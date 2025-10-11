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
  FogExp2,
  IcosahedronGeometry,
  LinearFilter,
  MathUtils,
  Object3D,
  PCFSoftShadowMap,
  Quaternion,
  RGBAFormat,
  SRGBColorSpace,
  TubeGeometry,
  Uniform,
  Vector2,
  Vector3,
} from "three";
import { Line, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import Stats from "three/examples/jsm/libs/stats.module.js";
import heroFallbackMedia from "../assets/hero-fallback.svg?url";

const HERO_ASPECT = 16 / 9;
const HERO_FOV = 45;
const HERO_CAMERA_DISTANCE = 8.5;
const HERO_CAMERA_ELEVATION_DEG = 12;
const HERO_ORB_RADIUS = 1.6; // diameter 3.2 units
const HERO_SHELL_SPECK_COUNT = 360;

const NEURAL_NODE_COUNT = 110;
const NEURAL_CONNECTIONS_PER_NODE = 3;
const CIRCUIT_PATH_COUNT = 14;
const CIRCUIT_PULSES_PER_PATH = 7;
const HERO_ORB_CENTER = new Vector3(0, 0.2, 0);
const ORBITAL_NODE_COUNT = 18;
const BACKGROUND_PARTICLE_COUNT = 96;
const FOREGROUND_PARTICLE_COUNT = 28;
const GOD_RAY_COUNT = 14;
const HEIGHT_FOG_COLOR = new Color(0x14233c);
const LENS_DIRT_TEXTURE_SIZE = 256;
const MOTION_BLUR_SAMPLES = 8;
const HERO_TIMELINE_DURATION = 20;
const HERO_TIMELINE_PHASES = [
  { key: "awakening", start: 0, duration: 5 },
  { key: "processing", start: 5, duration: 5 },
  { key: "peak", start: 10, duration: 5 },
  { key: "windDown", start: 15, duration: 5 },
];
const TWO_PI = Math.PI * 2;
const BASE_CYCLE_FREQUENCY = TWO_PI / HERO_TIMELINE_DURATION;

const HERO_BASE_FOG_DENSITY = 0.006;

const SHADOW_FLOOR = new Vector3(5 / 255, 8 / 255, 12 / 255);
const HERO_FOCUS_POINT = HERO_ORB_CENTER.clone();

function resolveMotionBlurSampleCount(quality) {
  const raw = quality?.motionBlurSamples ?? MOTION_BLUR_SAMPLES;
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return MOTION_BLUR_SAMPLES;
  }
  return Math.max(2, Math.floor(numeric));
}

const HERO_QUALITY_PRESETS = {
  high: {
    level: "high",
    neuralNodeCount: 110,
    neuralConnectionsPerNode: 3,
    circuitPathCount: 14,
    circuitPulsesPerPath: 7,
    orbitalNodeDensity: 1,
    energyStreamDensity: 1,
    backgroundParticleCount: 96,
    backgroundDriftScale: 1,
    foregroundParticleCount: 28,
    godRayCount: 14,
    bloomIntensity: 0.78,
    bloomRadius: 0.35,
    bloomThreshold: 1.0,
    enableDepthOfField: true,
    depthOfFieldBokehScale: 0.9,
    enableLensDirt: true,
    lensDirtStrength: 1,
    enableChromaticAberration: true,
    chromaticAberrationOffset: 0.002,
    enableMotionBlur: true,
    motionBlurIntensity: 0.46,
    motionBlurSamples: MOTION_BLUR_SAMPLES,
    enableFilmGrain: true,
    filmGrainStrength: 0.07,
    gridScanStrength: 1,
    fogBaseDensity: 0.008,
    fogPulseMultiplier: 0.18,
    cameraDrift: 1,
    godRayOpacity: 0.16,
  },
  medium: {
    level: "medium",
    neuralNodeCount: 85,
    neuralConnectionsPerNode: 3,
    circuitPathCount: 10,
    circuitPulsesPerPath: 6,
    orbitalNodeDensity: 0.78,
    energyStreamDensity: 0.82,
    backgroundParticleCount: 72,
    backgroundDriftScale: 0.85,
    foregroundParticleCount: 20,
    godRayCount: 10,
    bloomIntensity: 0.7,
    bloomRadius: 0.32,
    bloomThreshold: 1.05,
    enableDepthOfField: true,
    depthOfFieldBokehScale: 0.78,
    enableLensDirt: true,
    lensDirtStrength: 0.7,
    enableChromaticAberration: true,
    chromaticAberrationOffset: 0.0016,
    enableMotionBlur: true,
    motionBlurIntensity: 0.4,
    motionBlurSamples: Math.max(4, MOTION_BLUR_SAMPLES - 2),
    enableFilmGrain: true,
    filmGrainStrength: 0.06,
    gridScanStrength: 0.85,
    fogBaseDensity: 0.006,
    fogPulseMultiplier: 0.16,
    cameraDrift: 0.85,
    godRayOpacity: 0.14,
  },
  low: {
    level: "low",
    neuralNodeCount: 60,
    neuralConnectionsPerNode: 2,
    circuitPathCount: 7,
    circuitPulsesPerPath: 5,
    orbitalNodeDensity: 0.58,
    energyStreamDensity: 0.65,
    backgroundParticleCount: 48,
    backgroundDriftScale: 0.68,
    foregroundParticleCount: 14,
    godRayCount: 7,
    bloomIntensity: 0.62,
    bloomRadius: 0.28,
    bloomThreshold: 1.1,
    enableDepthOfField: false,
    depthOfFieldBokehScale: 0.65,
    enableLensDirt: false,
    lensDirtStrength: 0.4,
    enableChromaticAberration: false,
    chromaticAberrationOffset: 0,
    enableMotionBlur: false,
    motionBlurIntensity: 0.32,
    motionBlurSamples: Math.max(4, MOTION_BLUR_SAMPLES - 4),
    enableFilmGrain: true,
    filmGrainStrength: 0.045,
    gridScanStrength: 0.65,
    fogBaseDensity: 0.004,
    fogPulseMultiplier: 0.14,
    cameraDrift: 0.65,
    godRayOpacity: 0.12,
  },
};

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

function determineQualityLevel() {
  if (typeof window === "undefined") {
    return "high";
  }
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  const userAgent = nav?.userAgent?.toLowerCase?.() ?? "";
  const touchPoints = nav?.maxTouchPoints ?? 0;
  const isTouchDevice = "ontouchstart" in window || touchPoints > 1 || userAgent.includes("mobile");
  const prefersLowPower = (nav?.hardwareConcurrency ?? 8) <= 4;
  const limitedMemory = (nav?.deviceMemory ?? 8) <= 4;
  if (isTouchDevice || prefersLowPower || limitedMemory) {
    return "low";
  }
  if ((nav?.hardwareConcurrency ?? 8) <= 6) {
    return "medium";
  }
  if (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches) {
    return "medium";
  }
  return "high";
}

function useHeroQualitySettings(reduceMotion) {
  const [qualityLevel, setQualityLevel] = useState(() => determineQualityLevel());

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handleUpdate = () => {
      setQualityLevel(determineQualityLevel());
    };
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("orientationchange", handleUpdate);
    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("orientationchange", handleUpdate);
    };
  }, []);

  return useMemo(() => {
    const base = HERO_QUALITY_PRESETS[qualityLevel] ?? HERO_QUALITY_PRESETS.high;
    if (reduceMotion) {
      return {
        ...HERO_QUALITY_PRESETS.low,
        level: "low",
        gridScanStrength: 0,
        backgroundDriftScale: 0,
        enableDepthOfField: false,
        enableLensDirt: false,
        enableChromaticAberration: false,
        enableMotionBlur: false,
        enableFilmGrain: false,
        bloomIntensity: Math.min(base.bloomIntensity, 0.58),
        fogBaseDensity: Math.min(base.fogBaseDensity, 0.06),
      };
    }
    return { ...base };
  }, [qualityLevel, reduceMotion]);
}

