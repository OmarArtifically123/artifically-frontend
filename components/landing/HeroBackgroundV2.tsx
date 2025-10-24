"use client";

import React, { Suspense, useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import useInViewState from "../../hooks/useInViewState";
import HeroGradientOverlay from "./HeroGradientOverlay";

// Dynamically import the 3D scene to prevent hydration issues
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

interface HeroBackgroundV2Props {
  variant?: "default" | "minimal";
  className?: string;
}

/**
 * Check if WebGL is available in the browser
 */
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Error fallback component for Canvas failures
 */
function CanvasErrorFallback({ error }: { error: Error }) {
  console.error("[HeroBackground] Canvas failed to render:", error);
  return null; // Gracefully degrade to just the gradient overlay
}

/**
 * HeroBackgroundV2 - World-class AI automation marketplace background
 *
 * Architecture:
 * - React Three Fiber for declarative 3D/WebGL rendering
 * - PerformanceMonitor for real-time FPS adaptation
 * - WebGPU detection with WebGL fallback
 * - Aurora-style CSS gradient overlays
 * - GPU-accelerated particle systems with curl noise
 * - Custom shaders for sophisticated visual effects
 * - Lerp-based mouse tracking
 * - Accessibility-first (prefers-reduced-motion support)
 *
 * Performance targets:
 * - 60fps on desktop with discrete GPU
 * - 30-45fps on integrated graphics/mobile
 * - LCP < 2.5s
 * - CLS < 0.1
 */
function HeroBackgroundInner({
  variant = "default",
  onPerformanceDegrade,
}: {
  variant?: "default" | "minimal";
  onPerformanceDegrade?: (quality: number) => void;
}) {
  const [particleCount, setParticleCount] = useState(300);
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);
  const [dpr, setDpr] = useState(1);

  // Adapt quality based on FPS
  const handlePerformanceMonitor = useCallback(
    (api: { fps: number; refreshrate: number; factor: number }) => {
      // Dynamic quality adaptation
      if (api.fps < 30) {
        // Critical: fall back to static
        if (onPerformanceDegrade) onPerformanceDegrade(0);
        setParticleCount(50);
        setEnablePostProcessing(false);
        setDpr(0.5);
      } else if (api.fps < 45) {
        // Low: reduce quality
        if (onPerformanceDegrade) onPerformanceDegrade(0.5);
        setParticleCount(150);
        setEnablePostProcessing(false);
        setDpr(0.75);
      } else if (api.fps < 55) {
        // Medium: moderate quality
        if (onPerformanceDegrade) onPerformanceDegrade(0.75);
        setParticleCount(200);
        setEnablePostProcessing(true);
        setDpr(1);
      } else {
        // High: full quality
        if (onPerformanceDegrade) onPerformanceDegrade(1);
        setParticleCount(300);
        setEnablePostProcessing(true);
        setDpr(1);
      }
    },
    [onPerformanceDegrade]
  );

  return (
    <PerformanceMonitor onDecline={handlePerformanceMonitor}>
      <HeroScene
        variant={variant}
        particleCount={particleCount}
        enablePostProcessing={enablePostProcessing}
        dpr={dpr}
      />
      <Preload all />
    </PerformanceMonitor>
  );
}

export default function HeroBackgroundV2({
  variant = "default",
  className = "",
}: HeroBackgroundV2Props) {
  const prefersReducedMotion = useReducedMotion();
  const [containerRef, isInViewport] = useInViewState({
    threshold: 0.1,
    rootMargin: "100px",
    once: false,
    initialInView: true,
  });
  const isDocumentVisible = useDocumentVisibility();
  const [showCanvas, setShowCanvas] = useState(false);
  const [quality, setQuality] = useState(1);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const staticContainerRef = useRef<HTMLDivElement>(null);
  const hasLoggedMount = useRef(false);

  // Check WebGL support on mount
  useEffect(() => {
    const hasWebGL = checkWebGLSupport();
    setWebGLSupported(hasWebGL);

    if (!hasWebGL) {
      console.warn("[HeroBackground] WebGL not supported, falling back to gradient only");
    } else {
      console.log("[HeroBackground] WebGL supported, initializing Canvas");
    }
  }, []);

  // Only show canvas when in viewport and document is visible
  useEffect(() => {
    if (isInViewport && isDocumentVisible && webGLSupported) {
      if (!hasLoggedMount.current) {
        console.log("[HeroBackground] Canvas conditions met - isInViewport:", isInViewport, "isDocumentVisible:", isDocumentVisible, "webGLSupported:", webGLSupported);
        hasLoggedMount.current = true;
      }
      setShowCanvas(true);
    }
  }, [isInViewport, isDocumentVisible, webGLSupported]);

  // Fallback for reduced motion or low-end devices
  if (prefersReducedMotion) {
    return (
      <div
        ref={staticContainerRef}
        className={`hero-background hero-background--static ${className}`}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          minHeight: "max(100%, 100dvh)",
          zIndex: 0,
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><radialGradient id="grad1" cx="30%" cy="20%"><stop offset="0%" style="stop-color:%230a1628;stop-opacity:1" /><stop offset="100%" style="stop-color:%230f172f;stop-opacity:1" /></radialGradient><radialGradient id="grad2" cx="70%" cy="80%"><stop offset="0%" style="stop-color:%237c3aed;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%230a1628;stop-opacity:0" /></radialGradient></defs><rect width="1200" height="900" fill="url(%23grad1)"/><circle cx="360" cy="180" r="400" fill="url(%23grad2)" opacity="0.5"/><circle cx="900" cy="700" r="350" fill="url(%23grad2)" opacity="0.3"/></svg>')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`hero-background hero-background--v2 ${className}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        minHeight: "max(100%, 100dvh)",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Aurora-style CSS gradient mesh overlay */}
      <HeroGradientOverlay quality={quality} />

      {/* WebGL canvas - only render when in viewport and WebGL is supported */}
      {showCanvas && (
        <ErrorBoundary
          FallbackComponent={CanvasErrorFallback}
          onError={(error, errorInfo) => {
            console.error("[HeroBackground] ErrorBoundary caught error:", error, errorInfo);
          }}
        >
          <Suspense fallback={null}>
            <Canvas
              onCreated={(state) => {
                console.log("[HeroBackground] Canvas created successfully", state);
              }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
                precision: "highp",
                stencil: false,
                depth: true,
              }}
              camera={{
                position: [0, 0, 100],
                far: 10000,
                near: 0.1,
                fov: 75,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 2, // Above gradient overlay (zIndex: 1)
              }}
            >
              <HeroBackgroundInner
                variant={variant}
                onPerformanceDegrade={setQuality}
              />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
