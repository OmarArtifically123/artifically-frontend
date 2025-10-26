/**
 * Custom WebGL Shader for Node Glow Effect
 * Creates pulsing glow for active nodes
 */

export const NodeGlowShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vGlowIntensity;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Pulsing glow intensity
      vGlowIntensity = uIntensity * (0.8 + sin(uTime * 2.0) * 0.2);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vGlowIntensity;
    
    void main() {
      // Fresnel effect for edge glow
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
      
      // Pulsing color
      vec3 glowColor = uColor * (1.0 + sin(uTime * 3.0) * 0.3);
      
      // Combine fresnel and intensity
      float alpha = fresnel * vGlowIntensity;
      
      gl_FragColor = vec4(glowColor, alpha);
    }
  `,
};

export default NodeGlowShader;




