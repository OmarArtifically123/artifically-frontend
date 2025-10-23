/**
 * HeroShaders - Custom GLSL shaders for sophisticated visual effects
 *
 * Implements:
 * - Perlin/Simplex noise for procedural generation
 * - Curl noise for flow field generation
 * - Distance functions for geometric shapes
 * - Ray marching for volumetric effects
 * - Chromatic aberration and bloom effects
 */

/**
 * Perlin noise implementation in GLSL
 * Based on: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d9f1e6674e3b733e9
 */
export const PERLIN_NOISE = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float noise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 x12;
  x12.x = x0.x - 0.0 + C.xx;
  x12.y = x0.y - 0.0 + C.yy;
  x12 = x0.xy + C.xx ;
  x12.y = x0.y - 0.0 + C.yy;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, 0.0, 1.0 ) ) + i.x + vec3(0.0, 1.0, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 sx = sign(x);
  vec3 sh = -sign(h);
  vec3 ph = ox*sx + sh*sx;
  vec3 a0 = cross( vec3(x0.xy,0.), vec3(sh,0.) ) + vec3(0.,0.,1.)*cross(vec3(x0),vec3(sh));
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  return 130.0 * dot(m, a0);
}

float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 0.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
`;

/**
 * Curl noise for organic flow field generation
 * Creates vector field noise by computing partial derivatives of noise
 */
export const CURL_NOISE = `
vec3 curlNoise(vec3 p) {
  const float e = 0.0001;
  float n1 = noise(p.xy + e);
  float n2 = noise(p.xz + e);
  float n3 = noise(p.yz + e);

  float n4 = noise(p.xy - e);
  float n5 = noise(p.xz - e);
  float n6 = noise(p.yz - e);

  return normalize(vec3(
    n3 - n6,
    n1 - n4,
    n2 - n5
  ));
}
`;

/**
 * Signed Distance Functions (SDFs) for procedural shape generation
 */
export const DISTANCE_FUNCTIONS = `
// Sphere SDF
float sdfSphere(vec3 p, float r) {
  return length(p) - r;
}

// Box SDF
float sdfBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

// Torus SDF
float sdfTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

// Smooth minimum for blending
float smin( float a, float b, float k ) {
  float h = max( k-abs(a-b), 0.0 )/k;
  return min( a, b ) - h*h*h*k*(1.0/6.0);
}
`;

/**
 * Particle vertex shader for GPU-accelerated particles
 */
export const PARTICLE_VERTEX_SHADER = `
attribute float size;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = color;
  vAlpha = 1.0 - length(position) / 500.0;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = size * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
`;

/**
 * Particle fragment shader with sophisticated shading
 */
export const PARTICLE_FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);
  if (r > 1.0) discard;

  // Soft glow effect
  float intensity = exp(-r * 3.0) * 0.8;

  // Chromatic separation for depth perception
  vec3 color = vColor * (1.0 + r * 0.2);

  gl_FragColor = vec4(color, intensity * vAlpha * 0.7);
}
`;

/**
 * Flow field visualization shader
 */
export const FLOW_FIELD_SHADER = `
uniform float uTime;
uniform sampler2D uFlowTexture;

varying vec2 vUv;
varying float vHeight;

vec2 getFlow(vec2 uv) {
  vec3 flow = texture2D(uFlowTexture, uv).rgb;
  return (flow.xy - 0.5) * 2.0;
}

void main() {
  vec2 st = vUv;
  st += sin(st.y * 3.14159 + uTime * 0.5) * 0.05;

  vec2 flow = getFlow(st);
  float stripe = abs(sin((st.x + uTime * 0.2 + flow.x) * 10.0)) * 0.5 + 0.5;

  vec3 color = mix(
    vec3(0.06, 0.65, 0.93),
    vec3(0.49, 0.23, 0.93),
    stripe
  );

  float alpha = 1.0 - length(fract(st * 4.0) - 0.5) * 2.0;
  gl_FragColor = vec4(color, alpha * 0.3);
}
`;

/**
 * Post-processing shader for enhanced bloom
 */
export const BLOOM_SHADER = `
uniform sampler2D tDiffuse;
uniform float luminanceThreshold;

varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  float luminance = dot(texel.rgb, vec3(0.299, 0.587, 0.114));

  if (luminance < luminanceThreshold) {
    gl_FragColor = vec4(0.0);
  } else {
    gl_FragColor = texel * (luminance - luminanceThreshold);
  }
}
`;

/**
 * Ray marching shader for volumetric effects
 */
export const RAY_MARCH_SHADER = `
uniform vec3 uCameraPos;
uniform float uTime;

const int MAX_STEPS = 64;
const float MAX_DIST = 100.0;
const float SURF_DIST = 0.01;

float getDist(vec3 p) {
  // Procedural noise-based distance field
  float d = length(p) - 50.0;
  float noise = sin(p.x * 0.1 + uTime) * sin(p.y * 0.1) * sin(p.z * 0.1);
  return d + noise * 10.0;
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = getDist(p);
    dO += dS;
    if (dO > MAX_DIST || dS < SURF_DIST) break;
  }
  return dO;
}

vec3 getNormal(vec3 p) {
  const float e = 0.01;
  float d = getDist(p);
  vec3 n = d - vec3(
    getDist(p - vec3(e, 0.0, 0.0)),
    getDist(p - vec3(0.0, e, 0.0)),
    getDist(p - vec3(0.0, 0.0, e))
  );
  return normalize(n);
}

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(1920.0, 1080.0);
  vec3 ro = vec3(0.0, 0.0, 0.0);
  vec3 rd = normalize(vec3(uv - 0.5, 1.0));

  float d = rayMarch(ro, rd);
  vec3 p = ro + rd * d;

  vec3 n = getNormal(p);
  vec3 color = vec3(0.0);

  if (d < MAX_DIST) {
    vec3 lightPos = vec3(sin(uTime) * 100.0, 50.0, cos(uTime) * 100.0);
    vec3 lightDir = normalize(lightPos - p);
    color = mix(
      vec3(0.06, 0.65, 0.93),
      vec3(0.49, 0.23, 0.93),
      dot(n, lightDir) * 0.5 + 0.5
    );
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

// Helper functions for shader creation
export function createPerlinNoiseShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      ${PERLIN_NOISE}
      void main() {
        float n = fbm(vUv * 3.0 + uTime * 0.1);
        gl_FragColor = vec4(vec3(n), 1.0);
      }
    `,
  };
}

export function createFlowFieldShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      ${PERLIN_NOISE}
      void main() {
        vec2 st = vUv;
        float n = fbm(st + uTime * 0.2);
        vec3 color = mix(
          vec3(0.06, 0.65, 0.93),
          vec3(0.49, 0.23, 0.93),
          n
        );
        gl_FragColor = vec4(color, 0.5);
      }
    `,
  };
}

export function createCurlNoiseShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
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
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPosition;
      ${PERLIN_NOISE}
      ${CURL_NOISE}
      void main() {
        vec3 p = vec3(vPosition.xy, uTime * 0.1);
        vec3 curl = curlNoise(p);
        vec3 color = normalize(curl) * 0.5 + 0.5;
        gl_FragColor = vec4(color, 0.6);
      }
    `,
  };
}

export function createNoiseShader() {
  return createPerlinNoiseShader();
}
