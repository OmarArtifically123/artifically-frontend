"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DataFlowAnimation from "./DataFlowAnimation";
import { NodeGlowShader } from "../shaders/NodeGlowShader";
import type { GraphNode, GraphEdge } from "@/types/three-components";

interface Architecture3DGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (nodeId: string) => void;
  xRayMode?: boolean;
}

/**
 * Interactive 3D node graph showing system architecture
 */
export default function Architecture3DGraph({
  nodes,
  edges,
  onNodeClick,
  xRayMode = false,
}: Architecture3DGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    nodeMeshes: Map<string, THREE.Mesh>;
    nodeGlows: Map<string, THREE.Mesh>;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.05);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 10, 20);

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
    controls.maxDistance = 50;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Create node meshes
    const nodeMeshes: Map<string, THREE.Mesh> = new Map();
    const nodeGlows: Map<string, THREE.Mesh> = new Map();

    nodes.forEach((node) => {
      // Node sphere
      const geometry = new THREE.SphereGeometry(node.size || 0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color || 0x00ffff),
        emissive: new THREE.Color(node.color || 0x00ffff),
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.position);
      mesh.userData = { id: node.id, label: node.label };
      scene.add(mesh);
      nodeMeshes.set(node.id, mesh);

      // Glow effect
      const glowGeometry = new THREE.SphereGeometry((node.size || 0.5) * 1.2, 32, 32);
      const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: NodeGlowShader.vertexShader,
        fragmentShader: NodeGlowShader.fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.5 },
          uColor: { value: new THREE.Color(node.color || 0x00ffff) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });

      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(node.position);
      scene.add(glowMesh);
      nodeGlows.set(node.id, glowMesh);

      // Label
      const labelDiv = document.createElement("div");
      labelDiv.textContent = node.label;
      labelDiv.style.cssText = `
        position: absolute;
        color: white;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.7);
        padding: 4px 8px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
      `;
      container.appendChild(labelDiv);

      // Update label position
      function updateLabel() {
        const vector = node.position.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * width;
        const y = (-(vector.y * 0.5) + 0.5) * height;
        labelDiv.style.left = `${x}px`;
        labelDiv.style.top = `${y}px`;
      }

      (mesh.userData as Record<string, unknown>).updateLabel = updateLabel;
    });

    // Create connection lines
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        const points = [sourceNode.position, targetNode.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(edge.color || 0x00ffff),
          opacity: 0.3,
          transparent: true,
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    });

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(nodeMeshes.values()));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const nodeId = clickedMesh.userData.id;
        setSelectedNode(nodeId);
        onNodeClick?.(nodeId);

        // Zoom to node
        const targetPosition = clickedMesh.position.clone();
        targetPosition.z += 5;

        // Animate camera
        const startPosition = camera.position.clone();
        const duration = 1000;
        const startTime = Date.now();

        function animateCamera() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          camera.position.lerpVectors(startPosition, targetPosition, eased);
          camera.lookAt(clickedMesh.position);

          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          }
        }

        animateCamera();
      }
    };

    container.addEventListener("click", handleClick);

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Update glow shaders
      nodeGlows.forEach((glow) => {
        const material = glow.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = elapsedTime;
      });

      // Update labels
      nodeMeshes.forEach((mesh) => {
        if (mesh.userData && typeof (mesh.userData as Record<string, unknown>).updateLabel === 'function') {
          ((mesh.userData as Record<string, unknown>).updateLabel as () => void)();
        }
      });

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

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      nodeMeshes,
      nodeGlows,
    };

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);

      nodeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      nodeGlows.forEach((glow) => {
        glow.geometry.dispose();
        (glow.material as THREE.Material).dispose();
      });

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [nodes, edges, onNodeClick]);

  // X-Ray mode effect
  useEffect(() => {
    if (!sceneRef.current) return;

    const { nodeMeshes } = sceneRef.current;

    nodeMeshes.forEach((mesh: THREE.Mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = xRayMode ? 0.3 : 1;
      material.transparent = xRayMode;
    });
  }, [xRayMode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] rounded-xl overflow-hidden cursor-pointer"
      role="img"
      aria-label="Interactive 3D system architecture graph"
    />
  );
}




