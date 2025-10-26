"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGridShader, updateShaderTime } from "./HeroHolographicShaders";

interface HeroBackgroundGridProps {
  theme?: "dark" | "light" | "contrast";
  enableAnimation?: boolean;
  gridScale?: number;
  fadeDistance?: number;
  quality?: number;
}

/**
 * HeroBackgroundGrid - Infinite hexagonal grid background
 * 
 * Features:
 * - Procedurally generated hexagonal grid
 * - Perspective fade into distance
 * - Glowing nodes at hex intersections
 * - Random pulsing hexagons (data transmission effect)
 * - Slow rotation animation
 * - Theme-aware coloring
 * - Infinite extent using shader
 */
export default function HeroBackgroundGrid({
  theme = "dark",
  enableAnimation = true,
  gridScale = 0.05,
  fadeDistance = 800,
  quality = 1,
}: HeroBackgroundGridProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef(0);

  // Create grid material with shader
  const gridMaterial = useMemo(() => {
    const material = createGridShader(theme);
    
    // Adjust parameters based on theme
    if (material.uniforms.uGridScale) {
      material.uniforms.uGridScale.value = gridScale;
    }
    if (material.uniforms.uFadeDistance) {
      material.uniforms.uFadeDistance.value = fadeDistance;
    }
    
    return material;
  }, [theme, gridScale, fadeDistance]);

  // Create large plane for grid
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(2000, 2000, 1, 1);
  }, []);

  // Update material reference
  useEffect(() => {
    materialRef.current = gridMaterial;
  }, [gridMaterial]);

  // Animation loop
  useFrame((state, delta) => {
    if (!enableAnimation || !materialRef.current || !meshRef.current) return;

    clockRef.current += delta;

    // Update shader time
    updateShaderTime(materialRef.current, clockRef.current);

    // Slow rotation of entire grid
    meshRef.current.rotation.z = clockRef.current * 0.02;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={gridMaterial}
      position={[0, 0, -500]}
      rotation={[-Math.PI / 4, 0, 0]}
    />
  );
}

/**
 * Advanced grid with additional visual elements
 */
export function HeroAdvancedGrid({
  theme = "dark",
  enableAnimation = true,
  quality = 1,
}: {
  theme?: "dark" | "light" | "contrast";
  enableAnimation?: boolean;
  quality?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Points | null>(null);
  const clockRef = useRef(0);

  // Theme-specific colors
  const nodeColor = useMemo(() => {
    switch (theme) {
      case "light":
        return new THREE.Color("#1f7eff");
      case "contrast":
        return new THREE.Color("#00eaff");
      default:
        return new THREE.Color("#00d4ff");
    }
  }, [theme]);

  // Create glowing nodes at grid intersections
  const nodes = useMemo(() => {
    const nodeCount = Math.floor(50 * quality);
    const positions = new Float32Array(nodeCount * 3);
    const sizes = new Float32Array(nodeCount);
    const phases = new Float32Array(nodeCount);

    const hexSize = 50;

    for (let i = 0; i < nodeCount; i++) {
      // Distribute nodes in hexagonal pattern
      const angle = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = Math.random() * 400 + 100;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = -400 + Math.random() * 200;

      sizes[i] = 3 + Math.random() * 4;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, phases, count: nodeCount };
  }, [quality]);

  // Create node geometry and material
  const nodeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(nodes.positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(nodes.sizes, 1));
    geometry.setAttribute("phase", new THREE.BufferAttribute(nodes.phases, 1));
    return geometry;
  }, [nodes]);

  const nodeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: nodeColor },
        uOpacity: { value: theme === "contrast" ? 1.0 : 0.7 },
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        
        varying float vPhase;
        
        void main() {
          vPhase = phase;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        
        varying float vPhase;
        
        void main() {
          // Circular shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) {
            discard;
          }
          
          // Pulsing effect
          float pulse = sin(uTime * 2.0 + vPhase) * 0.5 + 0.5;
          
          // Glow
          float glow = 1.0 - dist * 2.0;
          glow = pow(glow, 2.0);
          
          vec3 color = uColor * (1.0 + glow * 2.0 * pulse);
          float alpha = glow * (0.5 + pulse * 0.5) * uOpacity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [nodeColor, theme]);

  // Animation loop for nodes
  useFrame((state, delta) => {
    if (!enableAnimation) return;

    clockRef.current += delta;

    // Update node material
    if (nodeMaterial.uniforms.uTime) {
      nodeMaterial.uniforms.uTime.value = clockRef.current;
    }

    // Rotate group slowly
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clockRef.current * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <HeroBackgroundGrid
        theme={theme}
        enableAnimation={enableAnimation}
        quality={quality}
      />
      <points
        ref={nodesRef}
        geometry={nodeGeometry}
        material={nodeMaterial}
      />
    </group>
  );
}

/**
 * Simplified grid for low-end devices
 */
export function HeroSimpleGrid({
  theme = "dark",
  color,
}: {
  theme?: "dark" | "light" | "contrast";
  color?: string;
}) {
  const gridColor = useMemo(() => {
    if (color) return color;
    
    switch (theme) {
      case "light":
        return "#1f7eff";
      case "contrast":
        return "#00eaff";
      default:
        return "#00d4ff";
    }
  }, [theme, color]);

  return (
    <gridHelper
      args={[2000, 40, gridColor, gridColor]}
      position={[0, 0, -300]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshBasicMaterial
        color={gridColor}
        transparent
        opacity={0.2}
      />
    </gridHelper>
  );
}

/**
 * Radial grid variation
 */
export function HeroRadialGrid({
  theme = "dark",
  rings = 10,
  spokes = 24,
}: {
  theme?: "dark" | "light" | "contrast";
  rings?: number;
  spokes?: number;
}) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    // Create rings
    for (let r = 1; r <= rings; r++) {
      const radius = (r / rings) * 500;
      for (let i = 0; i <= spokes; i++) {
        const angle = (i / spokes) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
          )
        );
      }
    }

    // Create spokes
    for (let s = 0; s < spokes; s++) {
      const angle = (s / spokes) * Math.PI * 2;
      for (let r = 0; r <= rings; r++) {
        const radius = (r / rings) * 500;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
          )
        );
      }
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [rings, spokes]);

  const color = useMemo(() => {
    switch (theme) {
      case "light":
        return "#7c3aed";
      case "contrast":
        return "#ff00ff";
      default:
        return "#8b5cf6";
    }
  }, [theme]);

  return (
    <points geometry={geometry} position={[0, 0, -400]}>
      <pointsMaterial
        size={1.5}
        color={color}
        transparent
        opacity={theme === "contrast" ? 0.8 : 0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

