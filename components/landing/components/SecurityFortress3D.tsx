"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HolographicEnhancement } from "../shaders/HolographicEnhancement";

/**
 * 3D visualization of security fortress with holographic shield
 */
export default function SecurityFortress3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.03);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 3, 6);

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
    controls.minDistance = 3;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Center fortress
    const fortressGeometry = new THREE.CylinderGeometry(1, 1.2, 2, 6);
    const fortressMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x1e40af,
      emissiveIntensity: 0.3,
    });
    const fortress = new THREE.Mesh(fortressGeometry, fortressMaterial);
    fortress.position.y = 1;
    scene.add(fortress);

    // Fortress top (roof)
    const roofGeometry = new THREE.ConeGeometry(1.3, 0.8, 6);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.9,
      roughness: 0.1,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.4;
    scene.add(roof);

    // Security shield (holographic sphere)
    const shieldGeometry = new THREE.SphereGeometry(2, 64, 64);
    const shieldMaterial = new THREE.ShaderMaterial({
      vertexShader: HolographicEnhancement.vertexShader,
      fragmentShader: HolographicEnhancement.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 1.0 },
        uColor: { value: new THREE.Color(0x06b6d4) },
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.y = 1.5;
    scene.add(shield);

    // Security layers (rings)
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(2.5 + i * 0.3, 0.05, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.4 - i * 0.1,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 1.5 + i * 0.3;
      ring.rotation.x = Math.PI / 2 + (i * Math.PI) / 6;
      scene.add(ring);
    }

    // Security nodes (orbiting spheres)
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      const angle = (i / 6) * Math.PI * 2;
      node.position.x = Math.cos(angle) * 3;
      node.position.z = Math.sin(angle) * 3;
      node.position.y = 1.5;
      
      scene.add(node);
      nodes.push(node);

      // Connection lines to fortress
      const points = [new THREE.Vector3(0, 1.5, 0), node.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.3,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }

    // Ground plane (grid)
    const gridHelper = new THREE.GridHelper(10, 20, 0x06b6d4, 0x0a0a14);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 1, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 1, 50);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Animation
    const clock = new THREE.Clock();
    let animationId: number;

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Update shield shader
      shieldMaterial.uniforms.uTime.value = elapsedTime;

      // Rotate shield
      shield.rotation.y = elapsedTime * 0.2;

      // Orbit nodes
      nodes.forEach((node, i) => {
        const angle = (i / 6) * Math.PI * 2 + elapsedTime * 0.3;
        node.position.x = Math.cos(angle) * 3;
        node.position.z = Math.sin(angle) * 3;
        node.position.y = 1.5 + Math.sin(elapsedTime * 2 + i) * 0.2;
      });

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
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] rounded-xl overflow-hidden cursor-move"
      role="img"
      aria-label="Interactive 3D security fortress visualization"
    />
  );
}


