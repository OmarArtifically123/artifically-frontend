import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  CubicBezierCurve3,
  DataTexture,
  DoubleSide,
  EdgesGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  MathUtils,
  Object3D,
  Quaternion,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";
import { Line, shaderMaterial, EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/drei";

const HERO_ASPECT = 16 / 9;
const HERO_FOV = 45;
const HERO_CAMERA_DISTANCE = 8.5;
const HERO_CAMERA_ELEVATION_DEG = 12;
const HERO_ORB_RADIUS = 1.6; // diameter 3.2 units

const NEURAL_NODE_COUNT = 110;
const NEURAL_CONNECTIONS_PER_NODE = 3;
const CIRCUIT_PATH_COUNT = 14;
const CIRCUIT_PULSES_PER_PATH = 7;
const HERO_ORB_CENTER = new Vector3(0, 0.2, 0);
const ORBITAL_NODE_COUNT = 18;
const BACKGROUND_PARTICLE_COUNT = 96;
const FOREGROUND_PARTICLE_COUNT = 28;
const GOD_RAY_COUNT = 14;

const ORBITAL_RING_CONFIG = [
  {
    id: "inner",
    radius: 2.2,
    tiltDeg: 15,
    tiltAxis: new Vector3(1, 0, 0),
    orbitSpeed: 0.03,
    direction: -1,
    typeSequence: ["A", "A", "B", "B", "C", "C"],
  },
  {
    id: "middle",
    radius: 3.1,
    tiltDeg: 25,
    tiltAxis: new Vector3(0.45, 0, 0.89).normalize(),
    orbitSpeed: 0.022,
    direction: 1,
    typeSequence: ["A", "A", "A", "A", "B", "B", "B", "B"],
  },
  {
    id: "outer",
    radius: 4.0,
    tiltDeg: 8,
    tiltAxis: new Vector3(0.2, 0, -0.98).normalize(),
    orbitSpeed: 0.018,
    direction: -1,
    typeSequence: ["C", "C", "B", "B"],
  },
];

const TYPE_A_TINT_COLORS = [
  new Color(0x3b82f6),
  new Color(0xa855f7),
  new Color(0x2dd4bf),
];

const ENERGY_GRADIENT = {
  start: new Color(0x3b82f6),
  middle: new Color(0x22d3ee),
  end: new Color(0xa855f7),
};

function createDeterministicRandom(seed = 2024) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function usePrefersReducedMotionScene() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => {
      setPrefers(event.matches);
    };
    setPrefers(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefers;
}

const GridMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new Color(0x1a2440),
    uColorB: new Color(0x060913),
    uGridColor: new Color(0x6366f1),
    uGlowColor: new Color(0x22d3ee),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uGridColor;
    uniform vec3 uGlowColor;
    varying vec2 vUv;

    float grid(vec2 uv, float scale, float thickness) {
      vec2 gv = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
      float line = min(gv.x, gv.y);
      return 1.0 - smoothstep(thickness, thickness + 1.5, line);
    }

    float starfield(vec2 uv) {
      vec2 p = uv * vec2(128.0, 72.0);
      vec2 i = floor(p);
      vec2 f = fract(p);
      float n = sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453;
      float star = fract(n) - 0.995;
      star = smoothstep(0.0, 0.005, star);
      float twinkle = 0.5 + 0.5 * sin(uTime * 0.6 + n);
      return star * twinkle;
    }

    void main() {
      vec2 uv = vUv;
      vec2 centered = uv - 0.5;
      float radial = clamp(length(centered) * 1.5, 0.0, 1.0);
      float vignette = smoothstep(1.0, 0.2, radial);
      vec3 base = mix(uColorB, uColorA, vignette);

      float depth = mix(-15.0, 2.0, uv.y);
      float perspective = 1.0 / (1.0 + max(depth + 15.0, 0.0) * 0.09);

      float gridX = grid(vec2(uv.x * mix(32.0, 8.0, uv.y), uv.y), 40.0 * perspective, 1.4);
      float gridZ = grid(vec2(uv.x, uv.y * mix(220.0, 40.0, uv.y)), 60.0 * perspective, 1.4);
      float gridMask = max(gridX, gridZ);

      float noiseValue = fract(sin(dot(uv * vec2(412.32, 236.52), vec2(12.9898, 78.233))) * 43758.5453);
      noiseValue = noiseValue * 2.0 - 1.0;

      float sweepPhase = fract(uTime / 7.2);
      float sweepWidth = 0.015 + 0.035 * sweepPhase;
      float sweep = exp(-pow((uv.y - sweepPhase), 2.0) / sweepWidth) * 0.6;

      vec3 color = base;
      color += uGridColor * 0.45 * gridMask * mix(1.0, 0.4, uv.y);
      color += uGlowColor * sweep;
      color += vec3(0.08, 0.12, 0.2) * noiseValue * 0.08;

      float horizonGlow = smoothstep(0.55, 0.95, uv.y);
      color += uGlowColor * 0.18 * horizonGlow;

      gl_FragColor = vec4(color, 0.92);
    }
  `,
);

const PlasmaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorInner: new Color(0x9333ea),
    uColorMid: new Color(0x6366f1),
    uColorOuter: new Color(0x3b82f6),
    uOpacity: 0.65,
  },
  /* glsl */ `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorInner;
    uniform vec3 uColorMid;
    uniform vec3 uColorOuter;
    uniform float uOpacity;
    varying vec3 vWorldPosition;

    // Simple 3D noise
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float n = mix(mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
                        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
                    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
                        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
      return n;
    }

    void main() {
      vec3 p = vWorldPosition * 1.35;
      float t = uTime * 0.15;
      float turbulence = 0.0;
      float amp = 0.5;
      float freq = 1.2;
      for (int i = 0; i < 5; i++) {
        turbulence += noise(p * freq + t) * amp;
        freq *= 1.87;
        amp *= 0.58;
      }
      turbulence = pow(turbulence, 1.6);

      vec3 color = mix(uColorInner, uColorMid, clamp(turbulence * 1.6, 0.0, 1.0));
      color = mix(color, uColorOuter, clamp(turbulence * 2.4 - 0.4, 0.0, 1.0));

      float alpha = clamp(0.25 + turbulence * 1.1, 0.0, 1.0) * uOpacity;
      gl_FragColor = vec4(color, alpha);
    }
  `,
);

GridMaterial.key = "GridMaterial";
PlasmaMaterial.key = "PlasmaMaterial";

const EnergyStreamMaterial = shaderMaterial(
  {
    uTime: 0,
    uFlowDirection: 1,
    uGradientShift: 0,
    uIntensity: 4.8,
    uOpacity: 0.9,
    uColorStart: ENERGY_GRADIENT.start.clone(),
    uColorMid: ENERGY_GRADIENT.middle.clone(),
    uColorEnd: ENERGY_GRADIENT.end.clone(),
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPosition.xyz);
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform float uFlowDirection;
    uniform float uGradientShift;
    uniform float uIntensity;
    uniform float uOpacity;
    uniform vec3 uColorStart;
    uniform vec3 uColorMid;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    vec3 energyGradient(float t) {
      float segment = clamp(t, 0.0, 1.0);
      vec3 a = mix(uColorStart, uColorMid, smoothstep(0.0, 0.5, segment));
      vec3 b = mix(uColorMid, uColorEnd, smoothstep(0.5, 1.0, segment));
      return mix(a, b, smoothstep(0.45, 1.0, segment));
    }

    void main() {
      float flow = fract(vUv.x + uGradientShift * uFlowDirection);
      vec3 baseColor = energyGradient(flow);
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewDir);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 1.5);
      float headOn = abs(dot(normal, viewDir));
      float alpha = uOpacity * mix(0.35, 1.0, pow(fresnel, 0.85));
      float intensity = uIntensity;
      vec3 color = baseColor * (1.2 + 0.8 * fresnel) * intensity;
      gl_FragColor = vec4(color, alpha * (1.0 - 0.45 * pow(headOn, 2.2)));
    }
  `,
);

const EnergyGlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uFlowDirection: 1,
    uGradientShift: 0,
    uOpacity: 0.25,
    uColorStart: ENERGY_GRADIENT.start.clone(),
    uColorMid: ENERGY_GRADIENT.middle.clone(),
    uColorEnd: ENERGY_GRADIENT.end.clone(),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uFlowDirection;
    uniform float uGradientShift;
    uniform float uOpacity;
    uniform vec3 uColorStart;
    uniform vec3 uColorMid;
    uniform vec3 uColorEnd;
    varying vec2 vUv;

    vec3 gradient(float t) {
      float segment = clamp(t, 0.0, 1.0);
      vec3 a = mix(uColorStart, uColorMid, smoothstep(0.0, 0.5, segment));
      vec3 b = mix(uColorMid, uColorEnd, smoothstep(0.5, 1.0, segment));
      vec3 base = mix(a, b, smoothstep(0.45, 1.0, segment));
      float luminance = dot(base, vec3(0.299, 0.587, 0.114));
      return mix(base, vec3(luminance), 0.5);
    }

    void main() {
      float flow = fract(vUv.x + uGradientShift * uFlowDirection);
      vec3 color = gradient(flow) * 1.5;
      gl_FragColor = vec4(color, uOpacity * smoothstep(0.0, 1.0, 1.0 - abs(vUv.y - 0.5) * 2.0));
    }
  `,
);

GridMaterial.key = "GridMaterial";
PlasmaMaterial.key = "PlasmaMaterial";
EnergyStreamMaterial.key = "EnergyStreamMaterial";
EnergyGlowMaterial.key = "EnergyGlowMaterial";

extend({ GridMaterial, PlasmaMaterial, EnergyStreamMaterial, EnergyGlowMaterial });

function createProceduralNormalTexture(size = 256, seed = 8128) {
  const random = createDeterministicRandom(seed);
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    const stride = i * 4;
    // Hex-inspired pattern
    const x = i % size;
    const y = Math.floor(i / size);
    const u = x / size;
    const v = y / size;
    const hex = Math.abs(Math.sin((u * 24.0 + v * 26.0) * Math.PI));
    const perturb = Math.pow(hex, 2.0) * 0.6 + random() * 0.4;
    const nx = Math.floor(128 + (random() * 2.0 - 1.0) * 48 + perturb * 72);
    const ny = Math.floor(128 + (random() * 2.0 - 1.0) * 48 + perturb * 64);
    const nz = Math.floor(255 - perturb * 92 + random() * 16);
    data[stride] = nx;
    data[stride + 1] = ny;
    data[stride + 2] = nz;
    data[stride + 3] = 255;
  }
  const texture = new DataTexture(data, size, size);
  texture.needsUpdate = true;
  texture.flipY = false;
  return texture;
}

function createNeuralNodes() {
  const random = createDeterministicRandom(1181);
  const nodes = Array.from({ length: NEURAL_NODE_COUNT }, () => {
    const radius = Math.pow(random(), 0.72) * 0.48;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const position = new Vector3().setFromSphericalCoords(radius, phi, theta);
    const scale = 0.05 + random() * 0.07;
    const pulseDuration = 0.8 + random() * 1.7;
    const pulseOffset = random() * Math.PI * 2;
    return { position, scale, pulseDuration, pulseOffset };
  });

  const connections = [];
  nodes.forEach((node, index) => {
    const distances = nodes
      .map((target, targetIndex) => ({
        index: targetIndex,
        distance: node.position.distanceToSquared(target.position),
      }))
      .filter(({ index: targetIndex }) => targetIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, NEURAL_CONNECTIONS_PER_NODE + 2);

    distances.forEach(({ index: targetIndex }) => {
      if (index < targetIndex) {
        connections.push([index, targetIndex]);
      }
    });
  });

  return { nodes, connections };
}

function createCircuitPaths() {
  const random = createDeterministicRandom(3412);
  return Array.from({ length: CIRCUIT_PATH_COUNT }, (_, index) => {
    const dir = new Vector3(random() - 0.5, random() - 0.2, random() - 0.5).normalize();
    const bend = new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(0.4);
    const start = dir.clone().multiplyScalar(0.12 + random() * 0.15);
    const midA = dir.clone().multiplyScalar(0.35 + random() * 0.28).add(bend);
    const midB = dir.clone().multiplyScalar(1.05 + random() * 0.32).add(bend.clone().multiplyScalar(0.6));
    const end = dir.clone().multiplyScalar(HERO_ORB_RADIUS * 0.95).add(bend.clone().multiplyScalar(0.25));

    const curve = new CatmullRomCurve3([start, midA, midB, end]);
    const samples = curve.getPoints(160);
    const colors = samples.map((_, pointIndex) => {
      const t = pointIndex / (samples.length - 1);
      const color = new Color();
      color.setRGB(
        MathUtils.lerp(34 / 255, 236 / 255, t),
        MathUtils.lerp(211 / 255, 72 / 255, t),
        MathUtils.lerp(238 / 255, 153 / 255, t),
      );
      return color;
    });

    const pulses = Array.from({ length: CIRCUIT_PULSES_PER_PATH }, () => ({
      offset: random(),
      speed: 1.1 + random() * 0.55,
      length: 0.18 + random() * 0.08,
    }));

    return { id: `path-${index}`, curve, samples, colors, pulses };
  });
}

function createOrbitalNetwork() {
  const random = createDeterministicRandom(7128);
  const nodes = [];
  const ringBuckets = new Map();

  ORBITAL_RING_CONFIG.forEach((ring, ringOrder) => {
    const tiltQuaternion = new Quaternion().setFromAxisAngle(ring.tiltAxis, MathUtils.degToRad(ring.tiltDeg));
    const typeCount = ring.typeSequence.length;
    ringBuckets.set(ring.id, []);
    ring.typeSequence.forEach((type, index) => {
      const baseAngle = (index / typeCount) * Math.PI * 2 + random() * Math.PI * 0.08;
      const baseScale =
        type === "A"
          ? MathUtils.lerp(0.28, 0.35, random())
          : type === "B"
            ? MathUtils.lerp(0.18, 0.25, random())
            : MathUtils.lerp(0.22, 0.3, random());
      const node = {
        id: `${ring.id}-${type}-${index}`,
        type,
        ringId: ring.id,
        ringOrder,
        orderIndex: index,
        orbitRadius: ring.radius,
        orbitSpeed: ring.orbitSpeed,
        direction: ring.direction,
        baseAngle,
        tiltQuaternion: tiltQuaternion.clone(),
        selfRotationAxis: new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
        selfRotationSpeed: MathUtils.lerp(0.08, 0.15, random()) * Math.PI * 2,
        scalePulseRate: MathUtils.lerp(0.6, 1.15, random()),
        scalePulseOffset: random() * Math.PI * 2,
        baseScale,
        colorCycleOffset: random(),
        shape: type === "B" ? (random() > 0.45 ? "dodeca" : "icosa") : undefined,
      };
      nodes.push(node);
      ringBuckets.get(ring.id).push(nodes.length - 1);
    });
  });

  const pairKeySet = new Set();
  const connectionPairs = [];

  const addPair = (a, b) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (pairKeySet.has(key)) return;
    pairKeySet.add(key);
    connectionPairs.push([a, b]);
  };

  const innerNodes = ringBuckets.get("inner") ?? [];
  const middleNodes = ringBuckets.get("middle") ?? [];
  const outerNodes = ringBuckets.get("outer") ?? [];

  innerNodes.forEach((innerIndex, index) => {
    const anchor = Math.round((index / innerNodes.length) * middleNodes.length) % middleNodes.length;
    const targets = [anchor, (anchor + 1) % middleNodes.length];
    targets.forEach((offset) => {
      addPair(innerIndex, middleNodes[offset]);
    });
  });

  outerNodes.forEach((outerIndex, index) => {
    const base = Math.round((index / outerNodes.length) * middleNodes.length) % middleNodes.length;
    const targets = [base, (base + 1) % middleNodes.length, (base + middleNodes.length - 1) % middleNodes.length];
    targets.forEach((offset) => {
      addPair(outerIndex, middleNodes[offset]);
    });
  });

  for (let i = 0; i < 3; i += 1) {
    const innerIndex = innerNodes[Math.floor(random() * innerNodes.length)];
    const outerIndex = outerNodes[Math.floor(random() * outerNodes.length)];
    if (typeof innerIndex === "number" && typeof outerIndex === "number") {
      addPair(innerIndex, outerIndex);
    }
  }

  const heroConnectionTargets = [
    innerNodes[Math.floor(random() * innerNodes.length)],
    middleNodes[Math.floor(random() * middleNodes.length)],
    outerNodes[Math.floor(random() * outerNodes.length)],
  ].filter((value, index, array) => typeof value === "number" && array.indexOf(value) === index);

  const streams = [];

  heroConnectionTargets.forEach((nodeIndex, idx) => {
    const flowTowardHero = idx < 2;
    streams.push(
      createEnergyStreamDescriptor(random, flowTowardHero ? nodeIndex : "hero", flowTowardHero ? "hero" : nodeIndex, {
        flowDirection: flowTowardHero ? 1 : -1,
        includeHero: true,
      }),
    );
  });

  const totalConnectionsEstimate = connectionPairs.length + streams.length;
  const targetInbound = Math.round(totalConnectionsEstimate * 0.6);
  let inboundCount = streams.filter((stream) => stream.flowDirection > 0).length;

  connectionPairs.forEach(([indexA, indexB], pairIndex) => {
    const nodeA = nodes[indexA];
    const nodeB = nodes[indexB];
    const preferOuter = nodeA.orbitRadius >= nodeB.orbitRadius ? indexA : indexB;
    const preferInner = preferOuter === indexA ? indexB : indexA;
    const flowTowardHero = inboundCount < targetInbound;
    const startIndex = flowTowardHero ? preferOuter : preferInner;
    const endIndex = flowTowardHero ? preferInner : preferOuter;
    if (flowTowardHero) {
      inboundCount += 1;
    }
    streams.push(
      createEnergyStreamDescriptor(random, startIndex, endIndex, {
        flowDirection: flowTowardHero ? 1 : -1,
        pairIndex,
      }),
    );
  });

  return { nodes: nodes.map((node, index) => ({ ...node, index })), streams };
}

function createEnergyStreamDescriptor(random, startIndex, endIndex, options = {}) {
  const flowDirection = options.flowDirection ?? 1;
  const wobblePeriod = 6 + random() * 4;
  const pulsePeriod = 0.8 + random() * 0.7;
  const coreRadius = MathUtils.lerp(0.012, 0.018, random());
  const outerRadius = MathUtils.lerp(0.035, 0.045, random());
  const particleCount = 3 + Math.floor(random() * 3);
  const wobbleAxis = new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
  const spiralAxis = new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();

  return {
    id: `stream-${options.includeHero ? "hero" : options.pairIndex ?? 0}-${Math.floor(random() * 100000)}`,
    startIndex,
    endIndex,
    flowDirection,
    controlMagnitude: MathUtils.lerp(0.3, 0.5, random()),
    spiralStrength: MathUtils.lerp(0.18, 0.32, random()),
    wobbleAmplitude: MathUtils.lerp(0.02, 0.05, random()),
    wobbleFrequency: (Math.PI * 2) / wobblePeriod,
    gradientOffset: random(),
    gradientSpeed: 1 / 3,
    coreRadius,
    outerRadius,
    particleSpeed: 1.2,
    particleOffsets: Array.from({ length: particleCount }, () => random()),
    pulseFrequency: (Math.PI * 2) / pulsePeriod,
    pulseBase: 3.5,
    pulseAmplitude: 3.0,
    wobbleAxis,
    spiralAxis,
  };
}

function createBackgroundParticles() {
  const random = createDeterministicRandom(9813);
  const positions = new Float32Array(BACKGROUND_PARTICLE_COUNT * 3);
  const verticalSpeeds = new Float32Array(BACKGROUND_PARTICLE_COUNT);
  const swayAxes = Array.from({ length: BACKGROUND_PARTICLE_COUNT }, () =>
    new Vector3(random() - 0.5, random() - 0.2, random() - 0.5).normalize(),
  );
  const offsets = new Float32Array(BACKGROUND_PARTICLE_COUNT);
  for (let i = 0; i < BACKGROUND_PARTICLE_COUNT; i += 1) {
    const index = i * 3;
    const radius = 4 + random() * 11;
    const angle = random() * Math.PI * 2;
    const height = -2.5 + random() * 5.5;
    positions[index] = Math.cos(angle) * radius * 0.72;
    positions[index + 1] = height;
    positions[index + 2] = -5 - random() * 10;
    verticalSpeeds[i] = 0.04 + random() * 0.06;
    offsets[i] = random() * Math.PI * 2;
  }
  return { positions, verticalSpeeds, swayAxes, offsets };
}

function createForegroundParticles() {
  const random = createDeterministicRandom(5172);
  return Array.from({ length: FOREGROUND_PARTICLE_COUNT }, (_, index) => {
    const radius = 2.4 + random() * 2.8;
    const angle = random() * Math.PI * 2;
    const height = -0.15 + random() * 0.3;
    const depth = 2.0 + random() * 2.0;
    const size = 0.12 + random() * 0.13;
    const speed = 0.08 + random() * 0.05;
    return {
      id: `bokeh-${index}`,
      position: new Vector3(Math.cos(angle) * radius, height, depth),
      rotationAxis: new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
      size,
      speed,
      offset: random() * Math.PI * 2,
      opacity: 0.08 + random() * 0.04,
    };
  });
}

function useProceduralShellMaps() {
  return useMemo(() => {
    const normalTexture = createProceduralNormalTexture(256, 9091);
    const roughnessTexture = createProceduralNormalTexture(256, 12041);
    return { normalTexture, roughnessTexture };
  }, []);
}

function CameraRig({ reduceMotion, targetAspect = HERO_ASPECT }) {
  const { camera, viewport } = useThree();
  const target = useMemo(() => new Vector3(0, 0.2, 0), []);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const horizontalDrift = reduceMotion ? 0 : Math.sin((time / 20) * Math.PI * 2) * 0.075;
    const verticalBreath = reduceMotion ? 0 : Math.sin(time * 0.25) * 0.02;
    const distance = HERO_CAMERA_DISTANCE;
    const elevationRad = MathUtils.degToRad(HERO_CAMERA_ELEVATION_DEG);
    const y = Math.sin(elevationRad) * distance + verticalBreath;
    const z = Math.cos(elevationRad) * distance;
    camera.position.set(horizontalDrift, y, z);
    camera.lookAt(target);
    camera.fov = HERO_FOV;
    const aspect = viewport.width / viewport.height || targetAspect;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  });
  return null;
}

function SceneLighting() {
  const rimLightRef = useRef();

  useEffect(() => {
    if (!rimLightRef.current) {
      return;
    }
    rimLightRef.current.target.position.set(0, 0.2, 0);
    rimLightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <hemisphereLight
        intensity={0.4}
        color={new Color(0x3c5078)}
        groundColor={new Color(0x0f1523)}
      />
      <directionalLight
        intensity={1.5}
        color={new Color(0xb4c8ff)}
        position={[5.2, 6.6, 4.2]}
        castShadow={false}
      />
      <spotLight
        ref={rimLightRef}
        intensity={1}
        color={new Color(0xff8c64)}
        angle={MathUtils.degToRad(45)}
        penumbra={0.65}
        position={[-4.2, 2.4, -3.4]}
        distance={22}
      />
      <pointLight intensity={2.6} color={new Color(0x22d3ee)} position={[0, 0.2, 0]} distance={9.5} decay={2.1} />
      <pointLight intensity={0.72} color={new Color(0x8b5cf6)} position={[3.6, 1.4, -3.2]} distance={6.5} decay={2.3} />
      <pointLight intensity={0.68} color={new Color(0x06b6d4)} position={[-3.4, 1.1, 2.8]} distance={6.8} decay={2.4} />
      <pointLight intensity={0.6} color={new Color(0xf472b6)} position={[1.4, 2.8, 4.2]} distance={7.1} decay={2.1} />
    </>
  );
}

function BackgroundLayers({ reduceMotion }) {
  const materialRef = useRef();
  const { positions, verticalSpeeds, swayAxes, offsets } = useMemo(() => createBackgroundParticles(), []);
  const pointsRef = useRef();

  useFrame(({ clock }, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
    if (reduceMotion || !pointsRef.current) {
      return;
    }
    const array = pointsRef.current.geometry.attributes.position.array;
    const time = clock.getElapsedTime();
    for (let i = 0; i < BACKGROUND_PARTICLE_COUNT; i += 1) {
      const index = i * 3;
      const sway = swayAxes[i];
      const offset = offsets[i];
      array[index] += sway.x * Math.sin(time * 0.18 + offset) * 0.0009;
      array[index + 1] += verticalSpeeds[i] * delta;
      array[index + 2] += sway.z * Math.cos(time * 0.22 + offset) * 0.0009;
      if (array[index + 1] > 2.5) {
        array[index + 1] = -3.2;
      }
      if (array[index + 2] > -2.5) {
        array[index + 2] = -11.5 - Math.random() * 4;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[0, -3, -7.5]} rotation={[-Math.PI / 2, 0, 0]} scale={[26, 20, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <gridMaterial ref={materialRef} side={DoubleSide} transparent depthWrite={false} />
      </mesh>
      <points ref={pointsRef} position={[0, 0, -2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={new Color(0x9ca3af)}
          size={0.05}
          transparent
          opacity={0.18}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function NeuralCore({ reduceMotion }) {
  const { nodes, connections } = useMemo(() => createNeuralNodes(), []);
  const instancedRef = useRef();
  const connectionRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const colorsRef = useRef(nodes.map(() => new Color(0x9333ea)));

  const connectionPositions = useMemo(() => {
    const array = new Float32Array(connections.length * 6);
    connections.forEach(([aIndex, bIndex], idx) => {
      const start = nodes[aIndex].position;
      const end = nodes[bIndex].position;
      const offset = idx * 6;
      array[offset] = start.x;
      array[offset + 1] = start.y;
      array[offset + 2] = start.z;
      array[offset + 3] = end.x;
      array[offset + 4] = end.y;
      array[offset + 5] = end.z;
    });
    return array;
  }, [connections, nodes]);

  useEffect(() => {
    if (!instancedRef.current) return;
    nodes.forEach((node, index) => {
      const gradientColor = new Color().setHSL(0.62 + node.position.length() * 0.12, 0.85, 0.58);
      instancedRef.current.setColorAt(index, gradientColor);
      colorsRef.current[index] = gradientColor;
    });
    instancedRef.current.instanceColor.needsUpdate = true;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (!instancedRef.current) return;
    const time = clock.getElapsedTime();
    nodes.forEach((node, index) => {
      const pulsePhase = (time / node.pulseDuration) * Math.PI * 2 + node.pulseOffset;
      const scaleMultiplier = reduceMotion ? 1 : MathUtils.lerp(0.82, 1.3, (Math.sin(pulsePhase) + 1) * 0.5);
      dummy.position.copy(node.position);
      dummy.scale.setScalar(node.scale * scaleMultiplier);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (connectionRef.current) {
      const flicker = reduceMotion ? 0.38 : 0.25 + Math.sin(time * 1.3) * 0.15;
      connectionRef.current.material.opacity = 0.22 + flicker * 0.32;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={instancedRef}
        args={[null, null, nodes.length]}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          transparent
          toneMapped={false}
          vertexColors
        />
      </instancedMesh>
      <lineSegments ref={connectionRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectionPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={new Color(0x60a5fa)} transparent opacity={0.28} linewidth={1} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function CircuitPath({ curve, samples, colors, pulses, reduceMotion }) {
  const points = useMemo(() => samples.map((point) => point.clone()), [samples]);
  const pulseRefs = useRef([]);

  useFrame(({ clock }) => {
    if (!pulseRefs.current.length || reduceMotion) {
      return;
    }
    const time = clock.getElapsedTime();
    pulses.forEach((pulse, index) => {
      const mesh = pulseRefs.current[index];
      if (!mesh) return;
      const progress = ((time * pulse.speed) + pulse.offset) % 1;
      const tail = Math.max(progress - pulse.length, 0);
      const headPoint = curve.getPointAt(progress);
      const tailPoint = curve.getPointAt(tail);
      mesh.position.copy(headPoint);
      const scale = MathUtils.lerp(0.45, 1.2, Math.sin(progress * Math.PI));
      mesh.scale.setScalar(scale * 0.18);
      mesh.material.opacity = MathUtils.lerp(0.65, 0.1, progress);
    });
  });

  return (
    <group>
      <Line
        points={points}
        color={colors[0]}
        vertexColors={colors}
        lineWidth={1.4}
        transparent
        opacity={0.48}
        toneMapped={false}
      />
      {pulses.map((pulse, index) => (
        <mesh
          key={index}
          ref={(value) => {
            pulseRefs.current[index] = value;
          }}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={new Color(0x22d3ee)}
            transparent
            opacity={0.55}
            toneMapped={false}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CircuitPaths({ reduceMotion }) {
  const paths = useMemo(() => createCircuitPaths(), []);
  return (
    <group>
      {paths.map((path) => (
        <CircuitPath key={path.id} {...path} reduceMotion={reduceMotion} />
      ))}
    </group>
  );
}

function OrbitalNetwork({ reduceMotion }) {
  const { nodes, streams } = useMemo(() => createOrbitalNetwork(), []);
  const orbitRefs = useRef([]);
  const visualRefs = useRef([]);
  const materialRefs = useRef([]);
  const edgeRefs = useRef([]);
  const coreRefs = useRef([]);
  const nodePositions = useRef(nodes.map(() => new Vector3()));
  const typeBGeometries = useMemo(
    () =>
      nodes.map((node) => {
        if (node.type !== "B") {
          return null;
        }
        return node.shape === "dodeca" ? new DodecahedronGeometry(0.5, 0) : new IcosahedronGeometry(0.5, 0);
      }),
    [nodes],
  );
  const typeBEdgeGeometries = useMemo(
    () => typeBGeometries.map((geometry) => (geometry ? new EdgesGeometry(geometry, 10) : null)),
    [typeBGeometries],
  );

  useEffect(() => {
    orbitRefs.current = orbitRefs.current.slice(0, nodes.length);
    visualRefs.current = visualRefs.current.slice(0, nodes.length);
    materialRefs.current = materialRefs.current.slice(0, nodes.length);
    edgeRefs.current = edgeRefs.current.slice(0, nodes.length);
    coreRefs.current = coreRefs.current.slice(0, nodes.length);
  }, [nodes.length]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    nodes.forEach((node, index) => {
      const orbitGroup = orbitRefs.current[index];
      const visualGroup = visualRefs.current[index];
      if (!orbitGroup || !visualGroup) return;
      const angle = node.baseAngle + node.direction * node.orbitSpeed * time * Math.PI * 2;
      const basePosition = new Vector3(Math.cos(angle) * node.orbitRadius, 0, Math.sin(angle) * node.orbitRadius);
      basePosition.applyQuaternion(node.tiltQuaternion);
      basePosition.add(HERO_ORB_CENTER);
      orbitGroup.position.copy(basePosition);
      nodePositions.current[index].copy(basePosition);

      const scalePulse = reduceMotion
        ? 1
        : MathUtils.lerp(0.95, 1.05, (Math.sin(time * node.scalePulseRate + node.scalePulseOffset) + 1) * 0.5);
      visualGroup.scale.setScalar(node.baseScale * scalePulse);
      visualGroup.rotateOnAxis(node.selfRotationAxis, node.selfRotationSpeed * delta);

      const material = materialRefs.current[index];
      if (node.type === "A" && material) {
        const cycle = ((time / 8 + node.colorCycleOffset) % TYPE_A_TINT_COLORS.length + TYPE_A_TINT_COLORS.length) %
          TYPE_A_TINT_COLORS.length;
        const baseIndex = Math.floor(cycle);
        const nextIndex = (baseIndex + 1) % TYPE_A_TINT_COLORS.length;
        const localT = cycle - baseIndex;
        const emissive = TYPE_A_TINT_COLORS[baseIndex].clone().lerp(TYPE_A_TINT_COLORS[nextIndex], localT);
        material.emissive.copy(emissive);
        material.emissiveIntensity = 0.6;
      }

      if (node.type === "B" && edgeRefs.current[index]) {
        const edgeMaterial = edgeRefs.current[index].material;
        edgeMaterial.opacity = reduceMotion ? 0.9 : 0.8 + Math.sin(time * 1.2 + node.scalePulseOffset) * 0.2;
      }

      if (node.type === "C" && coreRefs.current[index]) {
        const intensity = reduceMotion ? 5.0 : 5 + Math.sin(time * 1.6 + node.scalePulseOffset) * 1.2;
        coreRefs.current[index].material.emissiveIntensity = intensity;
      }
    });
  });

  const renderNode = (node, index) => {
    if (node.type === "A") {
      return (
        <mesh
          key={`${node.id}-mesh`}
          ref={(value) => {
            materialRefs.current[index] = value?.material ?? materialRefs.current[index];
          }}
          castShadow
          receiveShadow
        >
          <icosahedronGeometry args={[0.5, 4]} />
          <meshPhysicalMaterial
            color={new Color(0x282d34)}
            metalness={0.95}
            roughness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.12}
            emissive={TYPE_A_TINT_COLORS[0].clone()}
            emissiveIntensity={0.6}
            reflectivity={0.85}
            envMapIntensity={1.35}
            transparent={false}
          />
        </mesh>
      );
    }
    if (node.type === "B") {
      const angularGeometry = typeBGeometries[index];
      const edgeGeometry = typeBEdgeGeometries[index];
      return (
        <group key={`${node.id}-mesh`}>
          <mesh
            ref={(value) => {
              materialRefs.current[index] = value?.material ?? materialRefs.current[index];
            }}
            castShadow
            receiveShadow
          >
            {angularGeometry ? <primitive object={angularGeometry} attach="geometry" /> : <icosahedronGeometry args={[0.5, 0]} />}
            <meshStandardMaterial
              color={new Color(0x1e2330)}
              metalness={0.75}
              roughness={0.45}
              emissive={new Color(0x0f172a)}
              envMapIntensity={0.65}
            />
          </mesh>
          {edgeGeometry && (
            <lineSegments
              ref={(value) => {
                edgeRefs.current[index] = value ?? edgeRefs.current[index];
              }}
            >
              <primitive object={edgeGeometry} attach="geometry" />
              <lineBasicMaterial
                color={new Color(0x22d3ee)}
                transparent
                opacity={0.85}
                toneMapped={false}
              />
            </lineSegments>
          )}
        </group>
      );
    }

    return (
      <group key={`${node.id}-mesh`}>
        <mesh
          ref={(value) => {
            materialRefs.current[index] = value?.material ?? materialRefs.current[index];
          }}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[0.5, 0.18, 36, 72]} />
          <meshPhysicalMaterial
            color={new Color(0xc8dcff)}
            transparent
            opacity={0.85}
            transmission={0.88}
            ior={1.5}
            roughness={0.05}
            metalness={0}
            thickness={0.25}
          />
        </mesh>
        <mesh
          ref={(value) => {
            coreRefs.current[index] = value ?? coreRefs.current[index];
          }}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshBasicMaterial
            color={new Color(0xffffff)}
            emissive={new Color(0xffffff)}
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>
      </group>
    );
  };

  return (
    <group>
      {nodes.map((node, index) => (
        <group
          key={node.id}
          ref={(value) => {
            orbitRefs.current[index] = value ?? orbitRefs.current[index];
          }}
        >
          <group
            ref={(value) => {
              visualRefs.current[index] = value ?? visualRefs.current[index];
            }}
          >
            {renderNode(node, index)}
          </group>
        </group>
      ))}
      <EnergyStreams streams={streams} reduceMotion={reduceMotion} nodePositions={nodePositions} />
    </group>
  );
}

function ForegroundBokeh({ reduceMotion }) {
  const particles = useMemo(() => createForegroundParticles(), []);
  const instancedRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);

  useFrame(({ clock }) => {
    if (!instancedRef.current) return;
    const time = clock.getElapsedTime();
    particles.forEach((particle, index) => {
      const drift = reduceMotion ? 0 : Math.sin(time * particle.speed + particle.offset) * 0.08;
      dummy.position.copy(particle.position);
      dummy.position.x += drift * particle.rotationAxis.x;
      dummy.position.y += drift * particle.rotationAxis.y;
      dummy.position.z += drift * particle.rotationAxis.z;
      dummy.scale.set(particle.size * 0.9, particle.size, particle.size);
      dummy.rotation.set(0, 0, particle.offset * Math.PI);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    if (!instancedRef.current) return;
    particles.forEach((particle, index) => {
      instancedRef.current.setColorAt(index, new Color().setHSL(0.55 + particle.offset * 0.25, 0.6, 0.72));
    });
    instancedRef.current.instanceColor.needsUpdate = true;
  }, [particles]);

  return (
    <instancedMesh ref={instancedRef} args={[null, null, particles.length]}> 
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
        color={new Color(0xffffff)}
        vertexColors
      />
    </instancedMesh>
  );
}

function GodRays({ reduceMotion }) {
  const instancedRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const rays = useMemo(() => {
    const random = createDeterministicRandom(6412);
    return Array.from({ length: GOD_RAY_COUNT }, (_, index) => ({
      angle: (index / GOD_RAY_COUNT) * Math.PI * 2,
      length: 6 + random() * 2,
      width: 0.28 + random() * 0.12,
      offset: random() * Math.PI * 2,
      tilt: MathUtils.degToRad(-6 + random() * 12),
    }));
  }, []);

  useEffect(() => {
    if (!instancedRef.current) {
      return;
    }
    rays.forEach((ray, index) => {
      instancedRef.current.setColorAt(index, new Color(0x38bdf8));
    });
    instancedRef.current.instanceColor.needsUpdate = true;
  }, [rays]);

  useFrame(({ clock }) => {
    if (!instancedRef.current) return;
    const time = clock.getElapsedTime();
    const rotationOffset = reduceMotion ? 0 : time * Math.PI * 2 * 0.01;
    rays.forEach((ray, index) => {
      const groupRotation = ray.angle + rotationOffset;
      dummy.position.set(Math.cos(groupRotation) * 0.2, 0.2, Math.sin(groupRotation) * 0.2);
      dummy.rotation.set(ray.tilt, groupRotation, 0);
      dummy.scale.set(ray.width, ray.length, 1);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedRef} args={[null, null, rays.length]} frustumCulled={false} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.16}
        depthWrite={false}
        toneMapped={false}
        color={new Color(0x38bdf8)}
        blending={AdditiveBlending}
        vertexColors
      />
    </instancedMesh>
  );
}

function HeroOrb({ reduceMotion }) {
  const groupRef = useRef();
  const shellRef = useRef();
  const plasmaRef = useRef();
  const { normalTexture, roughnessTexture } = useProceduralShellMaps();

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const rotationSpeed = (Math.PI * 2) / 20; // 0.05 rotations per second
    const bob = reduceMotion ? 0 : Math.sin((time / 4.2) * Math.PI * 2) * 0.08;
    const wobbleX = reduceMotion ? 0 : Math.sin((time / 7) * Math.PI * 2) * 0.05;
    const wobbleZ = reduceMotion ? 0 : Math.sin((time / 7) * Math.PI * 2 + Math.PI / 2) * 0.05;
    const pulse = reduceMotion ? 1 : 1 + Math.sin((time / 1.8) * Math.PI * 2) * 0.0175;

    groupRef.current.position.set(wobbleX, 0.2 + bob, wobbleZ);
    groupRef.current.rotation.y += rotationSpeed * delta;
    groupRef.current.scale.setScalar(pulse * 1.0175);

    if (shellRef.current) {
      const emissiveIntensity = 0.3 + (reduceMotion ? 0 : (Math.sin(time * Math.PI * 2 / 1.8) + 1) * 0.125);
      shellRef.current.emissiveIntensity = emissiveIntensity;
      shellRef.current.opacity = 0.25;
    }
    if (plasmaRef.current) {
      plasmaRef.current.uTime = time;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[HERO_ORB_RADIUS, 6]} />
        <meshPhysicalMaterial
          ref={shellRef}
          color={new Color(0x0f1e3c)}
          emissive={new Color(0x22d3ee)}
          emissiveIntensity={0.4}
          roughness={0.08}
          metalness={0}
          thickness={0.42}
          transmission={0.72}
          transparent
          opacity={0.25}
          ior={1.45}
          reflectivity={0.72}
          clearcoat={0.35}
          clearcoatRoughness={0.12}
          normalMap={normalTexture}
          roughnessMap={roughnessTexture}
          normalScale={new Vector2(0.6, 0.6)}
          sheen={0.45}
          sheenColor={new Color(0x38bdf8)}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[HERO_ORB_RADIUS * 0.92, 5]} />
        <plasmaMaterial ref={plasmaRef} transparent depthWrite={false} />
      </mesh>
      <NeuralCore reduceMotion={reduceMotion} />
      <CircuitPaths reduceMotion={reduceMotion} />
      <GodRays reduceMotion={reduceMotion} />
    </group>
  );
}

function EnergyStreams({ streams, reduceMotion, nodePositions }) {
  const streamCurves = useMemo(
    () => streams.map(() => new CubicBezierCurve3(new Vector3(), new Vector3(), new Vector3(), new Vector3())),
    [streams],
  );
  const coreRefs = useRef([]);
  const glowRefs = useRef([]);
  const coreMaterials = useRef([]);
  const glowMaterials = useRef([]);
  const particleRefs = useRef(streams.map((stream) => new Array(stream.particleOffsets.length).fill(null)));

  const initialCoreGeometries = useMemo(
    () => streams.map((stream, index) => new TubeGeometry(streamCurves[index], 32, stream.coreRadius, 12, false)),
    [streams, streamCurves],
  );
  const initialGlowGeometries = useMemo(
    () => streams.map((stream, index) => new TubeGeometry(streamCurves[index], 32, stream.outerRadius, 12, false)),
    [streams, streamCurves],
  );

  useEffect(() => {
    coreRefs.current = coreRefs.current.slice(0, streams.length);
    glowRefs.current = glowRefs.current.slice(0, streams.length);
    coreMaterials.current = coreMaterials.current.slice(0, streams.length);
    glowMaterials.current = glowMaterials.current.slice(0, streams.length);
    particleRefs.current = streams.map((stream, streamIndex) => {
      const existing = particleRefs.current[streamIndex] ?? [];
      const next = new Array(stream.particleOffsets.length).fill(null);
      return next.map((_, particleIndex) => existing[particleIndex] ?? null);
    });
  }, [streams.length, streams]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    streams.forEach((stream, index) => {
      const coreMesh = coreRefs.current[index];
      const glowMesh = glowRefs.current[index];
      const coreMaterial = coreMaterials.current[index];
      const glowMaterial = glowMaterials.current[index];
      const curve = streamCurves[index];
      if (!curve) return;

      const startPosition =
        stream.startIndex === "hero"
          ? HERO_ORB_CENTER.clone()
          : nodePositions.current[stream.startIndex]?.clone() ?? HERO_ORB_CENTER.clone();
      const endPosition =
        stream.endIndex === "hero"
          ? HERO_ORB_CENTER.clone()
          : nodePositions.current[stream.endIndex]?.clone() ?? HERO_ORB_CENTER.clone();

      const direction = endPosition.clone().sub(startPosition);
      const length = direction.length();
      if (length < 0.001) {
        return;
      }

      const directionNormal = direction.clone().normalize();
      let perpendicular = direction.clone().cross(stream.spiralAxis);
      if (perpendicular.lengthSq() < 1e-6) {
        perpendicular = directionNormal.clone().cross(stream.wobbleAxis);
      }
      perpendicular.normalize();

      const wobbleValue = reduceMotion
        ? 0
        : stream.wobbleAmplitude * Math.sin(time * stream.wobbleFrequency + stream.gradientOffset * Math.PI * 2);
      const twistAngle = reduceMotion ? 0 : time * 0.35 + stream.gradientOffset * Math.PI * 2;
      const twistQuaternion = new Quaternion().setFromAxisAngle(directionNormal, twistAngle);

      const controlA = startPosition
        .clone()
        .addScaledVector(directionNormal, length * 0.33)
        .add(
          perpendicular
            .clone()
            .applyQuaternion(twistQuaternion)
            .multiplyScalar(stream.controlMagnitude + wobbleValue),
        );
      const controlB = startPosition
        .clone()
        .addScaledVector(directionNormal, length * 0.66)
        .add(
          perpendicular
            .clone()
            .applyQuaternion(twistQuaternion.clone().invert())
            .multiplyScalar(-stream.controlMagnitude * 0.75 + wobbleValue),
        );

      curve.v0.copy(startPosition);
      curve.v1.copy(controlA);
      curve.v2.copy(controlB);
      curve.v3.copy(endPosition);
      curve.updateArcLengths();

      const tubularSegments = reduceMotion ? 64 : 96;

      if (coreMesh) {
        const newGeometry = new TubeGeometry(curve, tubularSegments, stream.coreRadius, 16, false);
        coreMesh.geometry.dispose();
        coreMesh.geometry = newGeometry;
      }

      if (glowMesh) {
        const newGeometry = new TubeGeometry(curve, tubularSegments, stream.outerRadius, 12, false);
        glowMesh.geometry.dispose();
        glowMesh.geometry = newGeometry;
      }

      if (coreMaterial) {
        const intensity =
          stream.pulseBase +
          (reduceMotion ? 0 : stream.pulseAmplitude * Math.sin(time * stream.pulseFrequency + stream.gradientOffset * Math.PI * 2));
        coreMaterial.uniforms.uTime.value = time;
        coreMaterial.uniforms.uFlowDirection.value = stream.flowDirection;
        coreMaterial.uniforms.uGradientShift.value = reduceMotion
          ? stream.gradientOffset
          : stream.gradientOffset + time * stream.gradientSpeed * stream.flowDirection;
        coreMaterial.uniforms.uIntensity.value = intensity;
        coreMaterial.uniforms.uOpacity.value = reduceMotion ? 0.8 : 0.9;
      }

      if (glowMaterial) {
        glowMaterial.uniforms.uFlowDirection.value = stream.flowDirection;
        glowMaterial.uniforms.uGradientShift.value = reduceMotion
          ? stream.gradientOffset
          : stream.gradientOffset + time * stream.gradientSpeed * 0.65 * stream.flowDirection;
        glowMaterial.uniforms.uOpacity.value = reduceMotion ? 0.16 : 0.25;
      }

      const pathLength = Math.max(curve.getLength(), 0.0001);
      const directionSign = stream.flowDirection >= 0 ? 1 : -1;
      const particles = particleRefs.current[index] ?? [];

      particles.forEach((particle, particleIndex) => {
        if (!particle) return;
        const offset = stream.particleOffsets[particleIndex] ?? 0;
        const travel = reduceMotion ? offset : offset + (time * stream.particleSpeed) / pathLength;
        let t = ((travel % 1) + 1) % 1;
        if (directionSign < 0) {
          t = 1 - t;
        }
        const point = curve.getPointAt(t);
        particle.position.copy(point);
        const tangent = curve.getTangentAt(t).normalize();
        const up = new Vector3(0, 1, 0);
        if (tangent.lengthSq() > 0) {
          const alignment = new Quaternion().setFromUnitVectors(up, tangent);
          particle.quaternion.copy(alignment);
        }
        const particleScale = stream.coreRadius * 1.8;
        particle.scale.set(particleScale * 0.75, particleScale, particleScale);
      });
    });
  });

  return (
    <group>
      {streams.map((stream, index) => (
        <group key={stream.id} frustumCulled={false}>
          <mesh
            ref={(value) => {
              coreRefs.current[index] = value ?? coreRefs.current[index];
            }}
            geometry={initialCoreGeometries[index]}
            frustumCulled={false}
          >
            <energyStreamMaterial
              ref={(value) => {
                coreMaterials.current[index] = value ?? coreMaterials.current[index];
              }}
              transparent
              toneMapped={false}
            />
          </mesh>
          <mesh
            ref={(value) => {
              glowRefs.current[index] = value ?? glowRefs.current[index];
            }}
            geometry={initialGlowGeometries[index]}
            frustumCulled={false}
          >
            <energyGlowMaterial
              ref={(value) => {
                glowMaterials.current[index] = value ?? glowMaterials.current[index];
              }}
              transparent
              toneMapped={false}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {stream.particleOffsets.map((_, particleIndex) => (
            <mesh
              key={`${stream.id}-particle-${particleIndex}`}
              ref={(value) => {
                if (!particleRefs.current[index]) {
                  particleRefs.current[index] = [];
                }
                particleRefs.current[index][particleIndex] = value ?? particleRefs.current[index][particleIndex];
              }}
              frustumCulled={false}
            >
              <sphereGeometry args={[0.0125, 12, 12]} />
              <meshBasicMaterial color={new Color(0xffffff)} toneMapped={false} transparent opacity={0.95} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function SceneComposer({ reduceMotion }) {
  return (
    <group>
      <BackgroundLayers reduceMotion={reduceMotion} />
      <HeroOrb reduceMotion={reduceMotion} />
      <OrbitalNetwork reduceMotion={reduceMotion} />
      <ForegroundBokeh reduceMotion={reduceMotion} />
      <SceneLighting />
      <EffectComposer multisampling={reduceMotion ? 0 : 8} enabled>
        <Bloom
          intensity={reduceMotion ? 0.85 : 1.25}
          luminanceThreshold={0.24}
          luminanceSmoothing={0.32}
          radius={0.85}
        />
        <ChromaticAberration offset={[0.0009, 0.0012]} />
        <Noise premultiply opacity={reduceMotion ? 0.08 : 0.12} />
        <Vignette eskil={false} offset={0.22} darkness={0.75} />
      </EffectComposer>
    </group>
  );
}

export default function HeroScene({ width = 1280, height = 720 }) {
  if (typeof window === "undefined") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          background:
            "radial-gradient(circle at 30% 35%, rgba(59, 130, 246, 0.25), transparent 55%), radial-gradient(circle at 70% 65%, rgba(147, 51, 234, 0.22), transparent 58%)",
        }}
        aria-hidden="true"
      />
    );
  }

  const prefersReducedMotion = usePrefersReducedMotionScene();
  const targetAspect = width / height || HERO_ASPECT;

  return (
    <Canvas
      frameloop={prefersReducedMotion ? "demand" : "always"}
      camera={{
        fov: HERO_FOV,
        position: [0, Math.sin(MathUtils.degToRad(HERO_CAMERA_ELEVATION_DEG)) * HERO_CAMERA_DISTANCE, HERO_CAMERA_DISTANCE],
        near: 0.1,
        far: 60,
      }}
      dpr={[1.5, 2.2]}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <Suspense fallback={null}>
        <CameraRig reduceMotion={prefersReducedMotion} targetAspect={targetAspect} />
        <SceneComposer reduceMotion={prefersReducedMotion} />
      </Suspense>
    </Canvas>
  );
}
