"use client";

import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useTexture, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import HeroParticleSystem from "./HeroParticleSystem";
import { createNoiseShader, createFlowFieldShader } from "./HeroShaders";

interface HeroSceneProps {
  variant?: "default" | "minimal";
  particleCount?: number;
  enablePostProcessing?: boolean;
  dpr?: number;
}

interface MouseState {
  position: THREE.Vector2;
  target: THREE.Vector2;
  velocity: THREE.Vector2;
}

/**
 * HeroScene - Advanced 3D scene with procedural generation
 *
 * Features:
 * - GPU-accelerated particle systems with physics
 * - Flow field generation using curl noise
 * - Procedural mesh morphing
 * - Post-processing effects (bloom, chromatic aberration)
 * - Mouse-driven vortex interactions
 * - Adaptive rendering quality
 */
export default function HeroScene({
  variant = "default",
  particleCount = 300,
  enablePostProcessing = true,
  dpr = 1,
}: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const { scene, camera, gl } = useThree();
  const prefersReducedMotion = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);

  // Log HeroScene initialization
  useEffect(() => {
    console.log("[HeroScene] Component mounted", {
      variant,
      particleCount,
      enablePostProcessing,
      prefersReducedMotion,
      camera: camera.position,
      gl: gl.domElement,
    });
    return () => {
      console.log("[HeroScene] Component unmounted");
    };
  }, []);

  // Handle WebGL context loss and restore
  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("[HeroScene] WebGL context lost, disabling post-processing");
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log("[HeroScene] WebGL context restored, re-enabling post-processing");
      setContextLost(false);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl]);

  // Mouse tracking state with lerp smoothing
  const mouseStateRef = useRef<MouseState>({
    position: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(0, 0),
    velocity: new THREE.Vector2(0, 0),
  });

  // Mouse event handlers with lerp interpolation
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;

      mouseStateRef.current.target.set(x, y);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      const rect = gl.domElement.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1 - (touch.clientY - rect.top) / rect.height;

      mouseStateRef.current.target.set(x, y);
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove, { passive: true });
    gl.domElement.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl]);

  // Lerp-based smooth mouse position tracking
  useFrame(() => {
    const mouseState = mouseStateRef.current;

    // Smooth lerp to target position (0.1 = 10% of distance per frame)
    mouseState.position.lerp(mouseState.target, 0.1);

    // Update velocity for physics interactions
    mouseState.velocity
      .copy(mouseState.target)
      .sub(mouseState.position)
      .multiplyScalar(0.05);

    // Update group rotation based on mouse position
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.x = mouseState.position.y * 0.3 - 0.15;
      groupRef.current.rotation.y = mouseState.position.x * 0.3 - 0.15;
    }
  });

  // Background gradient setup
  useEffect(() => {
    scene.background = new THREE.Color("#0a1628");
    scene.fog = new THREE.Fog("#0a1628", 800, 2000);
  }, [scene]);

  // Ambient lighting for overall illumination
  const ambientLight = useMemo(() => {
    const light = new THREE.AmbientLight("#ffffff", 0.4);
    return light;
  }, []);

  const chromaticAberrationOffset = useMemo(
    () => new THREE.Vector2(0.001, 0.001),
    []
  );

  useEffect(() => {
    scene.add(ambientLight);
    return () => {
      scene.remove(ambientLight);
    };
  }, [scene, ambientLight]);

  // Additional point lights for dynamic lighting
  useEffect(() => {
    const light1 = new THREE.PointLight("#0ea5e9", 1, 1000);
    light1.position.set(200, 200, 300);
    const light2 = new THREE.PointLight("#7c3aed", 0.8, 1000);
    light2.position.set(-200, -200, 200);

    scene.add(light1, light2);
    return () => {
      scene.remove(light1, light2);
    };
  }, [scene]);

  return (
    <group ref={groupRef}>
      {/* Advanced Particle System */}
      <HeroParticleSystem
        count={particleCount}
        mouseState={mouseStateRef}
        enableAnimation={!prefersReducedMotion}
      />

      {/* Post-processing effects for desktop - disabled when context is lost */}
      {enablePostProcessing && !prefersReducedMotion && !contextLost && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            intensity={1.2}
          />
          <ChromaticAberration
            offset={chromaticAberrationOffset}
            radialModulation={false}
            modulationOffset={0.15}
          />
        </EffectComposer>
      )}
    </group>
  );
}
