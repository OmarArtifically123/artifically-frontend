"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createFresnelHologramShader, updateShaderTime } from "./HeroHolographicShaders";

interface HeroGeometricShapesProps {
  theme?: "dark" | "light" | "contrast";
  mouseState?: React.MutableRefObject<{
    position: THREE.Vector2;
    target: THREE.Vector2;
    velocity: THREE.Vector2;
  }>;
  enableAnimation?: boolean;
  quality?: number; // 0-1, affects detail level
}

interface ShapeConfig {
  geometry: THREE.BufferGeometry;
  position: THREE.Vector3;
  scale: number;
  rotationSpeed: THREE.Vector3;
  floatSpeed: number;
  floatAmplitude: number;
  wireframeColor: string;
  delay: number;
}

/**
 * HeroGeometricShapes - Floating holographic polyhedrons
 * 
 * Features:
 * - 3 distinct geometric shapes (icosahedron, octahedron, dodecahedron)
 * - Holographic fresnel shader with edge glow
 * - Wireframe rendering with glowing edges
 * - Autonomous floating and rotation
 * - Mouse parallax interaction
 * - LOD system for performance
 * - Theme-specific materials
 */
export default function HeroGeometricShapes({
  theme = "dark",
  mouseState,
  enableAnimation = true,
  quality = 1,
}: HeroGeometricShapesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<Array<{ mesh: THREE.Mesh; wireframe: THREE.LineSegments; config: ShapeConfig }>>([]);
  const clockRef = useRef(0);
  const { camera } = useThree();

  // Theme-specific wireframe colors
  const wireframeColors = useMemo(() => {
    switch (theme) {
      case "light":
        return {
          primary: "#1f7eff",
          secondary: "#ec4899",
          tertiary: "#7c3aed",
        };
      case "contrast":
        return {
          primary: "#00eaff",
          secondary: "#ff00ff",
          tertiary: "#ffff00",
        };
      default:
        return {
          primary: "#00d4ff",
          secondary: "#8b5cf6",
          tertiary: "#06b6d4",
        };
    }
  }, [theme]);

  // Create shape configurations
  const shapeConfigs = useMemo((): ShapeConfig[] => {
    // Adjust detail based on quality (LOD system)
    const detailLevel = Math.max(0, Math.floor(quality * 2));
    
    return [
      {
        // Icosahedron - Large, center-left
        geometry: new THREE.IcosahedronGeometry(80, detailLevel),
        position: new THREE.Vector3(-250, 100, -100),
        scale: 1.0,
        rotationSpeed: new THREE.Vector3(0.001, 0.0015, 0.0008),
        floatSpeed: 0.8,
        floatAmplitude: 30,
        wireframeColor: wireframeColors.primary,
        delay: 0,
      },
      {
        // Octahedron - Medium, top-right
        geometry: new THREE.OctahedronGeometry(60, detailLevel),
        position: new THREE.Vector3(200, -80, 50),
        scale: 1.0,
        rotationSpeed: new THREE.Vector3(-0.0012, 0.001, -0.001),
        floatSpeed: 1.2,
        floatAmplitude: 40,
        wireframeColor: wireframeColors.secondary,
        delay: 1.0,
      },
      {
        // Dodecahedron - Small, bottom-center
        geometry: new THREE.DodecahedronGeometry(50, detailLevel),
        position: new THREE.Vector3(50, 180, -50),
        scale: 1.0,
        rotationSpeed: new THREE.Vector3(0.0008, -0.0012, 0.0015),
        floatSpeed: 1.0,
        floatAmplitude: 25,
        wireframeColor: wireframeColors.tertiary,
        delay: 2.0,
      },
    ];
  }, [quality, wireframeColors]);

  // Initialize shapes
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const shapes: Array<{
      mesh: THREE.Mesh;
      wireframe: THREE.LineSegments;
      config: ShapeConfig;
    }> = [];

    shapeConfigs.forEach((config) => {
      // Create holographic material using fresnel shader
      const holographicMaterial = createFresnelHologramShader(theme);

      // Create main mesh with holographic material
      const mesh = new THREE.Mesh(config.geometry, holographicMaterial);
      mesh.position.copy(config.position);
      mesh.scale.setScalar(config.scale);

      // Create wireframe edges
      const edges = new THREE.EdgesGeometry(config.geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(config.wireframeColor),
        linewidth: theme === "contrast" ? 3 : 2,
        transparent: true,
        opacity: theme === "contrast" ? 1.0 : 0.8,
        blending: THREE.AdditiveBlending,
      });
      const wireframe = new THREE.LineSegments(edges, wireframeMaterial);
      wireframe.position.copy(config.position);
      wireframe.scale.setScalar(config.scale);

      // Add to group
      group.add(mesh);
      group.add(wireframe);

      shapes.push({ mesh, wireframe, config });
    });

    shapesRef.current = shapes;

    // Cleanup
    return () => {
      shapes.forEach(({ mesh, wireframe, config }) => {
        group.remove(mesh);
        group.remove(wireframe);
        config.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
        if (wireframe.material instanceof THREE.Material) {
          wireframe.material.dispose();
        }
      });
      shapesRef.current = [];
    };
  }, [shapeConfigs, theme]);

  // Animation loop
  useFrame((state, delta) => {
    if (!enableAnimation || shapesRef.current.length === 0) return;

    clockRef.current += delta;

    shapesRef.current.forEach(({ mesh, wireframe, config }) => {
      // Update shader time
      if (mesh.material instanceof THREE.ShaderMaterial) {
        updateShaderTime(mesh.material, clockRef.current);
      }

      // Autonomous rotation
      mesh.rotation.x += config.rotationSpeed.x;
      mesh.rotation.y += config.rotationSpeed.y;
      mesh.rotation.z += config.rotationSpeed.z;

      wireframe.rotation.copy(mesh.rotation);

      // Calculate all position offsets from BASE position to avoid accumulation
      
      // Floating motion with sine wave
      const floatOffset = Math.sin(clockRef.current * config.floatSpeed + config.delay) * config.floatAmplitude;
      
      // Horizontal drift
      const driftX = Math.cos(clockRef.current * 0.3 + config.delay * 0.5) * 15;
      const driftZ = Math.sin(clockRef.current * 0.25 + config.delay * 0.7) * 20;
      
      // Mouse parallax (shapes move opposite to mouse for depth)
      let parallaxX = 0;
      let parallaxY = 0;
      if (mouseState) {
        const mouseInfluence = 0.3;
        parallaxX = (mouseState.current.position.x - 0.5) * -100 * mouseInfluence;
        parallaxY = (mouseState.current.position.y - 0.5) * -80 * mouseInfluence;
      }
      
      // Apply all offsets to BASE position (prevents glitching/teleporting)
      mesh.position.x = config.position.x + driftX + parallaxX;
      mesh.position.y = config.position.y + floatOffset + parallaxY;
      mesh.position.z = config.position.z + driftZ;
      
      // Sync wireframe
      wireframe.position.copy(mesh.position);

      // Subtle scale pulsing
      const scalePulse = 1.0 + Math.sin(clockRef.current * 0.5 + config.delay) * 0.05;
      mesh.scale.setScalar(config.scale * scalePulse);
      wireframe.scale.setScalar(config.scale * scalePulse);

      // Glow intensity variation
      if (mesh.material instanceof THREE.ShaderMaterial && mesh.material.uniforms.uGlowIntensity) {
        const glowBase = theme === "contrast" ? 2.0 : 1.5;
        const glowPulse = Math.sin(clockRef.current * 2.0 + config.delay * 1.5) * 0.3;
        mesh.material.uniforms.uGlowIntensity.value = glowBase + glowPulse;
      }
    });

    // Group rotation for overall movement
    if (groupRef.current && !mouseState) {
      groupRef.current.rotation.y = Math.sin(clockRef.current * 0.1) * 0.1;
    }
  });

  // React to mouse velocity for tilt effect
  useEffect(() => {
    if (!mouseState || !enableAnimation) return;

    const interval = setInterval(() => {
      if (!groupRef.current) return;

      const velocity = mouseState.current.velocity;
      const tiltX = velocity.y * 0.5;
      const tiltY = velocity.x * -0.5;

      // Smooth interpolation to tilt
      groupRef.current.rotation.x += (tiltX - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (tiltY - groupRef.current.rotation.y) * 0.1;
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [mouseState, enableAnimation]);

  return <group ref={groupRef} />;
}

/**
 * HeroGeometricShape - Individual shape component (for manual control)
 */
export function HeroGeometricShape({
  type = "icosahedron",
  position = [0, 0, 0],
  scale = 1,
  theme = "dark",
  quality = 1,
}: {
  type?: "icosahedron" | "octahedron" | "dodecahedron" | "tetrahedron";
  position?: [number, number, number];
  scale?: number;
  theme?: "dark" | "light" | "contrast";
  quality?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const clockRef = useRef(0);

  // Create geometry based on type
  const geometry = useMemo(() => {
    const detail = Math.max(0, Math.floor(quality * 2));
    switch (type) {
      case "octahedron":
        return new THREE.OctahedronGeometry(1, detail);
      case "dodecahedron":
        return new THREE.DodecahedronGeometry(1, detail);
      case "tetrahedron":
        return new THREE.TetrahedronGeometry(1, detail);
      default:
        return new THREE.IcosahedronGeometry(1, detail);
    }
  }, [type, quality]);

  // Create materials
  const holographicMaterial = useMemo(() => createFresnelHologramShader(theme), [theme]);

  const wireframeColor = useMemo(() => {
    switch (theme) {
      case "light":
        return "#1f7eff";
      case "contrast":
        return "#00eaff";
      default:
        return "#00d4ff";
    }
  }, [theme]);

  // Animation
  useFrame((state, delta) => {
    if (!meshRef.current || !wireframeRef.current) return;

    clockRef.current += delta;

    // Update shader
    updateShaderTime(holographicMaterial, clockRef.current);

    // Rotation
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.0015;
    wireframeRef.current.rotation.copy(meshRef.current.rotation);
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef} geometry={geometry} material={holographicMaterial} />
      <lineSegments ref={wireframeRef} geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial
          color={wireframeColor}
          transparent
          opacity={theme === "contrast" ? 1.0 : 0.8}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

