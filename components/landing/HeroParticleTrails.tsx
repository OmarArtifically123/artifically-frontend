"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HeroParticleTrailsProps {
  particlePositions?: Float32Array;
  particleVelocities?: Float32Array;
  particleCount?: number;
  theme?: "dark" | "light" | "contrast";
  trailLength?: number;
  enableAnimation?: boolean;
  quality?: number;
}

interface TrailSegment {
  position: THREE.Vector3;
  age: number;
  velocity: THREE.Vector3;
}

interface ParticleTrailData {
  segments: TrailSegment[];
  color: THREE.Color;
}

/**
 * HeroParticleTrails - Motion trail system for particles
 * 
 * Features:
 * - Each particle leaves a fading trail (5-10 segments)
 * - Trail segments use additive blending for glow effect
 * - Trails curve based on velocity changes
 * - GPU-instanced rendering for 1000+ trail segments
 * - Auto-cleanup for memory management
 * - Theme-specific trail colors and intensities
 */
export default function HeroParticleTrails({
  particlePositions,
  particleVelocities,
  particleCount = 0,
  theme = "dark",
  trailLength = 8,
  enableAnimation = true,
  quality = 1,
}: HeroParticleTrailsProps) {
  const trailsRef = useRef<ParticleTrailData[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Points | null>(null);
  const clockRef = useRef(0);
  const frameCount = useRef(0);

  // Adjust trail length based on quality
  const effectiveTrailLength = useMemo(() => {
    return Math.max(3, Math.floor(trailLength * quality));
  }, [trailLength, quality]);

  // Theme-specific colors
  const trailColors = useMemo(() => {
    switch (theme) {
      case "light":
        return [
          new THREE.Color("#1f7eff"),
          new THREE.Color("#ec4899"),
          new THREE.Color("#f59e0b"),
          new THREE.Color("#7c3aed"),
          new THREE.Color("#10b981"),
          new THREE.Color("#0ea5e9"),
        ];
      case "contrast":
        return [
          new THREE.Color("#00eaff"),
          new THREE.Color("#ff00ff"),
          new THREE.Color("#ffff00"),
          new THREE.Color("#00ffe0"),
          new THREE.Color("#ff00aa"),
          new THREE.Color("#00d4ff"),
        ];
      default:
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

  // Initialize trails for each particle
  useEffect(() => {
    if (particleCount === 0) return;

    const trails: ParticleTrailData[] = [];

    for (let i = 0; i < particleCount; i++) {
      trails.push({
        segments: [],
        color: trailColors[i % trailColors.length].clone(),
      });
    }

    trailsRef.current = trails;
  }, [particleCount, trailColors]);

  // Create shader material for trails
  const trailMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: theme === "contrast" ? 0.9 : 0.7 },
        uGlowIntensity: { value: theme === "contrast" ? 2.5 : 1.5 },
      },
      vertexShader: `
        attribute vec3 color;
        attribute float age;
        attribute float size;
        
        varying vec3 vColor;
        varying float vAge;
        
        void main() {
          vColor = color;
          vAge = age;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Size attenuation based on age
          float ageFactor = 1.0 - vAge;
          gl_PointSize = size * ageFactor * (300.0 / -mvPosition.z);
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uGlowIntensity;
        
        varying vec3 vColor;
        varying float vAge;
        
        void main() {
          // Circular particle shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) {
            discard;
          }
          
          // Soft edge
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          
          // Fade with age
          float ageFade = 1.0 - vAge;
          alpha *= ageFade;
          
          // Glow effect
          float glow = 1.0 + (1.0 - dist * 2.0) * uGlowIntensity * ageFade;
          vec3 color = vColor * glow;
          
          gl_FragColor = vec4(color, alpha * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [theme]);

  // Update trails every frame
  useFrame((state, delta) => {
    if (!enableAnimation || !particlePositions || particleCount === 0) return;

    clockRef.current += delta;
    frameCount.current++;

    // Update trails every frame for smooth motion
    const trails = trailsRef.current;
    const updateInterval = Math.max(1, Math.floor(3 * (1 / quality)));

    if (frameCount.current % updateInterval !== 0) {
      // Still update shader time even if not adding new segments
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = clockRef.current;
      }
      return;
    }

    // Add new trail segments and age existing ones
    for (let i = 0; i < particleCount; i++) {
      const trail = trails[i];
      if (!trail) continue;

      // Get current particle position
      const currentPos = new THREE.Vector3(
        particlePositions[i * 3],
        particlePositions[i * 3 + 1],
        particlePositions[i * 3 + 2]
      );

      // Get velocity if available
      const velocity = particleVelocities
        ? new THREE.Vector3(
            particleVelocities[i * 3],
            particleVelocities[i * 3 + 1],
            particleVelocities[i * 3 + 2]
          )
        : new THREE.Vector3();

      // Add new segment at current position
      trail.segments.unshift({
        position: currentPos.clone(),
        age: 0,
        velocity: velocity.clone(),
      });

      // Age existing segments
      trail.segments.forEach((segment) => {
        segment.age += delta * 0.5;
      });

      // Remove old segments
      while (trail.segments.length > effectiveTrailLength) {
        trail.segments.pop();
      }
    }

    // Update geometry with all trail segments
    updateTrailGeometry();

    // Update shader time
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clockRef.current;
    }
  });

  // Update geometry with current trail data
  const updateTrailGeometry = () => {
    const trails = trailsRef.current;
    if (trails.length === 0) return;

    // Count total segments
    let totalSegments = 0;
    trails.forEach((trail) => {
      totalSegments += trail.segments.length;
    });

    if (totalSegments === 0) return;

    // Create arrays for all trail segments
    const positions = new Float32Array(totalSegments * 3);
    const colors = new Float32Array(totalSegments * 3);
    const ages = new Float32Array(totalSegments);
    const sizes = new Float32Array(totalSegments);

    let segmentIndex = 0;

    trails.forEach((trail) => {
      trail.segments.forEach((segment, i) => {
        // Position
        positions[segmentIndex * 3] = segment.position.x;
        positions[segmentIndex * 3 + 1] = segment.position.y;
        positions[segmentIndex * 3 + 2] = segment.position.z;

        // Color
        colors[segmentIndex * 3] = trail.color.r;
        colors[segmentIndex * 3 + 1] = trail.color.g;
        colors[segmentIndex * 3 + 2] = trail.color.b;

        // Age (0 = new, 1 = old)
        ages[segmentIndex] = segment.age;

        // Size (decreases with age)
        sizes[segmentIndex] = theme === "contrast" ? 3.0 : 2.0;

        segmentIndex++;
      });
    });

    // Create or update geometry
    if (geometryRef.current) {
      geometryRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometryRef.current.setAttribute("age", new THREE.BufferAttribute(ages, 1));
      geometryRef.current.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
      geometryRef.current.attributes.age.needsUpdate = true;
    } else {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("age", new THREE.BufferAttribute(ages, 1));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometryRef.current = geometry;
    }
  };

  // Update material reference
  useEffect(() => {
    materialRef.current = trailMaterial;
  }, [trailMaterial]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }
    };
  }, []);

  if (!geometryRef.current) {
    return null;
  }

  return <points ref={meshRef} geometry={geometryRef.current} material={trailMaterial} />;
}

/**
 * Simple trail component for testing
 */
export function SimpleParticleTrail({
  position,
  color = "#00d4ff",
  length = 10,
}: {
  position: [number, number, number];
  color?: string;
  length?: number;
}) {
  const trailRef = useRef<THREE.Points>(null);
  const segments = useRef<THREE.Vector3[]>([]);
  const clockRef = useRef(0);

  useFrame((state, delta) => {
    clockRef.current += delta;

    // Add current position
    segments.current.unshift(new THREE.Vector3(...position));

    // Remove old segments
    if (segments.current.length > length) {
      segments.current.pop();
    }

    // Update geometry
    if (trailRef.current && trailRef.current.geometry) {
      const positions = new Float32Array(segments.current.length * 3);
      const colors = new Float32Array(segments.current.length * 3);
      const sizes = new Float32Array(segments.current.length);

      const colorObj = new THREE.Color(color);

      segments.current.forEach((seg, i) => {
        positions[i * 3] = seg.x;
        positions[i * 3 + 1] = seg.y;
        positions[i * 3 + 2] = seg.z;

        colors[i * 3] = colorObj.r;
        colors[i * 3 + 1] = colorObj.g;
        colors[i * 3 + 2] = colorObj.b;

        sizes[i] = 2 * (1 - i / segments.current.length);
      });

      trailRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      trailRef.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      trailRef.current.geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    }
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry />
      <pointsMaterial
        size={2}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

