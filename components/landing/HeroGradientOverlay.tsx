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

  // Theme-aware gradient definitions - DRAMATICALLY DIFFERENT
  const gradients = useMemo(() => {
    if (theme === "light") {
      // LIGHT THEME: Vibrant, energetic, airy with bright rainbow colors
      return [
        {
          position: "25% 15%",
          colors: ["#1f7eff", "#ffffff"], // Vibrant blue to white
          blur: 140,
          opacity: 0.6,
        },
        {
          position: "75% 85%",
          colors: ["#ec4899", "#ffffff"], // Hot pink to white
          blur: 130,
          opacity: 0.5,
        },
        {
          position: "50% 40%",
          colors: ["#7c3aed", "#ffffff"], // Royal purple to white
          blur: 120,
          opacity: 0.45,
        },
        {
          position: "15% 65%",
          colors: ["#f59e0b", "#ffffff"], // Warm amber to white
          blur: 110,
          opacity: 0.4,
        },
        {
          position: "85% 25%",
          colors: ["#0ea5e9", "#ffffff"], // Sky blue to white
          blur: 125,
          opacity: 0.35,
        },
        {
          position: "40% 75%",
          colors: ["#10b981", "#ffffff"], // Emerald to white
          blur: 115,
          opacity: 0.3,
        },
      ];
    } else if (theme === "contrast") {
      // CONTRAST THEME: Electric, neon, cyberpunk with sharp colors and no blur
      return [
        {
          position: "20% 20%",
          colors: ["#00eaff", "#000000"], // Electric cyan to black
          blur: 0, // NO BLUR for sharp contrast
          opacity: 0.9,
        },
        {
          position: "80% 80%",
          colors: ["#ff00ff", "#000000"], // Neon magenta to black
          blur: 0,
          opacity: 0.8,
        },
        {
          position: "50% 50%",
          colors: ["#ffff00", "#000000"], // Electric yellow to black
          blur: 0,
          opacity: 0.7,
        },
        {
          position: "10% 90%",
          colors: ["#00ffe0", "#000000"], // Neon teal to black
          blur: 0,
          opacity: 0.6,
        },
        {
          position: "90% 10%",
          colors: ["#00d4ff", "#000000"], // Bright cyan to black
          blur: 0,
          opacity: 0.5,
        },
        {
          position: "35% 65%",
          colors: ["#ff00aa", "#000000"], // Hot magenta to black
          blur: 0,
          opacity: 0.4,
        },
      ];
    } else {
      // DARK THEME: Deep, moody, mysterious with deep space colors
      return [
        {
          position: "28% 18%",
          colors: ["#3b82f6", "#0a0a1a"], // Deep blue to near-black
          blur: 150,
          opacity: 0.7,
        },
        {
          position: "72% 82%",
          colors: ["#8b5cf6", "#0a0a1a"], // Deep purple to near-black
          blur: 140,
          opacity: 0.6,
        },
        {
          position: "48% 52%",
          colors: ["#0ea5e9", "#0a0a1a"], // Sky blue to near-black
          blur: 130,
          opacity: 0.5,
        },
        {
          position: "12% 68%",
          colors: ["#7c3aed", "#0a0a1a"], // Violet to near-black
          blur: 145,
          opacity: 0.45,
        },
        {
          position: "88% 32%",
          colors: ["#06b6d4", "#0a0a1a"], // Cyan to near-black
          blur: 135,
          opacity: 0.4,
        },
        {
          position: "60% 25%",
          colors: ["#4f46e5", "#0a0a1a"], // Indigo to near-black
          blur: 125,
          opacity: 0.35,
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
