/**
 * Reusable Three.js helper functions and utilities
 */

import * as THREE from "three";

/**
 * Create a basic scene with camera and renderer
 */
export function createScene(container: HTMLElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
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

  return { scene, camera, renderer };
}

/**
 * Handle window resize for Three.js scenes
 */
export function handleResize(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/**
 * Create particle geometry
 */
export function createParticleGeometry(count: number, spread: number = 10) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Position
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * spread;

    // Color
    colors[i3] = Math.random();
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return geometry;
}

/**
 * Create glow material
 */
export function createGlowMaterial(color: string | number, intensity: number = 1) {
  return new THREE.ShaderMaterial({
    uniforms: {
      c: { value: intensity },
      p: { value: 1.4 },
      glowColor: { value: new THREE.Color(color) },
      viewVector: { value: new THREE.Vector3() },
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
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
}

/**
 * Animate camera smoothly to a target position
 */
export function animateCameraTo(
  camera: THREE.Camera,
  targetPosition: THREE.Vector3,
  duration: number = 1000
): Promise<void> {
  return new Promise((resolve) => {
    const startPosition = camera.position.clone();
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      camera.position.lerpVectors(startPosition, targetPosition, eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    animate();
  });
}

/**
 * Create connection line between two points
 */
export function createConnectionLine(
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: string | number = 0x00ffff,
  opacity: number = 0.5
) {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    opacity,
    transparent: true,
  });

  return new THREE.Line(geometry, material);
}

/**
 * Dispose of Three.js resources
 */
export function disposeResources(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}

/**
 * Get mouse position in normalized device coordinates
 */
export function getMouseNDC(event: MouseEvent, container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
  };
}

/**
 * Create raycaster for object picking
 */
export function createRaycaster(
  camera: THREE.Camera,
  mouseNDC: { x: number; y: number }
) {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(mouseNDC.x, mouseNDC.y), camera);
  return raycaster;
}

const threeHelpers = {
  createScene,
  handleResize,
  createParticleGeometry,
  createGlowMaterial,
  animateCameraTo,
  createConnectionLine,
  disposeResources,
  getMouseNDC,
  createRaycaster,
};

export default threeHelpers;




