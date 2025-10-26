/**
 * Custom WebGL Shader for Holographic Security Shield Effect
 * Creates a futuristic, scanning hologram effect
 */

export const HolographicEnhancement = {
  vertexShader: `
    uniform float uTime;
    uniform float uIntensity;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;
      
      // Add slight wave distortion
      vec3 pos = position;
      float wave = sin(position.y * 5.0 + uTime * 2.0) * 0.02;
      pos.x += wave;
      pos.z += wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
      // Fresnel effect for edge glow
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
      
      // Scanning lines
      float scan = sin(vPosition.y * 20.0 - uTime * 3.0) * 0.5 + 0.5;
      scan = pow(scan, 3.0);
      
      // Grid pattern
      float gridX = abs(sin(vPosition.x * 30.0));
      float gridY = abs(sin(vPosition.y * 30.0));
      float grid = step(0.95, max(gridX, gridY)) * 0.3;
      
      // Hexagon pattern
      float hexPattern = abs(sin(vPosition.x * 10.0 + vPosition.y * 10.0));
      hexPattern = step(0.9, hexPattern) * 0.2;
      
      // Combine effects
      float finalAlpha = (fresnel * 0.6 + scan * 0.3 + grid + hexPattern) * uIntensity;
      
      // Color with pulsing
      vec3 color = uColor * (1.0 + sin(uTime * 2.0) * 0.2);
      
      gl_FragColor = vec4(color, finalAlpha);
    }
  `,
};

export default HolographicEnhancement;