function createDeterministicRandom(seed = 2024) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createLensDirtTexture(size = LENS_DIRT_TEXTURE_SIZE, seed = 3379) {
  const random = createDeterministicRandom(seed);
  const data = new Uint8Array(size * size * 4);
  const smudgeCount = 18;
  const smudges = Array.from({ length: smudgeCount }, () => {
    const center = new Vector2(random(), random());
    const rotation = random() * Math.PI * 2;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    return {
      center,
      cos,
      sin,
      radiusX: 0.08 + random() * 0.18,
      radiusY: 0.04 + random() * 0.12,
      softness: 0.35 + random() * 0.3,
      intensity: 0.35 + random() * 0.4,
    };
  });

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = x / (size - 1);
      const ny = y / (size - 1);
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const radial = Math.sqrt(dx * dx + dy * dy);
      const vignette = Math.max(0, 1 - Math.pow(radial * 1.45, 1.8));
      const noise = (random() * 0.65 + random() * 0.35) * 0.35;
      let value = vignette * 0.18 + noise * 0.25;

      smudges.forEach((smudge) => {
        const localX = nx - smudge.center.x;
        const localY = ny - smudge.center.y;
        const rotatedX = localX * smudge.cos - localY * smudge.sin;
        const rotatedY = localX * smudge.sin + localY * smudge.cos;
        const distance = Math.sqrt(
          (rotatedX / smudge.radiusX) * (rotatedX / smudge.radiusX) +
            (rotatedY / smudge.radiusY) * (rotatedY / smudge.radiusY),
        );
        const contribution = Math.exp(-Math.pow(distance, 2.6) / Math.max(smudge.softness, 0.001));
        value += contribution * smudge.intensity * 0.22;
      });

      const dust = Math.pow(random(), 8) * 0.9;
      value += dust * 0.6;

      const baseIndex = (y * size + x) * 4;
      const clamped = Math.min(1, Math.max(0, value));
      const channel = Math.floor(clamped * 255);
      data[baseIndex] = channel;
      data[baseIndex + 1] = channel;
      data[baseIndex + 2] = channel;
      data[baseIndex + 3] = 255;
    }
  }

  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.needsUpdate = true;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function useLensDirtTexture() {
  return useMemo(() => createLensDirtTexture(), []);
}

const easingLibrary = {
  linear: (t) => t,
  sineInOut: (t) => 0.5 - 0.5 * Math.cos(Math.PI * MathUtils.clamp(t, 0, 1)),
  cubicInOut: (t) => {
    const clamped = MathUtils.clamp(t, 0, 1);
    return clamped < 0.5
      ? 4 * clamped * clamped * clamped
      : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
  },
  quadInOut: (t) => {
    const clamped = MathUtils.clamp(t, 0, 1);
    return clamped < 0.5 ? 2 * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
  },
};

function resolveEase(ease) {
  if (typeof ease === "function") {
    return ease;
  }
  return easingLibrary[ease] ?? easingLibrary.linear;
}

function evaluateTimelineKeyframes(cycleTime, keyframes) {
  const time = MathUtils.euclideanModulo(cycleTime, HERO_TIMELINE_DURATION);
  if (!keyframes.length) {
    return 0;
  }

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    const current = keyframes[i];
    const next = keyframes[i + 1];
    if (time >= current.time && time <= next.time) {
      const span = Math.max(next.time - current.time, 0.0001);
      const progress = (time - current.time) / span;
      const easeFn = resolveEase(next.ease ?? current.ease ?? "linear");
      const eased = easeFn(progress);
      return MathUtils.lerp(current.value, next.value, eased);
    }
  }

  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  const wrappedSpan = HERO_TIMELINE_DURATION - last.time + first.time;
  const localTime = time < first.time ? time + HERO_TIMELINE_DURATION : time;
  const progress = MathUtils.clamp((localTime - last.time) / Math.max(wrappedSpan, 0.0001), 0, 1);
  const easeFn = resolveEase(first.ease ?? last.ease ?? "linear");
  const eased = easeFn(progress);
  return MathUtils.lerp(last.value, first.value, eased);
}

const HERO_TIMELINE_KEYFRAMES = {
  energyPulseFrequency: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1.32, ease: "sineInOut" },
    { time: 10, value: 1.45, ease: "sineInOut" },
    { time: 15, value: 1.68, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
  energyPulseAmplitude: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1.18, ease: "sineInOut" },
    { time: 10, value: 1.3, ease: "sineInOut" },
    { time: 15, value: 1.5, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
  energyPulseIntensity: [
    { time: 0, value: 1, ease: "quadInOut" },
    { time: 5, value: 1.12, ease: "quadInOut" },
    { time: 10, value: 1.2, ease: "quadInOut" },
    { time: 15, value: 1.3, ease: "quadInOut" },
    { time: 20, value: 1, ease: "quadInOut" },
  ],
  energyParticleSpeed: [
    { time: 0, value: 1, ease: "cubicInOut" },
    { time: 5, value: 1.05, ease: "cubicInOut" },
    { time: 10, value: 1.22, ease: "cubicInOut" },
    { time: 15, value: 1.45, ease: "cubicInOut" },
    { time: 20, value: 1, ease: "cubicInOut" },
  ],
  godRayOpacity: [
    { time: 0, value: 1, ease: "quadInOut" },
    { time: 5, value: 1.2, ease: "quadInOut" },
    { time: 10, value: 1.18, ease: "quadInOut" },
    { time: 15, value: 1.05, ease: "quadInOut" },
    { time: 20, value: 1, ease: "quadInOut" },
  ],
  backgroundDrift: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1.35, ease: "sineInOut" },
    { time: 10, value: 1.22, ease: "sineInOut" },
    { time: 15, value: 1.08, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
  nodeOrbitSpeed: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1, ease: "sineInOut" },
    { time: 10, value: 1.1, ease: "sineInOut" },
    { time: 15, value: 1.12, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
  nodeSelfRotation: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1.05, ease: "sineInOut" },
    { time: 10, value: 1.18, ease: "sineInOut" },
    { time: 15, value: 1.08, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
  heroNeuralPulse: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1.2, ease: "sineInOut" },
    { time: 10, value: 1.35, ease: "sineInOut" },
    { time: 15, value: 1.15, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
  heroEmissive: [
    { time: 0, value: 1, ease: "quadInOut" },
    { time: 5, value: 1.08, ease: "quadInOut" },
    { time: 10, value: 1.18, ease: "quadInOut" },
    { time: 15, value: 1.25, ease: "quadInOut" },
    { time: 20, value: 1, ease: "quadInOut" },
  ],
  heroScalePulse: [
    { time: 0, value: 1, ease: "sineInOut" },
    { time: 5, value: 1.12, ease: "sineInOut" },
    { time: 10, value: 1.18, ease: "sineInOut" },
    { time: 15, value: 1.1, ease: "sineInOut" },
    { time: 20, value: 1, ease: "sineInOut" },
  ],
};

function getHeroTimelineState(elapsedTime) {
  const cycleTime = MathUtils.euclideanModulo(elapsedTime, HERO_TIMELINE_DURATION);
  const normalizedTime = cycleTime / HERO_TIMELINE_DURATION;
  const phase = HERO_TIMELINE_PHASES.find((entry) => cycleTime >= entry.start && cycleTime < entry.start + entry.duration) ??
    HERO_TIMELINE_PHASES[HERO_TIMELINE_PHASES.length - 1];
  const phaseProgress = MathUtils.clamp((cycleTime - phase.start) / phase.duration, 0, 1);
  const gridScanProgress = MathUtils.clamp((cycleTime - 10) / 5, 0, 1);

  return {
    cycleTime,
    normalizedTime,
    phaseKey: phase.key,
    phaseProgress,
    energyPulseFrequencyMultiplier: evaluateTimelineKeyframes(
      cycleTime,
      HERO_TIMELINE_KEYFRAMES.energyPulseFrequency,
    ),
    energyPulseAmplitudeMultiplier: evaluateTimelineKeyframes(
      cycleTime,
      HERO_TIMELINE_KEYFRAMES.energyPulseAmplitude,
    ),
    energyPulseIntensityMultiplier: evaluateTimelineKeyframes(
      cycleTime,
      HERO_TIMELINE_KEYFRAMES.energyPulseIntensity,
    ),
    energyParticleSpeedMultiplier: evaluateTimelineKeyframes(
      cycleTime,
      HERO_TIMELINE_KEYFRAMES.energyParticleSpeed,
    ),
    godRayOpacityMultiplier: evaluateTimelineKeyframes(cycleTime, HERO_TIMELINE_KEYFRAMES.godRayOpacity),
    backgroundDriftMultiplier: evaluateTimelineKeyframes(cycleTime, HERO_TIMELINE_KEYFRAMES.backgroundDrift),
    nodeOrbitSpeedMultiplier: evaluateTimelineKeyframes(cycleTime, HERO_TIMELINE_KEYFRAMES.nodeOrbitSpeed),
    nodeSelfRotationMultiplier: evaluateTimelineKeyframes(
      cycleTime,
      HERO_TIMELINE_KEYFRAMES.nodeSelfRotation,
    ),
    heroNeuralPulseMultiplier: evaluateTimelineKeyframes(cycleTime, HERO_TIMELINE_KEYFRAMES.heroNeuralPulse),
    heroEmissiveMultiplier: evaluateTimelineKeyframes(cycleTime, HERO_TIMELINE_KEYFRAMES.heroEmissive),
    heroScalePulseMultiplier: evaluateTimelineKeyframes(cycleTime, HERO_TIMELINE_KEYFRAMES.heroScalePulse),
    gridScanStrength: MathUtils.clamp(easingLibrary.cubicInOut(gridScanProgress) * 1.4, 0, 1.4),
    gridScanProgress: easingLibrary.sineInOut(gridScanProgress),
  };
}

