"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DataFlowShader } from "../shaders/DataFlowShader";

interface Connection {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
}

interface DataFlowAnimationProps {
  connections: Connection[];
  speed?: number;
  particleCount?: number;
}

/**
 * Animated data flow particles along connections
 */
export default function DataFlowAnimation({
  connections,
  speed = 0.5,
  particleCount = 20,
}: DataFlowAnimationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleSystemsRef = useRef<THREE.Points[]>([]);

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;

    // Clear existing particle systems
    particleSystemsRef.current.forEach((system) => {
      group.remove(system);
      system.geometry.dispose();
      (system.material as THREE.Material).dispose();
    });
    particleSystemsRef.current = [];
    let isMounted = true;

    // Create particle system for each connection
    connections.forEach((connection, index) => {
      const geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(particleCount * 3);
      const progress = new Float32Array(particleCount);
      const sizes = new Float32Array(particleCount);
      const delays = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Initial position (will be updated in shader)
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Evenly distribute particles along path
        progress[i] = i / particleCount;

        // Random size variation
        sizes[i] = 3 + Math.random() * 2;

        // Stagger animation
        delays[i] = Math.random();
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));

      const material = new THREE.ShaderMaterial({
        vertexShader: DataFlowShader.vertexShader,
        fragmentShader: DataFlowShader.fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: speed },
          uStartPosition: { value: connection.start },
          uEndPosition: { value: connection.end },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(geometry, material);
      group.add(particles);
      particleSystemsRef.current.push(particles);
    });

    return () => {
      isMounted = false;
      particleSystemsRef.current.forEach((system) => {
        system.geometry.dispose();
        (system.material as THREE.Material).dispose();
      });
    };
  }, [connections, speed, particleCount]);

  useEffect(() => {
    let animationId: number;
    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;
      const time = Date.now() * 0.001;

      // Update all particle systems
      particleSystemsRef.current.forEach((system) => {
        const material = system.material as THREE.ShaderMaterial;
        if (material.uniforms.uTime) {
          material.uniforms.uTime.value = time;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isMounted = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return <group ref={groupRef} />;
}





