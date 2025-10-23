"use client";

import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  Clock,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Float32BufferAttribute,
  InstancedMesh,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import { getNetworkInformation, prefersLowPower } from "../../utils/networkPreferences";

const STATIC_GRADIENT_IMAGE_SET =
  "image-set(\n    url('/images/hero-background.avif') type('image/avif') 1x,\n    url('/images/hero-background.webp') type('image/webp') 1x,\n    url('/images/hero-background.jpg') type('image/jpeg') 1x\n  )";

// Premium enterprise AI color palette with enhanced vibrancy
const PARTICLE_COLORS = [
  "#0ea5e9", // Electric Blue - Primary AI color
  "#06b6d4", // Cyan - Data flow
  "#7c3aed", // Violet - Intelligence & automation
  "#3b82f6", // Blue - Trust & stability
  "#8b5cf6", // Purple - Innovation
];

// Enhanced connection logic for neural network aesthetic
const BASE_CONNECTION_DISTANCE = 180; // Increased for more visible connections
const MAX_MOUSE_ACCELERATION = 0.6;
const MOUSE_FORCE_RADIUS = 250; // Larger interaction radius for enterprise scale
const LOW_FPS_THRESHOLD = 45;
const FPS_SAMPLE_SIZE = 120;
const MAX_PARTICLES = 200;

// New constants for neural network effect
const MIN_CONNECTION_OPACITY = 0.15;
const MAX_CONNECTION_OPACITY = 0.7;
const GLOW_INTENSITY = 1.2;

function resolveDeviceProfile(width, connection) {
  let formFactor = "desktop";
  if (width <= 768) {
    formFactor = "mobile";
  } else if (width <= 1200) {
    formFactor = "tablet";
  }

  const effectiveType = connection?.effectiveType?.toLowerCase?.() ?? "";
  const isSlowConnection = Boolean(connection) && effectiveType !== "" && effectiveType !== "4g";
  const lowPowerPreferred = prefersLowPower(connection);

  return {
    width,
    formFactor,
    isLowEndMobile: formFactor === "mobile" && (isSlowConnection || lowPowerPreferred),
  };
}

function mulberry32(seed) {
  return () => {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createPerlinNoise(seed = Math.random()) {
  const random = mulberry32(Math.floor(seed * 1_000_000));
  const permutation = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) {
    p[i] = i;
  }
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i += 1) {
    permutation[i] = p[i & 255];
  }

  const grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (hash, x, y, z) => {
    const g = grad3[hash % 12];
    return g[0] * x + g[1] * y + g[2] * z;
  };

  return (x, y, z) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const aaa = permutation[X + permutation[Y + permutation[Z]]];
    const aba = permutation[X + permutation[Y + 1 + permutation[Z]]];
    const aab = permutation[X + permutation[Y + permutation[Z + 1]]];
    const abb = permutation[X + permutation[Y + 1 + permutation[Z + 1]]];
    const baa = permutation[X + 1 + permutation[Y + permutation[Z]]];
    const bba = permutation[X + 1 + permutation[Y + 1 + permutation[Z]]];
    const bab = permutation[X + 1 + permutation[Y + permutation[Z + 1]]];
    const bbb = permutation[X + 1 + permutation[Y + 1 + permutation[Z + 1]]];

    const x1 = lerp(grad(aaa, xf, yf, zf), grad(baa, xf - 1, yf, zf), u);
    const x2 = lerp(grad(aba, xf, yf - 1, zf), grad(bba, xf - 1, yf - 1, zf), u);
    const y1 = lerp(x1, x2, v);

    const x3 = lerp(grad(aab, xf, yf, zf - 1), grad(bab, xf - 1, yf, zf - 1), u);
    const x4 = lerp(grad(abb, xf, yf - 1, zf - 1), grad(bbb, xf - 1, yf - 1, zf - 1), u);
    const y2 = lerp(x3, x4, v);

    return lerp(y1, y2, w);
  };
}

