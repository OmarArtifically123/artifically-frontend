"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import useInViewState from "@/hooks/useInViewState";
import Architecture3DGraph from "./components/Architecture3DGraph";
import ComponentZoomView from "./components/ComponentZoomView";
import XRayMode from "./components/XRayMode";
import type { GraphNode, GraphEdge } from "@/types/three-components";
import styles from "./TechnologyArchitectureExplorer.module.css";

// Architecture nodes
const NODES: GraphNode[] = [
  {
    id: "ai-engine",
    label: "AI Decision Engine",
    position: new THREE.Vector3(0, 0, 0),
    color: "#8b5cf6",
    size: 1,
    metadata: {
      description: "Machine learning models that learn from your processes",
      features: [
        "500M+ decisions per day",
        "Real-time pattern recognition",
        "Predictive analytics",
        "Continuous learning",
      ],
      metrics: [
        { label: "Throughput", value: "500M/day" },
        { label: "Accuracy", value: "99.7%" },
        { label: "Latency", value: "<100ms" },
        { label: "Uptime", value: "99.98%" },
      ],
      connections: ["Workflow Orchestration", "Integration Hub", "Analytics Engine"],
    },
  },
  {
    id: "orchestration",
    label: "Workflow Orchestration",
    position: new THREE.Vector3(-5, 3, 0),
    color: "#06b6d4",
    size: 0.8,
    metadata: {
      description: "Design, deploy, and optimize complex multi-step automations",
      features: [
        "Visual no-code designer",
        "10K+ flows deployed",
        "Version control & rollback",
        "Real-time testing",
      ],
      metrics: [
        { label: "Active Flows", value: "10,247" },
        { label: "Success Rate", value: "99.92%" },
        { label: "Avg Response", value: "1.2s" },
        { label: "Deployments/Day", value: "1,200" },
      ],
      connections: ["AI Decision Engine", "Integration Hub", "Governance Layer"],
    },
  },
  {
    id: "integration",
    label: "Integration Hub",
    position: new THREE.Vector3(5, 3, 0),
    color: "#10b981",
    size: 0.8,
    metadata: {
      description: "Connect 500+ enterprise systems with native APIs",
      features: [
        "500+ pre-built connectors",
        "Real-time data sync",
        "Custom API support",
        "Intelligent data mapping",
      ],
      metrics: [
        { label: "Integrations", value: "500+" },
        { label: "Data Points/sec", value: "50K" },
        { label: "Sync Success", value: "99.95%" },
        { label: "API Calls/day", value: "10M+" },
      ],
      connections: ["AI Decision Engine", "Workflow Orchestration", "Data Layer"],
    },
  },
  {
    id: "monitoring",
    label: "Proactive Monitoring",
    position: new THREE.Vector3(-5, -3, 0),
    color: "#f59e0b",
    size: 0.7,
    metadata: {
      description: "Real-time anomaly detection and predictive alerting",
      features: [
        "99.98% uptime SLA",
        "Anomaly detection",
        "Predictive alerts",
        "Performance optimization",
      ],
      metrics: [
        { label: "Uptime", value: "99.98%" },
        { label: "MTTR", value: "12 min" },
        { label: "False Positives", value: "< 1%" },
        { label: "Metrics/sec", value: "100K" },
      ],
      connections: ["AI Decision Engine", "Workflow Orchestration"],
    },
  },
  {
    id: "governance",
    label: "Governance Layer",
    position: new THREE.Vector3(5, -3, 0),
    color: "#ec4899",
    size: 0.7,
    metadata: {
      description: "Enterprise compliance, audit trails, and controls",
      features: [
        "SOC2, HIPAA, FedRAMP compliant",
        "Comprehensive audit logs",
        "Role-based access control",
        "Approval workflows",
      ],
      metrics: [
        { label: "Audit Events", value: "1M+/day" },
        { label: "Compliance", value: "100%" },
        { label: "Access Controls", value: "2,500+" },
        { label: "Policy Checks", value: "50M/day" },
      ],
      connections: ["Workflow Orchestration", "Data Layer"],
    },
  },
  {
    id: "analytics",
    label: "Analytics Engine",
    position: new THREE.Vector3(0, -5, 0),
    color: "#0ea5e9",
    size: 0.6,
    metadata: {
      description: "Advanced analytics and business intelligence",
      features: [
        "Real-time dashboards",
        "Custom reports",
        "Predictive insights",
        "ROI tracking",
      ],
      metrics: [
        { label: "Data Points", value: "100B+" },
        { label: "Query Speed", value: "<500ms" },
        { label: "Reports/day", value: "50K" },
        { label: "Dashboards", value: "5,000+" },
      ],
      connections: ["AI Decision Engine"],
    },
  },
  {
    id: "data-layer",
    label: "Data Layer",
    position: new THREE.Vector3(0, 5, 0),
    color: "#a855f7",
    size: 0.6,
    metadata: {
      description: "Secure, scalable data storage and management",
      features: [
        "Multi-region replication",
        "Real-time sync",
        "End-to-end encryption",
        "GDPR compliant",
      ],
      metrics: [
        { label: "Storage", value: "500TB+" },
        { label: "Transactions/sec", value: "100K" },
        { label: "Latency", value: "<50ms" },
        { label: "Durability", value: "99.999999999%" },
      ],
      connections: ["Integration Hub", "Governance Layer"],
    },
  },
];

