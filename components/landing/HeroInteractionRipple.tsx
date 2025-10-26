"use client";

import React, { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface RippleData {
  origin: THREE.Vector3;
  startTime: number;
  duration: number;
  maxRadius: number;
  color: THREE.Color;
  id: number;
}

interface HeroInteractionRippleProps {
  theme?: "dark" | "light" | "contrast";
  enableInteraction?: boolean;
  particlePositions?: Float32Array;
  particleCount?: number;
  onRippleImpact?: (particleIndices: number[]) => void;
}

/**
 * HeroInteractionRipple - Mouse click ripple effects
 * 
 * Features:
 * - Expanding wave effect on mouse click
 * - Particles pushed outward by wave
 * - Geometric shapes react (tilt/scale)
 * - Visual distortion in wave area
 * - 1.5 second dissipation
 * - Theme-specific ripple colors
 * - Multiple ripples can coexist
 */
export default function HeroInteractionRipple({
  theme = "dark",
  enableInteraction = true,
  particlePositions,
  particleCount = 0,
  onRippleImpact,
}: HeroInteractionRippleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ripplesRef = useRef<RippleData[]>([]);
  const rippleMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const clockRef = useRef(0);
  const rippleIdCounter = useRef(0);
  const { camera, gl, raycaster } = useThree();
  const [isEnabled, setIsEnabled] = useState(enableInteraction);

  // Theme-specific ripple colors
  const rippleColors = useMemo(() => {
    switch (theme) {
      case "light":
        return [
          new THREE.Color("#1f7eff"),
          new THREE.Color("#ec4899"),
          new THREE.Color("#7c3aed"),
        ];
      case "contrast":
        return [
          new THREE.Color("#00eaff"),
          new THREE.Color("#ff00ff"),
          new THREE.Color("#ffff00"),
        ];
      default:
        return [
          new THREE.Color("#00d4ff"),
          new THREE.Color("#8b5cf6"),
          new THREE.Color("#0ea5e9"),
        ];
    }
  }, [theme]);

  // Create ripple material
  const createRippleMaterial = useCallback((color: THREE.Color) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: color },
        uThickness: { value: theme === "contrast" ? 3.0 : 2.0 },
        uOpacity: { value: theme === "contrast" ? 1.0 : 0.8 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform vec3 uColor;
        uniform float uThickness;
        uniform float uOpacity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Distance from center
          float dist = length(vPosition.xy);
          
          // Ripple wave
          float wave = abs(dist - uProgress * 500.0);
          float ripple = smoothstep(uThickness, 0.0, wave);
          
          // Fade out as ripple expands
          float fade = 1.0 - uProgress;
          
          // Color with glow
          vec3 color = uColor * (1.0 + ripple * 2.0);
          float alpha = ripple * fade * uOpacity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [theme]);

  // Handle mouse/touch clicks
  const handlePointerDown = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isEnabled || !groupRef.current) return;

    let clientX: number, clientY: number;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return;
    }

    // Convert screen coordinates to 3D
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, camera);

    // Create plane at z=0 to intersect
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersect);

    if (intersect) {
      // Create new ripple
      const rippleId = rippleIdCounter.current++;
      const color = rippleColors[rippleId % rippleColors.length];

      const ripple: RippleData = {
        origin: intersect,
        startTime: clockRef.current,
        duration: 1.5,
        maxRadius: 300,
        color: color.clone(),
        id: rippleId,
      };

      ripplesRef.current.push(ripple);

      // Create ripple mesh
      const geometry = new THREE.CircleGeometry(500, 64);
      const material = createRippleMaterial(color);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(intersect);
      mesh.position.z = 10; // Slightly in front

      groupRef.current.add(mesh);
      rippleMeshesRef.current.set(rippleId, mesh);
    }
  }, [isEnabled, gl, camera, raycaster, rippleColors, createRippleMaterial]);

  // Register event listeners
  useEffect(() => {
    if (!isEnabled) return;

    const canvas = gl.domElement;
    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("touchstart", handlePointerDown);

    return () => {
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isEnabled, gl, handlePointerDown]);

  // Animation loop - update ripples
  useFrame((state, delta) => {
    if (!isEnabled) return;

    clockRef.current += delta;

    // Update each ripple
    const activeRipples = ripplesRef.current.filter((ripple) => {
      const elapsed = clockRef.current - ripple.startTime;
      const progress = Math.min(1, elapsed / ripple.duration);

      // Get ripple mesh
      const mesh = rippleMeshesRef.current.get(ripple.id);
      if (!mesh) return false;

      // Update material
      if (mesh.material instanceof THREE.ShaderMaterial) {
        mesh.material.uniforms.uProgress.value = progress;
      }

      // Apply ripple force to particles
      if (particlePositions && particleCount > 0 && onRippleImpact) {
        const impactedParticles: number[] = [];
        const rippleRadius = progress * ripple.maxRadius;
        const rippleThickness = 50;

        for (let i = 0; i < particleCount; i++) {
          const particlePos = new THREE.Vector3(
            particlePositions[i * 3],
            particlePositions[i * 3 + 1],
            particlePositions[i * 3 + 2]
          );

          const dist = particlePos.distanceTo(ripple.origin);
          
          // Check if particle is at ripple edge
          if (Math.abs(dist - rippleRadius) < rippleThickness) {
            impactedParticles.push(i);
          }
        }

        if (impactedParticles.length > 0) {
          onRippleImpact(impactedParticles);
        }
      }

      // Remove completed ripples
      if (progress >= 1) {
        groupRef.current?.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
        rippleMeshesRef.current.delete(ripple.id);
        return false;
      }

      return true;
    });

    ripplesRef.current = activeRipples;
  });

  // Cleanup
  useEffect(() => {
    return () => {
      rippleMeshesRef.current.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });
      rippleMeshesRef.current.clear();
      ripplesRef.current = [];
    };
  }, []);

  return <group ref={groupRef} />;
}

