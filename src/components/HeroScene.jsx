import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  DataTexture,
  DoubleSide,
  MathUtils,
  Object3D,
  SRGBColorSpace,
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
const ORBITAL_NODE_COUNT = 18;
const FOG_PARTICLE_COUNT = 1500;
const FOREGROUND_PARTICLE_COUNT = 24;

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
    uColorA: new Color(0x030712),
    uColorB: new Color(0x0b1120),
    uGridColor: new Color(0x172554),
    uGlowColor: new Color(0x0ea5e9),
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
      vec3 base = mix(uColorA, uColorB, smoothstep(0.0, 1.0, uv.y));

      float fineGrid = grid(uv + uTime * 0.0015, 32.0, 1.2);
      float coarseGrid = grid(uv + vec2(uTime * 0.0006, -uTime * 0.0008), 8.0, 1.6);
      float glowMask = pow(smoothstep(0.35, 1.0, uv.y), 1.6);
      float glow = glowMask * (0.35 + 0.65 * fineGrid);

      float star = starfield(uv);

      vec3 color = base;
      color += uGridColor * 0.35 * coarseGrid;
      color += uGlowColor * glow * 0.45;
      color += uGlowColor * 0.2 * fineGrid;
      color += vec3(0.65, 0.75, 0.95) * star * 0.35;
      color = mix(color, vec3(0.02, 0.04, 0.1), 0.18);

      gl_FragColor = vec4(color, 0.96);
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

extend({ GridMaterial, PlasmaMaterial });

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

function createOrbitalNodes() {
  const random = createDeterministicRandom(7128);
  return Array.from({ length: ORBITAL_NODE_COUNT }, (_, index) => {
    const radius = 2.4 + random() * 1.6;
    const inclination = MathUtils.degToRad(18 + random() * 48);
    const azimuth = random() * Math.PI * 2;
    const speed = 0.08 + random() * 0.05;
    const size = 0.16 + random() * 0.22;
    const colorShift = random();
    return { id: `orbital-${index}`, radius, inclination, azimuth, speed, size, colorShift };
  });
}

function createFogParticles() {
  const random = createDeterministicRandom(9813);
  const positions = new Float32Array(FOG_PARTICLE_COUNT * 3);
  const velocities = new Float32Array(FOG_PARTICLE_COUNT);
  for (let i = 0; i < FOG_PARTICLE_COUNT; i += 1) {
    const index = i * 3;
    const radius = 4 + random() * 10;
    const angle = random() * Math.PI * 2;
    const height = -3 + random() * 4;
    positions[index] = Math.cos(angle) * radius * 0.6;
    positions[index + 1] = height;
    positions[index + 2] = -4 - random() * 6;
    velocities[i] = 0.12 + random() * 0.18;
  }
  return { positions, velocities };
}