// Connections between nodes
const EDGES: GraphEdge[] = [
  { id: "e1", source: "ai-engine", target: "orchestration", color: "#8b5cf6" },
  { id: "e2", source: "ai-engine", target: "integration", color: "#8b5cf6" },
  { id: "e3", source: "ai-engine", target: "monitoring", color: "#8b5cf6" },
  { id: "e4", source: "ai-engine", target: "analytics", color: "#8b5cf6" },
  { id: "e5", source: "orchestration", target: "integration", color: "#06b6d4" },
  { id: "e6", source: "orchestration", target: "governance", color: "#06b6d4" },
  { id: "e7", source: "integration", target: "data-layer", color: "#10b981" },
  { id: "e8", source: "governance", target: "data-layer", color: "#ec4899" },
];

/**
 * Technology Architecture Explorer - Interactive 3D visualization of system architecture
 */
export default function TechnologyArchitectureExplorer() {
  const [selectedComponent, setSelectedComponent] = useState<{
    id: string;
    label: string;
    description: string;
    features: string[];
    metrics: Array<{ label: string; value: string }>;
    connections: string[];
  } | null>(null);
  const [xRayMode, setXRayMode] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const handleNodeClick = (nodeId: string) => {
    const node = NODES.find((n) => n.id === nodeId);
    if (node && node.metadata) {
      setSelectedComponent({
        id: node.id,
        label: node.label,
        description: node.metadata.description,
        features: node.metadata.features,
        metrics: node.metadata.metrics,
        connections: node.metadata.connections,
      });
    }
  };

  return (
    <section
      id="technology-architecture"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="architecture-title"
    >
      {/* Background effects */}
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
          <motion.span className={styles.badge}>THE OPERATING SYSTEM</motion.span>

          <h2 id="architecture-title" className={styles.title}>
            An Integrated System,{" "}
            <span className={styles.titleGradient}>Not a Collection of Tools</span>
          </h2>

          <p className={styles.description}>
            Every capability connects seamlessly. Every function amplifies the others. This is how
            true enterprise automation works at scale.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <XRayMode enabled={xRayMode} onToggle={() => setXRayMode(!xRayMode)} />
        </motion.div>

        {/* 3D Visualization */}
        <motion.div
          className={styles.visualizationCard}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Architecture3DGraph
            nodes={NODES}
            edges={EDGES}
            onNodeClick={handleNodeClick}
            xRayMode={xRayMode}
          />
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="mt-8 text-center text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click nodes to explore
          </p>
        </motion.div>

        {/* Component Details Modal */}
        <ComponentZoomView
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      </div>
    </section>
  );
}