class LensDirtEffect extends Effect {
  constructor(texture, opacity = 0.15, threshold = 1.0) {
    super("LensDirtEffect", /* glsl */ `
        uniform sampler2D uDirtTexture;
        uniform float uOpacity;
        uniform float uThreshold;
        vec3 applyDirt(vec2 uv, vec3 color) {
          float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
          float mask = clamp((luminance - uThreshold) / max(1.0 - uThreshold, 0.0001), 0.0, 1.0);
          float dirt = texture(uDirtTexture, uv).r;
          return color + color * dirt * mask * uOpacity;
        }

        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec3 color = inputColor.rgb;
          color = applyDirt(uv, color);
          outputColor = vec4(color, inputColor.a);
        }
      `,
      {
        blendFunction: BlendFunction.NORMAL,
        uniforms: new Map([
          ["uDirtTexture", new Uniform(texture)],
          ["uOpacity", new Uniform(opacity)],
          ["uThreshold", new Uniform(threshold)],
        ]),
      },
    );
  }
}

class ColorGradeEffect extends Effect {
  constructor() {
    super("ColorGradeEffect", /* glsl */ `
        uniform vec3 uShadowFloor;
        uniform vec3 uShadowTint;
        uniform vec3 uHighlightTint;
        uniform float uMidToneContrast;
        uniform float uHighlightRollOff;
        uniform float uGlobalSaturation;
        uniform float uBlueCyanSaturation;
        uniform float uPurpleSaturation;
        uniform float uCoolBloomBoost;
        uniform vec2 uResolution;
        uniform float uVignetteIntensity;
        uniform float uVignetteRoundness;
        uniform float uVignetteFeather;

        vec3 rgb2hsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        float vignetteMask(vec2 uv, vec2 resolution, float intensity, float roundness, float feather) {
          vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
          vec2 centered = (uv - 0.5) * aspect;
          float dist = length(centered * vec2(1.0, mix(1.0, aspect.x, 1.0 - roundness)));
          float feathered = smoothstep(intensity, intensity - feather * 0.6, dist);
          return clamp(feathered, 0.0, 1.0);
        }

        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec3 color = clamp(inputColor.rgb, vec3(0.0), vec3(1.0));
          color = max(color, uShadowFloor);

          vec3 mid = smoothstep(vec3(0.15), vec3(0.85), color);
          color = mix(color, mid, uMidToneContrast);

          vec3 highlightCurve = 1.0 - exp(-color * uHighlightRollOff);
          color = mix(color, highlightCurve, 0.45);

          float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
          float shadowWeight = smoothstep(0.55, 0.05, luminance);
          float highlightWeight = smoothstep(0.45, 0.95, luminance);
          color += uShadowTint * shadowWeight;
          color += uHighlightTint * highlightWeight;

          vec3 hsv = rgb2hsv(color);
          hsv.y = clamp(hsv.y * uGlobalSaturation, 0.0, 1.0);
          float hue = hsv.x;

          float blueCyanMask = exp(-pow(min(abs(hue - 0.5), abs(hue - 1.0 - 0.5)) / 0.09, 2.2));
          float purpleMask = exp(-pow(min(abs(hue - 0.78), abs(hue + 0.22)) / 0.07, 2.5));
          hsv.y = clamp(hsv.y * mix(1.0, uBlueCyanSaturation, blueCyanMask), 0.0, 1.0);
          hsv.y = clamp(hsv.y * mix(1.0, uPurpleSaturation, purpleMask), 0.0, 1.0);
          float bloomSatBoost = smoothstep(0.6, 1.0, hsv.z);
          hsv.y = clamp(hsv.y * (1.0 + bloomSatBoost * 0.15), 0.0, 1.0);
          color = hsv2rgb(hsv);

          color = mix(color, color * vec3(0.8, 0.92, 1.05), uCoolBloomBoost);

          float vignette = vignetteMask(uv, uResolution, uVignetteIntensity, uVignetteRoundness, uVignetteFeather);
          color = mix(vec3(0.0), color, vignette);

          outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
        }
      `,
      {
        blendFunction: BlendFunction.NORMAL,
        attributes: EffectAttribute.CONVOLUTION,
        uniforms: new Map([
          ["uShadowFloor", new Uniform(new Vector3().copy(SHADOW_FLOOR))],
          ["uShadowTint", new Uniform(new Vector3(0.02, 0.06, 0.12))],
          ["uHighlightTint", new Uniform(new Vector3(0.05, 0.1, -0.02))],
          ["uMidToneContrast", new Uniform(0.28)],
          ["uHighlightRollOff", new Uniform(1.4)],
          ["uGlobalSaturation", new Uniform(1.08)],
          ["uBlueCyanSaturation", new Uniform(1.15)],
          ["uPurpleSaturation", new Uniform(1.12)],
          ["uCoolBloomBoost", new Uniform(0.15)],
          ["uResolution", new Uniform(new Vector2(1280, 720))],
          ["uVignetteIntensity", new Uniform(0.28)],
          ["uVignetteRoundness", new Uniform(0.7)],
          ["uVignetteFeather", new Uniform(0.5)],
        ]),
      },
    );
  }
}

class FilmGrainEffect extends Effect {
  constructor(intensity = 0.08, grainSize = 1.5, highlightResponse = 1.2) {
    super("FilmGrainEffect", /* glsl */ `
        uniform float uTime;
        uniform float uIntensity;
        uniform float uGrainSize;
        uniform float uHighlightResponse;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          float time = uTime * 0.5;
          vec2 grainUV = uv * uGrainSize + vec2(time, time * 1.27);
          float noise = hash(grainUV);
          noise = mix(noise, fract(noise * 1.215 + time * 0.07), 0.45);
          float luminance = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
          float weight = pow(clamp(luminance + 0.15, 0.0, 1.0), uHighlightResponse);
          float grain = (noise - 0.5) * uIntensity * (0.45 + weight);
          vec3 color = inputColor.rgb + grain;
          outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
        }
      `,
      {
        blendFunction: BlendFunction.NORMAL,
        uniforms: new Map([
          ["uTime", new Uniform(0)],
          ["uIntensity", new Uniform(intensity)],
          ["uGrainSize", new Uniform(grainSize)],
          ["uHighlightResponse", new Uniform(highlightResponse)],
        ]),
      },
    );
  }
}

class SplitChromaticAberrationEffect extends Effect {
  constructor(edgeIntensity = 0.4, redOffset = 0.002, blueOffset = -0.002) {
    super("SplitChromaticAberrationEffect", /* glsl */ `
        uniform float uEdgeIntensity;
        uniform float uRedOffset;
        uniform float uBlueOffset;

        vec3 sampleColor(sampler2D buffer, vec2 uv, vec2 offset, float redShift, float blueShift) {
          float red = texture(buffer, uv + offset * redShift).r;
          float green = texture(buffer, uv).g;
          float blue = texture(buffer, uv + offset * blueShift).b;
          return vec3(red, green, blue);
        }

        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 center = uv - 0.5;
          float distance = length(center);
          float falloff = smoothstep(0.25, 0.95, distance);
          vec2 direction = distance > 0.0001 ? normalize(center) : vec2(0.0);
          vec2 offset = direction * falloff * uEdgeIntensity;
          vec3 color = sampleColor(inputBuffer, uv, offset, uRedOffset, uBlueOffset);
          outputColor = vec4(color, inputColor.a);
        }
      `,
      {
        blendFunction: BlendFunction.NORMAL,
        uniforms: new Map([
          ["uEdgeIntensity", new Uniform(edgeIntensity)],
          ["uRedOffset", new Uniform(redOffset)],
          ["uBlueOffset", new Uniform(blueOffset)],
        ]),
      },
    );
  }
}