function getParticleCount(width) {
  if (width <= 768) {
    return 40;
  }
  if (width <= 1200) {
    return 80;
  }
  return 150;
}

function clampDevicePixelRatio() {
  if (typeof window === "undefined") {
    return 1;
  }
  const ratio = window.devicePixelRatio || 1;
  return Math.min(ratio, 2);
}

function createLineMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uGlowIntensity: { value: GLOW_INTENSITY },
    },
    vertexShader: `
      attribute vec4 color;
      varying vec4 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;
        vAlpha = color.a;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uGlowIntensity;
      varying vec4 vColor;
      varying float vAlpha;

      void main() {
        if (vAlpha <= 0.0) {
          discard;
        }
        // Enhanced glow effect with improved blending
        vec3 glowColor = vColor.rgb * uGlowIntensity;
        gl_FragColor = vec4(glowColor, vAlpha * 0.85);
      }
    `,
  });
}

function createGradientMaterial() {
  return new ShaderMaterial({
    side: DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColorTL: { value: new Color("#0f172a") }, // Deep Navy
      uColorTR: { value: new Color("#1e293b") }, // Slate
      uColorBL: { value: new Color("#1e1b4b") }, // Deep Indigo
      uColorBR: { value: new Color("#0f172a") }, // Deep Navy
      uGlowColor1: { value: new Color("#0ea5e9") }, // Electric Blue
      uGlowColor2: { value: new Color("#7c3aed") }, // Violet
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColorTL;
      uniform vec3 uColorTR;
      uniform vec3 uColorBL;
      uniform vec3 uColorBR;
      uniform vec3 uGlowColor1;
      uniform vec3 uGlowColor2;

      // Advanced Perlin-like noise function
      float noise(vec2 uv) {
        return sin(uv.x * 12.9898 + uv.y * 78.233) * 43758.5453;
      }

      vec2 rotateUV(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotation = mat2(c, -s, s, c);
        return rotation * (uv - 0.5) + 0.5;
      }

      void main() {
        // Subtle rotating gradient
        float angle = mod(uTime * 0.05, 20.0) / 20.0 * 6.28318530718;
        vec2 rotated = rotateUV(vUv, angle);
        rotated = clamp(rotated, 0.0, 1.0);

        // Base gradient
        vec3 top = mix(uColorTL, uColorTR, rotated.x);
        vec3 bottom = mix(uColorBL, uColorBR, rotated.x);
        vec3 baseColor = mix(top, bottom, rotated.y);

        // Add subtle glow highlights with energy nodes
        float distFromCenter = distance(vUv, vec2(0.5, 0.5));
        float glowFalloff = 1.0 - smoothstep(0.0, 1.2, distFromCenter);

        // Multi-colored glow accent
        vec3 glowAccent1 = uGlowColor1 * glowFalloff * 0.15;
        vec3 glowAccent2 = uGlowColor2 * (1.0 - glowFalloff) * 0.1;

        // Subtle time-based variation
        float timeVary = sin(uTime * 0.3 + distFromCenter * 3.0) * 0.05;
        vec3 finalColor = baseColor + glowAccent1 + glowAccent2 + vec3(timeVary);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });
}

export default function HeroBackground({ variant = "particles" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const instancedMeshRef = useRef(null);
  const lineGeometryRef = useRef(null);
  const noiseRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const frameTimesRef = useRef([]);
  const connectionDistanceRef = useRef(BASE_CONNECTION_DISTANCE);
  const performanceAdjustedRef = useRef(false);
  const clockRef = useRef(new Clock());
  const shouldAnimateRef = useRef(false);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    lastMove: 0,
    active: false,
  });
  const startAnimationRef = useRef(null);
  const stopAnimationRef = useRef(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [prefersLowPowerMode, setPrefersLowPowerMode] = useState(() => prefersLowPower());
  const [deviceProfile, setDeviceProfile] = useState(() =>
    resolveDeviceProfile(
      typeof window === "undefined" ? 1440 : window.innerWidth,
      undefined,
    ),
  );
  const [isInViewport, setIsInViewport] = useState(false);
  const isDocumentVisible = useDocumentVisibility();

  const shouldAnimate =
    variant === "particles" &&
    isInViewport &&
    isDocumentVisible &&
    !prefersReducedMotion &&
    !prefersLowPowerMode &&
    !deviceProfile.isLowEndMobile;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const connection = getNetworkInformation();
    if (!connection) {
      return undefined;
    }

    const updatePreference = () => setPrefersLowPowerMode(prefersLowPower(connection));

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", updatePreference);
      return () => connection.removeEventListener("change", updatePreference);
    }

    connection.onchange = updatePreference;
    return () => {
      connection.onchange = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const connection = getNetworkInformation();

    const updateProfile = () => {
      const width = window.innerWidth || 0;
      const profile = resolveDeviceProfile(width, connection ?? getNetworkInformation());

      if (profile.formFactor === "desktop") {
        connectionDistanceRef.current = BASE_CONNECTION_DISTANCE;
      } else if (profile.formFactor === "tablet") {
        connectionDistanceRef.current = BASE_CONNECTION_DISTANCE * 0.85;
      } else {
        connectionDistanceRef.current = BASE_CONNECTION_DISTANCE * 0.7;
      }

      setDeviceProfile((previous) => {
        if (
          previous.width === profile.width &&
          previous.formFactor === profile.formFactor &&
          previous.isLowEndMobile === profile.isLowEndMobile
        ) {
          return previous;
        }
        return profile;
      });
    };

    updateProfile();

    const handleResize = () => updateProfile();
    window.addEventListener("resize", handleResize);

    if (!connection) {
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    const handleConnectionChange = () => updateProfile();

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", handleConnectionChange);
      return () => {
        window.removeEventListener("resize", handleResize);
        connection.removeEventListener("change", handleConnectionChange);
      };
    }

    connection.onchange = handleConnectionChange;
    return () => {
      window.removeEventListener("resize", handleResize);
      connection.onchange = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const connection = getNetworkInformation();
    const width = window.innerWidth || 0;
    const profile = resolveDeviceProfile(width, connection);

    if (profile.formFactor === "desktop") {
      connectionDistanceRef.current = BASE_CONNECTION_DISTANCE;
    } else if (profile.formFactor === "tablet") {
      connectionDistanceRef.current = BASE_CONNECTION_DISTANCE * 0.85;
    } else {
      connectionDistanceRef.current = BASE_CONNECTION_DISTANCE * 0.7;
    }

    setDeviceProfile(profile);
  }, [prefersLowPowerMode]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === node) {
            setIsInViewport(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [variant]);

  useEffect(() => {
    if (prefersReducedMotion || variant !== "particles" || deviceProfile.isLowEndMobile || !isInViewport) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return undefined;
    }

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(clampDevicePixelRatio());
    renderer.setSize(container.clientWidth, container.clientHeight, false);

    const scene = new Scene();
    const camera = new OrthographicCamera(
      0,
      container.clientWidth,
      container.clientHeight,
      0,
      -1000,
      1000,
    );
    camera.position.set(0, 0, 10);

    const gradientMaterial = createGradientMaterial();
    const gradientGeometry = new PlaneGeometry(1, 1, 1, 1);
    const gradientMesh = new Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.set(container.clientWidth / 2, container.clientHeight / 2, -50);
    gradientMesh.scale.set(container.clientWidth, container.clientHeight, 1);
    scene.add(gradientMesh);

    const ambientLight = new AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const particleGeometry = new SphereGeometry(1, 16, 16);
    const particleMaterial = new MeshBasicMaterial({
      color: new Color("#ffffff"),
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    particleMaterial.vertexColors = true;

    const instancedMesh = new InstancedMesh(particleGeometry, particleMaterial, MAX_PARTICLES);
    instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    instancedMesh.count = 0;
    scene.add(instancedMesh);

    const maxConnections = MAX_PARTICLES * 8;
    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(maxConnections * 6), 3),
    );
    lineGeometry.setAttribute(
      "color",
      new Float32BufferAttribute(new Float32Array(maxConnections * 8), 4),
    );
    lineGeometry.setDrawRange(0, 0);
    const lineMaterial = createLineMaterial();
    const lineSegments = new LineSegments(lineGeometry, lineMaterial);
    lineSegments.frustumCulled = false;
    scene.add(lineSegments);

    const noise = createPerlinNoise();
    const particles = [];
    const tempMatrix = new Matrix4();
    const tempScale = new Vector3();
    const colorHelper = new Color();

    const ensureParticleCount = (target) => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      while (particles.length < target && particles.length < MAX_PARTICLES) {
        // Varying particle sizes for neural network depth
        const radius = 0.4 + Math.random() * 1.2;
        const particleColor = colorHelper
          .set(PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)])
          .convertSRGBToLinear()
          .clone();
        const particle = {
          position: new Vector3(Math.random() * width, Math.random() * height, 0),
          velocity: new Vector3((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, 0),
          speed: 0.08 + Math.random() * 0.18,
          radius,
          color: particleColor,
          noiseOffset: new Vector3(Math.random() * 100, Math.random() * 100, Math.random() * 100),
          connectionStrength: 0.5 + Math.random() * 0.5, // Neural node strength
          isActive: Math.random() > 0.3, // Some nodes are more active
        };
        particles.push(particle);
      }
      if (particles.length > target) {
        particles.length = target;
      }
      instancedMesh.count = particles.length;
      lineGeometry.setDrawRange(0, 0);
    };

    const writeInstances = () => {
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        tempMatrix.makeTranslation(particle.position.x, particle.position.y, particle.position.z);
        tempScale.set(particle.radius, particle.radius, particle.radius);
        tempMatrix.scale(tempScale);
        instancedMesh.setMatrixAt(i, tempMatrix);
        if (instancedMesh.setColorAt) {
          instancedMesh.setColorAt(i, particle.color);
        }
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }
    };

    ensureParticleCount(getParticleCount(container.clientWidth));
    writeInstances();

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    instancedMeshRef.current = instancedMesh;
    lineGeometryRef.current = lineGeometry;
    noiseRef.current = noise;
    particlesRef.current = particles;
    connectionDistanceRef.current = BASE_CONNECTION_DISTANCE;
    performanceAdjustedRef.current = false;
    frameTimesRef.current = [];

    const updateScrollEffects = () => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) {
        return;
      }
      canvasElement.style.transform = "";
      canvasElement.style.opacity = "";
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setPixelRatio(clampDevicePixelRatio());
      renderer.setSize(width, height, false);
      camera.right = width;
      camera.left = 0;
      camera.top = 0;
      camera.bottom = height;
      camera.updateProjectionMatrix();
      gradientMesh.position.set(width / 2, height / 2, -50);
      gradientMesh.scale.set(width, height, 1);
      ensureParticleCount(getParticleCount(width));
      particles.forEach((particle) => {
        particle.position.x = ((particle.position.x % width) + width) % width;
        particle.position.y = ((particle.position.y % height) + height) % height;
      });
      writeInstances();
      updateScrollEffects();
    };

    const updateMouse = (event) => {
      const pointerFine = window.matchMedia?.("(pointer: fine)").matches;
      if (!pointerFine) {
        return;
      }
      const node = containerRef.current;
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.normalizedX = (x / rect.width) * 2 - 1;
      mouseRef.current.normalizedY = (y / rect.height) * -2 + 1;
      mouseRef.current.lastMove = performance.now();
      mouseRef.current.active = true;
    };

    const renderFrame = () => {
      const rendererInstance = rendererRef.current;
      const sceneInstance = sceneRef.current;
      const cameraInstance = cameraRef.current;
      const instancedMeshInstance = instancedMeshRef.current;
      const lineGeometryInstance = lineGeometryRef.current;
      if (!rendererInstance || !sceneInstance || !cameraInstance || !instancedMeshInstance || !lineGeometryInstance) {
        animationRef.current = undefined;
        return;
      }
      if (!shouldAnimateRef.current) {
        animationRef.current = undefined;
        return;
      }

      const delta = clockRef.current.getDelta();
      const elapsed = clockRef.current.elapsedTime;
      gradientMaterial.uniforms.uTime.value = elapsed;

      const particlesArray = particlesRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const noise = noiseRef.current;
      const mouse = mouseRef.current;
      const mouseActive = mouse.active && performance.now() - mouse.lastMove < 800;
      if (!mouseActive) {
        mouse.active = false;
      }

      const directionVector = new Vector3();
      for (let i = 0; i < particlesArray.length; i += 1) {
        const particle = particlesArray[i];
        const noiseX = noise((elapsed * 0.15 + particle.noiseOffset.x) * 0.1, particle.noiseOffset.y, particle.noiseOffset.z);
        const noiseY = noise(particle.noiseOffset.x, (elapsed * 0.15 + particle.noiseOffset.y) * 0.1, particle.noiseOffset.z);
        directionVector.set(noiseX, noiseY, 0);
        if (directionVector.lengthSq() > 0) {
          directionVector.normalize().multiplyScalar(particle.speed);
          particle.velocity.lerp(directionVector, 0.025);
        }

        if (mouseActive) {
          const dx = mouse.x - particle.position.x;
          const dy = mouse.y - particle.position.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq > 0 && distanceSq < MOUSE_FORCE_RADIUS * MOUSE_FORCE_RADIUS) {
            const distance = Math.sqrt(distanceSq);
            const force = Math.min(MAX_MOUSE_ACCELERATION, (1 / distanceSq) * 6000);
            particle.velocity.x += (dx / distance) * force;
            particle.velocity.y += (dy / distance) * force;
          }
        }

        particle.position.add(particle.velocity);

        if (particle.position.x < 0) {
          particle.position.x += width;
        } else if (particle.position.x > width) {
          particle.position.x -= width;
        }
        if (particle.position.y < 0) {
          particle.position.y += height;
        } else if (particle.position.y > height) {
          particle.position.y -= height;
        }

        tempMatrix.makeTranslation(particle.position.x, particle.position.y, particle.position.z);
        tempScale.set(particle.radius, particle.radius, particle.radius);
        tempMatrix.scale(tempScale);
        instancedMeshInstance.setMatrixAt(i, tempMatrix);
      }

      instancedMeshInstance.instanceMatrix.needsUpdate = true;

      const positionsAttribute = lineGeometryInstance.getAttribute("position");
      const colorsAttribute = lineGeometryInstance.getAttribute("color");
      const positionsArray = positionsAttribute.array;
      const colorsArray = colorsAttribute.array;
      let lineIndex = 0;
      const connectionDistance = connectionDistanceRef.current;

      for (let i = 0; i < particlesArray.length; i += 1) {
        const particleA = particlesArray[i];
        for (let j = i + 1; j < particlesArray.length; j += 1) {
          const particleB = particlesArray[j];
          const dx = particleA.position.x - particleB.position.x;
          const dy = particleA.position.y - particleB.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= connectionDistance) {
            // Enhanced opacity calculation for neural network feel
            const closeness = 1 - distance / connectionDistance;
            // Strength based on particle activity and connection strength
            const connectionStrength = (particleA.connectionStrength + particleB.connectionStrength) * 0.5;
            const baseOpacity = MIN_CONNECTION_OPACITY + (MAX_CONNECTION_OPACITY - MIN_CONNECTION_OPACITY) * closeness;
            const finalOpacity = baseOpacity * connectionStrength;

            const basePosition = lineIndex * 6;
            positionsArray[basePosition] = particleA.position.x;
            positionsArray[basePosition + 1] = particleA.position.y;
            positionsArray[basePosition + 2] = 0;
            positionsArray[basePosition + 3] = particleB.position.x;
            positionsArray[basePosition + 4] = particleB.position.y;
            positionsArray[basePosition + 5] = 0;

            // Blend colors based on particle colors for richer connections
            const baseColor = lineIndex * 8;
            for (let k = 0; k < 2; k += 1) {
              const source = k === 0 ? particleA : particleB;
              colorsArray[baseColor + k * 4] = source.color.r;
              colorsArray[baseColor + k * 4 + 1] = source.color.g;
              colorsArray[baseColor + k * 4 + 2] = source.color.b;
              colorsArray[baseColor + k * 4 + 3] = finalOpacity;
            }
            lineIndex += 1;
            if (lineIndex >= maxConnections) {
              break;
            }
          }
        }
        if (lineIndex >= maxConnections) {
          break;
        }
      }

      lineGeometryInstance.setDrawRange(0, lineIndex * 2);
      positionsAttribute.needsUpdate = true;
      colorsAttribute.needsUpdate = true;

      rendererInstance.render(sceneInstance, cameraInstance);

      const frameTimes = frameTimesRef.current;
      frameTimes.push(delta * 1000);
      if (frameTimes.length > FPS_SAMPLE_SIZE) {
        frameTimes.shift();
      }
      const average = frameTimes.reduce((sum, value) => sum + value, 0) / frameTimes.length;
      if (!performanceAdjustedRef.current && average > 1000 / LOW_FPS_THRESHOLD) {
        performanceAdjustedRef.current = true;
        const reducedCount = Math.max(10, Math.floor(particlesArray.length * 0.7));
        particlesArray.length = reducedCount;
        instancedMeshInstance.count = reducedCount;
        instancedMeshInstance.instanceMatrix.needsUpdate = true;
        if (instancedMeshInstance.instanceColor) {
          instancedMeshInstance.instanceColor.needsUpdate = true;
        }
        connectionDistanceRef.current = connectionDistance * 1.2;
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateScrollEffects);
    };

    const handleResize = () => {
      requestAnimationFrame(resize);
    };

    const stopAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };

    const startAnimation = () => {
      if (!animationRef.current) {
        clockRef.current.start();
        clockRef.current.elapsedTime = 0;
        frameTimesRef.current = [];
        animationRef.current = requestAnimationFrame(renderFrame);
      }
    };

    startAnimationRef.current = startAnimation;
    stopAnimationRef.current = stopAnimation;

    resize();
    updateScrollEffects();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", updateMouse);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", updateMouse);
      stopAnimation();
      instancedMesh.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      gradientMaterial.dispose();
      gradientGeometry.dispose();
      lineMaterial.dispose();
      lineGeometry.dispose();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      instancedMeshRef.current = null;
      lineGeometryRef.current = null;
      particlesRef.current = [];
      noiseRef.current = null;
      startAnimationRef.current = null;
      stopAnimationRef.current = null;
      shouldAnimateRef.current = false;
    };
  }, [prefersReducedMotion, variant, deviceProfile.isLowEndMobile, isInViewport]);

  useEffect(() => {
    shouldAnimateRef.current = shouldAnimate;
    if (shouldAnimate) {
      startAnimationRef.current?.();
    } else {
      stopAnimationRef.current?.();
    }
  }, [shouldAnimate]);

  if (prefersReducedMotion || deviceProfile.isLowEndMobile) {
    return (
      <div
        ref={containerRef}
        className="hero-background hero-background--static"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          minHeight: "max(100%, 100dvh)",
          zIndex: 0,
          backgroundImage: STATIC_GRADIENT_IMAGE_SET,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="hero-background"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        minHeight: "max(100%, 100dvh)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          minHeight: "max(100%, 100dvh)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}