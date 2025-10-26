/**
 * WebGL Detection and Capability Testing
 */

export interface WebGLCapabilities {
  supported: boolean;
  version: 1 | 2 | null;
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxVertexAttributes: number;
  extensions: string[];
}

/**
 * Detect WebGL support and capabilities
 */
export function detectWebGLCapabilities(): WebGLCapabilities {
  const result: WebGLCapabilities = {
    supported: false,
    version: null,
    renderer: "Unknown",
    vendor: "Unknown",
    maxTextureSize: 0,
    maxVertexAttributes: 0,
    extensions: [],
  };

  if (typeof window === "undefined") {
    return result;
  }

  const canvas = document.createElement("canvas");
  
  // Try WebGL 2 first
  let gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
  
  if (gl) {
    result.supported = true;
    result.version = 2;
  } else {
    // Fall back to WebGL 1
    gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    
    if (gl) {
      result.supported = true;
      result.version = 1;
    }
  }

  if (gl) {
    // Get renderer info
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      result.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Unknown";
      result.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Unknown";
    }

    // Get capabilities
    result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    result.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 0;
    
    // Get extensions
    result.extensions = gl.getSupportedExtensions() || [];

    // Lose context to free resources
    const loseContext = gl.getExtension("WEBGL_lose_context");
    if (loseContext) {
      loseContext.loseContext();
    }
  }

  return result;
}

/**
 * Check if device can handle high-quality WebGL
 */
export function canHandleHighQualityWebGL(): boolean {
  const capabilities = detectWebGLCapabilities();
  
  return (
    capabilities.supported &&
    capabilities.maxTextureSize >= 4096 &&
    capabilities.maxVertexAttributes >= 16 &&
    !capabilities.renderer.toLowerCase().includes("swiftshader") // Software renderer
  );
}

/**
 * Get recommended quality level based on WebGL capabilities
 */
export function getRecommendedQuality(): "low" | "medium" | "high" {
  if (!detectWebGLCapabilities().supported) {
    return "low";
  }

  if (canHandleHighQualityWebGL()) {
    return "high";
  }

  return "medium";
}

const webglDetector = {
  detectWebGLCapabilities,
  canHandleHighQualityWebGL,
  getRecommendedQuality,
};

export default webglDetector;




