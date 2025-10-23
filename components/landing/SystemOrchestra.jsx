"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useInViewState from "@/hooks/useInViewState";

const CAPABILITIES = [
  {
    id: "orchestration",
    label: "Workflow Orchestration",
    description: "Design, deploy, and optimize complex multi-step automations",
    icon: "⚙️",
    position: { x: 50, y: 20 },
    connections: ["monitoring", "governance"],
    metrics: "10K+ flows deployed",
  },
  {
    id: "intelligence",
    label: "AI Decision Engine",
    description: "Machine learning models that learn from your processes",
    icon: "🧠",
    position: { x: 50, y: 50 },
    connections: ["orchestration", "monitoring", "integrations"],
    metrics: "500M+ decisions/day",
  },
  {
    id: "integrations",
    label: "Enterprise Integrations",
    description: "Connect 500+ enterprise systems with native APIs",
    icon: "🔗",
    position: { x: 20, y: 35 },
    connections: ["intelligence", "governance"],
    metrics: "500+ systems",
  },
  {
    id: "monitoring",
    label: "Proactive Monitoring",
    description: "Real-time anomaly detection and predictive alerting",
    icon: "📊",
    position: { x: 80, y: 35 },
    connections: ["intelligence", "orchestration"],
    metrics: "99.98% uptime SLA",
  },
  {
    id: "governance",
    label: "Enterprise Governance",
    description: "Compliance audit trails, approval workflows, and controls",
    icon: "🔐",
    position: { x: 50, y: 80 },
    connections: ["orchestration", "integrations"],
    metrics: "SOC2, HIPAA, FedRAMP",
  },
];

function InteractiveSystemViz({ selectedCapability, onSelect }) {
  const svgRef = useRef(null);
  const timeRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const animate = () => {
      timeRef.current += 0.016;

      // Update connection animations
      CAPABILITIES.forEach((capability) => {
        capability.connections.forEach((connectedId) => {
          const connected = CAPABILITIES.find((c) => c.id === connectedId);
          if (!connected) return;

          const line = svg.querySelector(
            `[data-connection="${capability.id}-${connectedId}"]`
          );
          if (line) {
            const x1 = (capability.position.x / 100) * 800;
            const y1 = (capability.position.y / 100) * 600;
            const x2 = (connected.position.x / 100) * 800;
            const y2 = (connected.position.y / 100) * 600;

            const offset = Math.sin(timeRef.current * 2) * 20;
            line.setAttribute("x1", x1 + offset * 0.1);
            line.setAttribute("y1", y1 + offset * 0.1);
            line.setAttribute("x2", x2 - offset * 0.1);
            line.setAttribute("y2", y2 - offset * 0.1);

            // Animate stroke dasharray for flow effect
            const dashOffset = (timeRef.current * 20) % 100;
            line.style.strokeDashoffset = dashOffset;
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full aspect-video bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="w-full h-full"
      >
        {/* Connection Lines */}
        {CAPABILITIES.flatMap((capability) =>
          capability.connections.map((connectedId) => {
            const connected = CAPABILITIES.find((c) => c.id === connectedId);
            if (!connected || capability.id > connectedId) return null;

            const x1 = (capability.position.x / 100) * 800;
            const y1 = (capability.position.y / 100) * 600;
            const x2 = (connected.position.x / 100) * 800;
            const y2 = (connected.position.y / 100) * 600;

            const isSelected =
              selectedCapability === capability.id ||
              selectedCapability === connectedId;

            return (
              <line
                key={`${capability.id}-${connectedId}`}
                data-connection={`${capability.id}-${connectedId}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isSelected ? "#06b6d4" : "rgba(148, 163, 184, 0.3)"}
                strokeWidth={isSelected ? 2 : 1}
                strokeDasharray="10,5"
                className="transition-colors duration-300"
              />
            );
          })
        )}

        {/* Capability Nodes */}
        {CAPABILITIES.map((capability) => {
          const x = (capability.position.x / 100) * 800;
          const y = (capability.position.y / 100) * 600;
          const isSelected = selectedCapability === capability.id;

          return (
            <g
              key={capability.id}
              onClick={() => onSelect(capability.id)}
              className="cursor-pointer"
            >
              {/* Node Glow */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 60 : 45}
                fill={isSelected ? "#06b6d4" : "#0ea5e9"}
                opacity={isSelected ? 0.15 : 0.1}
                className="transition-all duration-300"
              />

              {/* Node Circle */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 45 : 35}
                fill="rgba(10, 10, 20, 0.8)"
                stroke={isSelected ? "#06b6d4" : "#0ea5e9"}
                strokeWidth={isSelected ? 2 : 1.5}
                className="transition-all duration-300"
              />

              {/* Icon */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dy=".3em"
                fontSize="24"
                fontWeight="bold"
              >
                {capability.icon}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CapabilityDetail({ capability, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{capability.icon}</span>
          <h3 className="text-2xl font-bold text-white">{capability.label}</h3>
        </div>
        <p className="text-slate-400">{capability.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-white mb-2">Key Features</h4>
          <ul className="space-y-2">
            {[
              "Visual no-code designer",
              "Real-time testing & debugging",
              "Version control & rollback",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-cyan-400 font-semibold">{capability.metrics}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-white">Connected to</h4>
        <div className="flex flex-wrap gap-2">
          {capability.connections.map((connectedId) => {
            const connected = CAPABILITIES.find((c) => c.id === connectedId);
            return (
              <div
                key={connectedId}
                className="px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-300"
              >
                {connected?.label}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function SystemOrchestra() {
  const [selectedCapability, setSelectedCapability] = useState("intelligence");
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const activeCapability = CAPABILITIES.find((c) => c.id === selectedCapability);

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,20,0.3), rgba(15,15,30,0.5))",
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl opacity-5 bg-cyan-500" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 bg-blue-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-4">
            THE OPERATING SYSTEM
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            An Integrated System,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Not a Collection of Tools
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every capability connects seamlessly. Every function amplifies the others. This is
            how true enterprise automation works at scale.
          </p>
        </motion.div>

        {/* Interactive System Visualization */}
        <div className="mb-12">
          <InteractiveSystemViz
            selectedCapability={selectedCapability}
            onSelect={setSelectedCapability}
          />
        </div>

        {/* Selected Capability Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Capability Detail Panel */}
          <div className="lg:col-span-2">
            {activeCapability && (
              <CapabilityDetail capability={activeCapability} isActive={true} />
            )}
          </div>

          {/* Capability List Sidebar */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 px-2 mb-4">EXPLORE CAPABILITIES</h4>
            {CAPABILITIES.map((capability) => (
              <motion.button
                key={capability.id}
                onClick={() => setSelectedCapability(capability.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all text-sm ${
                  selectedCapability === capability.id
                    ? "bg-cyan-500/20 border-cyan-500/50 text-white"
                    : "bg-slate-900/30 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-lg mb-1">{capability.icon}</div>
                <div className="font-semibold">{capability.label}</div>
                <div className="text-xs text-slate-500 mt-1">{capability.metrics}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
