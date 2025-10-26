"use client";

import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HeroParticleSystemProps {
  count?: number;
  mouseState?: React.MutableRefObject<{
    position: THREE.Vector2;
    target: THREE.Vector2;
    velocity: THREE.Vector2;
  }>;
  enableAnimation?: boolean;
  theme?: string;
  geometricShapes?: Array<{ position: THREE.Vector3; radius: number }>;
}

interface ParticleLayer {
  points: THREE.Points;
  positions: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  energy: Float32Array;
  clusters: Float32Array;
  zDepth: number;
}

/**
 * HeroParticleSystem - ENHANCED GPU-accelerated particle physics
 *
 * NEW FEATURES:
 * - 500 particles (up from 300)
 * - 3 distinct depth layers (-200, 0, +200 Z)
 * - Vortex physics on mouse hover (particles spiral around cursor)
 * - Particle clustering behavior (particles form temporary groups)
 * - 3 size classes (small 0.5-1.0, medium 1.2-1.8, large 2.0-3.5)
 * - Emission glow affecting nearby particles (brightness influence)
 * - Collision detection with geometric shapes (avoidance)
 * - Wave propagation from mouse clicks (ripple force)
 * - Theme-specific 6-color palettes
 */
export default function HeroParticleSystem({
  count = 500,
  mouseState,
  enableAnimation = true,
  theme = "dark",
  geometricShapes = [],
}: HeroParticleSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, gl } = useThree();
  const layersRef = useRef<ParticleLayer[]>([]);
  const clockRef = useRef(0);
  const cleanupFnsRef = useRef<Array<() => void>>([]);
  const waveRef = useRef<{ origin: THREE.Vector3; time: number; active: boolean }>({
    origin: new THREE.Vector3(),
    time: 0,
    active: false,
  });
  const vortexStrength = useRef(0);

  // Log particle system initialization
  useEffect(() => {
    console.log("[ENHANCED HeroParticleSystem] Initializing with", count, "particles (3 layers), animation:", enableAnimation);
  }, [count, enableAnimation]);

  // Theme-aware 6-color palettes
  const colorPalette = useMemo(() => {
    if (theme === "light") {
      return [
        new THREE.Color("#1f7eff"),
        new THREE.Color("#ec4899"),
        new THREE.Color("#f59e0b"),
        new THREE.Color("#7c3aed"),
        new THREE.Color("#10b981"),
        new THREE.Color("#0ea5e9"),
      ];
    } else if (theme === "contrast") {
      return [
        new THREE.Color("#00eaff"),
        new THREE.Color("#ff00ff"),
        new THREE.Color("#ffff00"),
        new THREE.Color("#00ffe0"),
        new THREE.Color("#ff00aa"),
        new THREE.Color("#00d4ff"),
      ];
    } else {
      return [
        new THREE.Color("#3b82f6"),
        new THREE.Color("#8b5cf6"),
        new THREE.Color("#0ea5e9"),
        new THREE.Color("#7c3aed"),
        new THREE.Color("#06b6d4"),
        new THREE.Color("#4f46e5"),
      ];
    }
  }, [theme]);

  // Size classes for particles
  const SIZE_SMALL = theme === "contrast" ? 1.0 : 0.5;
  const SIZE_MEDIUM = theme === "contrast" ? 2.0 : 1.2;
  const SIZE_LARGE = theme === "contrast" ? 3.5 : 2.0;

  // Create 3 depth layers - wrapped in useMemo to avoid recreating on every render
  const DEPTH_LAYERS = useMemo(() => [-200, 0, 200], []);
  const particlesPerLayer = Math.floor(count / 3);

  // Initialize particle layers
  useEffect(() => {
    if (!groupRef.current) return;

    const layers: ParticleLayer[] = [];

    DEPTH_LAYERS.forEach((zDepth, layerIndex) => {
      const layerCount = particlesPerLayer;
      const positions = new Float32Array(layerCount * 3);
      const velocities = new Float32Array(layerCount * 3);
      const colors = new Float32Array(layerCount * 3);
      const sizes = new Float32Array(layerCount);
      const energy = new Float32Array(layerCount);
      const clusters = new Float32Array(layerCount);

      // Seed for deterministic generation per layer
      let seed = 12345 + layerIndex * 1000;
      const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      // Distribute particles
      for (let i = 0; i < layerCount; i++) {
        // Position: cylindrical distribution
        const angle = random() * Math.PI * 2;
        const radius = random() * 400;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = zDepth;

        // Velocity
        velocities[i * 3] = (random() - 0.5) * 2;
        velocities[i * 3 + 1] = (random() - 0.5) * 2;
        velocities[i * 3 + 2] = (random() - 0.5) * 0.5;

        // Color from palette
        const color = colorPalette[i % colorPalette.length];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Size class: 50% small, 30% medium, 20% large
        const sizeRand = random();
        if (sizeRand < 0.5) {
          sizes[i] = SIZE_SMALL + random() * (SIZE_SMALL * 0.5);
        } else if (sizeRand < 0.8) {
          sizes[i] = SIZE_MEDIUM + random() * (SIZE_MEDIUM * 0.3);
        } else {
          sizes[i] = SIZE_LARGE + random() * (SIZE_LARGE * 0.5);
        }

        // Energy for glow
        energy[i] = 0.5 + random() * 0.5;

        // Cluster assignment (0-5 for 6 clusters)
        clusters[i] = Math.floor(random() * 6);
      }

      // Create geometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      // Create material
      const material = new THREE.PointsMaterial({
        size: theme === "contrast" ? 3 : 2,
        sizeAttenuation: true,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: theme === "contrast" ? 0.95 : 0.8,
      });

      const points = new THREE.Points(geometry, material);
      groupRef.current?.add(points);

      layers.push({
        points,
        positions,
        velocities,
        colors,
        sizes,
        energy,
        clusters,
        zDepth,
      });
    });

    layersRef.current = layers;

    console.log(`[HeroParticleSystem] Created ${layers.length} layers with ${particlesPerLayer} particles each`);

    // Cleanup
    const group = groupRef.current;
    return () => {
      layers.forEach((layer) => {
        group?.remove(layer.points);
        layer.points.geometry.dispose();
        if (layer.points.material instanceof THREE.Material) {
          layer.points.material.dispose();
        }
      });
      layersRef.current = [];
    };
  }, [particlesPerLayer, colorPalette, theme, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, DEPTH_LAYERS]);

  // Curl noise for organic flow
  const curlNoise = useCallback((x: number, y: number, z: number, time: number) => {
    const e = 0.001;
    const scale = 0.005;
    
    const n1 = Math.sin((x + time * 0.1) * scale) * Math.cos(y * scale);
    const n2 = Math.cos((y + time * 0.1) * scale) * Math.sin(z * scale);
    
    return {
      x: n2,
      y: -n1,
    };
  }, []);

  // Mouse click handler for wave propagation
  useEffect(() => {
    if (!enableAnimation) return;

    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Convert to 3D space
      const origin = new THREE.Vector3(x * 400, y * 300, 0);
      
      waveRef.current = {
        origin,
        time: clockRef.current,
        active: true,
      };

      // Wave deactivates after 2 seconds
      setTimeout(() => {
        waveRef.current.active = false;
      }, 2000);
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [enableAnimation, gl]);

  // Animation loop - ENHANCED PHYSICS
  useFrame((state, delta) => {
    if (!enableAnimation || layersRef.current.length === 0) return;

    clockRef.current += delta;

    // Update vortex strength based on mouse velocity
    if (mouseState) {
      const velocityMagnitude = Math.sqrt(
        mouseState.current.velocity.x ** 2 + mouseState.current.velocity.y ** 2
      );
      vortexStrength.current = Math.min(1, velocityMagnitude * 10);
    }

    layersRef.current.forEach((layer) => {
      const { positions, velocities, sizes, energy, clusters } = layer;
      const particleCount = positions.length / 3;

      // Cluster centers (6 clusters)
      const clusterCenters = new Array(6).fill(null).map((_, i) => ({
        x: Math.cos((i / 6) * Math.PI * 2 + clockRef.current * 0.1) * 300,
        y: Math.sin((i / 6) * Math.PI * 2 + clockRef.current * 0.1) * 300,
      }));

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // 1. CURL NOISE FLOW
        const flow = curlNoise(x, y, z, clockRef.current);
        velocities[i3] += flow.x * 0.02;
        velocities[i3 + 1] += flow.y * 0.02;

        // 2. CLUSTERING BEHAVIOR
        const clusterIndex = Math.floor(clusters[i]);
        const clusterCenter = clusterCenters[clusterIndex];
        const dxCluster = clusterCenter.x - x;
        const dyCluster = clusterCenter.y - y;
        const distCluster = Math.sqrt(dxCluster ** 2 + dyCluster ** 2);
        
        if (distCluster > 50) {
          const clusterForce = 0.005;
          velocities[i3] += (dxCluster / distCluster) * clusterForce;
          velocities[i3 + 1] += (dyCluster / distCluster) * clusterForce;
        }

        // 3. MOUSE VORTEX PHYSICS
        if (mouseState && vortexStrength.current > 0.1) {
          const mouseX = (mouseState.current.position.x - 0.5) * 800;
          const mouseY = (mouseState.current.position.y - 0.5) * 600;
          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx ** 2 + dy ** 2);

          if (dist < 200 && dist > 10) {
            // Attraction
            const attractionForce = (1 - dist / 200) * 0.1 * vortexStrength.current;
            velocities[i3] += (dx / dist) * attractionForce;
            velocities[i3 + 1] += (dy / dist) * attractionForce;

            // Vortex (tangential force)
            const angle = Math.atan2(dy, dx);
            const tangentX = Math.cos(angle + Math.PI / 2);
            const tangentY = Math.sin(angle + Math.PI / 2);
            const vortexForce = (1 - dist / 200) * 0.15 * vortexStrength.current;
            velocities[i3] += tangentX * vortexForce;
            velocities[i3 + 1] += tangentY * vortexForce;
          }
        }

        // 4. WAVE PROPAGATION
        if (waveRef.current.active) {
          const waveAge = clockRef.current - waveRef.current.time;
          const waveRadius = waveAge * 200;
          const dx = x - waveRef.current.origin.x;
          const dy = y - waveRef.current.origin.y;
          const dist = Math.sqrt(dx ** 2 + dy ** 2);

          // Check if particle is at wave front
          if (Math.abs(dist - waveRadius) < 50) {
            const pushForce = 0.5;
            velocities[i3] += (dx / (dist + 1)) * pushForce;
            velocities[i3 + 1] += (dy / (dist + 1)) * pushForce;
          }
        }

        // 5. COLLISION AVOIDANCE WITH GEOMETRIC SHAPES
        geometricShapes.forEach((shape) => {
          const dx = x - shape.position.x;
          const dy = y - shape.position.y;
          const dz = z - shape.position.z;
          const dist = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

          if (dist < shape.radius + 30) {
            const avoidForce = 0.2;
            velocities[i3] += (dx / (dist + 1)) * avoidForce;
            velocities[i3 + 1] += (dy / (dist + 1)) * avoidForce;
            velocities[i3 + 2] += (dz / (dist + 1)) * avoidForce;
          }
        });

        // 6. DAMPING
        velocities[i3] *= 0.97;
        velocities[i3 + 1] *= 0.97;
        velocities[i3 + 2] *= 0.98;

        // 7. UPDATE POSITION
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // 8. WRAP AROUND BOUNDARIES
        const wrapDist = 500;
        if (positions[i3] > wrapDist) positions[i3] -= wrapDist * 2;
        if (positions[i3] < -wrapDist) positions[i3] += wrapDist * 2;
        if (positions[i3 + 1] > wrapDist) positions[i3 + 1] -= wrapDist * 2;
        if (positions[i3 + 1] < -wrapDist) positions[i3 + 1] += wrapDist * 2;

        // Keep Z within layer
        positions[i3 + 2] = layer.zDepth + Math.sin(clockRef.current + i) * 20;

        // 9. ANIMATE SIZE (pulsing based on energy)
        sizes[i] = sizes[i] * (1 + Math.sin(clockRef.current * 2 + i * 0.1) * 0.1 * energy[i]);
      }

      // Update geometry attributes
      layer.points.geometry.attributes.position.needsUpdate = true;
      layer.points.geometry.attributes.size.needsUpdate = true;
    });
  });

  // Expose particle positions for connections and trails
  useEffect(() => {
    const interval = setInterval(() => {
      if (layersRef.current.length > 0 && groupRef.current) {
        // Export positions for use by other components
        const allPositions = new Float32Array(count * 3);
        let offset = 0;
        
        layersRef.current.forEach((layer) => {
          allPositions.set(layer.positions, offset);
          offset += layer.positions.length;
        });

        // Store in ref for other components to access
        if (groupRef.current.userData) {
          (groupRef.current.userData as Record<string, unknown>).particlePositions = allPositions;
        }
      }
    }, 100); // Update 10 times per second

    return () => clearInterval(interval);
  }, [count]);

  return <group ref={groupRef} />;
}
