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
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import { getNetworkInformation, prefersLowPower } from "../../utils/networkPreferences";

const STATIC_GRADIENT_IMAGE_SET =
  "image-set(\n    url('/images/hero-background.avif') type('image/avif') 1x,\n    url('/images/hero-background.webp') type('image/webp') 1x,\n    url('/images/hero-background.jpg') type('image/jpeg') 1x\n  )";

// Premium iridescent color palette - from cool intelligence to warm interaction
const CORE_COLORS = {
  deepBlue: "#0a1628",      // Deep intelligence base
  electricBlue: "#0ea5e9",  // Primary AI color
  cyan: "#06b6d4",          // Data streams
  violet: "#7c3aed",        // Learning & thought
  gold: "#f59e0b",          // Warmth & interaction
  rose: "#f43f5e",          // Energy
};

// Multiple layers of particles for depth
const PARTICLE_LAYERS = [
  { count: 0.3, speed: 0.04, size: 0.6, color: CORE_COLORS.deepBlue, z: -50 },
  { count: 0.4, speed: 0.08, size: 0.8, color: CORE_COLORS.electricBlue, z: 0 },
  { count: 0.3, speed: 0.12, size: 1.0, color: CORE_COLORS.cyan, z: 50 },
];

const BASE_CONNECTION_DISTANCE = 200;
const MAX_MOUSE_ACCELERATION = 0.8;
const MOUSE_FORCE_RADIUS = 400;
const LOW_FPS_THRESHOLD = 45;
const FPS_SAMPLE_SIZE = 120;
const MAX_PARTICLES = 300;
const VORTEX_STRENGTH = 2.5;
const FLOW_FIELD_SCALE = 0.008;

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

// Curl noise for organic flowing movement
function createCurlNoise() {
  const perlin = createPerlinNoise();
  return (x, y, z) => {
    const e = 0.001;
    const n1 = perlin(x + e, y, z) - perlin(x - e, y, z);
    const n2 = perlin(x, y + e, z) - perlin(x, y - e, z);
    const n3x = perlin(x, y, z + e) - perlin(x, y, z - e);
    const n3y = perlin(x + e, y, z + e) - perlin(x - e, y, z - e);
    return {
      x: n2 - n3y,
      y: n3x - n1,
    };
  };
}

function getParticleCount(width, qualityTier = "desktop") {
  if (qualityTier === "mobile" || width <= 768) {
    return 60;
  }
  if (qualityTier === "tablet" || width <= 1200) {
    return 120;
  }
  return 200;
}

function clampDevicePixelRatio() {
  if (typeof window === "undefined") {
    return 1;
  }
  const ratio = window.devicePixelRatio || 1;
  return Math.min(ratio, 2);
}

