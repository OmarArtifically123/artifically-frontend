"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ROIDataPoint {
  day: number;
  value: number;
  label: string;
}

interface ROIGraphOverlayProps {
  data: ROIDataPoint[];
  color: string;
  isActive: boolean;
}

/**
 * ROI graph overlay showing value accumulation over time
 */
export default function ROIGraphOverlay({ data, color, isActive }: ROIGraphOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Calculate scales
    const maxValue = Math.max(...data.map((d) => d.value));
    const maxDay = Math.max(...data.map((d) => d.day));

    const xScale = width / maxDay;
    const yScale = (height * 0.7) / maxValue;
    const padding = 40;

    // Draw grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.1)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + ((height - padding * 2) / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw area under curve
    ctx.fillStyle = `${color}15`;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((point, index) => {
      const x = padding + point.day * xScale;
      const y = height - padding - point.value * yScale;

      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        // Smooth curve
        const prevPoint = data[index - 1];
        const prevX = padding + prevPoint.day * xScale;
        const prevY = height - padding - prevPoint.value * yScale;

        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        ctx.quadraticCurveTo(cpX, (prevY + y) / 2, x, y);
      }
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + point.day * xScale;
      const y = height - padding - point.value * yScale;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        // Smooth curve
        const prevPoint = data[index - 1];
        const prevX = padding + prevPoint.day * xScale;
        const prevY = height - padding - prevPoint.value * yScale;

        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        ctx.quadraticCurveTo(cpX, (prevY + y) / 2, x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    data.forEach((point) => {
      const x = padding + point.day * xScale;
      const y = height - padding - point.value * yScale;

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Inner dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // White center
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";

    data.forEach((point) => {
      const x = padding + point.day * xScale;
      const y = height - padding - point.value * yScale;

      // Value label above point
      ctx.fillText(point.label, x, y - 15);
    });

    // Draw axes labels
    ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * (5 - i);
      const y = padding + ((height - padding * 2) / 5) * i;
      ctx.fillText(`${value.toFixed(1)}x`, padding - 10, y + 4);
    }

    // X-axis label
    ctx.textAlign = "center";
    ctx.fillText("Days Since Launch", width / 2, height - 10);

    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("ROI Multiplier", 0, 0);
    ctx.restore();
  }, [data, color, isActive]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-64 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Title */}
      <div className="absolute top-6 left-6">
        <h4 className="text-sm font-semibold text-white mb-1">ROI Growth</h4>
        <p className="text-xs text-slate-400">Value accumulation over time</p>
      </div>
    </motion.div>
  );
}





