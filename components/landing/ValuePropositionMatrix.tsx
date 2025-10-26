"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useInViewState from "@/hooks/useInViewState";
import Problem3DCube from "./components/Problem3DCube";
import ParticleMorph from "./components/ParticleMorph";
import RealTimeMetrics from "./components/RealTimeMetrics";
import InteractiveRoleSelector from "./components/InteractiveRoleSelector";
import type { UserRole } from "@/types/landing";
import styles from "./ValuePropositionMatrix.module.css";

const ROLES: UserRole[] = [
  {
    id: "finance",
    label: "Finance",
    icon: "📊",
    description: "Automated reconciliation, variance alerts, audit trails",
    color: "#10b981",
    metrics: [
      { label: "Automation Rate", value: "87%", unit: "%", color: "#10b981", icon: "⚡" },
      { label: "Time Saved", value: "142 hrs/wk", unit: "", color: "#06b6d4", icon: "⏱️" },
      { label: "Accuracy", value: "99.97%", unit: "%", color: "#8b5cf6", icon: "🎯" },
    ],
  },
  {
    id: "support",
    label: "Support",
    icon: "🎧",
    description: "AI-powered resolution, deflection, sentiment analysis",
    color: "#f59e0b",
    metrics: [
      { label: "Resolution Rate", value: "64%", unit: "%", color: "#f59e0b", icon: "✅" },
      { label: "Time Saved", value: "89 hrs/wk", unit: "", color: "#06b6d4", icon: "⏱️" },
      { label: "CSAT Score", value: "94.2%", unit: "%", color: "#10b981", icon: "😊" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "⚙️",
    description: "Intelligent routing, predictive maintenance, optimization",
    color: "#8b5cf6",
    metrics: [
      { label: "Efficiency Gain", value: "76%", unit: "%", color: "#8b5cf6", icon: "📈" },
      { label: "Time Saved", value: "156 hrs/wk", unit: "", color: "#06b6d4", icon: "⏱️" },
      { label: "Cost Reduction", value: "98.4%", unit: "%", color: "#10b981", icon: "💰" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "📣",
    description: "Campaign orchestration, lead scoring, conversion optimization",
    color: "#ec4899",
    metrics: [
      { label: "Campaign Velocity", value: "19%", unit: "% ↑", color: "#ec4899", icon: "🚀" },
      { label: "Conversion Rate", value: "31%", unit: "% ↑", color: "#10b981", icon: "📊" },
      { label: "ROI", value: "5.2x", unit: "", color: "#f59e0b", icon: "💎" },
    ],
  },
];

const CUBE_FACES = [
  {
    id: "fragmentation",
    title: "Fragmented Systems",
    description: "47 disconnected tools, siloed data, manual sync",
    color: "#ef4444",
  },
  {
    id: "unified",
    title: "Unified Intelligence",
    description: "One system, seamless flow, automated orchestration",
    color: "#10b981",
  },
  {
    id: "manual",
    title: "Manual Processes",
    description: "Hours of repetitive work, human error, bottlenecks",
    color: "#f59e0b",
  },
  {
    id: "automated",
    title: "Intelligent Automation",
    description: "AI-powered workflows, 99.97% accuracy, instant execution",
    color: "#06b6d4",
  },
  {
    id: "reactive",
    title: "Reactive Operations",
    description: "Fighting fires, delayed insights, missed opportunities",
    color: "#a855f7",
  },
  {
    id: "predictive",
    title: "Predictive Intelligence",
    description: "Proactive alerts, real-time optimization, continuous improvement",
    color: "#8b5cf6",
  },
];

/**
 * Value Proposition Matrix - Interactive 3D visualization
 * Shows problem/solution transformations with particle morphing
 */
export default function ValuePropositionMatrix() {
  const [activeRole, setActiveRole] = useState("finance");
  const [morphProgress, setMorphProgress] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const currentRole = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  const handleRoleChange = (roleId: string) => {
    setActiveRole(roleId);
    // Reset morph animation
    setMorphProgress(0);
    setTimeout(() => {
      setMorphProgress(1);
    }, 100);
  };

  return (
    <section
      id="value-proposition"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="value-proposition-title"
    >
      {/* Background effects */}
      <div className={styles.background}>
        <div
          className={styles.glowOrb}
          style={{
            background: `radial-gradient(circle, ${currentRole.color}15, transparent 70%)`,
          }}
        />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className={styles.badge}
            style={{
              color: currentRole.color,
              borderColor: `${currentRole.color}33`,
              backgroundColor: `${currentRole.color}11`,
            }}
          >
            INTELLIGENT TRANSFORMATION
          </motion.span>

          <h2 id="value-proposition-title" className={styles.title}>
            From Chaos to{" "}
            <span
              className={styles.titleGradient}
              style={{
                background: `linear-gradient(90deg, ${currentRole.color}, #06b6d4)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Orchestrated Excellence
            </span>
          </h2>

          <p className={styles.description}>
            Watch as fragmented systems transform into unified intelligence. One platform that
            learns your role, understands your challenges, and automatically optimizes for your success.
          </p>
        </motion.div>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <InteractiveRoleSelector
            roles={ROLES}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className={styles.grid}>
          {/* 3D Cube */}
          <motion.div
            className={styles.visualizationCard}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Problem → Solution Space</h3>
              <p className={styles.cardDescription}>
                Drag to explore different transformation dimensions
              </p>
            </div>
            <Problem3DCube faces={CUBE_FACES} />
          </motion.div>

          {/* Particle Morph */}
          <motion.div
            className={styles.visualizationCard}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Transformation in Action</h3>
              <p className={styles.cardDescription}>
                From scattered chaos to structured intelligence
              </p>
            </div>
            <ParticleMorph progress={morphProgress} isActive={isInView} />
          </motion.div>
        </div>

        {/* Metrics */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Your Impact: <span style={{ color: currentRole.color }}>{currentRole.label}</span>
            </h3>
            <p className="text-slate-400">{currentRole.description}</p>
          </div>
          <RealTimeMetrics
            metrics={currentRole.metrics.map((m) => ({
              label: m.label,
              value: parseFloat(m.value),
              unit: m.unit,
              color: m.color,
            }))}
            isActive={isInView}
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            className={styles.ctaButton}
            style={{
              backgroundColor: `${currentRole.color}20`,
              borderColor: `${currentRole.color}60`,
              color: currentRole.color,
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            See How It Works for {currentRole.label}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}





