"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useInViewState from "@/hooks/useInViewState";
import AIAvatar from "./components/AIAvatar";
import NeuralNetworkViz from "./components/NeuralNetworkViz";
import SplitScreenDemo from "./components/SplitScreenDemo";
import VoiceOfCustomer from "./components/VoiceOfCustomer";
import InteractiveRoleSelector from "./components/InteractiveRoleSelector";
import type { UserRole } from "@/types/landing";
import styles from "./AdaptiveIntelligenceShowcase.module.css";

const ROLES: UserRole[] = [
  {
    id: "finance",
    label: "Finance",
    icon: "📊",
    description: "Automated reconciliation, variance alerts, audit trails",
    color: "#10b981",
    metrics: [],
  },
  {
    id: "support",
    label: "Support",
    icon: "🎧",
    description: "AI-powered resolution, deflection, sentiment analysis",
    color: "#f59e0b",
    metrics: [],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "⚙️",
    description: "Intelligent routing, predictive maintenance, optimization",
    color: "#8b5cf6",
    metrics: [],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "📣",
    description: "Campaign orchestration, lead scoring, conversion optimization",
    color: "#ec4899",
    metrics: [],
  },
];

const SPLIT_SCREEN_DATA = {
  finance: {
    left: {
      title: "Finance Dashboard",
      features: [
        "Real-time reconciliation",
        "Variance detection",
        "Automated audit trails",
        "Predictive cash flow",
      ],
      metrics: [
        { label: "Accuracy", value: "99.97%" },
        { label: "Time Saved", value: "142 hrs" },
      ],
      color: "#10b981",
    },
    right: {
      title: "Finance Insights",
      features: [
        "Anomaly alerts",
        "Compliance monitoring",
        "Risk scoring",
        "Report generation",
      ],
      metrics: [
        { label: "Automation", value: "87%" },
        { label: "ROI", value: "6.2x" },
      ],
      color: "#10b981",
    },
  },
  support: {
    left: {
      title: "Support Console",
      features: [
        "AI ticket routing",
        "Sentiment analysis",
        "Auto-responses",
        "Knowledge base AI",
      ],
      metrics: [
        { label: "Resolution", value: "64%" },
        { label: "CSAT", value: "94.2%" },
      ],
      color: "#f59e0b",
    },
    right: {
      title: "Support Analytics",
      features: [
        "Deflection tracking",
        "Agent assist AI",
        "Quality scoring",
        "Trend analysis",
      ],
      metrics: [
        { label: "Time Saved", value: "89 hrs" },
        { label: "Cost Down", value: "47%" },
      ],
      color: "#f59e0b",
    },
  },
  operations: {
    left: {
      title: "Operations Hub",
      features: [
        "Predictive maintenance",
        "Resource optimization",
        "Workflow automation",
        "Capacity planning",
      ],
      metrics: [
        { label: "Efficiency", value: "+76%" },
        { label: "Downtime", value: "-68%" },
      ],
      color: "#8b5cf6",
    },
    right: {
      title: "Operations Intelligence",
      features: [
        "Real-time monitoring",
        "Smart alerts",
        "Cost optimization",
        "Performance metrics",
      ],
      metrics: [
        { label: "Savings", value: "$420K" },
        { label: "ROI", value: "5.1x" },
      ],
      color: "#8b5cf6",
    },
  },
  marketing: {
    left: {
      title: "Marketing Command",
      features: [
        "Campaign automation",
        "Lead scoring AI",
        "Content optimization",
        "Channel orchestration",
      ],
      metrics: [
        { label: "Velocity", value: "+19%" },
        { label: "Conv Rate", value: "+31%" },
      ],
      color: "#ec4899",
    },
    right: {
      title: "Marketing Intelligence",
      features: [
        "Attribution modeling",
        "Predictive analytics",
        "A/B testing AI",
        "Performance tracking",
      ],
      metrics: [
        { label: "ROI", value: "5.2x" },
        { label: "Reach", value: "+42%" },
      ],
      color: "#ec4899",
    },
  },
};

