"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import HeroParticleSystem from "./HeroParticleSystem";
import HeroGeometricShapes from "./HeroGeometricShapes";
import HeroNeuralConnections from "./HeroNeuralConnections";
import HeroParticleTrails from "./HeroParticleTrails";
import { HeroAdvancedGrid } from "./HeroBackgroundGrid";
import HeroDataStreams from "./HeroDataStreams";
import HeroInteractionRipple from "./HeroInteractionRipple";

interface HeroSceneProps {
  variant?: "default" | "minimal";
  particleCount?: number;
  enablePostProcessing?: boolean;
  dpr?: number;
  theme?: "dark" | "light" | "contrast";
}

interface MouseState {
  position: THREE.Vector2;
  target: THREE.Vector2;
  velocity: THREE.Vector2;
}

type QualityTier = "ultra" | "high" | "medium" | "low";

/**
 * HeroScene - ENHANCED Advanced 3D scene with all effects
 * 
 * NEW FEATURES:
 * - All 7 new components integrated
 * - Bloom post-processing (intensity 2.5)
 * - Depth of field (focus center, blur edges)
 * - Vignette effect
 * - 4-tier performance system (Ultra/High/Medium/Low)
 * - Smooth camera parallax following mouse
 * - Auto-rotate on idle (3 seconds)
 * - Scroll-based zoom pulse
 * - God rays effect (via bloom)
 */