function createForegroundParticles() {
  const random = createDeterministicRandom(5172);
  return Array.from({ length: FOREGROUND_PARTICLE_COUNT }, (_, index) => {
    const radius = 2.2 + random() * 2.6;
    const angle = random() * Math.PI * 2;
    const height = -0.3 + random() * 0.6;
    const depth = 2.2 + random() * 2.8;
    const size = 0.45 + random() * 0.65;
    const speed = 0.08 + random() * 0.05;
    return {
      id: `bokeh-${index}`,
      position: new Vector3(Math.cos(angle) * radius, height, depth),
      rotationAxis: new Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
      size,
      speed,
      offset: random() * Math.PI * 2,
      opacity: 0.3 + random() * 0.4,
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
      <ambientLight intensity={0.24} color={0x1e293b} />
      <directionalLight
        intensity={1.8}
        color={new Color(0xc8dcff)}
        position={[2.1, 4.2, 3.1]}
        castShadow={false}
      />
      <spotLight
        ref={rimLightRef}
        intensity={1.2}
        color={new Color(0xffbe96)}
        angle={MathUtils.degToRad(45)}
        penumbra={0.65}
        position={[-1.6, 2.2, -2.4]}
        distance={18}
      />
      <pointLight intensity={2.5} color={new Color(0x22d3ee)} position={[0, 0.2, 0]} distance={8.5} decay={2.2} />
    </>
  );
}

function BackgroundLayers({ reduceMotion }) {
  const materialRef = useRef();
  const { positions, velocities } = useMemo(() => createFogParticles(), []);
  const pointsRef = useRef();

  useFrame(({ clock }, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
    if (reduceMotion || !pointsRef.current) {
      return;
    }
    const array = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < FOG_PARTICLE_COUNT; i += 1) {
      const index = i * 3;
      array[index] += Math.sin(clock.elapsedTime * 0.08 + i) * 0.0008;
      array[index + 1] += Math.cos(clock.elapsedTime * 0.12 + i * 0.3) * 0.0006;
      array[index + 2] += velocities[i] * delta * 0.02;
      if (array[index + 2] > -1.5) {
        array[index + 2] = -6 - Math.random() * 6;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <mesh
        position={[0, -1.6, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[34, 34, 1]}
      >
        <planeGeometry args={[1, 1, 1, 1]} />
        <gridMaterial ref={materialRef} side={DoubleSide} transparent depthWrite={false} />
      </mesh>
      <points ref={pointsRef} position={[0, 0, -1]}> 
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={new Color(0x3b82f6)}
          size={0.085}
          transparent
          opacity={0.32}
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
  const nodes = useMemo(() => createOrbitalNodes(), []);
  const instancedRef = useRef();
  const connectionsRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const connectionPositions = useRef(new Float32Array(nodes.length * 6));

  useFrame(({ clock }) => {
    if (!instancedRef.current) return;
    const time = clock.getElapsedTime();
    nodes.forEach((node, index) => {
      const angle = node.azimuth + time * node.speed;
      const radius = node.radius;
      const inclination = node.inclination;
      const pos = new Vector3(
        Math.cos(angle) * radius * Math.sin(inclination),
        Math.cos(inclination) * radius * 0.6,
        Math.sin(angle) * radius * Math.sin(inclination)
      );
      dummy.position.copy(pos);
      const scale = node.size * (reduceMotion ? 1 : 0.85 + Math.sin(time * 0.8 + node.colorShift * Math.PI * 2) * 0.25);
      dummy.scale.setScalar(scale);
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);

      const offset = index * 6;
      connectionPositions.current[offset] = pos.x;
      connectionPositions.current[offset + 1] = pos.y;
      connectionPositions.current[offset + 2] = pos.z;
      connectionPositions.current[offset + 3] = 0;
      connectionPositions.current[offset + 4] = 0.2;
      connectionPositions.current[offset + 5] = 0;
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (connectionsRef.current) {
      connectionsRef.current.geometry.attributes.position.array.set(connectionPositions.current);
      connectionsRef.current.geometry.attributes.position.needsUpdate = true;
      const baseOpacity = reduceMotion ? 0.18 : 0.22 + Math.sin(time * 0.4) * 0.08;
      connectionsRef.current.material.opacity = baseOpacity;
    }
  });

  useEffect(() => {
    if (!instancedRef.current) return;
    nodes.forEach((node, index) => {
      const color = new Color().setHSL(MathUtils.lerp(0.52, 0.92, node.colorShift), 0.75, 0.6);
      instancedRef.current.setColorAt(index, color);
    });
    instancedRef.current.instanceColor.needsUpdate = true;
  }, [nodes]);

  return (
    <group>
      <instancedMesh ref={instancedRef} args={[null, null, nodes.length]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.85} vertexColors />
      </instancedMesh>
      <lineSegments ref={connectionsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectionPositions.current, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={new Color(0x60a5fa)} transparent opacity={0.2} toneMapped={false} />
      </lineSegments>
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
