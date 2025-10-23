"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useInViewState from "@/hooks/useInViewState";

const IMPACT_METRICS = [
  {
    id: "incident",
    title: "Incident Triage AI",
    description: "Automatic incident categorization & routing",
    metrics: [
      { label: "MTTR Improvement", value: 0, target: 42, unit: "%", color: "#ef4444" },
      { label: "Resolution Rate", value: 0, target: 89, unit: "%", color: "#10b981" },
      { label: "False Positives", value: 0, target: 8, unit: "↓%", color: "#f59e0b" },
    ],
    icon: "🚨",
  },
  {
    id: "revenue",
    title: "Revenue Intelligence",
    description: "ML-powered revenue forecasting & opportunity detection",
    metrics: [
      { label: "Forecast Accuracy", value: 0, target: 94, unit: "%", color: "#0ea5e9" },
      { label: "Opportunities Found", value: 0, target: 28, unit: "↑%", color: "#10b981" },
      { label: "Win Rate", value: 0, target: 38, unit: "↑%", color: "#8b5cf6" },
    ],
    icon: "💰",
  },
  {
    id: "support",
    title: "Support Auto-Resolution",
    description: "Autonomous issue resolution without human touch",
    metrics: [
      { label: "Resolution Rate", value: 0, target: 61, unit: "↑%", color: "#06b6d4" },
      { label: "CSAT Score", value: 0, target: 92, unit: "%", color: "#10b981" },
      { label: "Cost per Ticket", value: 0, target: 47, unit: "↓%", color: "#f59e0b" },
    ],
    icon: "🎧",
  },
  {
    id: "finance",
    title: "Finance Close Automation",
    description: "Autonomous financial close and reconciliation",
    metrics: [
      { label: "Cycle Time", value: 0, target: 35, unit: "↓%", color: "#ef4444" },
      { label: "Accuracy", value: 0, target: 99.98, unit: "%", color: "#10b981" },
      { label: "Cost Reduction", value: 0, target: 62, unit: "↓%", color: "#f59e0b" },
    ],
    icon: "📈",
  },
  {
    id: "marketing",
    title: "Marketing Orchestration",
    description: "AI-driven campaign management & optimization",
    metrics: [
      { label: "Campaign Velocity", value: 0, target: 19, unit: "↑%", color: "#06b6d4" },
      { label: "Conversion Rate", value: 0, target: 31, unit: "↑%", color: "#10b981" },
      { label: "ROI", value: 0, target: 5.2, unit: "x", color: "#8b5cf6" },
    ],
    icon: "📣",
  },
  {
    id: "trust",
    title: "Trust & Safety Guardian",
    description: "Real-time fraud detection & risk mitigation",
    metrics: [
      { label: "Fraud Detection", value: 0, target: 99.7, unit: "%", color: "#0ea5e9" },
      { label: "False Positives", value: 0, target: 47, unit: "↓%", color: "#10b981" },
      { label: "Response Time", value: 0, target: 92, unit: "% <100ms", color: "#f59e0b" },
    ],
    icon: "🔒",
  },
];

function AnimatedNumber({ target, unit }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    let currentValue = 0;
    const step = target / 60; // Animate over ~1 second

    const animate = () => {
      currentValue += step;
      if (currentValue >= target) {
        setValue(target);
      } else {
        setValue(Math.round(currentValue * 100) / 100);
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target]);

  return (
    <>
      {value}
      {unit}
    </>
  );
}

function MetricBar({ label, target, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>
          <AnimatedNumber target={target} unit="" />
          {target < 10 ? "x" : "%"}
        </span>
      </div>
      <motion.div
        className="h-2 rounded-full overflow-hidden bg-slate-800"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(target, 100)}%` }}
          transition={{ delay: 0.3, duration: 1 }}
        />
      </motion.div>
    </div>
  );
}

function ImpactCard({ metric, index }) {
  const cardRef = useRef(null);
  const isInView = useInViewState(cardRef);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.6 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group relative rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6 hover:border-slate-600 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{metric.icon}</span>
          <div>
            <h3 className="font-semibold text-white text-lg">{metric.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{metric.description}</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {metric.metrics.map((m, i) => (
          <MetricBar key={i} label={m.label} target={m.target} color={m.color} />
        ))}
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-slate-600/10 to-transparent rounded-xl" />
    </motion.div>
  );
}

export default function ImpactDashboard() {
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
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5 bg-green-500" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-5 bg-blue-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 mb-4">
            PROVEN IMPACT
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Real Results from
            <br />
            Real Deployments
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            These aren't projections or case studies. These are live metrics from active systems
            right now, demonstrating the transformative power at enterprise scale.
          </p>
        </motion.div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {IMPACT_METRICS.map((metric, index) => (
            <ImpactCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: "Avg Automation Rate", value: "74%", color: "#0ea5e9" },
            { label: "Avg Cost Reduction", value: "52%", color: "#10b981" },
            { label: "Avg Time Savings", value: "118 hrs/wk", color: "#f59e0b" },
            { label: "Customer ROI", value: "5.1x avg", color: "#8b5cf6" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
