"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DataFlowVisualizerProps {
  mode: "chaotic" | "organized";
  isActive: boolean;
}

/**
 * Visualizes data flow - chaotic before vs organized after
 */
export default function DataFlowVisualizer({ mode, isActive }: DataFlowVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      color: string;
    }

    const particles: Particle[] = [];
    const particleCount = mode === "chaotic" ? 50 : 30;

    // Initialize particles
    let isMounted = true;
    for (let i = 0; i < particleCount; i++) {
      const colors = mode === "chaotic"
        ? ["#ef4444", "#f97316", "#f59e0b"]
        : ["#10b981", "#06b6d4", "#8b5cf6"];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (mode === "chaotic" ? 4 : 1),
        vy: (Math.random() - 0.5) * (mode === "chaotic" ? 4 : 1),
        targetX: mode === "organized" ? width / 2 : Math.random() * width,
        targetY: mode === "organized" ? (i / particleCount) * height : Math.random() * height,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationId: number;

    const animate = () => {
      if (!isMounted) return;
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Fade effect
      ctx.fillStyle = "rgba(10, 10, 20, 0.1)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (mode === "chaotic") {
          // Chaotic movement
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        } else {
          // Organized movement toward target
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;

          particle.x += dx * 0.05;
          particle.y += dy * 0.05;
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          10
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, particle.color + "00");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        if (mode === "organized") {
          ctx.strokeStyle = particle.color + "30";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.targetX, particle.targetY);
          ctx.stroke();
        }
      });

      // Draw connections in organized mode
      if (mode === "organized") {
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 100) {
              ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 * (1 - dist / 100)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isMounted = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mode, isActive]);

  return (
    <motion.div
      className="relative w-full h-64 rounded-xl border border-slate-700 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.8), rgba(20,20,40,0.8))" }}
      />

      {/* Label */}
      <div
        className={`
          absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
          ${mode === "chaotic"
            ? "bg-red-500/20 text-red-400 border border-red-500/50"
            : "bg-green-500/20 text-green-400 border border-green-500/50"
          }
        `}
      >
        {mode === "chaotic" ? "❌ Scattered Data" : "✓ Unified Data"}
      </div>
    </motion.div>
  );
}


