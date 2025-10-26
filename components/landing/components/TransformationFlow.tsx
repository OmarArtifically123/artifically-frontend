"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface FlowNode {
  id: string;
  label: string;
  type: "input" | "process" | "output";
  x: number;
  y: number;
}

interface TransformationFlowProps {
  mode: "before" | "after";
  isActive: boolean;
}

/**
 * Animated flow diagram showing process transformation
 */
export default function TransformationFlow({ mode, isActive }: TransformationFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);

  useEffect(() => {
    // Define nodes based on mode
    const beforeNodes: FlowNode[] = [
      { id: "1", label: "Manual Entry", type: "input", x: 50, y: 150 },
      { id: "2", label: "Email Check", type: "process", x: 200, y: 80 },
      { id: "3", label: "Spreadsheet", type: "process", x: 200, y: 150 },
      { id: "4", label: "Copy/Paste", type: "process", x: 200, y: 220 },
      { id: "5", label: "Manual Review", type: "process", x: 350, y: 100 },
      { id: "6", label: "Data Entry", type: "process", x: 350, y: 200 },
      { id: "7", label: "Final Check", type: "process", x: 500, y: 150 },
      { id: "8", label: "Output", type: "output", x: 650, y: 150 },
    ];

    const afterNodes: FlowNode[] = [
      { id: "1", label: "Auto Capture", type: "input", x: 50, y: 150 },
      { id: "2", label: "AI Processing", type: "process", x: 250, y: 150 },
      { id: "3", label: "Smart Validation", type: "process", x: 450, y: 150 },
      { id: "4", label: "Auto Output", type: "output", x: 650, y: 150 },
    ];

    setNodes(mode === "before" ? beforeNodes : afterNodes);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    let animationProgress = 0;
    let isMounted = true;
    let animationId: number;

    const animate = () => {
      if (!isMounted) return;
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      animationProgress = (animationProgress + 0.01) % 1;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.strokeStyle = mode === "before" ? "#ef4444" : "#10b981";
      ctx.lineWidth = 2;

      for (let i = 0; i < nodes.length - 1; i++) {
        const current = nodes[i];
        const next = nodes[i + 1];

        // Animated dash
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -animationProgress * 20;

        ctx.beginPath();
        ctx.moveTo(current.x + 60, current.y + 20);
        ctx.lineTo(next.x, next.y + 20);
        ctx.stroke();
      }

      // Draw nodes
      nodes.forEach((node, index) => {
        const delay = index * 0.1;
        const nodeProgress = Math.max(0, Math.min(1, (animationProgress + delay) % 1));

        // Node background
        ctx.fillStyle = mode === "before" ? "#7f1d1d" : "#065f46";
        ctx.fillRect(node.x, node.y, 60, 40);

        // Node border with animation
        ctx.strokeStyle = mode === "before" ? "#ef4444" : "#10b981";
        ctx.lineWidth = 2 + Math.sin(nodeProgress * Math.PI * 2) * 1;
        ctx.strokeRect(node.x, node.y, 60, 40);

        // Node label
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x + 30, node.y + 25);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isMounted = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [nodes, mode, isActive]);

  return (
    <div className="relative w-full h-64 rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Mode label */}
      <div
        className={`
          absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold
          ${mode === "before"
            ? "bg-red-500/20 text-red-400 border border-red-500/50"
            : "bg-green-500/20 text-green-400 border border-green-500/50"
          }
        `}
      >
        {mode === "before" ? "❌ Manual Process" : "✓ Automated Flow"}
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 text-sm">
        <div className="text-slate-400 mb-1">
          {mode === "before" ? "Steps: 8" : "Steps: 4"}
        </div>
        <div className="text-slate-400">
          {mode === "before" ? "Time: 2-3 hours" : "Time: < 5 minutes"}
        </div>
      </div>
    </div>
  );
}


