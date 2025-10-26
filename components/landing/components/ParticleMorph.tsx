"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ParticleMorphShader } from "../shaders/ParticleMorphShader";

interface ParticleMorphProps {
  progress: number;
  isActive: boolean;
}

/**
 * Particle system that morphs from chaos (scattered) to order (structured grid)
 */
export default function ParticleMorph({ progress, isActive }: ParticleMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    clock: THREE.Clock;
    animationId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle geometry
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const animationDelays = new Float32Array(particleCount);
    
    // Generate particle data
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Initial positions (chaos - random scattered)
      randomPositions[i3] = (Math.random() - 0.5) * 10;
      randomPositions[i3 + 1] = (Math.random() - 0.5) * 10;
      randomPositions[i3 + 2] = (Math.random() - 0.5) * 5;
      
      // Target positions (order - structured grid)
      const gridSize = Math.ceil(Math.cbrt(particleCount));
      const index = i;
      const x = (index % gridSize) - gridSize / 2;
      const y = Math.floor((index / gridSize) % gridSize) - gridSize / 2;
      const z = Math.floor(index / (gridSize * gridSize)) - gridSize / 2;
      
      targetPositions[i3] = x * 0.5;
      targetPositions[i3 + 1] = y * 0.5;
      targetPositions[i3 + 2] = z * 0.5;
      
      // Start with random positions
      positions[i3] = randomPositions[i3];
      positions[i3 + 1] = randomPositions[i3 + 1];
      positions[i3 + 2] = randomPositions[i3 + 2];
      
      // Random scales
      scales[i] = Math.random() * 0.5 + 0.5;
      
      // Staggered animation delays
      animationDelays[i] = Math.random() * 0.3;
    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aRandomPosition", new THREE.BufferAttribute(randomPositions, 3));
    geometry.setAttribute("aTargetPosition", new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute("aAnimationDelay", new THREE.BufferAttribute(animationDelays, 1));
    
    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: ParticleMorphShader.vertexShader,
      fragmentShader: ParticleMorphShader.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSize: { value: 8.0 },
        uChaosPosition: { value: new THREE.Vector3(0, 0, 0) },
        uOrderPosition: { value: new THREE.Vector3(0, 0, 0) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const clock = new THREE.Clock();
    
    // Animation loop
    function animate() {
      const elapsedTime = clock.getElapsedTime();
      
      // Update uniforms
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uProgress.value = progress;
      
      // Rotate particles slightly
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
      
      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    }
    
    if (isActive) {
      animate();
    }
    
    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      clock,
      animationId: null,
    };

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Update progress when it changes
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.particles.material instanceof THREE.ShaderMaterial) {
      sceneRef.current.particles.material.uniforms.uProgress.value = progress;
    }
  }, [progress, isActive]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] relative"
      role="img"
      aria-label="Particle transformation visualization"
    />
  );
}




