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
import HeroPerformanceFallback, { HeroStaticFallback } from "./HeroPerformanceFallback";
import { useTheme } from "../../context/ThemeContext";

// Dynamically import the 3D scene to prevent hydration issues - LAZY LOADED
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

interface HeroBackgroundV2Props {
  variant?: "default" | "minimal";
  className?: string;
  debug?: boolean;
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
 * Detect device tier for performance optimization
 */
function detectDeviceTier(): "high" | "medium" | "low" {
  if (typeof window === "undefined") return "medium";

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    return memory >= 6 && cores >= 6 ? "medium" : "low";
  }

  if (cores >= 8 && memory >= 8) {
    return "high";
  } else if (cores >= 4 && memory >= 4) {
    return "medium";
  } else {
    return "low";
  }
}

/**
 * Error fallback component for Canvas failures with retry
 */
function CanvasErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  console.error("[HeroBackground] Canvas failed to render:", error);
  
  useEffect(() => {
    // Auto-retry once after 2 seconds
    const timeout = setTimeout(() => {
      console.log("[HeroBackground] Attempting to recover from error");
      resetErrorBoundary();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [resetErrorBoundary]);

  return null; // Gracefully degrade to just the gradient overlay
}

/**
 * Loading shimmer while 3D scene initializes
 */
function LoadingShimmer({ theme }: { theme: string }) {
  const shimmerColor = useMemo(() => {
    switch (theme) {
      case "light":
        return "rgba(31, 126, 255, 0.1)";
      case "contrast":
        return "rgba(0, 234, 255, 0.2)";
      default:
        return "rgba(59, 130, 246, 0.1)";
    }
  }, [theme]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite",
        pointerEvents: "none",
      }}
    >
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
}

/**
 * HeroBackgroundV2 - ENHANCED World-class background system
 * 
 * NEW FEATURES:
 * - Performance tier detection on mount
 * - Lazy loading for 3D (100ms delay)
 * - Loading shimmer during initialization
 * - Error boundaries with retry logic
 * - Quality control props
 * - Debug mode (show FPS, particle count, draw calls)
 * - Better WebGL support detection
 * - Graceful fallback chain: 3D → 2D Canvas → Gradient Only
 */
function HeroBackgroundInner({
  variant = "default",
  onPerformanceDegrade,
  theme,
  debug = false,
}: {
  variant?: "default" | "minimal";
  onPerformanceDegrade?: (quality: number) => void;
  theme: string;
  debug?: boolean;
}) {
  const [particleCount, setParticleCount] = useState(500);
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);
  const [dpr, setDpr] = useState(1);
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);

  // Adapt quality based on FPS - MORE AGGRESSIVE
  const handlePerformanceMonitor = useCallback(
    (api: { fps: number; refreshrate: number; factor: number }) => {
      setFps(Math.round(api.fps));

      // Dynamic quality adaptation
      if (api.fps < 25) {
        // Critical: fall back to 2D
        if (onPerformanceDegrade) onPerformanceDegrade(0);
        setParticleCount(50);
        setEnablePostProcessing(false);
        setDpr(0.5);
      } else if (api.fps < 35) {
        // Low: minimal 3D
        if (onPerformanceDegrade) onPerformanceDegrade(0.3);
        setParticleCount(150);
        setEnablePostProcessing(false);
        setDpr(0.75);
      } else if (api.fps < 45) {
        // Medium: reduced quality
        if (onPerformanceDegrade) onPerformanceDegrade(0.6);
        setParticleCount(300);
        setEnablePostProcessing(false);
        setDpr(0.85);
      } else if (api.fps < 55) {
        // High: good quality
        if (onPerformanceDegrade) onPerformanceDegrade(0.85);
        setParticleCount(400);
        setEnablePostProcessing(true);
        setDpr(1);
      } else {
        // Ultra: full quality
        if (onPerformanceDegrade) onPerformanceDegrade(1);
        setParticleCount(500);
        setEnablePostProcessing(true);
        setDpr(1);
      }
    },
    [onPerformanceDegrade]
  );

  return (
    <>
      <PerformanceMonitor onDecline={handlePerformanceMonitor} onIncline={handlePerformanceMonitor}>
        <HeroScene
          variant={variant}
          particleCount={particleCount}
          enablePostProcessing={enablePostProcessing}
          dpr={dpr}
          theme={theme}
        />
        <Preload all />
      </PerformanceMonitor>

      {/* Debug overlay */}
      {debug && (
        <div
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.8)",
            color: "#0f0",
            padding: "10px",
            fontFamily: "monospace",
            fontSize: "12px",
            zIndex: 9999,
            borderRadius: "4px",
            pointerEvents: "none",
          }}
        >
          <div>FPS: {fps}</div>
          <div>Particles: {particleCount}</div>
          <div>DPR: {dpr.toFixed(2)}</div>
          <div>Post-FX: {enablePostProcessing ? "ON" : "OFF"}</div>
          <div>Draw Calls: {drawCalls}</div>
        </div>
      )}
    </>
  );
}