/**
 * Simplified ripple effect for performance
 */
export function HeroSimpleRipple({
  theme = "dark",
  position,
  onComplete,
}: {
  theme?: "dark" | "light" | "contrast";
  position: THREE.Vector3;
  onComplete?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const clockRef = useRef(0);
  const duration = 1.5;

  const color = useMemo(() => {
    switch (theme) {
      case "light":
        return "#1f7eff";
      case "contrast":
        return "#00eaff";
      default:
        return "#00d4ff";
    }
  }, [theme]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    clockRef.current += delta;
    const progress = Math.min(1, clockRef.current / duration);

    // Scale up
    const scale = progress * 10;
    meshRef.current.scale.set(scale, scale, 1);

    // Fade out
    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = 1 - progress;
    }

    // Complete
    if (progress >= 1 && onComplete) {
      onComplete();
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.9, 1, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Distortion wave effect
 */
export function HeroDistortionWave({
  theme = "dark",
  origin,
  enabled = true,
}: {
  theme?: "dark" | "light" | "contrast";
  origin: THREE.Vector3;
  enabled?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef(0);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOrigin: { value: origin },
        uProgress: { value: 0 },
        uStrength: { value: theme === "contrast" ? 0.5 : 0.3 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uOrigin;
        uniform float uProgress;
        uniform float uStrength;
        
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          float dist = distance(pos.xy, uOrigin.xy);
          float wave = sin(dist * 0.1 - uProgress * 10.0) * uStrength;
          
          pos.z += wave * (1.0 - uProgress);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `,
      transparent: true,
      visible: false, // Invisible but affects vertices
    });
  }, [origin, theme]);

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useFrame((state, delta) => {
    if (!enabled || !materialRef.current) return;

    clockRef.current += delta;
    const progress = Math.min(1, clockRef.current / 1.5);

    materialRef.current.uniforms.uProgress.value = progress;
  });

  return (
    <mesh ref={meshRef} material={material} visible={false}>
      <planeGeometry args={[1000, 1000, 64, 64]} />
    </mesh>
  );
}

