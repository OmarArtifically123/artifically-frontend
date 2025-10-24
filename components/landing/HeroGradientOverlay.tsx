"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HeroGradientOverlayProps {
  quality?: number; // 0-1, higher = more visual detail
  theme?: string;
}

/**
 * HeroGradientOverlay - Aurora-style CSS gradient mesh
 *
 * Creates sophisticated procedural gradients using:
 * - Multiple radial gradients for organic color fields
 * - Heavy blur (80-120px) for smooth transitions
 * - Sophisticated color palette (purples, blues, teals)
 * - Responsive to quality settings for performance
 * - Glassmorphism-compatible layering
 *
 * This runs independently of WebGL for better performance and accessibility
 */
export default function HeroGradientOverlay({ quality = 1, theme = "dark" }: HeroGradientOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Theme-aware gradient definitions
  const gradients = useMemo(() => {
    if (theme === "light") {
      return [
        {
          position: "30% 20%",
          colors: ["#0ea5e9", "#f8f9ff"], // Electric blue to light bg
          blur: 120,
          opacity: 0.4,
        },
        {
          position: "70% 80%",
          colors: ["#7c3aed", "#f8f9ff"], // Violet to light bg
          blur: 100,
          opacity: 0.3,
        },
        {
          position: "50% 50%",
          colors: ["#06b6d4", "#f8f9ff"], // Cyan to light bg
          blur: 90,
          opacity: 0.25,
        },
        {
          position: "15% 70%",
          colors: ["#f59e0b", "#f8f9ff"], // Gold to light bg
          blur: 110,
          opacity: 0.2,
        },
        {
          position: "85% 30%",
          colors: ["#ec4899", "#f8f9ff"], // Rose to light bg
          blur: 100,
          opacity: 0.15,
        },
      ];
    } else if (theme === "contrast") {
      return [
        {
          position: "30% 20%",
          colors: ["#00d4ff", "#000000"], // Cyan to black
          blur: 120,
          opacity: 0.8,
        },
        {
          position: "70% 80%",
          colors: ["#00ffe0", "#000000"], // Teal to black
          blur: 100,
          opacity: 0.6,
        },
        {
          position: "50% 50%",
          colors: ["#ff00ff", "#000000"], // Magenta to black
          blur: 90,
          opacity: 0.5,
        },
        {
          position: "15% 70%",
          colors: ["#ffff00", "#000000"], // Yellow to black
          blur: 110,
          opacity: 0.4,
        },
        {
          position: "85% 30%",
          colors: ["#00eaff", "#000000"], // Electric cyan to black
          blur: 100,
          opacity: 0.3,
        },
      ];
    } else {
      // Dark theme (default)
      return [
        {
          position: "30% 20%",
          colors: ["#0ea5e9", "#0a1628"], // Electric blue to deep blue
          blur: 120,
          opacity: 0.6,
        },
        {
          position: "70% 80%",
          colors: ["#7c3aed", "#0a1628"], // Violet to deep blue
          blur: 100,
          opacity: 0.4,
        },
        {
          position: "50% 50%",
          colors: ["#06b6d4", "#0a1628"], // Cyan to deep blue
          blur: 90,
          opacity: 0.3,
        },
        {
          position: "15% 70%",
          colors: ["#f59e0b", "#0a1628"], // Gold to deep blue
          blur: 110,
          opacity: 0.25,
        },
        {
          position: "85% 30%",
          colors: ["#f43f5e", "#0a1628"], // Rose to deep blue
          blur: 100,
          opacity: 0.2,
        },
      ];
    }
  }, [theme]);

  // Animate gradient positions subtly over time
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let time = 0;
    const animate = () => {
      time += 0.0005;

      const dynamicGradients = gradients.map((gradient, index) => {
        // Compute new position based on time
        const basePos = gradient.position.split(" ");
        const x = parseFloat(basePos[0]);
        const y = parseFloat(basePos[1]);

        // Sine wave animation for organic movement
        const offsetX = Math.sin(time + index * 1.57) * 15; // Move 15% max
        const offsetY = Math.cos(time * 0.7 + index * 2.09) * 15;

        const newX = Math.max(10, Math.min(90, x + offsetX));
        const newY = Math.max(10, Math.min(90, y + offsetY));

        return {
          ...gradient,
          position: `${newX}% ${newY}%`,
        };
      });

      // Update background with new gradient positions
      const backgroundStyle = dynamicGradients
        .map(
          (gradient, index) =>
            `radial-gradient(ellipse ${800 - index * 100}px at ${gradient.position},
           rgba(${hexToRgb(gradient.colors[0]).join(",")}, ${gradient.opacity}) 0%,
           rgba(${hexToRgb(gradient.colors[1]).join(",")}, 0) 100%)`
        )
        .join(", ");

      const blurStyle = `blur(${Math.round(
        quality * 100 + (1 - quality) * 60
      )}px)`;

      container.style.backgroundImage = backgroundStyle;
      container.style.filter = blurStyle;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gradients, quality]);

  return (
    <motion.div
      ref={containerRef}
      className="hero-gradient-overlay"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        willChange: "filter, background-image",
        // Disable backdrop filter on lower quality for performance
        backdropFilter: quality > 0.7 ? "blur(0.5px)" : undefined,
      } as React.CSSProperties}
    />
  );
}

/**
 * Helper to convert hex color to RGB values
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [10, 22, 40]; // Fallback to deep blue
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}
