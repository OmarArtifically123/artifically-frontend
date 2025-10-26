"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createDataStreamShader, updateShaderTime } from "./HeroHolographicShaders";

interface HeroDataStreamsProps {
  theme?: "dark" | "light" | "contrast";
  columnCount?: number;
  enableAnimation?: boolean;
  quality?: number;
}

interface DataColumn {
  position: THREE.Vector3;
  speed: number;
  width: number;
  height: number;
  phase: number;
}

/**
 * HeroDataStreams - Falling data columns (Matrix-style)
 * 
 * Features:
 * - 8-12 vertical columns of falling text
 * - Random binary, hex codes, AI tokens
 * - Different fall speeds per column
 * - Fade in at top, fade out at bottom
 * - Some characters "glitch" (rapid color change)
 * - Only render columns in viewport
 * - Theme-specific colors
 */
export default function HeroDataStreams({
  theme = "dark",
  columnCount = 10,
  enableAnimation = true,
  quality = 1,
}: HeroDataStreamsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<Array<{ mesh: THREE.Mesh; config: DataColumn }>>([]);
  const clockRef = useRef(0);
  const { camera, viewport } = useThree();

  // Adjust column count based on quality
  const effectiveColumnCount = useMemo(() => {
    return Math.max(4, Math.floor(columnCount * quality));
  }, [columnCount, quality]);

  // Generate data column configurations
  const columnConfigs = useMemo((): DataColumn[] => {
    const columns: DataColumn[] = [];
    const spacing = viewport.width / (effectiveColumnCount + 1);

    for (let i = 0; i < effectiveColumnCount; i++) {
      columns.push({
        position: new THREE.Vector3(
          -viewport.width / 2 + spacing * (i + 1) + (Math.random() - 0.5) * 50,
          viewport.height / 2 + 100,
          50 + Math.random() * 100
        ),
        speed: 0.5 + Math.random() * 1.0,
        width: 20 + Math.random() * 30,
        height: 200 + Math.random() * 400,
        phase: Math.random() * Math.PI * 2,
      });
    }

    return columns;
  }, [effectiveColumnCount, viewport.width, viewport.height]);

  // Initialize columns
  useEffect(() => {
    if (!groupRef.current) return;

    const columns: Array<{ mesh: THREE.Mesh; config: DataColumn }> = [];

    columnConfigs.forEach((config) => {
      // Create material with data stream shader
      const material = createDataStreamShader(theme);
      
      // Adjust shader parameters
      if (material.uniforms.uSpeed) {
        material.uniforms.uSpeed.value = config.speed;
      }

      // Create plane geometry for each column
      const geometry = new THREE.PlaneGeometry(config.width, config.height, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.copy(config.position);
      
      groupRef.current.add(mesh);
      columns.push({ mesh, config });
    });

    columnsRef.current = columns;

    // Cleanup
    return () => {
      columns.forEach(({ mesh, config }) => {
        groupRef.current?.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });
      columnsRef.current = [];
    };
  }, [columnConfigs, theme]);

  // Animation loop
  useFrame((state, delta) => {
    if (!enableAnimation || columnsRef.current.length === 0) return;

    clockRef.current += delta;

    columnsRef.current.forEach(({ mesh, config }) => {
      // Update shader time
      if (mesh.material instanceof THREE.ShaderMaterial) {
        updateShaderTime(mesh.material, clockRef.current + config.phase);
      }

      // Subtle horizontal drift
      const drift = Math.sin(clockRef.current * 0.3 + config.phase) * 0.5;
      mesh.position.x = config.position.x + drift;

      // Depth oscillation for parallax
      const depthOscillation = Math.sin(clockRef.current * 0.2 + config.phase) * 20;
      mesh.position.z = config.position.z + depthOscillation;
    });
  });

  return <group ref={groupRef} />;
}

/**
 * Alternative: Canvas-based data streams for better text rendering
 */
export function HeroCanvasDataStreams({
  theme = "dark",
  columnCount = 10,
  enableAnimation = true,
}: {
  theme?: "dark" | "light" | "contrast";
  columnCount?: number;
  enableAnimation?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<Array<{
    texture: THREE.CanvasTexture;
    mesh: THREE.Mesh;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    yOffset: number;
    speed: number;
  }>>([]);
  const clockRef = useRef(0);
  const { viewport } = useThree();

  // Character sets
  const characters = useMemo(() => {
    return "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`";
  }, []);

  // Theme colors
  const streamColor = useMemo(() => {
    switch (theme) {
      case "light":
        return "#f59e0b";
      case "contrast":
        return "#00d4ff";
      default:
        return "#7c3aed";
    }
  }, [theme]);

  // Initialize canvas-based columns
  useEffect(() => {
    if (!groupRef.current) return;

    const columns: Array<{
      texture: THREE.CanvasTexture;
      mesh: THREE.Mesh;
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      yOffset: number;
      speed: number;
    }> = [];

    const spacing = viewport.width / (columnCount + 1);

    for (let i = 0; i < columnCount; i++) {
      // Create canvas for text rendering
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) continue;

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Create material
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      // Create mesh
      const geometry = new THREE.PlaneGeometry(40, 320);
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        -viewport.width / 2 + spacing * (i + 1),
        0,
        50 + Math.random() * 100
      );

      groupRef.current.add(mesh);

      columns.push({
        texture,
        mesh,
        canvas,
        ctx,
        yOffset: Math.random() * 1000,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    columnsRef.current = columns;

    // Cleanup
    return () => {
      columns.forEach(({ mesh, texture }) => {
        groupRef.current?.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
        texture.dispose();
      });
      columnsRef.current = [];
    };
  }, [columnCount, viewport.width, streamColor, characters]);

  // Animation loop - update canvas textures
  useFrame((state, delta) => {
    if (!enableAnimation || columnsRef.current.length === 0) return;

    clockRef.current += delta;

    columnsRef.current.forEach((column) => {
      const { ctx, canvas, texture, yOffset, speed } = column;

      // Update y offset for falling effect
      column.yOffset = (yOffset + speed * 60 * delta) % 1000;

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw characters
      ctx.font = "16px monospace";
      ctx.fillStyle = streamColor;
      ctx.textAlign = "center";

      const charCount = 20;
      const charHeight = canvas.height / charCount;

      for (let j = 0; j < charCount; j++) {
        const y = (j * charHeight + column.yOffset) % canvas.height;
        const char = characters[Math.floor((Math.random() + clockRef.current * 0.1) * characters.length) % characters.length];
        
        // Fade based on position
        const fadeTop = Math.min(1, y / (canvas.height * 0.2));
        const fadeBottom = Math.min(1, (canvas.height - y) / (canvas.height * 0.2));
        const fade = Math.min(fadeTop, fadeBottom);
        
        ctx.globalAlpha = fade * 0.8;
        ctx.fillText(char, canvas.width / 2, y);
      }

      // Update texture
      texture.needsUpdate = true;
    });
  });

  return <group ref={groupRef} />;
}

/**
 * Particle-based data stream for low-end devices
 */
export function HeroSimpleDataStreams({
  theme = "dark",
  streamCount = 6,
}: {
  theme?: "dark" | "light" | "contrast";
  streamCount?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const clockRef = useRef(0);

  const streamColor = useMemo(() => {
    switch (theme) {
      case "light":
        return "#f59e0b";
      case "contrast":
        return "#00d4ff";
      default:
        return "#7c3aed";
    }
  }, [theme]);

  const geometry = useMemo(() => {
    const particlesPerStream = 30;
    const totalParticles = streamCount * particlesPerStream;
    const positions = new Float32Array(totalParticles * 3);
    const speeds = new Float32Array(totalParticles);

    for (let i = 0; i < streamCount; i++) {
      const x = (i - streamCount / 2) * 100;
      
      for (let j = 0; j < particlesPerStream; j++) {
        const index = i * particlesPerStream + j;
        positions[index * 3] = x + (Math.random() - 0.5) * 10;
        positions[index * 3 + 1] = (j / particlesPerStream) * 600 - 300;
        positions[index * 3 + 2] = -100 + Math.random() * 50;
        
        speeds[index] = 50 + Math.random() * 50;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));
    
    return geom;
  }, [streamCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    clockRef.current += delta;

    const positions = geometry.attributes.position.array as Float32Array;
    const speeds = geometry.attributes.speed.array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] -= speeds[i] * delta;
      
      if (positions[i * 3 + 1] < -300) {
        positions[i * 3 + 1] = 300;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={2}
        color={streamColor}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

