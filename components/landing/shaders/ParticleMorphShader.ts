/**
 * Custom WebGL Shader for Particle Morphing Effect
 * Morphs particles from chaos (scattered) to order (structured)
 */

export const ParticleMorphShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    uniform float uSize;
    uniform vec3 uChaosPosition;
    uniform vec3 uOrderPosition;
    
    attribute float aScale;
    attribute vec3 aRandomPosition;
    attribute vec3 aTargetPosition;
    attribute float aAnimationDelay;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    // Easing function
    float easeInOutCubic(float t) {
      return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    }
    
    void main() {
      // Calculate adjusted progress with delay
      float adjustedProgress = clamp((uProgress - aAnimationDelay) / (1.0 - aAnimationDelay), 0.0, 1.0);
      float easedProgress = easeInOutCubic(adjustedProgress);
      
      // Interpolate between chaos and order positions
      vec3 morphedPosition = mix(aRandomPosition, aTargetPosition, easedProgress);
      
      // Add subtle wave motion
      float wave = sin(uTime * 2.0 + position.x * 0.5) * 0.1 * (1.0 - easedProgress);
      morphedPosition.y += wave;
      
      // Calculate final position
      vec4 modelPosition = modelMatrix * vec4(morphedPosition, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Size with depth attenuation
      float depthFactor = 1.0 / -viewPosition.z;
      gl_PointSize = uSize * aScale * depthFactor * 100.0;
      
      // Color gradient based on progress
      vec3 chaosColor = vec3(0.8, 0.2, 0.2); // Red for chaos
      vec3 orderColor = vec3(0.2, 0.6, 1.0); // Blue for order
      vColor = mix(chaosColor, orderColor, easedProgress);
      
      // Alpha based on progress and distance
      vAlpha = 0.6 + easedProgress * 0.4;
    }
  `,

  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      // Create circular particles
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
      vec3 finalColor = vColor + vec3(glow * 0.3);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default ParticleMorphShader;




