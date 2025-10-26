"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useInViewState from "@/hooks/useInViewState";
import LiveMetricsDashboard from "./components/LiveMetricsDashboard";
import IndustryFilter from "./components/IndustryFilter";
import BeforeAfterComparison from "./components/BeforeAfterComparison";
import TrustBadges from "./components/TrustBadges";
import styles from "./ProvenAtScale.module.css";

const LIVE_METRICS = [
  {
    id: "automation",
    label: "Avg Automation Rate",
    value: 74,
    unit: "%",
    trend: "up" as const,
    color: "#0ea5e9",
    icon: "⚡",
  },
  {
    id: "cost",
    label: "Avg Cost Reduction",
    value: 52,
    unit: "%",
    trend: "up" as const,
    color: "#10b981",
    icon: "💰",
  },
  {
    id: "time",
    label: "Hours Freed Weekly",
    value: 118,
    unit: "hrs",
    trend: "up" as const,
    color: "#f59e0b",
    icon: "⏱️",
  },
  {
    id: "roi",
    label: "Customer ROI",
    value: 5.1,
    unit: "x avg",
    trend: "up" as const,
    color: "#8b5cf6",
    icon: "📈",
  },
];

const INDUSTRY_FILTERS = [
  { id: "finance", label: "Finance", icon: "💼", count: 127 },
  { id: "healthcare", label: "Healthcare", icon: "🏥", count: 89 },
  { id: "retail", label: "Retail", icon: "🛍️", count: 104 },
  { id: "tech", label: "Technology", icon: "💻", count: 156 },
  { id: "manufacturing", label: "Manufacturing", icon: "🏭", count: 73 },
];

const TRUST_BADGES = [
  { id: "soc2", name: "SOC 2 Type II", acronym: "SOC2", icon: "🔒", description: "Security & compliance certified" },
  { id: "hipaa", name: "HIPAA Compliant", acronym: "HIPAA", icon: "🏥", description: "Healthcare data protection" },
  { id: "fedramp", name: "FedRAMP Authorized", acronym: "FedRAMP", icon: "🏛️", description: "Federal security standards" },
  { id: "iso", name: "ISO 27001", acronym: "ISO", icon: "✓", description: "Information security management" },
  { id: "gdpr", name: "GDPR Compliant", acronym: "GDPR", icon: "🌍", description: "EU data protection" },
  { id: "ccpa", name: "CCPA Compliant", acronym: "CCPA", icon: "🛡️", description: "California privacy" },
];

const BEFORE_AFTER = [
  {
    label: "Processing Time",
    before: "5-7 days",
    after: "8 hours",
    improvement: "85%",
    color: "#06b6d4",
  },
  {
    label: "Error Rate",
    before: "12.3%",
    after: "0.03%",
    improvement: "99.7%",
    color: "#10b981",
  },
  {
    label: "Manual Work",
    before: "142 hrs/wk",
    after: "12 hrs/wk",
    improvement: "92%",
    color: "#f59e0b",
  },
];

/**
 * Proven At Scale - Consolidated section showing metrics and customer success
 */
export default function ProvenAtScale() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const handleFilterToggle = (filterId: string) => {
    if (filterId === "all") {
      setActiveFilters([]);
    } else {
      setActiveFilters((prev) =>
        prev.includes(filterId)
          ? prev.filter((id) => id !== filterId)
          : [...prev, filterId]
      );
    }
  };

  return (
    <section
      id="proven-at-scale"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="proven-title"
    >
      {/* Background */}
      <div className={styles.background}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span className={styles.badge}>PROVEN IMPACT</motion.span>

          <h2 id="proven-title" className={styles.title}>
            Real Results from{" "}
            <span className={styles.titleGradient}>Real Deployments</span>
          </h2>

          <p className={styles.description}>
            These aren't projections or case studies. These are live metrics from active systems
            right now, demonstrating transformative power at enterprise scale.
          </p>
        </motion.div>

        {/* Live Metrics Dashboard */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LiveMetricsDashboard metrics={LIVE_METRICS} isActive={isInView} />
        </motion.div>

        {/* Before/After Comparison */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Typical Transformation Metrics
          </h3>
          <BeforeAfterComparison metrics={BEFORE_AFTER} isActive={isInView} />
        </motion.div>

        {/* Industry Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <IndustryFilter
            options={INDUSTRY_FILTERS}
            activeFilters={activeFilters}
            onToggle={handleFilterToggle}
          />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Enterprise Security & Compliance
          </h3>
          <TrustBadges badges={TRUST_BADGES} isActive={isInView} />
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { label: "Companies", value: "500+", color: "#0ea5e9" },
            { label: "Automations", value: "18.7K+", color: "#10b981" },
            { label: "Hours Freed", value: "2.1M+", color: "#f59e0b" },
            { label: "Avg ROI", value: "5.1x", color: "#8b5cf6" },
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





