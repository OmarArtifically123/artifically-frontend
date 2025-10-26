"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useInViewState from "@/hooks/useInViewState";

const TRANSFORMATIONS = [
  {
    id: "fragmentation",
    before: {
      title: "Fragmented Systems",
      description: "Data siloed across incompatible platforms",
      items: ["Salesforce", "NetSuite", "Zendesk", "Custom DB"],
      metric: "47 APIs",
    },
    after: {
      title: "Unified Intelligence Layer",
      description: "Seamless data flow with AI coordination",
      items: ["Real-time Sync", "ML Pipeline", "Unified API", "Governance"],
      metric: "1 System",
    },
    color: "#0ea5e9",
  },
  {
    id: "manual",
    before: {
      title: "Manual QA Process",
      description: "Hours of human verification per cycle",
      items: ["Visual inspection", "Spot checks", "Edge cases", "Human error"],
      metric: "42 hrs/wk",
    },
    after: {
      title: "Automated Quality Assurance",
      description: "AI-powered validation at machine speed",
      items: ["Continuous monitoring", "Anomaly detection", "Pattern learning", "99.97% accuracy"],
      metric: "2 hrs/wk",
    },
    color: "#10b981",
  },
  {
    id: "slowChange",
    before: {
      title: "Slow Change Control",
      description: "Days to deploy configuration changes",
      items: ["Planning", "Testing", "Approval", "Deployment"],
      metric: "5-7 days",
    },
    after: {
      title: "Instant Playbooks",
      description: "Deploy changes with AI-assisted verification",
      items: ["Pre-validated", "Rollback ready", "A/B tested", "Live monitoring"],
      metric: "Minutes",
    },
    color: "#f59e0b",
  },
  {
    id: "costControl",
    before: {
      title: "Runaway Infrastructure Costs",
      description: "Manual resource provisioning inefficiency",
      items: ["Over-provisioning", "Idle resources", "Waste", "Budget shock"],
      metric: "$420k/yr",
    },
    after: {
      title: "Predictable Automation Costs",
      description: "Intelligent resource optimization",
      items: ["Auto-scaling", "Waste detection", "Cost prediction", "ROI-focused"],
      metric: "$78k/yr",
    },
    color: "#8b5cf6",
  },
];

function hexToRgb(hex) {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => char + char)
          .join("")
      : sanitized.slice(0, 6);
  const intValue = Number.parseInt(normalized || "000000", 16);

  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
}

function DataFlowVisualization({ isActive, color }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const { r, g, b } = hexToRgb(color);

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.016;

      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = "rgba(5, 5, 15, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Draw flowing particles representing data transformation
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const progress = (timeRef.current * 0.3 + (i / particleCount)) % 1;
        const x = (progress * width * 1.2) - width * 0.1;
        const y = height * 0.5 + Math.sin(progress * Math.PI * 2 + i) * height * 0.2;

        const opacity = Math.sin(progress * Math.PI) * 0.6;
        const size = 2 + Math.sin(progress * Math.PI * 2) * 2;

        ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = color + Math.floor(opacity * 100).toString(16).padStart(2, "0");
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, size + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw central transformation zone
      const zoneProgress = Math.sin(timeRef.current * 1.5) * 0.3 + 0.5;
      const glowStrength = Math.min(zoneProgress * 0.5, 0.45);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.08,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.5
      );
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowStrength})`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${glowStrength * 0.45})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-48 rounded-lg"
      style={{
        background: "linear-gradient(90deg, rgba(10,10,20,0.6), rgba(20,20,40,0.6))",
      }}
    />
  );
}

function TransformationCard({ label, description, items, metric, color }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-white mb-1">{label}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-sm text-slate-300"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {item}
          </motion.div>
        ))}
      </div>
      <div className="pt-2 border-t border-slate-700">
        <div className="text-2xl font-bold" style={{ color }}>
          {metric}
        </div>
      </div>
    </div>
  );
}

export default function TransformationVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(15,15,30,0.5), rgba(10,10,20,0.3))",
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 bg-blue-500" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5 bg-purple-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span
            className="inline-block text-sm font-semibold px-3 py-1 rounded-full border mb-4"
            style={{
              color: TRANSFORMATIONS[activeIndex].color,
              borderColor: TRANSFORMATIONS[activeIndex].color + "33",
              backgroundColor: TRANSFORMATIONS[activeIndex].color + "11",
            }}
          >
            TRANSFORMATIVE IMPACT
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            See How Enterprise<br />Operations Transform
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real organizations. Real results. Real transformation from the inside out.
          </p>
        </motion.div>

        {/* Transformation Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {TRANSFORMATIONS.map((transformation, index) => (
            <motion.button
              key={transformation.id}
              onClick={() => setActiveIndex(index)}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
              style={{
                backgroundColor:
                  activeIndex === index
                    ? transformation.color + "22"
                    : "rgba(255,255,255,0.05)",
                color: activeIndex === index ? transformation.color : "rgba(255,255,255,0.6)",
                borderWidth: activeIndex === index ? "1px" : "1px",
                borderColor:
                  activeIndex === index ? transformation.color + "66" : "rgba(255,255,255,0.1)",
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {transformation.before.title}
            </motion.button>
          ))}
        </div>

        {/* Main Transformation Display */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Visualization */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
            <DataFlowVisualization
              isActive={isInView}
              color={TRANSFORMATIONS[activeIndex].color}
            />
          </div>

          {/* Before and After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="p-6 rounded-xl border border-slate-700 bg-gradient-to-b from-red-950/20 to-slate-950/40"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl">⚠️</div>
                <h3 className="text-xl font-bold text-white">The Challenge</h3>
              </div>
              <TransformationCard
                label={TRANSFORMATIONS[activeIndex].before.title}
                description={TRANSFORMATIONS[activeIndex].before.description}
                items={TRANSFORMATIONS[activeIndex].before.items}
                metric={TRANSFORMATIONS[activeIndex].before.metric}
                color="#ef4444"
              />
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-slate-700 bg-gradient-to-b from-green-950/20 to-slate-950/40"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl">✨</div>
                <h3 className="text-xl font-bold text-white">The Transformation</h3>
              </div>
              <TransformationCard
                label={TRANSFORMATIONS[activeIndex].after.title}
                description={TRANSFORMATIONS[activeIndex].after.description}
                items={TRANSFORMATIONS[activeIndex].after.items}
                metric={TRANSFORMATIONS[activeIndex].after.metric}
                color={TRANSFORMATIONS[activeIndex].color}
              />
            </motion.div>
          </div>

          {/* Impact Statement */}
          <motion.div
            className="text-center p-8 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-slate-300 mb-4">This transformation typically happens within</p>
            <div className="text-3xl font-bold text-white">
              4-6 weeks of deployment
            </div>
            <p className="text-slate-400 mt-2">
              From initial setup to measurable impact across your organization
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