class HeroMotionBlurEffect extends Effect {
  constructor(intensity = 0.5, sampleCount = MOTION_BLUR_SAMPLES) {
    super("HeroMotionBlurEffect", /* glsl */ `
        uniform vec2 uBlurDirection;
        uniform float uIntensity;
        uniform float uSampleCount;

        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
          vec2 dir = uBlurDirection * uIntensity;
          float samples = max(uSampleCount, 1.0);
          vec3 accum = vec3(0.0);
          float total = 0.0;
          for (float i = 0.0; i < ${MOTION_BLUR_SAMPLES.toFixed(1)}; i += 1.0) {
            float t = (i / max(samples - 1.0, 1.0)) - 0.5;
            vec2 sampleUv = uv + dir * t;
            vec3 sampleColor = texture(inputBuffer, sampleUv).rgb;
            float weight = 1.0 - abs(t);
            accum += sampleColor * weight;
            total += weight;
            if (i >= samples - 1.0) {
              break;
            }
          }
          vec3 color = accum / max(total, 0.0001);
          outputColor = vec4(color, inputColor.a);
        }
      `,
      {
        blendFunction: BlendFunction.NORMAL,
        uniforms: new Map([
          ["uBlurDirection", new Uniform(new Vector2(0, 0))],
          ["uIntensity", new Uniform(intensity)],
          ["uSampleCount", new Uniform(sampleCount)],
        ]),
      },
    );
  }
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
    uScanStrength: 0,
    uScanProgress: 0,
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
    uniform float uScanStrength;
    uniform float uScanProgress;
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
      float sweepWidth = 0.018;
      float ambientSweep = exp(-pow((uv.y - sweepPhase), 2.0) / sweepWidth) * 0.25;

      float scanWidth = mix(0.012, 0.045, clamp(uScanStrength, 0.0, 1.0));
      float scanDenom = max(scanWidth, 0.001);
      float scanSweep = exp(-pow((uv.y - uScanProgress), 2.0) / scanDenom) * uScanStrength;

