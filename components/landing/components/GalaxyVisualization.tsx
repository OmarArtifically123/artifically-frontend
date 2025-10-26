"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GalaxyShader } from "../shaders/GalaxyShader";

interface Integration {
  id: string;
  name: string;
  category: string;
  position: THREE.Vector3;
  color: string;
}

interface GalaxyVisualizationProps {
  integrations: Integration[];
  onIntegrationClick?: (integrationId: string) => void;
}

/**
 * 3D galaxy visualization showing integrations orbiting the platform
 */
export default function GalaxyVisualization({
  integrations,
  onIntegrationClick,
}: GalaxyVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.02);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 15, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Center platform (your system)
    const platformGeometry = new THREE.SphereGeometry(1, 64, 64);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    scene.add(platform);

    // Platform glow
    const glowGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        c: { value: 0.5 },
        p: { value: 4.5 },
        glowColor: { value: new THREE.Color(0x06b6d4) },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity);
        }
      `,
    });
    const platformGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(platformGlow);

    // Create particle galaxy
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount * 3);
    const orbitSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy positions
      const radius = Math.random() * 10 + 2;
      const angle = Math.random() * Math.PI * 2;
      const spinAngle = radius * 0.5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      positions[i3] = Math.cos(angle + spinAngle + branchAngle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i3 + 2] = Math.sin(angle + spinAngle + branchAngle) * radius;

      // Randomness for natural look
      randomness[i3] = (Math.random() - 0.5);
      randomness[i3 + 1] = (Math.random() - 0.5);
      randomness[i3 + 2] = (Math.random() - 0.5);

      scales[i] = Math.random();
      orbitSpeeds[i] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));
    geometry.setAttribute("aOrbitSpeed", new THREE.BufferAttribute(orbitSpeeds, 1));

    const galaxyMaterial = new THREE.ShaderMaterial({
      vertexShader: GalaxyShader.vertexShader,
      fragmentShader: GalaxyShader.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 8.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const galaxyParticles = new THREE.Points(geometry, galaxyMaterial);
    scene.add(galaxyParticles);

    // Add integration points
    integrations.forEach((integration) => {
      const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(integration.color),
        emissive: new THREE.Color(integration.color),
        emissiveIntensity: 0.5,
      });

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(integration.position);
      sphere.userData = { id: integration.id, name: integration.name };
      scene.add(sphere);

      // Connection line to center
      const points = [new THREE.Vector3(0, 0, 0), integration.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(integration.color),
        opacity: 0.2,
        transparent: true,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Animation
    const clock = new THREE.Clock();
    let animationId: number;

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Update shader uniforms
      galaxyMaterial.uniforms.uTime.value = elapsedTime * 0.1;

      // Rotate platform
      platform.rotation.y = elapsedTime * 0.2;

      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geometry.dispose();
      galaxyMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [integrations, onIntegrationClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] rounded-xl overflow-hidden cursor-move"
      role="img"
      aria-label="Interactive 3D integration galaxy"
    />
  );
}




