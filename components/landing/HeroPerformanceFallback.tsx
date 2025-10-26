"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";

interface HeroPerformanceFallbackProps {
  className?: string;
  particleCount?: number;
  enableConnections?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Connection {
  from: number;
  to: number;
  distance: number;
}

/**
 * HeroPerformanceFallback - 2D Canvas fallback for low-end devices
 * 
 * Features:
 * - Canvas 2D API (no WebGL required)
 * - Simple 50-particle system
 * - Basic particle connections
 * - No 3D shapes or post-processing
 * - 30 FPS target for battery savings
 * - Full prefers-reduced-motion support
 * - Theme-aware colors
 * - Minimal resource usage
 */
export default function HeroPerformanceFallback({
  className = "",
  particleCount = 50,
  enableConnections = true,
}: HeroPerformanceFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Theme-specific colors
  const getThemeColors = useCallback(() => {
    switch (theme) {
      case "light":
        return {
          particles: ["#1f7eff", "#ec4899", "#f59e0b", "#7c3aed", "#10b981", "#0ea5e9"],
          connections: "rgba(124, 58, 237, 0.4)",
          background: "transparent",
        };
      case "contrast":
        return {
          particles: ["#00eaff", "#ff00ff", "#ffff00", "#00ffe0", "#ff00aa", "#00d4ff"],
          connections: "rgba(255, 255, 0, 0.8)",
          background: "transparent",
        };
      default:
        return {
          particles: ["#3b82f6", "#8b5cf6", "#0ea5e9", "#7c3aed", "#06b6d4", "#4f46e5"],
          connections: "rgba(59, 130, 246, 0.3)",
          background: "transparent",
        };
    }
  }, [theme]);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const colors = getThemeColors();
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1 + Math.random() * 2,
        color: colors.particles[i % colors.particles.length],
      });
    }

    return particles;
  }, [particleCount, getThemeColors]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Initialize canvas and particles
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    particlesRef.current = initParticles(dimensions.width, dimensions.height);
  }, [dimensions, initParticles]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = getThemeColors();
    const FPS_TARGET = 30;
    const FRAME_INTERVAL = 1000 / FPS_TARGET;
    const CONNECTION_DISTANCE = 120;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime.current;

      // Throttle to ~30 FPS
      if (elapsed < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime.current = now - (elapsed % FRAME_INTERVAL);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 150 * 0.02;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
          }
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, particle.color + "80");
        gradient.addColorStop(1, particle.color + "00");
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw connections
      if (enableConnections) {
        const connections: Connection[] = [];

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
              connections.push({ from: i, to: j, distance });
            }

            // Limit connections for performance
            if (connections.length >= 100) break;
          }
          if (connections.length >= 100) break;
        }

        // Draw connection lines
        connections.forEach(({ from, to, distance }) => {
          const opacity = 1 - distance / CONNECTION_DISTANCE;
          ctx.beginPath();
          ctx.moveTo(particles[from].x, particles[from].y);
          ctx.lineTo(particles[to].x, particles[to].y);
          ctx.strokeStyle = colors.connections.replace(/[\d.]+\)$/g, `${opacity * 0.4})`);
          ctx.lineWidth = theme === "contrast" ? 2 : 1;
          ctx.stroke();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, enableConnections, getThemeColors, theme]);

  return (
    <div
      ref={containerRef}
      className={`hero-performance-fallback ${className}`}
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
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}

/**
 * Ultra-minimal fallback for prefers-reduced-motion
 */
export function HeroStaticFallback({ className = "" }: { className?: string }) {
  const { theme } = useTheme();

  const getGradient = useCallback(() => {
    switch (theme) {
      case "light":
        return "radial-gradient(ellipse at 30% 20%, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)";
      case "contrast":
        return "radial-gradient(ellipse at 30% 20%, #000000 0%, #000000 50%, #000000 100%)";
      default:
        return "radial-gradient(ellipse at 30% 20%, #0a1628 0%, #0f172f 50%, #1a1b3f 100%)";
    }
  }, [theme]);

  return (
    <div
      className={`hero-static-fallback ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        minHeight: "max(100%, 100dvh)",
        zIndex: 0,
        background: getGradient(),
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * Animated gradient fallback (CSS only, no canvas)
 */
export function HeroGradientFallback({ className = "" }: { className?: string }) {
  const { theme } = useTheme();

  const getAnimatedStyle = useCallback((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      minHeight: "max(100%, 100dvh)",
      zIndex: 0,
      pointerEvents: "none",
      backgroundSize: "400% 400%",
      animation: "heroGradientShift 15s ease infinite",
    };

    switch (theme) {
      case "light":
        return {
          ...baseStyle,
          background: "linear-gradient(-45deg, #e0f2fe, #f0f9ff, #ddd6fe, #fce7f3)",
        };
      case "contrast":
        return {
          ...baseStyle,
          background: "linear-gradient(-45deg, #000000, #001a1a, #1a0033, #000000)",
        };
      default:
        return {
          ...baseStyle,
          background: "linear-gradient(-45deg, #0a1628, #1a1b3f, #2d1b69, #0f172f)",
        };
    }
  }, [theme]);

  return (
    <>
      <style>
        {`
          @keyframes heroGradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div className={`hero-gradient-fallback ${className}`} style={getAnimatedStyle()} />
    </>
  );
}

