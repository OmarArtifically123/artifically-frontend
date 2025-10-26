import { useEffect, useState } from "react";

export type ComplexityLevel = "low" | "medium" | "high";

interface DeviceCapabilities {
  complexityLevel: ComplexityLevel;
  supportsWebGL: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connectionSpeed?: "slow" | "medium" | "fast";
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Hook to determine device capabilities and adjust visual complexity accordingly
 * Returns the appropriate complexity level for optimal performance
 */
export function useAdaptiveComplexity(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    complexityLevel: "medium",
    supportsWebGL: false,
    isMobile: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check WebGL support
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const supportsWebGL = !!gl;

    // Check device memory (if available)
    const nav = navigator as any;
    const deviceMemory = nav.deviceMemory;
    const hardwareConcurrency = nav.hardwareConcurrency || 4;

    // Check connection speed (if available)
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    let connectionSpeed: "slow" | "medium" | "fast" = "medium";
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === "slow-2g" || effectiveType === "2g") {
        connectionSpeed = "slow";
      } else if (effectiveType === "4g") {
        connectionSpeed = "fast";
      }
    }

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Determine complexity level
    let complexityLevel: ComplexityLevel = "medium";

    if (prefersReducedMotion) {
      complexityLevel = "low";
    } else if (isMobile) {
      complexityLevel = "medium";
    } else if (!supportsWebGL || connectionSpeed === "slow") {
      complexityLevel = "low";
    } else if (
      deviceMemory && deviceMemory >= 8 &&
      hardwareConcurrency >= 8 &&
      connectionSpeed === "fast"
    ) {
      complexityLevel = "high";
    } else if (
      deviceMemory && deviceMemory >= 4 &&
      hardwareConcurrency >= 4 &&
      supportsWebGL
    ) {
      complexityLevel = "medium";
    } else {
      complexityLevel = "low";
    }

    setCapabilities({
      complexityLevel,
      supportsWebGL,
      deviceMemory,
      hardwareConcurrency,
      connectionSpeed,
      isMobile,
      prefersReducedMotion,
    });

    // Cleanup
    if (gl && "getExtension" in gl) {
      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }
    }
  }, []);

  return capabilities;
}

export default useAdaptiveComplexity;