const CUSTOMER_QUOTES = {
  finance: [
    {
      quote: "The AI catches discrepancies we would never spot manually. It's like having a tireless auditor that learns our patterns.",
      author: "Sarah Chen",
      role: "CFO",
      company: "TechCorp Global",
    },
    {
      quote: "Month-end close went from 5 days to 8 hours. The AI handles all the reconciliation automatically.",
      author: "Michael Rodriguez",
      role: "Controller",
      company: "Enterprise Finance LLC",
    },
  ],
  support: [
    {
      quote: "Our CSAT scores jumped 23% after implementing AI-powered ticket routing. Customers get to the right expert instantly.",
      author: "Jennifer Park",
      role: "Head of Support",
      company: "CloudServe Inc",
    },
    {
      quote: "64% of tickets are now resolved by AI before reaching an agent. Our team can focus on complex issues that matter.",
      author: "David Thompson",
      role: "Support Director",
      company: "ServiceHub",
    },
  ],
  operations: [
    {
      quote: "Predictive maintenance alone saved us $420K in downtime. The AI knows our systems better than we do.",
      author: "Lisa Anderson",
      role: "VP Operations",
      company: "Manufacturing Solutions",
    },
    {
      quote: "Resource allocation is completely automated now. The AI optimizes our capacity in real-time.",
      author: "James Wilson",
      role: "Operations Manager",
      company: "LogisticsPro",
    },
  ],
  marketing: [
    {
      quote: "Campaign velocity increased 19% with AI orchestration. We're launching more, learning faster, converting better.",
      author: "Emily Zhang",
      role: "CMO",
      company: "GrowthTech",
    },
    {
      quote: "The AI's lead scoring is 31% more accurate than our manual process. We're closing deals faster than ever.",
      author: "Robert Martinez",
      role: "Marketing Director",
      company: "SalesForce Solutions",
    },
  ],
};

/**
 * Adaptive Intelligence Showcase - Demonstrates role-based personalization
 */
export default function AdaptiveIntelligenceShowcase() {
  const [activeRole, setActiveRole] = useState("finance");
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const currentRole = ROLES.find((r) => r.id === activeRole) || ROLES[0];
  const splitScreenData = SPLIT_SCREEN_DATA[activeRole as keyof typeof SPLIT_SCREEN_DATA];
  const customerQuotes = CUSTOMER_QUOTES[activeRole as keyof typeof CUSTOMER_QUOTES];

  return (
    <section
      id="adaptive-intelligence"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="adaptive-intelligence-title"
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
            INTELLIGENT ADAPTATION
          </motion.span>

          <h2 id="adaptive-intelligence-title" className={styles.title}>
            One System,{" "}
            <span
              className={styles.titleGradient}
              style={{
                background: `linear-gradient(90deg, ${currentRole.color}, #06b6d4)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Infinite Optimizations
            </span>
          </h2>

          <p className={styles.description}>
            The system learns your role, understands your challenges, and automatically optimizes
            its responses. Not a tool built for everyone. A system that adapts to each of you.
          </p>
        </motion.div>

        {/* AI Avatars */}
        <motion.div
          className="flex justify-center gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {ROLES.map((role) => (
            <div key={role.id} onClick={() => setActiveRole(role.id)} className="cursor-pointer">
              <AIAvatar
                role={role.label}
                color={role.color}
                icon={role.icon}
                isActive={activeRole === role.id}
              />
            </div>
          ))}
        </motion.div>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <InteractiveRoleSelector
            roles={ROLES}
            activeRole={activeRole}
            onRoleChange={setActiveRole}
          />
        </motion.div>

        {/* Neural Network Visualization */}
        <motion.div
          className={styles.visualizationCard}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>AI Decision Engine in Action</h3>
            <p className={styles.cardDescription}>
              Watch how the neural network processes your role-specific workflows
            </p>
          </div>
          <NeuralNetworkViz isActive={isInView} color={currentRole.color} />
        </motion.div>

        {/* Split Screen Demo */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <SplitScreenDemo
            leftRole={splitScreenData.left}
            rightRole={splitScreenData.right}
            isActive={isInView}
          />
        </motion.div>

        {/* Voice of Customer */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <VoiceOfCustomer
            quotes={customerQuotes}
            activeRoleId={activeRole}
            color={currentRole.color}
          />
        </motion.div>
      </div>
    </section>
  );
}





