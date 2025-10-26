/**
 * TypeScript Type Definitions for Three.js Components
 */

import type * as THREE from "three";

// Scene Configuration
export interface SceneConfig {
  background?: THREE.Color | THREE.Texture | null;
  fog?: THREE.Fog | THREE.FogExp2;
  environment?: THREE.Texture;
}

// Camera Configuration
export interface CameraConfig {
  type: "perspective" | "orthographic";
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
  position?: [number, number, number];
  lookAt?: [number, number, number];
}

// Renderer Configuration
export interface RendererConfig {
  antialias?: boolean;
  alpha?: boolean;
  precision?: "highp" | "mediump" | "lowp";
  powerPreference?: "high-performance" | "low-power" | "default";
  preserveDrawingBuffer?: boolean;
  logarithmicDepthBuffer?: boolean;
  physicallyCorrectLights?: boolean;
  toneMapping?: THREE.ToneMapping;
  toneMappingExposure?: number;
  outputEncoding?: THREE.TextureEncoding;
  shadowMapEnabled?: boolean;
  shadowMapType?: THREE.ShadowMapType;
}

// Light Configuration
export interface LightConfig {
  type: "ambient" | "directional" | "point" | "spot" | "hemisphere";
  color: string | number;
  intensity: number;
  position?: [number, number, number];
  castShadow?: boolean;
  shadowMapSize?: [number, number];
}

// Material Configuration
export interface MaterialConfig {
  type: "basic" | "standard" | "physical" | "lambert" | "phong" | "shader";
  color?: string | number;
  metalness?: number;
  roughness?: number;
  emissive?: string | number;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
  side?: THREE.Side;
  wireframe?: boolean;
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, THREE.IUniform>;
}

// Geometry Configuration
export interface GeometryConfig {
  type: "box" | "sphere" | "cylinder" | "plane" | "torus" | "custom";
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  segments?: number;
  vertices?: Float32Array;
  indices?: Uint16Array | Uint32Array;
}

// Particle System Configuration
export interface ParticleSystemConfig {
  count: number;
  size: number;
  sizeAttenuation?: boolean;
  color?: string | number;
  opacity?: number;
  blending?: THREE.Blending;
  distribution?: "random" | "sphere" | "box" | "custom";
  spread?: number;
  velocity?: {
    min: [number, number, number];
    max: [number, number, number];
  };
  lifetime?: {
    min: number;
    max: number;
  };
}

// Animation Configuration
export interface AnimationConfig {
  target: THREE.Object3D;
  property: string;
  from: any;
  to: any;
  duration: number;
  easing?: (t: number) => number;
  loop?: boolean;
  yoyo?: boolean;
  onUpdate?: (value: any) => void;
  onComplete?: () => void;
}

// Post-Processing Configuration
export interface PostProcessingConfig {
  bloom?: {
    strength: number;
    radius: number;
    threshold: number;
  };
  chromaticAberration?: {
    offset: number;
  };
  vignette?: {
    darkness: number;
    offset: number;
  };
  glitch?: {
    strength: number;
  };
}

// Orbit Controls Configuration
export interface OrbitControlsConfig {
  enableDamping?: boolean;
  dampingFactor?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  enableRotate?: boolean;
  rotateSpeed?: number;
  enablePan?: boolean;
  panSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

// Shader Uniforms
export interface ShaderUniforms {
  time?: THREE.IUniform<number>;
  resolution?: THREE.IUniform<THREE.Vector2>;
  mouse?: THREE.IUniform<THREE.Vector2>;
  color1?: THREE.IUniform<THREE.Color>;
  color2?: THREE.IUniform<THREE.Color>;
  opacity?: THREE.IUniform<number>;
  progress?: THREE.IUniform<number>;
}

// Node for 3D Graph
export interface GraphNode {
  id: string;
  label: string;
  position: THREE.Vector3;
  color?: string | number;
  size?: number;
  metadata?: Record<string, any>;
}

// Edge/Connection for 3D Graph
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  color?: string | number;
  width?: number;
  animated?: boolean;
}

// 3D Graph Configuration
export interface Graph3DConfig {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeSize?: number;
  edgeWidth?: number;
  interactive?: boolean;
  autoRotate?: boolean;
  showLabels?: boolean;
}

// 3D Object Interaction
export interface ObjectInteraction {
  object: THREE.Object3D;
  type: "click" | "hover" | "drag";
  position: THREE.Vector3;
  normal?: THREE.Vector3;
  uv?: THREE.Vector2;
  distance: number;
}

// Raycaster Result
export interface RaycastResult {
  object: THREE.Object3D;
  point: THREE.Vector3;
  distance: number;
  face?: THREE.Face;
  faceIndex?: number;
  uv?: THREE.Vector2;
}

// Model Loader Configuration
export interface ModelLoaderConfig {
  url: string;
  type: "gltf" | "fbx" | "obj" | "stl";
  onProgress?: (progress: number) => void;
  onLoad?: (model: THREE.Group) => void;
  onError?: (error: Error) => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

// Texture Configuration
export interface TextureConfig {
  url?: string;
  repeat?: [number, number];
  offset?: [number, number];
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  minFilter?: THREE.TextureFilter;
  magFilter?: THREE.TextureFilter;
  encoding?: THREE.TextureEncoding;
  anisotropy?: number;
}

// Performance Monitoring
export interface ThreePerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  memory?: {
    geometries: number;
    textures: number;
  };
}

// Scene State
export interface SceneState {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  controls?: any;
  clock: THREE.Clock;
  animationId?: number;
}

// Effect Composer Configuration
export interface EffectComposerConfig {
  multisampling?: number;
  frameBufferType?: THREE.TextureDataType;
  passes?: {
    type: string;
    config?: Record<string, any>;
  }[];
}

// 3D Text Configuration
export interface Text3DConfig {
  text: string;
  font: string;
  size?: number;
  height?: number;
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  material?: MaterialConfig;
}

// Instance Configuration (for InstancedMesh)
export interface InstanceConfig {
  count: number;
  geometry: GeometryConfig;
  material: MaterialConfig;
  positions?: Float32Array;
  rotations?: Float32Array;
  scales?: Float32Array;
  colors?: Float32Array;
}

// Morph Target Configuration
export interface MorphConfig {
  geometry: THREE.BufferGeometry;
  influences: number[];
  duration: number;
  easing?: (t: number) => number;
}