export default function HeroScene({
  variant = "default",
  particleCount = 500,
  enablePostProcessing = true,
  dpr = 1,
  theme = "dark",
}: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const { scene, camera, gl } = useThree();
  const prefersReducedMotion = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);
  const [qualityTier, setQualityTier] = useState<QualityTier>("high");
  const [fps, setFps] = useState(60);
  const fpsHistory = useRef<number[]>([]);
  const lastFrameTime = useRef(performance.now());
  const idleTimer = useRef(0);
  const particlePositionsRef = useRef<Float32Array | null>(null);

  // Log HeroScene initialization
  useEffect(() => {
    console.log("[ENHANCED HeroScene] Component mounted", {
      variant,
      particleCount,
      enablePostProcessing,
      prefersReducedMotion,
      theme,
      qualityTier,
    });
    return () => {
      console.log("[HeroScene] Component unmounted");
    };
  }, [variant, particleCount, enablePostProcessing, prefersReducedMotion, theme, qualityTier]);

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
    position: new THREE.Vector2(0.5, 0.5),
    target: new THREE.Vector2(0.5, 0.5),
    velocity: new THREE.Vector2(0, 0),
  });

  // Mouse event handlers with lerp interpolation
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;

      mouseStateRef.current.target.set(x, y);
      idleTimer.current = 0; // Reset idle timer on movement
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      const rect = gl.domElement.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1 - (touch.clientY - rect.top) / rect.height;

      mouseStateRef.current.target.set(x, y);
      idleTimer.current = 0;
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove, { passive: true });
    gl.domElement.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl]);

  // FPS monitoring and performance tier adjustment
  useFrame((state, delta) => {
    // Calculate FPS
    const now = performance.now();
    const frameTime = now - lastFrameTime.current;
    lastFrameTime.current = now;
    
    const currentFps = 1000 / frameTime;
    fpsHistory.current.push(currentFps);
    
    if (fpsHistory.current.length > 60) {
      fpsHistory.current.shift();
    }

    // Update FPS average every 60 frames
    if (fpsHistory.current.length === 60) {
      const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / 60;
      setFps(avgFps);

      // Adjust quality tier based on FPS
      if (avgFps < 30) {
        setQualityTier("low");
      } else if (avgFps < 45) {
        setQualityTier("medium");
      } else if (avgFps < 55) {
        setQualityTier("high");
      } else {
        setQualityTier("ultra");
      }
    }
  });

  // Lerp-based smooth mouse position tracking
  useFrame((state, delta) => {
    const mouseState = mouseStateRef.current;

    // Smooth lerp to target position (0.1 = 10% of distance per frame)
    mouseState.position.lerp(mouseState.target, 0.1);

    // Update velocity for physics interactions
    mouseState.velocity
      .copy(mouseState.target)
      .sub(mouseState.position)
      .multiplyScalar(0.05);

    // Update idle timer
    idleTimer.current += delta;

    // Update group rotation based on mouse position or auto-rotate
    if (groupRef.current && !prefersReducedMotion) {
      if (idleTimer.current > 3) {
        // Auto-rotate when idle
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;
      } else {
        // Mouse parallax
        groupRef.current.rotation.x = (mouseState.position.y - 0.5) * 0.3;
        groupRef.current.rotation.y = (mouseState.position.x - 0.5) * 0.3;
      }
    }
  });

  // Camera parallax
  useFrame((state) => {
    if (!camera || prefersReducedMotion) return;

    const mouseState = mouseStateRef.current;
    
    // Subtle camera movement
    const targetX = (mouseState.position.x - 0.5) * 20;
    const targetY = (mouseState.position.y - 0.5) * 20;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
  });

  // Scroll-based zoom pulse
  useEffect(() => {
    const handleScroll = () => {
      if (!camera || prefersReducedMotion) return;

      const scrollY = window.scrollY;
      const zoomFactor = 1 + Math.min(scrollY / 1000, 0.1);
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.zoom = zoomFactor;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [camera, prefersReducedMotion]);

  // Background gradient setup
  useEffect(() => {
    const bgColor = theme === "light" ? "#f0f9ff" : theme === "contrast" ? "#000000" : "#0a1628";
    scene.background = new THREE.Color(bgColor);
    
    const fogColor = theme === "light" ? "#ffffff" : theme === "contrast" ? "#000000" : "#0a1628";
    scene.fog = new THREE.Fog(fogColor, 800, 2000);
  }, [scene, theme]);

  // Ambient lighting for overall illumination
  const ambientLight = useMemo(() => {
    const intensity = theme === "light" ? 0.7 : theme === "contrast" ? 0.3 : 0.4;
    return new THREE.AmbientLight("#ffffff", intensity);
  }, [theme]);

  useEffect(() => {
    scene.add(ambientLight);
    return () => {
      scene.remove(ambientLight);
    };
  }, [scene, ambientLight]);

  // Additional point lights for dynamic lighting
  useEffect(() => {
    const light1Color = theme === "light" ? "#1f7eff" : theme === "contrast" ? "#00eaff" : "#0ea5e9";
    const light2Color = theme === "light" ? "#ec4899" : theme === "contrast" ? "#ff00ff" : "#7c3aed";

    const light1 = new THREE.PointLight(light1Color, 1, 1000);
    light1.position.set(200, 200, 300);
    
    const light2 = new THREE.PointLight(light2Color, 0.8, 1000);
    light2.position.set(-200, -200, 200);

    scene.add(light1, light2);
    
    return () => {
      scene.remove(light1, light2);
    };
  }, [scene, theme]);

  // Quality tier settings
  const qualitySettings = useMemo(() => {
    switch (qualityTier) {
      case "ultra":
        return {
          particles: 500,
          connections: true,
          trails: true,
          geometric: true,
          grid: true,
          streams: true,
          postProcessing: true,
          bloomIntensity: 2.5,
          dof: true,
        };
      case "high":
        return {
          particles: 300,
          connections: true,
          trails: false,
          geometric: true,
          grid: true,
          streams: false,
          postProcessing: true,
          bloomIntensity: 1.5,
          dof: false,
        };
      case "medium":
        return {
          particles: 150,
          connections: true,
          trails: false,
          geometric: true,
          grid: false,
          streams: false,
          postProcessing: false,
          bloomIntensity: 1.0,
          dof: false,
        };
      default: // low
        return {
          particles: 50,
          connections: false,
          trails: false,
          geometric: false,
          grid: false,
          streams: false,
          postProcessing: false,
          bloomIntensity: 0.5,
          dof: false,
        };
    }
  }, [qualityTier]);

  // Get geometric shapes positions for collision detection
  const geometricShapes = useMemo(() => [
    { position: new THREE.Vector3(-250, 100, -100), radius: 80 },
    { position: new THREE.Vector3(200, -80, 50), radius: 60 },
    { position: new THREE.Vector3(50, 180, -50), radius: 50 },
  ], []);

  return (
    <group ref={groupRef}>
      {/* Background Grid */}
      {qualitySettings.grid ? (
        <HeroAdvancedGrid
          theme={theme}
          enableAnimation={!prefersReducedMotion}
          quality={qualityTier === "ultra" ? 1 : 0.5}
        />
      ) : null}

      {/* Data Streams */}
      {qualitySettings.streams ? (
        <HeroDataStreams
          theme={theme}
          columnCount={10}
          enableAnimation={!prefersReducedMotion}
          quality={qualityTier === "ultra" ? 1 : 0.7}
        />
      ) : null}

      {/* Advanced Particle System with 3 layers */}
      <HeroParticleSystem
        count={qualitySettings.particles}
        mouseState={mouseStateRef}
        enableAnimation={!prefersReducedMotion}
        theme={theme}
        geometricShapes={geometricShapes}
      />

      {/* Neural Connections between particles */}
      {qualitySettings.connections && particlePositionsRef.current ? (
        <HeroNeuralConnections
          particlePositions={particlePositionsRef.current}
          particleCount={qualitySettings.particles}
          theme={theme}
          maxConnections={200}
          connectionDistance={150}
          enableAnimation={!prefersReducedMotion}
          quality={qualityTier === "ultra" ? 1 : 0.7}
        />
      ) : null}

      {/* Particle Trails */}
      {qualitySettings.trails && particlePositionsRef.current ? (
        <HeroParticleTrails
          particlePositions={particlePositionsRef.current}
          particleCount={qualitySettings.particles}
          theme={theme}
          trailLength={8}
          enableAnimation={!prefersReducedMotion}
          quality={qualityTier === "ultra" ? 1 : 0.7}
        />
      ) : null}

      {/* Holographic Geometric Shapes */}
      {qualitySettings.geometric ? (
        <HeroGeometricShapes
          theme={theme}
          mouseState={mouseStateRef}
          enableAnimation={!prefersReducedMotion}
          quality={qualityTier === "ultra" ? 1 : 0.5}
        />
      ) : null}

      {/* Interaction Ripples */}
      <HeroInteractionRipple
        theme={theme}
        enableInteraction={!prefersReducedMotion}
        particlePositions={particlePositionsRef.current || undefined}
        particleCount={qualitySettings.particles}
      />

      {/* Post-processing effects - disabled when context is lost */}
      {enablePostProcessing && qualitySettings.postProcessing && !prefersReducedMotion && !contextLost ? (
        <EffectComposer>
          <>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              height={300}
              intensity={qualitySettings.bloomIntensity}
              radius={0.8}
            />
            
            {qualitySettings.dof ? (
              <DepthOfField
                focusDistance={0.05}
                focalLength={0.1}
                bokehScale={2}
                height={480}
              />
            ) : null}
            
            <Vignette
              offset={0.3}
              darkness={theme === "contrast" ? 0.8 : 0.5}
              eskil={false}
            />
          </>
        </EffectComposer>
      ) : null}
    </group>
  );
}
