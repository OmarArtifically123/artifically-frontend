/**
 * Custom WebGL Shader for Data Flow Animation
 * Creates flowing particle effects along connections
 */

export const DataFlowShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uStartPosition;
    uniform vec3 uEndPosition;
    
    attribute float aProgress;
    attribute float aSize;
    attribute float aDelay;
    
    varying float vAlpha;
    varying vec3 vColor;
    
    void main() {
      // Calculate position along the path with delay
      float adjustedProgress = mod((aProgress + uTime * uSpeed + aDelay), 1.0);
      
      // Interpolate between start and end
      vec3 pos = mix(uStartPosition, uEndPosition, adjustedProgress);
      
      // Add slight wave motion
      float wave = sin(adjustedProgress * 6.28318 + uTime * 2.0) * 0.05;
      pos.y += wave;
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Size with perspective
      gl_PointSize = aSize * (1.0 / -viewPosition.z) * 100.0;
      
      // Alpha based on progress (fade in/out at ends)
      float fadeIn = smoothstep(0.0, 0.1, adjustedProgress);
      float fadeOut = smoothstep(1.0, 0.9, adjustedProgress);
      vAlpha = fadeIn * fadeOut;
      
      // Color gradient along path
      vec3 startColor = vec3(0.0, 0.8, 1.0); // Cyan
      vec3 endColor = vec3(0.6, 0.2, 1.0);   // Purple
      vColor = mix(startColor, endColor, adjustedProgress);
    }
  `,

  fragmentShader: `
    varying float vAlpha;
    varying vec3 vColor;
    
    void main() {
      // Circular particles
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) {
        discard;
      }
      
      // Soft edge with glow
      float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
      alpha *= vAlpha;
      
      // Add glow effect
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      vec3 finalColor = vColor + vec3(glow * 0.5);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default DataFlowShader;





