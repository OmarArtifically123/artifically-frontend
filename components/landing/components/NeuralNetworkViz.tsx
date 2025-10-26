"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface NeuralNetworkVizProps {
  isActive: boolean;
  color: string;
}

/**
 * Neural network visualization showing AI decision-making process
 */
export default function NeuralNetworkViz({ isActive, color }: NeuralNetworkVizProps) {
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

    // Neural network structure
    const layers = [
      { nodes: 4, x: width * 0.15 },
      { nodes: 6, x: width * 0.4 },
      { nodes: 5, x: width * 0.65 },
      { nodes: 3, x: width * 0.9 },
    ];

    // Calculate node positions
    const nodePositions: Array<{ x: number; y: number; layer: number }> = [];
    layers.forEach((layer, layerIndex) => {
      const spacing = height / (layer.nodes + 1);
      for (let i = 0; i < layer.nodes; i++) {
        nodePositions.push({
          x: layer.x,
          y: spacing * (i + 1),
          layer: layerIndex,
        });
      }
    });

    // Create connections
    const connections: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      progress: number;
    }> = [];

    for (let i = 0; i < nodePositions.length; i++) {
      const node = nodePositions[i];
      // Connect to next layer
      const nextLayerNodes = nodePositions.filter((n) => n.layer === node.layer + 1);
      nextLayerNodes.forEach((nextNode) => {
        connections.push({
          from: { x: node.x, y: node.y },
          to: { x: nextNode.x, y: nextNode.y },
          progress: Math.random(),
        });
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      if (!isActive) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      time += 0.01;

      // Clear canvas
      ctx.fillStyle = "rgba(10, 10, 20, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Draw connections
      connections.forEach((connection) => {
        connection.progress = (connection.progress + 0.01) % 1;

        // Draw line
        ctx.strokeStyle = `${color}30`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.stroke();

        // Draw flowing particle
        const particleX = connection.from.x + (connection.to.x - connection.from.x) * connection.progress;
        const particleY = connection.from.y + (connection.to.y - connection.from.y) * connection.progress;

        const gradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 3);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      nodePositions.forEach((node, index) => {
        const pulse = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7;

        // Node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        gradient.addColorStop(0, `${color}${Math.floor(pulse * 100).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(1, `${color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, color]);

  return (
    <motion.div
      className="relative w-full h-full min-h-[300px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, rgba(10,10,20,0.8), rgba(20,20,40,0.8))" }}
      />

      {/* Labels */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span>Neural Decision Pathways</span>
        </div>
        <div className="text-slate-500">
          {isActive ? "Processing..." : "Idle"}
        </div>
      </div>

      <div className="absolute top-4 right-4 text-right text-xs text-slate-400">
        <div className="font-semibold text-white mb-1">AI Engine Active</div>
        <div className="text-slate-500">Real-time Analysis</div>
      </div>
    </motion.div>
  );
}




