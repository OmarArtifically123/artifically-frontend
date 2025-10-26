"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface Chart3DProps {
  data: DataPoint[];
  type: "bar" | "line";
  title: string;
}

/**
 * 3D charts using Three.js for impressive data visualization
 */
export default function Chart3D({ data, type, title }: Chart3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a14, 10, 50);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(8, 6, 8);

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
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2.2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 50);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Grid floor
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Create chart based on type
    if (type === "bar") {
      createBarChart(scene, data);
    } else {
      createLineChart(scene, data);
    }

    // Animation loop
    let animationId: number;
    let isMounted = true;

    function animate() {
      if (!isMounted) return;
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
      isMounted = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [data, type]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950"
      />
      <div className="absolute top-4 left-4 text-white">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-xs text-slate-400 mt-1">Interactive 3D Visualization</p>
      </div>
    </div>
  );
}

function createBarChart(scene: THREE.Scene, data: DataPoint[]) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const spacing = 2;

  data.forEach((point, index) => {
    const height = (point.value / maxValue) * 5;
    const x = (index - data.length / 2) * spacing;

    // Bar
    const geometry = new THREE.BoxGeometry(1, height, 1);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(point.color),
      emissive: new THREE.Color(point.color),
      emissiveIntensity: 0.3,
      metalness: 0.5,
      roughness: 0.3,
    });

    const bar = new THREE.Mesh(geometry, material);
    bar.position.set(x, height / 2, 0);
    scene.add(bar);

    // Glow effect
    const glowGeometry = new THREE.BoxGeometry(1.2, height + 0.2, 1.2);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(point.color),
      transparent: true,
      opacity: 0.2,
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(x, height / 2, 0);
    scene.add(glow);
  });
}

function createLineChart(scene: THREE.Scene, data: DataPoint[]) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const spacing = 2;

  // Create points
  const points: THREE.Vector3[] = [];

  data.forEach((point, index) => {
    const height = (point.value / maxValue) * 5;
    const x = (index - data.length / 2) * spacing;

    points.push(new THREE.Vector3(x, height, 0));

    // Sphere at each point
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(point.color),
      emissive: new THREE.Color(point.color),
      emissiveIntensity: 0.5,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, height, 0);
    scene.add(sphere);
  });

  // Create line through points
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(data[0].color),
    emissive: new THREE.Color(data[0].color),
    emissiveIntensity: 0.3,
  });

  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(tube);
}





