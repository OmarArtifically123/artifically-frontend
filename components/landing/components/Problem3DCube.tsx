"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useAdaptiveComplexity } from "@/hooks/useAdaptiveComplexity";

interface CubeFace {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface Problem3DCubeProps {
  faces: CubeFace[];
  onFaceChange?: (faceId: string) => void;
}

/**
 * Interactive 3D cube showing different transformations on each face
 * Users can drag to rotate or click faces to view
 */
export default function Problem3DCube({ faces, onFaceChange }: Problem3DCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFace, setActiveFace] = useState(0);
  const { supportsWebGL, complexityLevel } = useAdaptiveComplexity();
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    cube: THREE.Mesh;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !supportsWebGL) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: complexityLevel !== "low",
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create cube with different colors on each face
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Create materials for each face
    const materials = faces.slice(0, 6).map((face) => 
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(face.color),
        emissive: new THREE.Color(face.color),
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.3,
      })
    );

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.01;
      targetRotation.x += deltaY * 0.01;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging || event.touches.length !== 1) return;

      const deltaX = event.touches[0].clientX - previousMousePosition.x;
      const deltaY = event.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.01;
      targetRotation.x += deltaY * 0.01;

      previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    // Animation
    let animationId: number;
    
    const animate = () => {
      // Smooth rotation interpolation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

      cube.rotation.x = currentRotation.x;
      cube.rotation.y = currentRotation.y;

      // Auto-rotate when not dragging
      if (!isDragging) {
        targetRotation.y += 0.002;
      }

      // Pulsing effect
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      cube.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

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

    sceneRef.current = {
      scene,
      camera,
      renderer,
      cube,
    };

    // Cleanup
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationId);
      sceneRef.current = null;
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);

      geometry.dispose();
      materials.forEach(m => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [supportsWebGL, complexityLevel, faces]);

  // Fallback for non-WebGL browsers
  if (!supportsWebGL) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl">
        <div className="text-center p-8">
          <p className="text-slate-400">Interactive 3D visualization</p>
          <p className="text-sm text-slate-500 mt-2">
            WebGL is required for this feature
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D cube showing different problem-solution transformations"
    />
  );
}




