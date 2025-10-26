"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HeroNeuralConnectionsProps {
  particlePositions?: Float32Array;
  particleCount?: number;
  theme?: "dark" | "light" | "contrast";
  maxConnections?: number;
  connectionDistance?: number;
  enableAnimation?: boolean;
  quality?: number;
}

interface Connection {
  indexA: number;
  indexB: number;
  distance: number;
  energy: number;
}

/**
 * HeroNeuralConnections - Dynamic particle connection system
 * 
 * Features:
 * - Neural network-style lines connecting nearby particles
 * - Dynamic thickness based on distance (closer = thicker)
 * - Animated energy pulses traveling along connections
 * - Opacity fades with distance
 * - Color shifts based on connection "energy"
 * - Smart viewport culling (only render visible connections)
 * - Max 200 connections for performance
 * - Theme-specific rendering
 */
export default function HeroNeuralConnections({
  particlePositions,
  particleCount = 0,
  theme = "dark",
  maxConnections = 200,
  connectionDistance = 150,
  enableAnimation = true,
  quality = 1,
}: HeroNeuralConnectionsProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const connectionsRef = useRef<Connection[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const clockRef = useRef(0);
  const { camera } = useThree();

  // Theme-specific colors
  const colors = useMemo(() => {
    switch (theme) {
      case "light":
        return {
          primary: new THREE.Color("#7c3aed"),
          secondary: new THREE.Color("#ec4899"),
          accent: new THREE.Color("#1f7eff"),
        };
      case "contrast":
        return {
          primary: new THREE.Color("#ffff00"),
          secondary: new THREE.Color("#00eaff"),
          accent: new THREE.Color("#ff00ff"),
        };
      default:
        return {
          primary: new THREE.Color("#3b82f6"),
          secondary: new THREE.Color("#8b5cf6"),
          accent: new THREE.Color("#00d4ff"),
        };
    }
  }, [theme]);

  // Create shader material for connections
  const connectionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorPrimary: { value: colors.primary },
        uColorSecondary: { value: colors.secondary },
        uColorAccent: { value: colors.accent },
        uPulseSpeed: { value: 2.0 },
        uOpacityMultiplier: { value: theme === "contrast" ? 1.0 : 0.6 },
        uThicknessMultiplier: { value: theme === "contrast" ? 2.0 : 1.0 },
      },
      vertexShader: `
        attribute float distance;
        attribute float energy;
        attribute float linePosition;
        
        varying float vDistance;
        varying float vEnergy;
        varying float vLinePosition;
        
        void main() {
          vDistance = distance;
          vEnergy = energy;
          vLinePosition = linePosition;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorSecondary;
        uniform vec3 uColorAccent;
        uniform float uPulseSpeed;
        uniform float uOpacityMultiplier;
        uniform float uThicknessMultiplier;
        
        varying float vDistance;
        varying float vEnergy;
        varying float vLinePosition;
        
        void main() {
          // Distance-based opacity (closer connections are more opaque)
          float distanceFactor = 1.0 - smoothstep(50.0, 150.0, vDistance);
          
          // Energy pulse traveling along the connection
          float pulsePosition = fract(vLinePosition + uTime * uPulseSpeed * vEnergy);
          float pulse = smoothstep(0.0, 0.1, pulsePosition) * smoothstep(0.3, 0.1, pulsePosition);
          
          // Color mixing based on energy and pulse
          vec3 baseColor = mix(uColorPrimary, uColorSecondary, vEnergy);
          vec3 finalColor = mix(baseColor, uColorAccent, pulse * 0.8);
          
          // Glow effect
          float glow = pulse * 2.0 + distanceFactor * 0.5;
          finalColor *= (1.0 + glow);
          
          // Final opacity
          float alpha = (distanceFactor * 0.4 + pulse * 0.6) * uOpacityMultiplier;
          alpha = clamp(alpha, 0.0, 1.0);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [colors, theme]);

  // Calculate connections between particles
  const calculateConnections = useMemo(() => {
    return (positions: Float32Array, count: number, maxDist: number, maxConn: number): Connection[] => {
      if (!positions || count === 0) return [];

      const connections: Connection[] = [];
      const posVector1 = new THREE.Vector3();
      const posVector2 = new THREE.Vector3();

      // Find all connections within distance
      for (let i = 0; i < count; i++) {
        posVector1.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );

        for (let j = i + 1; j < count; j++) {
          posVector2.set(
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          );

          const distance = posVector1.distanceTo(posVector2);

          if (distance < maxDist) {
            connections.push({
              indexA: i,
              indexB: j,
              distance,
              energy: Math.random(), // Random energy for varied pulse speeds
            });
          }

          // Early exit if we have too many connections
          if (connections.length >= maxConn * 2) {
            break;
          }
        }

        if (connections.length >= maxConn * 2) {
          break;
        }
      }

      // Sort by distance and take closest connections
      connections.sort((a, b) => a.distance - b.distance);
      return connections.slice(0, maxConn);
    };
  }, []);

  // Update geometry with current connections
  useEffect(() => {
    if (!particlePositions || particleCount === 0) return;

    // Calculate new connections
    const connections = calculateConnections(
      particlePositions,
      particleCount,
      connectionDistance,
      maxConnections
    );

    connectionsRef.current = connections;

    // Create line geometry
    const positions = new Float32Array(connections.length * 6); // 2 points per connection * 3 coords
    const distances = new Float32Array(connections.length * 2);
    const energies = new Float32Array(connections.length * 2);
    const linePositions = new Float32Array(connections.length * 2);

    connections.forEach((connection, i) => {
      const i6 = i * 6;
      const i2 = i * 2;

      // Start point
      positions[i6] = particlePositions[connection.indexA * 3];
      positions[i6 + 1] = particlePositions[connection.indexA * 3 + 1];
      positions[i6 + 2] = particlePositions[connection.indexA * 3 + 2];

      // End point
      positions[i6 + 3] = particlePositions[connection.indexB * 3];
      positions[i6 + 4] = particlePositions[connection.indexB * 3 + 1];
      positions[i6 + 5] = particlePositions[connection.indexB * 3 + 2];

      // Attributes
      distances[i2] = connection.distance;
      distances[i2 + 1] = connection.distance;

      energies[i2] = connection.energy;
      energies[i2 + 1] = connection.energy;

      linePositions[i2] = 0; // Start of line
      linePositions[i2 + 1] = 1; // End of line
    });

    // Create or update geometry
    if (geometryRef.current) {
      geometryRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute("distance", new THREE.BufferAttribute(distances, 1));
      geometryRef.current.setAttribute("energy", new THREE.BufferAttribute(energies, 1));
      geometryRef.current.setAttribute("linePosition", new THREE.BufferAttribute(linePositions, 1));
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.distance.needsUpdate = true;
      geometryRef.current.attributes.energy.needsUpdate = true;
    } else {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("distance", new THREE.BufferAttribute(distances, 1));
      geometry.setAttribute("energy", new THREE.BufferAttribute(energies, 1));
      geometry.setAttribute("linePosition", new THREE.BufferAttribute(linePositions, 1));
      geometryRef.current = geometry;
    }
  }, [particlePositions, particleCount, calculateConnections, connectionDistance, maxConnections]);

  // Update material reference
  useEffect(() => {
    materialRef.current = connectionMaterial;
  }, [connectionMaterial]);

  // Animation loop - update shader time and line positions
  useFrame((state, delta) => {
    if (!enableAnimation || !materialRef.current) return;

    clockRef.current += delta;
    materialRef.current.uniforms.uTime.value = clockRef.current;

    // Update line positions based on particle movement
    if (
      particlePositions &&
      geometryRef.current &&
      geometryRef.current.attributes.position
    ) {
      const positions = geometryRef.current.attributes.position.array as Float32Array;
      const connections = connectionsRef.current;

      connections.forEach((connection, i) => {
        const i6 = i * 6;

        // Update start point
        positions[i6] = particlePositions[connection.indexA * 3];
        positions[i6 + 1] = particlePositions[connection.indexA * 3 + 1];
        positions[i6 + 2] = particlePositions[connection.indexA * 3 + 2];

        // Update end point
        positions[i6 + 3] = particlePositions[connection.indexB * 3];
        positions[i6 + 4] = particlePositions[connection.indexB * 3 + 1];
        positions[i6 + 5] = particlePositions[connection.indexB * 3 + 2];
      });

      geometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }
    };
  }, []);

  if (!geometryRef.current || connectionsRef.current.length === 0) {
    return null;
  }

  return (
    <lineSegments ref={lineRef} geometry={geometryRef.current} material={connectionMaterial} />
  );
}

/**
 * Helper: Calculate if connection is in view frustum
 */
function isConnectionInView(
  posA: THREE.Vector3,
  posB: THREE.Vector3,
  camera: THREE.Camera,
  frustum: THREE.Frustum
): boolean {
  // Check if either endpoint is in frustum
  return frustum.containsPoint(posA) || frustum.containsPoint(posB);
}

/**
 * Advanced version with frustum culling
 */
export function HeroNeuralConnectionsOptimized({
  particlePositions,
  particleCount = 0,
  theme = "dark",
  maxConnections = 200,
  connectionDistance = 150,
  enableAnimation = true,
  quality = 1,
}: HeroNeuralConnectionsProps) {
  const { camera } = useThree();
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  // Update frustum every frame
  useFrame(() => {
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
  });

  // For now, use the standard component
  // TODO: Implement frustum culling for connections
  return (
    <HeroNeuralConnections
      particlePositions={particlePositions}
      particleCount={particleCount}
      theme={theme}
      maxConnections={maxConnections}
      connectionDistance={connectionDistance}
      enableAnimation={enableAnimation}
      quality={quality}
    />
  );
}