function createAdvancedGradientMaterial() {
  return new ShaderMaterial({
    side: DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uInteractionEnergy: { value: 0 },
      uColorBase: { value: new Color(CORE_COLORS.deepBlue) },
      uColorAccent1: { value: new Color(CORE_COLORS.electricBlue) },
      uColorAccent2: { value: new Color(CORE_COLORS.violet) },
      uColorInteraction: { value: new Color(CORE_COLORS.gold) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      uniform float uInteractionEnergy;
      uniform vec3 uColorBase;
      uniform vec3 uColorAccent1;
      uniform vec3 uColorAccent2;
      uniform vec3 uColorInteraction;

      float noise(vec2 uv) {
        return sin(uv.x * 12.9898 + uv.y * 78.233) * 43758.5453;
      }

      vec2 rotateUV(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotation = mat2(c, -s, s, c);
        return rotation * (uv - 0.5) + 0.5;
      }

      float smoothPulse(float time, float speed) {
        return sin(time * speed) * 0.5 + 0.5;
      }

      void main() {
        // Animated rotating gradient with multiple layers
        float angle = mod(uTime * 0.03, 20.0) / 20.0 * 6.28318530718;
        vec2 rotated = rotateUV(vUv, angle);
        rotated = clamp(rotated, 0.0, 1.0);

        // Base gradient layer
        vec3 baseGradient = mix(uColorBase, uColorAccent1, rotated.x);
        baseGradient = mix(baseGradient, uColorAccent2, rotated.y);

        // Distance-based glow from center
        float distFromCenter = distance(vUv, vec2(0.5, 0.5));
        float centerGlow = 1.0 - smoothstep(0.0, 1.4, distFromCenter);

        // Multi-layered accent colors
        vec3 accentColor = mix(
          uColorAccent1,
          uColorInteraction,
          smoothPulse(uTime, 0.5)
        );
        vec3 glowAccent = accentColor * centerGlow * (0.15 + uInteractionEnergy * 0.1);

        // Subtle fractal-like detail
        float detailNoise = fract(sin(vUv.x * 31.41 + vUv.y * 17.29 + uTime * 0.1) * 415.92);
        vec3 detail = vec3(detailNoise * 0.02);

        // Time-based color shift
        float timeShift = sin(uTime * 0.2) * 0.05;
        vec3 finalColor = baseGradient + glowAccent + detail;
        finalColor = mix(finalColor, accentColor * 0.3, uInteractionEnergy * 0.5);
        finalColor = clamp(finalColor + vec3(timeShift), 0.0, 1.0);

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
  const instancedMeshesRef = useRef([]);
  const noiseRef = useRef(null);
  const curlNoiseRef = useRef(null);
  const particleLayersRef = useRef([]);
  const animationRef = useRef();
  const frameTimesRef = useRef([]);
  const clockRef = useRef(new Clock());
  const shouldAnimateRef = useRef(false);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastMove: 0,
    active: false,
    energy: 0,
    vortex: { x: 0, y: 0, strength: 0 },
  });
  const scrollRef = useRef({ speed: 0, energy: 0 });
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
    if (
      prefersReducedMotion ||
      variant !== "particles" ||
      deviceProfile.isLowEndMobile ||
      prefersLowPowerMode ||
      !isInViewport
    ) {
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

    const gradientMaterial = createAdvancedGradientMaterial();
    const gradientGeometry = new PlaneGeometry(1, 1, 1, 1);
    const gradientMesh = new Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.set(container.clientWidth / 2, container.clientHeight / 2, -50);
    gradientMesh.scale.set(container.clientWidth, container.clientHeight, 1);
    scene.add(gradientMesh);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create multi-layer particle system
    const particleGeometry = new SphereGeometry(1, 12, 12);
    const instancedMeshes = [];
    const particleLayers = [];

    const qualityTier = deviceProfile.formFactor;
    const baseParticleCount = getParticleCount(container.clientWidth, qualityTier);

    PARTICLE_LAYERS.forEach((layerConfig) => {
      const count = Math.floor(baseParticleCount * layerConfig.count);
      const particleMaterial = new MeshBasicMaterial({
        color: new Color(layerConfig.color),
        transparent: true,
        opacity: 0.7,
        blending: AdditiveBlending,
        depthWrite: false,
      });

      const instancedMesh = new InstancedMesh(particleGeometry, particleMaterial, count);
      instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
      instancedMesh.count = 0;
      instancedMesh.position.z = layerConfig.z;
      scene.add(instancedMesh);
      instancedMeshes.push(instancedMesh);

      // Initialize particles
      const particles = [];
      const width = container.clientWidth;
      const height = container.clientHeight;
      const tempMatrix = new Matrix4();
      const tempScale = new Vector3();

      for (let i = 0; i < count; i += 1) {
        const particle = {
          position: new Vector3(Math.random() * width, Math.random() * height, 0),
          velocity: new Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, 0),
          speed: layerConfig.speed,
          radius: layerConfig.size * (0.5 + Math.random() * 0.8),
          noiseOffset: new Vector3(Math.random() * 100, Math.random() * 100, Math.random() * 100),
          energy: Math.random(),
          fluidInfluence: 0.8 + Math.random() * 0.2,
          connectionStrength: 0.6 + Math.random() * 0.4,
        };
        particles.push(particle);
      }

      particleLayers.push({
        particles,
        instancedMesh,
        geometry: particleGeometry,
        material: particleMaterial,
        config: layerConfig,
      });
    });

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    instancedMeshesRef.current = instancedMeshes;
    noiseRef.current = createPerlinNoise();
    curlNoiseRef.current = createCurlNoise();
    particleLayersRef.current = particleLayers;

    const writeInstances = () => {
      const tempMatrix = new Matrix4();
      const tempScale = new Vector3();

      particleLayers.forEach((layer) => {
        const instancedMesh = layer.instancedMesh;
        const particles = layer.particles;

        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];
          tempMatrix.makeTranslation(particle.position.x, particle.position.y, particle.position.z);
          tempScale.set(particle.radius, particle.radius, particle.radius);
          tempMatrix.scale(tempScale);
          instancedMesh.setMatrixAt(i, tempMatrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
      });
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

      particleLayers.forEach((layer) => {
        layer.particles.forEach((particle) => {
          particle.position.x = ((particle.position.x % width) + width) % width;
          particle.position.y = ((particle.position.y % height) + height) % height;
        });
      });
      writeInstances();
    };

    let lastScrollTime = 0;
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

      // Track velocity for vortex effect
      const mouse = mouseRef.current;
      mouse.vx = x - mouse.x;
      mouse.vy = y - mouse.y;
      mouse.x = x;
      mouse.y = y;
      mouse.lastMove = performance.now();
      mouse.active = true;
    };

    const updateScroll = () => {
      const now = performance.now();
      lastScrollTime = now;
      // Scroll speed will be calculated in render loop
    };

    const renderFrame = () => {
      if (!shouldAnimateRef.current) {
        animationRef.current = undefined;
        return;
      }

      const rendererInstance = rendererRef.current;
      const sceneInstance = sceneRef.current;
      const cameraInstance = cameraRef.current;
      if (!rendererInstance || !sceneInstance || !cameraInstance) {
        animationRef.current = undefined;
        return;
      }

      const delta = clockRef.current.getDelta();
      const elapsed = clockRef.current.elapsedTime;
      const noise = noiseRef.current;
      const curlNoise = curlNoiseRef.current;
      const mouse = mouseRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Update mouse interaction energy
      const mouseActive = mouse.active && performance.now() - mouse.lastMove < 1000;
      if (!mouseActive) {
        mouse.active = false;
        mouse.energy = Math.max(0, mouse.energy - 0.02);
      } else {
        mouse.energy = Math.min(1, mouse.energy + 0.05);
      }

      // Update vortex from mouse velocity
      mouse.vortex.strength = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy) * VORTEX_STRENGTH;
      mouse.vortex.x = mouse.x;
      mouse.vortex.y = mouse.y;

      // Update gradient material with interaction energy
      gradientMaterial.uniforms.uTime.value = elapsed;
      gradientMaterial.uniforms.uInteractionEnergy.value = mouse.energy;

      const tempMatrix = new Matrix4();
      const tempScale = new Vector3();
      const directionVector = new Vector3();

      particleLayersRef.current.forEach((layer) => {
        const particles = layer.particles;
        const speed = layer.config.speed;
        const instancedMesh = layer.instancedMesh;

        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];

          // Curl noise for organic flowing movement
          const flowField = curlNoise(
            (elapsed * 0.1 + particle.noiseOffset.x) * FLOW_FIELD_SCALE,
            particle.noiseOffset.y * FLOW_FIELD_SCALE,
            particle.noiseOffset.z * FLOW_FIELD_SCALE,
          );

          directionVector.set(flowField.x, flowField.y, 0);
          if (directionVector.lengthSq() > 0) {
            directionVector.normalize().multiplyScalar(speed);
            particle.velocity.lerp(directionVector, 0.03);
          }

          // Mouse interaction - attraction zones with vortex
          if (mouseActive) {
            const dx = mouse.x - particle.position.x;
            const dy = mouse.y - particle.position.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq > 0 && distanceSq < MOUSE_FORCE_RADIUS * MOUSE_FORCE_RADIUS) {
              const distance = Math.sqrt(distanceSq);
              const force = Math.min(MAX_MOUSE_ACCELERATION, (1 / (distanceSq + 1)) * 3000 * mouse.energy);

              // Primary attraction force
              particle.velocity.x += (dx / distance) * force;
              particle.velocity.y += (dy / distance) * force;

              // Vortex twist effect
              const angle = Math.atan2(dy, dx);
              const tangentX = Math.cos(angle + Math.PI / 2);
              const tangentY = Math.sin(angle + Math.PI / 2);
              const vortexForce = mouse.vortex.strength * (1 - distance / MOUSE_FORCE_RADIUS);
              particle.velocity.x += tangentX * vortexForce * 0.1;
              particle.velocity.y += tangentY * vortexForce * 0.1;
            }
          }

          // Apply velocity
          particle.position.add(particle.velocity);

          // Wrap around edges
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

          // Update instance
          tempMatrix.makeTranslation(particle.position.x, particle.position.y, particle.position.z);
          tempScale.set(particle.radius, particle.radius, particle.radius);
          tempMatrix.scale(tempScale);
          instancedMesh.setMatrixAt(i, tempMatrix);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
      });

      rendererInstance.render(sceneInstance, cameraInstance);

      // Performance monitoring
      const frameTimes = frameTimesRef.current;
      frameTimes.push(delta * 1000);
      if (frameTimes.length > FPS_SAMPLE_SIZE) {
        frameTimes.shift();
      }

      animationRef.current = requestAnimationFrame(renderFrame);
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

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("scroll", updateScroll);
      stopAnimation();

      particleLayers.forEach((layer) => {
        layer.geometry.dispose();
        layer.material.dispose();
        layer.instancedMesh.dispose();
      });
      gradientMaterial.dispose();
      gradientGeometry.dispose();
      renderer.dispose();

      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      instancedMeshesRef.current = [];
      particleLayersRef.current = [];
      noiseRef.current = null;
      curlNoiseRef.current = null;
      startAnimationRef.current = null;
      stopAnimationRef.current = null;
      shouldAnimateRef.current = false;
    };
  }, [
    prefersReducedMotion,
    variant,
    deviceProfile.isLowEndMobile,
    prefersLowPowerMode,
    isInViewport,
  ]);

  useEffect(() => {
    shouldAnimateRef.current = shouldAnimate;
    if (shouldAnimate) {
      startAnimationRef.current?.();
    } else {
      stopAnimationRef.current?.();
    }
  }, [shouldAnimate]);

  if (prefersReducedMotion || deviceProfile.isLowEndMobile || prefersLowPowerMode || variant !== "particles") {
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