export default function HeroBackgroundV2({
  variant = "default",
  className = "",
  debug = false,
}: HeroBackgroundV2Props) {
  const { theme } = useTheme();
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
  const [deviceTier, setDeviceTier] = useState<"high" | "medium" | "low">("medium");
  const [isLoading, setIsLoading] = useState(true);
  const staticContainerRef = useRef<HTMLDivElement>(null);
  const hasLoggedMount = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 2;

  // Check WebGL support and device tier on mount
  useEffect(() => {
    const hasWebGL = checkWebGLSupport();
    const tier = detectDeviceTier();
    
    setWebGLSupported(hasWebGL);
    setDeviceTier(tier);

    if (!hasWebGL) {
      console.warn("[HeroBackground] WebGL not supported, falling back to 2D Canvas");
    } else {
      console.log("[HeroBackground] WebGL supported, device tier:", tier);
    }
  }, []);

  // Lazy load 3D scene with 100ms delay
  useEffect(() => {
    if (!isInViewport || !isDocumentVisible || !webGLSupported || prefersReducedMotion) {
      return;
    }

    // Delay initialization by 100ms to improve initial load
    const timer = setTimeout(() => {
      if (!hasLoggedMount.current) {
        console.log("[HeroBackground] Initializing 3D scene - viewport:", isInViewport, "visible:", isDocumentVisible);
        hasLoggedMount.current = true;
      }
      setShowCanvas(true);
      
      // Remove loading shimmer after 500ms
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 100);

    return () => clearTimeout(timer);
  }, [isInViewport, isDocumentVisible, webGLSupported, prefersReducedMotion]);

  // Handle error boundary reset
  const handleReset = useCallback(() => {
    retryCount.current += 1;
    
    if (retryCount.current >= maxRetries) {
      console.warn("[HeroBackground] Max retries reached, falling back to 2D");
      setWebGLSupported(false);
    } else {
      console.log(`[HeroBackground] Retry attempt ${retryCount.current}/${maxRetries}`);
      setShowCanvas(false);
      setTimeout(() => setShowCanvas(true), 1000);
    }
  }, []);

  // Fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        ref={staticContainerRef}
        className={`hero-background hero-background--static ${className}`}
        aria-hidden="true"
      >
        <HeroStaticFallback />
      </div>
    );
  }

  // Fallback for low-end devices or WebGL not supported
  if (!webGLSupported || deviceTier === "low") {
    return (
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={`hero-background hero-background--fallback ${className}`}
        aria-hidden="true"
      >
        <HeroGradientOverlay quality={quality} theme={theme} />
        <HeroPerformanceFallback particleCount={50} enableConnections={deviceTier !== "low"} />
      </div>
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
      <HeroGradientOverlay quality={quality} theme={theme} />

      {/* Loading shimmer */}
      {isLoading && showCanvas && <LoadingShimmer theme={theme} />}

      {/* WebGL canvas - only render when in viewport and WebGL is supported */}
      {showCanvas && (
        <ErrorBoundary
          FallbackComponent={(props) => <CanvasErrorFallback {...props} resetErrorBoundary={handleReset} />}
          onError={(error, errorInfo) => {
            console.error("[HeroBackground] ErrorBoundary caught error:", error, errorInfo);
          }}
          onReset={handleReset}
        >
          <Suspense fallback={<LoadingShimmer theme={theme} />}>
            <Canvas
              onCreated={(state) => {
                console.log("[HeroBackground] Canvas created successfully");
                if (debug) {
                  console.log("[HeroBackground] Renderer info:", state.gl.info);
                }
              }}
              dpr={deviceTier === "high" ? [1, 2] : 1}
              gl={{
                antialias: deviceTier !== "low",
                alpha: true,
                powerPreference: deviceTier === "high" ? "high-performance" : "default",
                precision: deviceTier === "high" ? "highp" : "mediump",
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
                theme={theme}
                debug={debug}
              />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
