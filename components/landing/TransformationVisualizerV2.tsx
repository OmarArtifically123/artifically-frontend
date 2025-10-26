"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useInViewState from "@/hooks/useInViewState";
import TransformationFlow from "./components/TransformationFlow";
import DataFlowVisualizer from "./components/DataFlowVisualizer";
import ProcessComparison from "./components/ProcessComparison";
import ImpactCalculator from "./components/ImpactCalculator";
import styles from "./TransformationVisualizerV2.module.css";

const PROCESS_COMPARISONS = [
  {
    label: "Data Collection",
    before: [
      "Manual email checking (30 min)",
      "Copy-paste from multiple sources",
      "Excel spreadsheet juggling",
      "Version control nightmare",
    ],
    after: [
      "Auto-capture from all sources",
      "Real-time data sync",
      "Single source of truth",
      "Instant version history",
    ],
  },
  {
    label: "Processing & Validation",
    before: [
      "Manual data entry and review",
      "Human error rate: 3-5%",
      "Inconsistent formatting",
      "Missing data fields",
    ],
    after: [
      "AI-powered validation",
      "Error rate: < 0.05%",
      "Smart formatting",
      "Auto-completion of fields",
    ],
  },
  {
    label: "Output & Distribution",
    before: [
      "Manual report generation",
      "Email distribution lists",
      "Follow-up reminders needed",
      "No delivery tracking",
    ],
    after: [
      "Automated reports",
      "Smart routing rules",
      "Automatic follow-ups",
      "Full delivery analytics",
    ],
  },
];

/**
 * Transformation Visualizer V2 - Enhanced before/after comparison
 */
export default function TransformationVisualizerV2() {
  const [activeView, setActiveView] = useState<"flow" | "data" | "comparison" | "calculator">("flow");
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  return (
    <section
      id="transformation-visualizer"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="transform-title"
    >
      {/* Background */}
      <div className={styles.background}>
        <div className={styles.glowOrb} />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span className={styles.badge}>TRANSFORMATION IN ACTION</motion.span>

          <h2 id="transform-title" className={styles.title}>
            See the{" "}
            <span className={styles.titleGradient}>Difference</span>
          </h2>

          <p className={styles.description}>
            Not hypothetical improvements. Real transformations happening right now,
            across thousands of processes and millions of workflows.
          </p>
        </motion.div>

        {/* View Selector */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { id: "flow", label: "Process Flow", icon: "🔄" },
            { id: "data", label: "Data Flow", icon: "💫" },
            { id: "comparison", label: "Comparison", icon: "⚖️" },
            { id: "calculator", label: "Impact Calculator", icon: "📊" },
          ].map((view) => (
            <motion.button
              key={view.id}
              onClick={() => setActiveView(view.id as typeof activeView)}
              className={`
                px-6 py-3 rounded-lg font-medium text-sm transition-all
                ${activeView === view.id
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                  : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-white"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <span>{view.icon}</span>
                <span>{view.label}</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content Views */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {activeView === "flow" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Before Automation</h3>
                <TransformationFlow mode="before" isActive={isInView} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">After Automation</h3>
                <TransformationFlow mode="after" isActive={isInView} />
              </div>
            </div>
          )}

          {activeView === "data" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Before: Scattered</h3>
                <DataFlowVisualizer mode="chaotic" isActive={isInView} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">After: Unified</h3>
                <DataFlowVisualizer mode="organized" isActive={isInView} />
              </div>
            </div>
          )}

          {activeView === "comparison" && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Side-by-Side Process Comparison
              </h3>
              <ProcessComparison items={PROCESS_COMPARISONS} isActive={isInView} />
            </div>
          )}

          {activeView === "calculator" && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Calculate Your Transformation Impact
              </h3>
              <ImpactCalculator isActive={isInView} />
            </div>
          )}
        </motion.div>

        {/* Key Metrics Summary */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { label: "Time Reduction", value: "75%", color: "#06b6d4" },
            { label: "Error Reduction", value: "99.7%", color: "#10b981" },
            { label: "Cost Savings", value: "52%", color: "#f59e0b" },
            { label: "Efficiency Gain", value: "8.2x", color: "#8b5cf6" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.7 + i * 0.05, duration: 0.4 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className={styles.ctaButton}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            See Your Transformation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