      vec3 color = base;
      color += uGridColor * 0.45 * gridMask * mix(1.0, 0.4, uv.y);
      color += uGlowColor * (ambientSweep + scanSweep);
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

const HeightFogMaterial = shaderMaterial(
  {
    uTime: 0,
    uDensity: 0.08,
    uHeightFalloff: 0.45,
    uColor: HEIGHT_FOG_COLOR.clone(),
    uStartDistance: 3.0,
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
    uniform float uDensity;
    uniform float uHeightFalloff;
    uniform vec3 uColor;
    uniform float uStartDistance;
    varying vec3 vWorldPosition;

    void main() {
      float distanceToCamera = length(vWorldPosition - cameraPosition);
      float distanceMask = smoothstep(uStartDistance, uStartDistance + 12.0, distanceToCamera);
      float heightMask = exp(-(vWorldPosition.y + 3.0) * uHeightFalloff);
      float timeMod = 0.5 + 0.5 * sin(uTime * 0.12 + dot(vWorldPosition.xz, vec2(0.23, 0.31)));
      float density = uDensity * distanceMask * heightMask;
      float fogFactor = 1.0 - exp(-density * distanceToCamera);
      float alpha = clamp(fogFactor * mix(0.35, 0.75, timeMod), 0.0, 1.0);
      gl_FragColor = vec4(uColor, alpha * 0.85);
    }
  `,
);

HeightFogMaterial.key = "HeightFogMaterial";

extend({ GridMaterial, PlasmaMaterial, EnergyStreamMaterial, EnergyGlowMaterial, HeightFogMaterial });

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

function createShellSpecks(count = HERO_SHELL_SPECK_COUNT) {
  const random = createDeterministicRandom(4421);
  return Array.from({ length: count }, (_, index) => {
    const direction = new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const baseColor = new Color().setHSL(MathUtils.lerp(0.51, 0.62, random()), 0.85, MathUtils.lerp(0.7, 0.9, random()));
    return {
      id: `speck-${index}`,
      position: direction.multiplyScalar(HERO_ORB_RADIUS * 0.99),
      twinkleSpeed: 0.8 + random() * 1.4,
      twinklePhase: random() * Math.PI * 2,
      minIntensity: 0.65,
      maxIntensity: 1.0,
      baseColor,
      scale: 0.012 + random() * 0.006,
    };
  });
}

function createNeuralNodes(count = NEURAL_NODE_COUNT, connectionsPerNode = NEURAL_CONNECTIONS_PER_NODE) {
  const random = createDeterministicRandom(1181);
  const nodes = Array.from({ length: count }, () => {
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
      .slice(0, connectionsPerNode + 2);

    distances.forEach(({ index: targetIndex }) => {
      if (index < targetIndex) {
        connections.push([index, targetIndex]);
      }
    });
  });

  return { nodes, connections };
}

function createCircuitPaths(pathCount = CIRCUIT_PATH_COUNT, pulsesPerPath = CIRCUIT_PULSES_PER_PATH) {
  const random = createDeterministicRandom(3412);
  return Array.from({ length: pathCount }, (_, index) => {
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

    const pulses = Array.from({ length: pulsesPerPath }, () => ({
      offset: random(),
      speed: 1.1 + random() * 0.55,
      length: 0.18 + random() * 0.08,
    }));

    return { id: `path-${index}`, curve, samples, colors, pulses };
  });
}

function createOrbitalNetwork({ orbitalNodeDensity = 1, energyStreamDensity = 1 } = {}) {
  const random = createDeterministicRandom(7128);
  const nodes = [];
  const ringBuckets = new Map();

  ORBITAL_RING_CONFIG.forEach((ring, ringOrder) => {
    const tiltQuaternion = new Quaternion().setFromAxisAngle(ring.tiltAxis, MathUtils.degToRad(ring.tiltDeg));
    const typeCount = ring.typeSequence.length;
    const density = MathUtils.clamp(orbitalNodeDensity, 0.2, 1);
    const targetCount = Math.max(1, Math.round(typeCount * density));
    const step = typeCount / targetCount;
    const activeIndices = [];
    for (let i = 0; i < targetCount; i += 1) {
      activeIndices.push(Math.floor(i * step));
    }
    const uniqueActiveIndices = Array.from(new Set(activeIndices)).sort((a, b) => a - b);
    const sequence = density >= 0.999 ? ring.typeSequence : uniqueActiveIndices.map((index) => ring.typeSequence[index % typeCount]);
    ringBuckets.set(ring.id, []);
    sequence.forEach((type, index) => {
      const baseAngle = (index / sequence.length) * Math.PI * 2 + random() * Math.PI * 0.08;
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

  const heroStreams = streams.slice(0, heroConnectionTargets.length);
  let connectionStreams = streams.slice(heroConnectionTargets.length);
  if (energyStreamDensity < 0.999 && connectionStreams.length > 0) {
    const density = MathUtils.clamp(energyStreamDensity, 0.25, 1);
    const stride = Math.max(1, Math.round(1 / density));
    connectionStreams = connectionStreams.filter((_, index) => index % stride === 0);
  }

  return { nodes: nodes.map((node, index) => ({ ...node, index })), streams: [...heroStreams, ...connectionStreams] };
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

function createBackgroundParticles(count = BACKGROUND_PARTICLE_COUNT) {
  const random = createDeterministicRandom(9813);
  const positions = new Float32Array(count * 3);
  const verticalSpeeds = new Float32Array(count);
  const swayAxes = Array.from({ length: count }, () =>
    new Vector3(random() - 0.5, random() - 0.2, random() - 0.5).normalize(),
  );
  const offsets = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
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

function createForegroundParticles(count = FOREGROUND_PARTICLE_COUNT) {
  const random = createDeterministicRandom(5172);
  return Array.from({ length: count }, (_, index) => {
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

function CameraRig({ reduceMotion, targetAspect = HERO_ASPECT, quality }) {
  const { camera, viewport } = useThree();
  const target = useMemo(() => new Vector3(0, 0.2, 0), []);
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const timeline = getHeroTimelineState(elapsed);
    const cycleTime = timeline.cycleTime;
    const driftScale = quality?.cameraDrift ?? 1;
    const horizontalDrift = reduceMotion ? 0 : Math.sin(BASE_CYCLE_FREQUENCY * cycleTime) * 0.15 * driftScale;
    const verticalBreath = reduceMotion ? 0 : Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 2) * 0.02 * driftScale;
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

function AtmosphericFog({ reduceMotion, quality }) {
  const materialRef = useRef();

  useEffect(() => {
    if (!materialRef.current) {
      return;
    }
    materialRef.current.uTime = 0;
    const baseDensity = quality.fogBaseDensity ?? HERO_BASE_FOG_DENSITY;
    materialRef.current.uDensity = reduceMotion ? Math.min(baseDensity, 0.06) : baseDensity;
    materialRef.current.uHeightFalloff = 0.45;
  }, [quality.fogBaseDensity, reduceMotion]);

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return;
    }
    const timeline = getHeroTimelineState(clock.getElapsedTime());
    materialRef.current.uTime = reduceMotion ? 0 : timeline.cycleTime;
    if (!reduceMotion) {
      const baseDensity = quality.fogBaseDensity ?? HERO_BASE_FOG_DENSITY;
      const pulseStrength = quality.fogPulseMultiplier ?? 0.18;
      materialRef.current.uDensity = baseDensity * (1 + (timeline.backgroundDriftMultiplier - 1) * pulseStrength);
    }
  }, [quality.fogBaseDensity, quality.fogPulseMultiplier, reduceMotion]);

  return (
    <mesh position={[0, -1.5, -2]} scale={[34, 18, 42]}>
      <boxGeometry args={[1, 1, 1, 1, 6, 1]} />
      <heightFogMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function BackgroundLayers({ reduceMotion, quality }) {
  const materialRef = useRef();
  const { positions, verticalSpeeds, swayAxes, offsets } = useMemo(
    () => createBackgroundParticles(quality.backgroundParticleCount ?? BACKGROUND_PARTICLE_COUNT),
    [quality.backgroundParticleCount],
  );
  const pointsRef = useRef();
  const particleCount = positions.length / 3;

  useFrame(({ clock }, delta) => {
    const timeline = getHeroTimelineState(clock.getElapsedTime());
    if (materialRef.current) {
      materialRef.current.uTime = timeline.cycleTime;
      const scanStrength = (quality.gridScanStrength ?? 1) * timeline.gridScanStrength;
      materialRef.current.uScanStrength = reduceMotion ? 0 : scanStrength;
      materialRef.current.uScanProgress = timeline.gridScanProgress;
    }
    if (reduceMotion || !pointsRef.current) {
      return;
    }
    const array = pointsRef.current.geometry.attributes.position.array;
    const cycleTime = timeline.cycleTime;
    const driftMultiplier = timeline.backgroundDriftMultiplier * (quality.backgroundDriftScale ?? 1);
    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3;
      const sway = swayAxes[i];
      const offset = offsets[i];
      const swayFactor = Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 3 + offset);
      const swayFactorZ = Math.cos(BASE_CYCLE_FREQUENCY * cycleTime * 2.6 + offset);
      array[index] += sway.x * swayFactor * 0.0009 * driftMultiplier;
      array[index + 1] += verticalSpeeds[i] * delta * driftMultiplier;
      array[index + 2] += sway.z * swayFactorZ * 0.0009 * driftMultiplier;
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
          opacity={reduceMotion ? 0.12 : 0.16 * (quality.gridScanStrength ?? 1)}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function NeuralCore({ reduceMotion, quality }) {
  const { nodes, connections } = useMemo(
    () =>
      createNeuralNodes(
        quality.neuralNodeCount ?? NEURAL_NODE_COUNT,
        quality.neuralConnectionsPerNode ?? NEURAL_CONNECTIONS_PER_NODE,
      ),
    [quality.neuralConnectionsPerNode, quality.neuralNodeCount],
  );
  const instancedRef = useRef();
  const connectionRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const colorsRef = useRef(nodes.map(() => new Color(0x9333ea)));
  const trailSampleCount = resolveMotionBlurSampleCount(quality);

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
    const timeline = getHeroTimelineState(time);
    const cycleTime = timeline.cycleTime;
    nodes.forEach((node, index) => {
      const pulsePhase = (cycleTime / node.pulseDuration) * TWO_PI + node.pulseOffset;
      const basePulse = MathUtils.lerp(0.82, 1.3, (Math.sin(pulsePhase) + 1) * 0.5);
      const scaleMultiplier = reduceMotion
        ? 1
        : 1 + (basePulse - 1) * (1 + (timeline.heroNeuralPulseMultiplier - 1) * 0.65);
      dummy.position.copy(node.position);
      dummy.scale.setScalar(node.scale * scaleMultiplier);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (connectionRef.current) {
      const flickerPhase = reduceMotion ? 0 : Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 6 + 0.45);
      const baseOpacity = reduceMotion ? 0.32 : 0.22 + timeline.heroNeuralPulseMultiplier * 0.08;
      connectionRef.current.material.opacity = baseOpacity + flickerPhase * 0.12 * timeline.heroNeuralPulseMultiplier;
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
        <lineBasicMaterial color={new Color(0x60a5fa)} transparent opacity={0.32} linewidth={1} toneMapped={false} />
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
    const timeline = getHeroTimelineState(time);
    pulses.forEach((pulse, index) => {
      const mesh = pulseRefs.current[index];
      if (!mesh) return;
      const progress = ((time * pulse.speed * timeline.heroNeuralPulseMultiplier) + pulse.offset) % 1;
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

function CircuitPaths({ reduceMotion, quality }) {
  const paths = useMemo(
    () =>
      createCircuitPaths(
        quality.circuitPathCount ?? CIRCUIT_PATH_COUNT,
        quality.circuitPulsesPerPath ?? CIRCUIT_PULSES_PER_PATH,
      ),
    [quality.circuitPathCount, quality.circuitPulsesPerPath],
  );
  return (
    <group>
      {paths.map((path) => (
        <CircuitPath key={path.id} {...path} reduceMotion={reduceMotion} />
      ))}
    </group>
  );
}

function OrbitalNetwork({ reduceMotion, quality }) {
  const { nodes, streams } = useMemo(
    () =>
      createOrbitalNetwork({
        orbitalNodeDensity: quality.orbitalNodeDensity ?? 1,
        energyStreamDensity: quality.energyStreamDensity ?? 1,
      }),
    [quality.energyStreamDensity, quality.orbitalNodeDensity],
  );
  const orbitRefs = useRef([]);
  const visualRefs = useRef([]);
  const materialRefs = useRef([]);
  const edgeRefs = useRef([]);
  const coreRefs = useRef([]);
  const nodePositions = useRef(nodes.map(() => new Vector3()));
  const nodeTrailRefs = useRef(nodes.map(() => null));
  const trailSampleCount = Math.max(2, resolveMotionBlurSampleCount(quality));
  const nodeTrailBuffers = useRef(nodes.map(() => new Float32Array(trailSampleCount * 3)));
  const nodeHistories = useRef(nodes.map(() => Array.from({ length: trailSampleCount }, () => HERO_ORB_CENTER.clone())));
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
    nodeTrailRefs.current = nodeTrailRefs.current.slice(0, nodes.length);
    nodeTrailBuffers.current = nodes.map((_, index) => {
      const existing = nodeTrailBuffers.current[index];
      if (existing && existing.length === trailSampleCount * 3) {
        return existing;
      }
      return new Float32Array(trailSampleCount * 3);
    });
    nodeHistories.current = nodes.map((_, index) => {
      const existing = nodeHistories.current[index];
      if (existing && existing.length === trailSampleCount) {
        return existing;
      }
      return Array.from({ length: trailSampleCount }, () => HERO_ORB_CENTER.clone());
    });
  }, [nodes.length, trailSampleCount]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const timeline = getHeroTimelineState(time);
    const cycleTime = timeline.cycleTime;
    nodes.forEach((node, index) => {
      const orbitGroup = orbitRefs.current[index];
      const visualGroup = visualRefs.current[index];
      if (!orbitGroup || !visualGroup) return;
      const orbitSpeed = node.orbitSpeed * timeline.nodeOrbitSpeedMultiplier;
      const angle = node.baseAngle + node.direction * orbitSpeed * cycleTime * TWO_PI;
      const basePosition = new Vector3(Math.cos(angle) * node.orbitRadius, 0, Math.sin(angle) * node.orbitRadius);
      basePosition.applyQuaternion(node.tiltQuaternion);
      basePosition.add(HERO_ORB_CENTER);
      orbitGroup.position.copy(basePosition);
      nodePositions.current[index].copy(basePosition);

      const history = nodeHistories.current[index];
      const buffer = nodeTrailBuffers.current[index];
      const trail = nodeTrailRefs.current[index];
      if (history && buffer) {
        for (let i = history.length - 1; i > 0; i -= 1) {
          history[i].copy(history[i - 1]);
        }
        history[0].copy(basePosition);
        history.forEach((vec, historyIndex) => {
          const base = historyIndex * 3;
          buffer[base] = vec.x;
          buffer[base + 1] = vec.y;
          buffer[base + 2] = vec.z;
        });
        const hasSufficientSamples = history.length >= 2 && buffer.length >= 6;
        if (trail?.geometry && hasSufficientSamples) {
          if (typeof trail.geometry.setPositions === "function") {
            trail.geometry.setPositions(buffer);
          } else if (typeof trail.geometry.setFromPoints === "function") {
            trail.geometry.setFromPoints(history);
          }
        }
      }

      const scalePulse = reduceMotion
        ? 1
        : MathUtils.lerp(
            0.95,
            1.05,
            (Math.sin(cycleTime * node.scalePulseRate * TWO_PI + node.scalePulseOffset) + 1) * 0.5,
          );
      const timelineScale = 1 + (timeline.heroNeuralPulseMultiplier - 1) * 0.35;
      visualGroup.scale.setScalar(node.baseScale * scalePulse * timelineScale);
      visualGroup.rotateOnAxis(
        node.selfRotationAxis,
        node.selfRotationSpeed * delta * timeline.nodeSelfRotationMultiplier,
      );

      const material = materialRefs.current[index];
      if (node.type === "A" && material) {
        const cycle = ((cycleTime / 8 + node.colorCycleOffset) % TYPE_A_TINT_COLORS.length + TYPE_A_TINT_COLORS.length) %
          TYPE_A_TINT_COLORS.length;
        const baseIndex = Math.floor(cycle);
        const nextIndex = (baseIndex + 1) % TYPE_A_TINT_COLORS.length;
        const localT = cycle - baseIndex;
        const emissive = TYPE_A_TINT_COLORS[baseIndex].clone().lerp(TYPE_A_TINT_COLORS[nextIndex], localT);
        material.emissive.copy(emissive);
        material.emissiveIntensity = 0.68 * timeline.heroEmissiveMultiplier;
      }

      if (node.type === "B" && edgeRefs.current[index]) {
        const edgeMaterial = edgeRefs.current[index].material;
        const opacityBase = reduceMotion ? 0.88 : 0.82;
        edgeMaterial.opacity =
          opacityBase + Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 4 + node.scalePulseOffset) * 0.18 * timeline.heroNeuralPulseMultiplier;
      }

      if (node.type === "C" && coreRefs.current[index]) {
        const intensity = reduceMotion
          ? 5.0
          : (5 + Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 5 + node.scalePulseOffset) * 1.2) *
            timeline.heroEmissiveMultiplier;
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
          <meshStandardMaterial
            color={new Color(0xffffff)}
            emissive={new Color(0xffffff)}
            emissiveIntensity={5}
            metalness={0}
            roughness={1}
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
          <Line
            ref={(value) => {
              nodeTrailRefs.current[index] = value ?? nodeTrailRefs.current[index];
            }}
            points={nodeHistories.current[index] ?? []}
            color="#38bdf8"
            transparent
            opacity={reduceMotion ? 0.1 : 0.28 * MathUtils.clamp(quality.energyStreamDensity ?? 1, 0.55, 1)}
            lineWidth={1.4}
            toneMapped={false}
          />
        </group>
      ))}
      <EnergyStreams
        streams={streams}
        reduceMotion={reduceMotion}
        nodePositions={nodePositions}
        quality={quality}
      />
    </group>
  );
}

function ForegroundBokeh({ reduceMotion, quality }) {
  const particles = useMemo(
    () => createForegroundParticles(quality.foregroundParticleCount ?? FOREGROUND_PARTICLE_COUNT),
    [quality.foregroundParticleCount],
  );
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
        opacity={reduceMotion ? 0.3 : 0.4 * (quality.backgroundDriftScale ?? 1)}
        depthWrite={false}
        toneMapped={false}
        color={new Color(0xffffff)}
        vertexColors
      />
    </instancedMesh>
  );
}

function createGodRayDescriptors(count = GOD_RAY_COUNT) {
  const random = createDeterministicRandom(6412);
  return Array.from({ length: count }, (_, index) => ({
    angle: (index / count) * Math.PI * 2,
    length: 6 + random() * 2,
    width: 0.28 + random() * 0.12,
    offset: random() * Math.PI * 2,
    tilt: MathUtils.degToRad(-6 + random() * 12),
  }));
}

function GodRays({ reduceMotion, quality }) {
  const instancedRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const rays = useMemo(() => createGodRayDescriptors(quality.godRayCount ?? GOD_RAY_COUNT), [quality.godRayCount]);

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
    const timeline = getHeroTimelineState(time);
    const cycleTime = timeline.cycleTime;
    const rotationOffset = reduceMotion ? 0 : timeline.normalizedTime * TWO_PI * 0.5;
    rays.forEach((ray, index) => {
      const groupRotation = ray.angle + rotationOffset;
      dummy.position.set(Math.cos(groupRotation) * 0.2, 0.2, Math.sin(groupRotation) * 0.2);
      dummy.rotation.set(ray.tilt, groupRotation, 0);
      dummy.scale.set(ray.width, ray.length, 1);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (instancedRef.current.material) {
      const opacityBase = quality.godRayOpacity ?? 0.16;
      instancedRef.current.material.opacity = reduceMotion
        ? opacityBase
        : opacityBase * timeline.godRayOpacityMultiplier;
    }
  });

  return (
    <instancedMesh ref={instancedRef} args={[null, null, rays.length]} frustumCulled={false} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={quality.godRayOpacity ?? 0.16}
        depthWrite={false}
        toneMapped={false}
        color={new Color(0x38bdf8)}
        blending={AdditiveBlending}
        vertexColors
      />
    </instancedMesh>
  );
}

function HeroOrb({ reduceMotion, quality }) {
  const groupRef = useRef();
  const shellRef = useRef();
  const plasmaRef = useRef();
  const speckRef = useRef();
  const speckDummy = useMemo(() => new Object3D(), []);
  const speckColor = useMemo(() => new Color(), []);
  const shellSpecks = useMemo(() => createShellSpecks(), []);
  const { normalTexture, roughnessTexture } = useProceduralShellMaps();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const timeline = getHeroTimelineState(time);
    const cycleTime = timeline.cycleTime;
    const normalized = timeline.normalizedTime;
    const bob = reduceMotion ? 0 : Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 3) * 0.08;
    const wobbleX = reduceMotion ? 0 : Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 5) * 0.05;
    const wobbleZ = reduceMotion ? 0 : Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 5 + Math.PI / 2) * 0.05;
    const pulse = reduceMotion
      ? 1
      : 1 + ((Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 7) + 1) * 0.5) * 0.035 * timeline.heroScalePulseMultiplier;

    groupRef.current.position.set(wobbleX, 0.2 + bob, wobbleZ);
    groupRef.current.rotation.y = normalized * TWO_PI;
    groupRef.current.scale.setScalar(pulse);

    if (shellRef.current) {
      const emissivePhase = (Math.sin(BASE_CYCLE_FREQUENCY * cycleTime * 7) + 1) * 0.5;
      const emissiveScale = quality?.level === "low" ? 0.92 : quality?.level === "medium" ? 1 : 1.08;
      const emissiveIntensity = reduceMotion
        ? 0.425
        : (0.3 + emissivePhase * 0.25) * timeline.heroEmissiveMultiplier * emissiveScale;
      shellRef.current.emissiveIntensity = emissiveIntensity;
      shellRef.current.opacity = 0.24 * emissiveScale;
    }
    if (plasmaRef.current) {
      plasmaRef.current.uTime = cycleTime;
    }
    if (speckRef.current) {
      shellSpecks.forEach((speck, index) => {
        const phase = reduceMotion
          ? speck.twinklePhase
          : speck.twinklePhase + cycleTime * speck.twinkleSpeed * BASE_CYCLE_FREQUENCY;
        const twinkle = MathUtils.lerp(speck.minIntensity, speck.maxIntensity, (Math.sin(phase) + 1) * 0.5);
        speckDummy.position.copy(speck.position);
        speckDummy.lookAt(HERO_ORB_CENTER);
        const scale = speck.scale * (0.9 + twinkle * 0.4) * timeline.heroScalePulseMultiplier;
        speckDummy.scale.setScalar(scale);
        speckDummy.updateMatrix();
        speckRef.current.setMatrixAt(index, speckDummy.matrix);
        speckColor.copy(speck.baseColor).multiplyScalar(twinkle * 1.25 * timeline.heroEmissiveMultiplier);
        speckRef.current.setColorAt(index, speckColor);
      });
      speckRef.current.instanceMatrix.needsUpdate = true;
      if (speckRef.current.instanceColor) {
        speckRef.current.instanceColor.needsUpdate = true;
      }
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
          attenuationDistance={0.45}
          attenuationColor={new Color(0x64c8dc)}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[HERO_ORB_RADIUS * 0.92, 5]} />
        <plasmaMaterial ref={plasmaRef} transparent depthWrite={false} />
      </mesh>
      <instancedMesh ref={speckRef} args={[null, null, shellSpecks.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0.9}
          depthWrite={false}
          toneMapped={false}
          vertexColors
          blending={AdditiveBlending}
        />
      </instancedMesh>
      <NeuralCore reduceMotion={reduceMotion} quality={quality} />
      <CircuitPaths reduceMotion={reduceMotion} quality={quality} />
      <GodRays reduceMotion={reduceMotion} quality={quality} />
    </group>
  );
}

function EnergyStreams({ streams, reduceMotion, nodePositions, quality }) {
  const streamCurves = useMemo(
    () => streams.map(() => new CubicBezierCurve3(new Vector3(), new Vector3(), new Vector3(), new Vector3())),
    [streams],
  );
  const coreRefs = useRef([]);
  const glowRefs = useRef([]);
  const coreMaterials = useRef([]);
  const glowMaterials = useRef([]);
  const particleRefs = useRef(streams.map((stream) => new Array(stream.particleOffsets.length).fill(null)));
  const particleTrailRefs = useRef(streams.map((stream) => new Array(stream.particleOffsets.length).fill(null)));
  const motionTrailSamples = resolveMotionBlurSampleCount(quality);
  const particleTrailBuffers = useRef(
    streams.map((stream) => stream.particleOffsets.map(() => new Float32Array(motionTrailSamples * 3))),
  );
  const particleHistories = useRef(
    streams.map((stream) =>
      stream.particleOffsets.map(() => Array.from({ length: motionTrailSamples }, () => new Vector3())),
    ),
  );

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
    particleTrailRefs.current = streams.map((stream, streamIndex) => {
      const existing = particleTrailRefs.current[streamIndex] ?? [];
      const next = new Array(stream.particleOffsets.length).fill(null);
      return next.map((_, particleIndex) => existing[particleIndex] ?? null);
    });
    particleTrailBuffers.current = streams.map((stream, streamIndex) => {
      const existing = particleTrailBuffers.current[streamIndex] ?? [];
      return stream.particleOffsets.map((_, particleIndex) => {
        const buffer = existing[particleIndex];
        if (buffer && buffer.length === motionTrailSamples * 3) {
          return buffer;
        }
        return new Float32Array(motionTrailSamples * 3);
      });
    });
    particleHistories.current = streams.map((stream, streamIndex) => {
      const existing = particleHistories.current?.[streamIndex] ?? [];
      return stream.particleOffsets.map((_, particleIndex) => {
        const history = existing[particleIndex];
        if (history && history.length === motionTrailSamples) {
          return history;
        }
        return Array.from({ length: motionTrailSamples }, () => new Vector3());
      });
    });
  }, [motionTrailSamples, streams]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const timeline = getHeroTimelineState(time);
    const cycleTime = timeline.cycleTime;
    const energyMultiplier = MathUtils.clamp(quality.energyStreamDensity ?? 1, 0.55, 1.05);
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
        : stream.wobbleAmplitude * Math.sin(cycleTime * stream.wobbleFrequency + stream.gradientOffset * Math.PI * 2);
      const twistAngle = reduceMotion ? 0 : cycleTime * 0.35 + stream.gradientOffset * Math.PI * 2;
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
        const pulseFrequency = stream.pulseFrequency * timeline.energyPulseFrequencyMultiplier;
        const intensity =
          (stream.pulseBase * timeline.energyPulseIntensityMultiplier * energyMultiplier) +
          (reduceMotion
            ? 0
            : stream.pulseAmplitude * timeline.energyPulseAmplitudeMultiplier *
              Math.sin(cycleTime * pulseFrequency + stream.gradientOffset * Math.PI * 2));
        coreMaterial.uniforms.uTime.value = cycleTime;
        coreMaterial.uniforms.uFlowDirection.value = stream.flowDirection;
        coreMaterial.uniforms.uGradientShift.value = reduceMotion
          ? stream.gradientOffset
          : stream.gradientOffset + cycleTime * stream.gradientSpeed * stream.flowDirection;
        coreMaterial.uniforms.uIntensity.value = intensity;
        coreMaterial.uniforms.uOpacity.value = reduceMotion ? 0.78 : 0.86 * energyMultiplier;
      }

      if (glowMaterial) {
        glowMaterial.uniforms.uFlowDirection.value = stream.flowDirection;
        glowMaterial.uniforms.uGradientShift.value = reduceMotion
          ? stream.gradientOffset
          : stream.gradientOffset + cycleTime * stream.gradientSpeed * 0.65 * stream.flowDirection;
        glowMaterial.uniforms.uOpacity.value = reduceMotion
          ? 0.14
          : 0.22 * timeline.energyPulseAmplitudeMultiplier * energyMultiplier;
      }

      const pathLength = Math.max(curve.getLength(), 0.0001);
      const directionSign = stream.flowDirection >= 0 ? 1 : -1;
      const particles = particleRefs.current[index] ?? [];

      particles.forEach((particle, particleIndex) => {
        if (!particle) return;
        const offset = stream.particleOffsets[particleIndex] ?? 0;
        const travel = reduceMotion
          ? offset
          : offset + ((time * stream.particleSpeed * timeline.energyParticleSpeedMultiplier) / pathLength);
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
        const particleScale = stream.coreRadius * 1.6 * energyMultiplier;
        particle.scale.set(particleScale * 0.75, particleScale, particleScale);

        const histories = particleHistories.current[index];
        const buffers = particleTrailBuffers.current[index];
        const trails = particleTrailRefs.current[index];
        if (histories && buffers && trails) {
          const history = histories[particleIndex];
          const buffer = buffers[particleIndex];
          const trail = trails[particleIndex];
          if (history && buffer) {
            for (let i = history.length - 1; i > 0; i -= 1) {
              history[i].copy(history[i - 1]);
            }
            history[0].copy(point);
            history.forEach((vec, historyIndex) => {
              const base = historyIndex * 3;
              buffer[base] = vec.x;
              buffer[base + 1] = vec.y;
              buffer[base + 2] = vec.z;
            });
            if (trail?.geometry) {
              if (typeof trail.geometry.setPositions === "function") {
                trail.geometry.setPositions(buffer);
              } else if (typeof trail.geometry.setFromPoints === "function") {
                trail.geometry.setFromPoints(history);
              }
            }
          }
        }
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
          {stream.particleOffsets.map((_, particleIndex) => {
            const history =
              particleHistories.current[index]?.[particleIndex] ??
              Array.from({ length: motionTrailSamples }, () => new Vector3());
            return (
              <group key={`${stream.id}-particle-${particleIndex}`}>
                <mesh
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
                <Line
                  ref={(value) => {
                    if (!particleTrailRefs.current[index]) {
                      particleTrailRefs.current[index] = [];
                    }
                    particleTrailRefs.current[index][particleIndex] = value ?? particleTrailRefs.current[index][particleIndex];
                  }}
                  points={history}
                  color="#66f7ff"
                  transparent
                  opacity={reduceMotion ? 0.08 : 0.24 * MathUtils.clamp(quality.energyStreamDensity ?? 1, 0.5, 1)}
                  lineWidth={1.1}
                  dashed={false}
                  toneMapped={false}
                />
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function SceneComposer({ reduceMotion, quality }) {
  const { camera, size, scene } = useThree();
  const backgroundColor = useMemo(() => new Color(0x0f172a), []);
  const fogColor = useMemo(() => new Color(0x142337), []);
  const environmentSnapshot = useRef({ background: null, fog: null });
  const fogRef = useRef();
  const lensDirtTexture = useLensDirtTexture();
  const dofRef = useRef();
  const colorGradeEffect = useMemo(() => new ColorGradeEffect(), []);
  const lensDirtEffect = useMemo(
    () => new LensDirtEffect(lensDirtTexture, quality.lensDirtStrength ?? 0.15, 1.0),
    [lensDirtTexture, quality.lensDirtStrength],
  );
  const filmGrainEffect = useMemo(
    () => new FilmGrainEffect(quality.enableFilmGrain ? quality.filmGrainStrength : 0, 1.5, 1.45),
    [quality.enableFilmGrain, quality.filmGrainStrength],
  );
  const chromaticEffect = useMemo(
    () =>
      new SplitChromaticAberrationEffect(
        0.4,
        quality.chromaticAberrationOffset ?? 0.002,
        -(quality.chromaticAberrationOffset ?? 0.002),
      ),
    [quality.chromaticAberrationOffset],
  );
  const motionBlurSamples = resolveMotionBlurSampleCount(quality);
  const motionBlurEffect = useMemo(
    () =>
      new HeroMotionBlurEffect(
        quality.enableMotionBlur ? quality.motionBlurIntensity : 0,
        quality.enableMotionBlur ? motionBlurSamples : 4,
      ),
    [motionBlurSamples, quality.enableMotionBlur, quality.motionBlurIntensity],
  );
  const previousCameraPosition = useRef(new Vector3());
  const cameraVelocity = useRef(new Vector3());
  const blurDirection = useRef(new Vector2());
  const rightVector = useRef(new Vector3());
  const upVector = useRef(new Vector3());

  useEffect(() => {
    if (!scene) {
      return undefined;
    }
    const previousBackground =
      scene.background instanceof Color ? scene.background.clone() : scene.background ?? null;
    const previousFog = scene.fog ?? null;
    environmentSnapshot.current = { background: previousBackground, fog: previousFog };
    scene.background = backgroundColor.clone();
    const fogInstance = new FogExp2(fogColor.clone(), quality.fogBaseDensity ?? HERO_BASE_FOG_DENSITY);
    fogRef.current = fogInstance;
    scene.fog = fogInstance;
    return () => {
      if (environmentSnapshot.current.background instanceof Color) {
        scene.background = environmentSnapshot.current.background;
      } else {
        scene.background = environmentSnapshot.current.background ?? null;
      }
      scene.fog = environmentSnapshot.current.fog ?? null;
    };
  }, [backgroundColor, fogColor, quality.fogBaseDensity, scene]);

  useEffect(() => {
    previousCameraPosition.current.copy(camera.position);
  }, [camera]);

  useEffect(() => {
    const resolutionUniform = colorGradeEffect.uniforms.get("uResolution");
    if (resolutionUniform) {
      resolutionUniform.value.set(size.width, size.height);
    }
  }, [colorGradeEffect, size.height, size.width]);

  useEffect(() => {
    const dirtUniform = lensDirtEffect.uniforms.get("uDirtTexture");
    if (dirtUniform) {
      dirtUniform.value = lensDirtTexture;
    }
  }, [lensDirtEffect, lensDirtTexture]);

  useEffect(() => {
    const intensityUniform = filmGrainEffect.uniforms.get("uIntensity");
    if (intensityUniform) {
      intensityUniform.value = quality.enableFilmGrain ? quality.filmGrainStrength : 0;
    }
  }, [filmGrainEffect, quality.enableFilmGrain, quality.filmGrainStrength]);

  useEffect(() => {
    const intensityUniform = motionBlurEffect.uniforms.get("uIntensity");
    if (intensityUniform) {
      intensityUniform.value = quality.enableMotionBlur ? quality.motionBlurIntensity : 0;
    }
    const samplesUniform = motionBlurEffect.uniforms.get("uSampleCount");
    if (samplesUniform) {
      samplesUniform.value = quality.enableMotionBlur ? motionBlurSamples : 4;
    }
  }, [motionBlurEffect, motionBlurSamples, quality.enableMotionBlur, quality.motionBlurIntensity]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const timeline = getHeroTimelineState(time);
    if (fogRef.current) {
      const baseDensity = (quality.fogBaseDensity ?? HERO_BASE_FOG_DENSITY) *
        (reduceMotion ? 1 : 1 + (timeline.backgroundDriftMultiplier - 1) * (quality.fogPulseMultiplier ?? 0.18));
      fogRef.current.density = MathUtils.lerp(fogRef.current.density, baseDensity, 0.1);
      fogRef.current.color.copy(fogColor);
    }
    if (quality.enableFilmGrain) {
      const grainTimeUniform = filmGrainEffect.uniforms.get("uTime");
      if (grainTimeUniform) {
        grainTimeUniform.value = time;
      }
    }

    if (dofRef.current) {
      const focusBreathing = reduceMotion ? 0 : Math.sin((time / 6) * Math.PI * 2) * 0.05;
      const focusDistanceWorld = camera.position.distanceTo(HERO_FOCUS_POINT) + focusBreathing;
      const nearWorld = Math.max(camera.near + 0.05, focusDistanceWorld - 2);
      const farWorld = Math.min(camera.far - 0.05, focusDistanceWorld + 2);
      const normalizedFocus = MathUtils.clamp(
        (focusDistanceWorld - camera.near) / (camera.far - camera.near),
        0,
        1,
      );
      const normalizedRange = MathUtils.clamp(
        (farWorld - nearWorld) / (camera.far - camera.near),
        0.001,
        1,
      );
      dofRef.current.focusDistance = normalizedFocus;
      dofRef.current.focusRange = normalizedRange;
      dofRef.current.focalLength = 0.02;
      dofRef.current.bokehScale =
        (quality.depthOfFieldBokehScale ?? 0.9) * (reduceMotion ? 0.7 : 1.0);
    }

    cameraVelocity.current.copy(camera.position).sub(previousCameraPosition.current);
    previousCameraPosition.current.copy(camera.position);

    rightVector.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
    upVector.current.set(0, 1, 0).applyQuaternion(camera.quaternion);
    blurDirection.current.set(
      rightVector.current.dot(cameraVelocity.current),
      upVector.current.dot(cameraVelocity.current),
    );
    const velocityMagnitude = cameraVelocity.current.length();
    if (velocityMagnitude < 1e-5) {
      blurDirection.current.set(0, 0);
    } else {
      const blurStrength = Math.min(velocityMagnitude * 14, 1.0);
      const currentLength = blurDirection.current.length();
      if (currentLength > 0.0001) {
        blurDirection.current.multiplyScalar((blurStrength / currentLength) * 0.5);
      } else {
        blurDirection.current.set(0, 0);
      }
    }
    if (quality.enableMotionBlur) {
      const blurUniform = motionBlurEffect.uniforms.get("uBlurDirection");
      if (blurUniform) {
        blurUniform.value.copy(blurDirection.current);
      }
    }
  });

  return (
    <group>
      <BackgroundLayers reduceMotion={reduceMotion} quality={quality} />
      <AtmosphericFog reduceMotion={reduceMotion} quality={quality} />
      <HeroOrb reduceMotion={reduceMotion} quality={quality} />
      <OrbitalNetwork reduceMotion={reduceMotion} quality={quality} />
      <ForegroundBokeh reduceMotion={reduceMotion} quality={quality} />
      <SceneLighting />
      <EffectComposer
        multisampling={reduceMotion ? 0 : quality.level === "high" ? 8 : quality.level === "medium" ? 4 : 0}
        enabled
      >
        <Bloom
          intensity={quality.bloomIntensity}
          luminanceThreshold={quality.bloomThreshold}
          luminanceSmoothing={0.18}
          radius={quality.bloomRadius}
          mipmapBlur
        />
        {quality.enableDepthOfField ? (
          <DepthOfField
            ref={dofRef}
            focusDistance={0.45}
            focalLength={0.02}
            bokehScale={quality.depthOfFieldBokehScale}
            height={720}
          />
        ) : null}
        {quality.enableLensDirt ? <primitive object={lensDirtEffect} /> : null}
        {quality.enableChromaticAberration ? <primitive object={chromaticEffect} /> : null}
        {quality.enableMotionBlur ? <primitive object={motionBlurEffect} /> : null}
        <primitive object={colorGradeEffect} />
        {quality.enableFilmGrain ? <primitive object={filmGrainEffect} /> : null}
      </EffectComposer>
    </group>
  );
}

function PerformanceStatsMonitor() {
  const statsRef = useRef();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.position = "fixed";
    stats.dom.style.right = "16px";
    stats.dom.style.bottom = "16px";
    stats.dom.style.zIndex = "1000";
    stats.dom.style.pointerEvents = "none";
    document.body.appendChild(stats.dom);
    statsRef.current = stats;
    return () => {
      if (stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
      statsRef.current = undefined;
    };
  }, []);

  useFrame(() => {
    if (statsRef.current) {
      statsRef.current.update();
    }
  });

  return null;
}

export default function HeroScene({ width = 1280, height = 720 }) {
  if (typeof window === "undefined") {
    return (
      <img
        src={heroFallbackMedia}
        alt=""
        role="presentation"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  const prefersReducedMotion = usePrefersReducedMotionScene();
  const targetAspect = width / height || HERO_ASPECT;
  const quality = useHeroQualitySettings(prefersReducedMotion);
  const shouldRenderStats =
    typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
      ? import.meta.env.MODE !== "production"
      : false;
  const maxDpr = quality.level === "high" ? 2 : quality.level === "medium" ? 1.75 : 1.5;
  
  return (
    <Canvas
    shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: quality.level === "low" ? "low-power" : "high-performance",
      }}
      frameloop={prefersReducedMotion ? "demand" : "always"}
      camera={{
        fov: HERO_FOV,
        position: [
          0,
          Math.sin(MathUtils.degToRad(HERO_CAMERA_ELEVATION_DEG)) * HERO_CAMERA_DISTANCE,
          HERO_CAMERA_DISTANCE,
        ],
        near: 0.1,
        far: 60,
      }}
      dpr={[1, maxDpr]}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "inherit",
        pointerEvents: "none",
        backgroundColor: "#0f172a",
      }}
      onCreated={({ gl, scene }) => {
        const pixelRatio = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, maxDpr) : 1;
        gl.setPixelRatio(pixelRatio);
        gl.setSize(width, height, false);
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
        gl.setClearColor(new Color(0x0f172a), 1);
        scene.background = new Color(0x0f172a);
        scene.fog = new FogExp2(0x142337, HERO_BASE_FOG_DENSITY);
      }}
    >
      <Suspense fallback={null}>
        <CameraRig reduceMotion={prefersReducedMotion} targetAspect={targetAspect} quality={quality} />
        <SceneComposer reduceMotion={prefersReducedMotion} quality={quality} />
        {shouldRenderStats ? <PerformanceStatsMonitor /> : null}
      </Suspense>
    </Canvas>
  );
}
