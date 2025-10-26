"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import useInViewState from "@/hooks/useInViewState";
import SecurityFortress3D from "./components/SecurityFortress3D";
import SecurityLayersExplorer from "./components/SecurityLayersExplorer";
import ComplianceCertifications from "./components/ComplianceCertifications";
import AuditTrailDemo from "./components/AuditTrailDemo";
import PenetrationTestResults from "./components/PenetrationTestResults";
import styles from "./TrustSecurityFortress.module.css";

/**
 * Trust & Security Fortress - Comprehensive security showcase
 */
export default function TrustSecurityFortress() {
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  return (
    <section
      id="security-fortress"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="security-title"
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
          <motion.span className={styles.badge}>
            ENTERPRISE SECURITY
          </motion.span>

          <h2 id="security-title" className={styles.title}>
            Security That{" "}
            <span className={styles.titleGradient}>Never Sleeps</span>
          </h2>

          <p className={styles.description}>
            Bank-grade security architecture with 24/7 monitoring, zero-trust principles,
            and compliance with the world's strictest regulations. Your data's fortress.
          </p>
        </motion.div>

        {/* 3D Security Fortress Visualization */}
        <motion.div
          className={styles.fortressCard}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-4 border-b border-slate-700 bg-slate-900/50">
            <h3 className="text-xl font-semibold text-white">
              Multi-Layer Security Architecture
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Interactive visualization of our security fortress
            </p>
          </div>
          <SecurityFortress3D />
          <div className="p-4 border-t border-slate-700 bg-slate-900/50 text-center text-sm text-slate-400">
            🖱️ Drag to rotate • 🔍 Scroll to zoom
          </div>
        </motion.div>

        {/* Security Layers Explorer */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SecurityLayersExplorer isActive={isInView} />
        </motion.div>

        {/* Compliance Certifications */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ComplianceCertifications isActive={isInView} />
        </motion.div>

        {/* Two Column: Audit Trail & Penetration Tests */}
        <motion.div
          className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div>
            <AuditTrailDemo />
          </div>
          <div>
            <PenetrationTestResults isActive={isInView} />
          </div>
        </motion.div>

        {/* Security Stats Summary */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { label: "Uptime SLA", value: "99.98%", color: "#10b981" },
            { label: "Security Incidents", value: "0", color: "#06b6d4" },
            { label: "Data Breaches", value: "0", color: "#8b5cf6" },
            { label: "Certifications", value: "8+", color: "#f59e0b" },
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

        {/* Trust Statement */}
        <motion.div
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <blockquote className="text-xl text-slate-300 italic mb-4">
            "Security isn't a feature. It's the foundation. Every line of code, every architecture decision, every deployment—built with security first."
          </blockquote>
          <div className="text-sm text-slate-400">
            — Chief Security Officer
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.button
            className={styles.ctaButton}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Read Our Security Whitepaper
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}


