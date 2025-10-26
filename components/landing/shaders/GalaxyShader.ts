/**
 * Custom WebGL Shader for Galaxy Particle System
 * Creates a stunning particle galaxy effect for integrations
 */

export const GalaxyShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aRandomness;
    attribute float aOrbitSpeed;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      // Apply orbital rotation
      float angle = uTime * aOrbitSpeed;
      float radius = length(position.xy);
      
      vec3 pos = position;
      pos.x = cos(angle) * radius + aRandomness.x * 0.5;
      pos.y = sin(angle) * radius + aRandomness.y * 0.5;
      pos.z = position.z + sin(uTime + aRandomness.z * 10.0) * 0.2;
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Size with perspective
      gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z) * 100.0;
      
      // Color based on distance from center
      float distanceFromCenter = length(position.xy);
      vec3 innerColor = vec3(0.0, 0.8, 1.0); // Cyan
      vec3 outerColor = vec3(0.6, 0.2, 1.0); // Purple
      vColor = mix(innerColor, outerColor, distanceFromCenter / 10.0);
      
      // Alpha based on distance
      vAlpha = 1.0 - (distanceFromCenter / 12.0);
    }
  `,

  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      // Circular particles
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) {
        discard;
      }
      
      // Soft edges with glow
      float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
      alpha *= vAlpha;
      
      // Add glow
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      vec3 finalColor = vColor + vec3(glow * 0.4);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default GalaxyShader;




