/**
 * Custom WebGL Shader for Smooth Morphing Effects
 * Transforms between different states with beautiful transitions
 */

export const MorphingShader = {
  vertexShader: `
    uniform float uProgress;
    uniform float uTime;
    
    attribute vec3 aPositionBefore;
    attribute vec3 aPositionAfter;
    attribute vec3 aColorBefore;
    attribute vec3 aColorAfter;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    // Easing function for smooth transitions
    float easeInOutCubic(float t) {
      return t < 0.5 
        ? 4.0 * t * t * t 
        : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    }
    
    void main() {
      float easedProgress = easeInOutCubic(uProgress);
      
      // Morph position
      vec3 morphedPosition = mix(aPositionBefore, aPositionAfter, easedProgress);
      
      // Add wave effect during transition
      float waveIntensity = sin(easedProgress * 3.14159) * 0.3;
      morphedPosition.y += sin(uTime * 2.0 + position.x * 2.0) * waveIntensity;
      
      // Morph color
      vColor = mix(aColorBefore, aColorAfter, easedProgress);
      
      // Alpha for fade in/out effect
      vAlpha = 0.3 + easedProgress * 0.7;
      
      vec4 modelPosition = modelMatrix * vec4(morphedPosition, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      gl_PointSize = 8.0 * (1.0 / -viewPosition.z) * 100.0;
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
      
      // Soft edges
      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      alpha *= vAlpha;
      
      // Glow effect
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      vec3 finalColor = vColor + vec3(glow * 0.2);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default MorphingShader;

