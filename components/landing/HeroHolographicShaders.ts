/**
 * HeroHolographicShaders.ts
 * 
 * Advanced GLSL shaders for futuristic holographic hero background
 * 
 * Contains:
 * 1. Fresnel Hologram Shader - For geometric shapes with edge glow
 * 2. Energy Field Shader - For particle trails with HDR emission
 * 3. Grid Shader - Procedural hexagonal grid
 * 4. Chromatic Aberration Shader - Mouse interaction distortion
 * 5. Data Stream Shader - Matrix-style falling characters
 */

import * as THREE from "three";

// ============================================================================
// 1. FRESNEL HOLOGRAM SHADER
// ============================================================================

export interface FresnelHologramUniforms {
  uTime: { value: number };
  uColorPrimary: { value: THREE.Color };
  uColorSecondary: { value: THREE.Color };
  uFresnelPower: { value: number };
  uScanlineSpeed: { value: number };
  uScanlineWidth: { value: number };
  uOpacity: { value: number };
  uGlowIntensity: { value: number };
}

export function createFresnelHologramShader(theme: "dark" | "light" | "contrast"): THREE.ShaderMaterial {
  const colors = getThemeColors(theme);
  
  const uniforms: FresnelHologramUniforms = {
    uTime: { value: 0 },
    uColorPrimary: { value: new THREE.Color(colors.primary) },
    uColorSecondary: { value: new THREE.Color(colors.secondary) },
    uFresnelPower: { value: theme === "contrast" ? 1.5 : 3.0 },
    uScanlineSpeed: { value: 0.5 },
    uScanlineWidth: { value: 0.1 },
    uOpacity: { value: theme === "contrast" ? 0.95 : theme === "light" ? 0.7 : 0.8 },
    uGlowIntensity: { value: theme === "contrast" ? 2.0 : 1.5 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorPrimary;
      uniform vec3 uColorSecondary;
      uniform float uFresnelPower;
      uniform float uScanlineSpeed;
      uniform float uScanlineWidth;
      uniform float uOpacity;
      uniform float uGlowIntensity;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      
      // Fresnel effect calculation
      float fresnel(vec3 viewDirection, vec3 normal, float power) {
        float facing = dot(normalize(viewDirection), normalize(normal));
        return pow(1.0 - abs(facing), power);
      }
      
      // Animated scanline effect
      float scanline(vec3 position, float time, float speed, float width) {
        float line = sin(position.y * 10.0 - time * speed) * 0.5 + 0.5;
        return smoothstep(0.5 - width, 0.5, line) * smoothstep(0.5 + width, 0.5, line);
      }
      
      // Holographic shimmer
      float holographicNoise(vec3 position, float time) {
        float noise = sin(position.x * 15.0 + time) * 
                     cos(position.y * 15.0 + time * 0.7) * 
                     sin(position.z * 15.0 + time * 0.5);
        return noise * 0.5 + 0.5;
      }
      
      void main() {
        // Calculate fresnel effect (edge glow)
        float fresnelEffect = fresnel(vViewPosition, vNormal, uFresnelPower);
        
        // Animated scanlines
        float scanlineEffect = scanline(vWorldPosition, uTime, uScanlineSpeed, uScanlineWidth);
        
        // Holographic shimmer
        float shimmer = holographicNoise(vWorldPosition, uTime * 0.3);
        
        // Color mixing based on position and effects
        vec3 color = mix(uColorPrimary, uColorSecondary, fresnelEffect);
        color = mix(color, uColorSecondary * 1.5, scanlineEffect * 0.3);
        color += shimmer * 0.1;
        
        // Glow intensification at edges
        color *= (1.0 + fresnelEffect * uGlowIntensity);
        
        // Final opacity calculation
        float alpha = fresnelEffect * uOpacity;
        alpha += scanlineEffect * 0.2;
        alpha = clamp(alpha, 0.0, 1.0);
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

// ============================================================================
// 2. ENERGY FIELD SHADER
// ============================================================================

export interface EnergyFieldUniforms {
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uSpeed: { value: number };
  uIntensity: { value: number };
  uTrailLength: { value: number };
  uEmission: { value: number };
}

export function createEnergyFieldShader(theme: "dark" | "light" | "contrast"): THREE.ShaderMaterial {
  const colors = getThemeColors(theme);
  
  const uniforms: EnergyFieldUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(colors.accent) },
    uSpeed: { value: 2.0 },
    uIntensity: { value: theme === "contrast" ? 2.5 : 1.5 },
    uTrailLength: { value: 0.3 },
    uEmission: { value: theme === "contrast" ? 3.0 : 2.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
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
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uTrailLength;
      uniform float uEmission;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      // Energy pulse traveling along trail
      float energyPulse(float position, float time, float speed, float length) {
        float pulse = fract((position + time * speed));
        return smoothstep(1.0, 1.0 - length, pulse) * smoothstep(0.0, length * 0.3, pulse);
      }
      
      // Turbulent energy flow
      float energyFlow(vec2 uv, float time) {
        return sin(uv.x * 20.0 + time) * 
               cos(uv.y * 15.0 - time * 0.7) * 0.5 + 0.5;
      }
      
      void main() {
        // Energy pulse along UV
        float pulse = energyPulse(vUv.x, uTime, uSpeed, uTrailLength);
        
        // Turbulent flow
        float flow = energyFlow(vUv, uTime * 0.5);
        
        // Core energy intensity
        float coreIntensity = pulse * uIntensity;
        coreIntensity *= (1.0 + flow * 0.3);
        
        // Color with HDR emission
        vec3 color = uColor * coreIntensity * uEmission;
        
        // Soft edges
        float edgeFade = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
        
        // Final alpha
        float alpha = coreIntensity * edgeFade;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

// ============================================================================
// 3. HEXAGONAL GRID SHADER
// ============================================================================

export interface GridShaderUniforms {
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uGridScale: { value: number };
  uLineWidth: { value: number };
  uPulseSpeed: { value: number };
  uFadeDistance: { value: number };
  uNodeGlow: { value: number };
}

export function createGridShader(theme: "dark" | "light" | "contrast"): THREE.ShaderMaterial {
  const colors = getThemeColors(theme);
  
  const uniforms: GridShaderUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(colors.grid) },
    uGridScale: { value: 0.05 },
    uLineWidth: { value: theme === "contrast" ? 0.04 : 0.02 },
    uPulseSpeed: { value: 0.5 },
    uFadeDistance: { value: 800.0 },
    uNodeGlow: { value: theme === "contrast" ? 2.0 : 1.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uGridScale;
      uniform float uLineWidth;
      uniform float uPulseSpeed;
      uniform float uFadeDistance;
      uniform float uNodeGlow;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      
      // Hexagonal distance function
      float hexDist(vec2 p) {
        p = abs(p);
        float c = dot(p, normalize(vec2(1.0, 1.73)));
        c = max(c, p.x);
        return c;
      }
      
      // Hexagonal grid pattern
      vec4 hexGrid(vec2 p, float scale) {
        vec2 grid = vec2(1.0, 1.73) * scale;
        
        vec2 p1 = mod(p, grid) - grid * 0.5;
        vec2 p2 = mod(p - grid * 0.5, grid) - grid * 0.5;
        
        float d1 = hexDist(p1);
        float d2 = hexDist(p2);
        
        float dist = min(d1, d2);
        vec2 center = d1 < d2 ? p1 : p2;
        
        return vec4(center, dist, 0.0);
      }
      
      // Random function for node pulsing
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        // Create hexagonal grid
        vec2 scaledUv = vWorldPosition.xy * uGridScale;
        vec4 hex = hexGrid(scaledUv, 1.0);
        
        // Distance from camera for fade
        float distFromCenter = length(vWorldPosition.xy);
        float fade = 1.0 - smoothstep(uFadeDistance * 0.5, uFadeDistance, distFromCenter);
        
        // Hexagon edges
        float hexEdge = smoothstep(uLineWidth, 0.0, abs(hex.z - 0.5));
        
        // Pulsing nodes at hex centers
        float nodeDistance = length(hex.xy);
        float nodePulse = sin(uTime * uPulseSpeed + random(floor(scaledUv)) * 6.28) * 0.5 + 0.5;
        float node = smoothstep(0.08, 0.0, nodeDistance) * nodePulse;
        
        // Combine effects
        float intensity = max(hexEdge * 0.3, node * uNodeGlow);
        intensity *= fade;
        
        // Color with glow
        vec3 color = uColor * (1.0 + node * 2.0);
        
        gl_FragColor = vec4(color, intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

// ============================================================================
// 4. CHROMATIC ABERRATION SHADER
// ============================================================================

export interface ChromaticAberrationUniforms {
  tDiffuse: { value: THREE.Texture | null };
  uOffset: { value: THREE.Vector2 };
  uIntensity: { value: number };
}

export function createChromaticAberrationShader(): THREE.ShaderMaterial {
  const uniforms: ChromaticAberrationUniforms = {
    tDiffuse: { value: null },
    uOffset: { value: new THREE.Vector2(0.001, 0.001) },
    uIntensity: { value: 1.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 uOffset;
      uniform float uIntensity;
      
      varying vec2 vUv;
      
      void main() {
        vec2 offset = uOffset * uIntensity;
        
        // Sample RGB channels separately
        float r = texture2D(tDiffuse, vUv + offset).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - offset).b;
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `,
  });
}

// ============================================================================
// 5. DATA STREAM SHADER
// ============================================================================

export interface DataStreamUniforms {
  uTime: { value: number };
  uColor: { value: THREE.Color };
  uSpeed: { value: number };
  uDensity: { value: number };
  uGlitchFrequency: { value: number };
  uFadeTop: { value: number };
  uFadeBottom: { value: number };
}

export function createDataStreamShader(theme: "dark" | "light" | "contrast"): THREE.ShaderMaterial {
  const colors = getThemeColors(theme);
  
  const uniforms: DataStreamUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(colors.stream) },
    uSpeed: { value: 1.0 },
    uDensity: { value: 20.0 },
    uGlitchFrequency: { value: 0.1 },
    uFadeTop: { value: 0.2 },
    uFadeBottom: { value: 0.8 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
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
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uDensity;
      uniform float uGlitchFrequency;
      uniform float uFadeTop;
      uniform float uFadeBottom;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      // Random function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Character block
      float character(vec2 uv, vec2 gridPos, float time) {
        float char = random(gridPos + floor(time));
        float fallSpeed = 0.5 + random(gridPos) * 0.5;
        float y = fract(uv.y + time * fallSpeed * uSpeed);
        
        // Character appears as blocks
        float block = step(0.8, char) * step(0.1, y) * step(y, 0.9);
        
        return block;
      }
      
      // Glitch effect
      vec3 glitch(vec3 color, vec2 uv, float time, float frequency) {
        float glitchValue = random(vec2(floor(time * 10.0), floor(uv.y * 50.0)));
        
        if (glitchValue < frequency) {
          // Color shift during glitch
          return color * vec3(2.0, 0.5, 2.0);
        }
        
        return color;
      }
      
      void main() {
        // Create grid for characters
        vec2 gridUv = vUv * vec2(8.0, uDensity);
        vec2 gridPos = floor(gridUv);
        vec2 gridFract = fract(gridUv);
        
        // Generate character
        float charIntensity = character(gridFract, gridPos, uTime);
        
        // Fade at top and bottom
        float fadeTop = smoothstep(0.0, uFadeTop, vUv.y);
        float fadeBottom = smoothstep(1.0, uFadeBottom, vUv.y);
        float fade = fadeTop * fadeBottom;
        
        // Base color
        vec3 color = uColor * charIntensity;
        
        // Apply glitch effect
        color = glitch(color, vUv, uTime, uGlitchFrequency);
        
        // Trail fade
        float trail = smoothstep(0.0, 0.3, fract(vUv.y + uTime * uSpeed));
        
        float alpha = charIntensity * fade * trail;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  grid: string;
  stream: string;
}

function getThemeColors(theme: "dark" | "light" | "contrast"): ThemeColors {
  switch (theme) {
    case "light":
      return {
        primary: "#1f7eff",
        secondary: "#ec4899",
        accent: "#7c3aed",
        grid: "#0ea5e9",
        stream: "#f59e0b",
      };
    case "contrast":
      return {
        primary: "#00eaff",
        secondary: "#ff00ff",
        accent: "#ffff00",
        grid: "#00ffe0",
        stream: "#00d4ff",
      };
    default: // dark
      return {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#0ea5e9",
        grid: "#06b6d4",
        stream: "#7c3aed",
      };
  }
}

// Export helper to update shader uniforms
export function updateShaderTime(material: THREE.ShaderMaterial, time: number): void {
  if (material.uniforms.uTime) {
    material.uniforms.uTime.value = time;
  }
}

export function updateShaderColor(
  material: THREE.ShaderMaterial,
  uniformName: string,
  color: THREE.Color | string
): void {
  if (material.uniforms[uniformName]) {
    if (typeof color === "string") {
      material.uniforms[uniformName].value.set(color);
    } else {
      material.uniforms[uniformName].value.copy(color);
    }
  }
}

