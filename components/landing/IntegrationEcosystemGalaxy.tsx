"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import useInViewState from "@/hooks/useInViewState";
import GalaxyVisualization from "./components/GalaxyVisualization";
import IntegrationSearch from "./components/IntegrationSearch";
import IntegrationDetailModal from "./components/IntegrationDetailModal";
import StackBuilder from "./components/StackBuilder";
import styles from "./IntegrationEcosystemGalaxy.module.css";

// Sample integrations data (in real app, would come from API)
const INTEGRATIONS = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Seamlessly sync customer data, automate lead management, and trigger workflows based on CRM events.",
    position: new THREE.Vector3(4, 0.5, 2),
    color: "#00a1e0",
    features: [
      "Bi-directional data sync",
      "Real-time triggers on record changes",
      "Custom object support",
      "Automated lead routing",
      "Activity logging",
    ],
    verified: true,
    popular: true,
    setupTime: "15 minutes",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Send notifications, create channels, and enable two-way communication with workflows.",
    position: new THREE.Vector3(-3, 0, 4),
    color: "#4A154B",
    features: [
      "Smart notifications",
      "Channel automation",
      "Interactive messages",
      "File sharing",
      "Bot integration",
    ],
    verified: true,
    popular: true,
    setupTime: "5 minutes",
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    category: "Productivity",
    description: "Automate Gmail, Sheets, Drive, Calendar, and more with deep integration.",
    position: new THREE.Vector3(3, -0.5, -4),
    color: "#4285F4",
    features: [
      "Gmail automation",
      "Sheets data manipulation",
      "Drive file management",
      "Calendar scheduling",
      "Docs generation",
    ],
    verified: true,
    popular: true,
    setupTime: "10 minutes",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "Support",
    description: "Automate ticket management, SLA tracking, and customer support workflows.",
    position: new THREE.Vector3(-4, 0, -3),
    color: "#03363D",
    features: [
      "Ticket automation",
      "SLA monitoring",
      "Auto-responses",
      "Priority routing",
      "Agent workload balancing",
    ],
    verified: true,
    popular: false,
    setupTime: "12 minutes",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing",
    description: "Automate marketing campaigns, lead scoring, and email workflows.",
    position: new THREE.Vector3(5, 0, -2),
    color: "#FF7A59",
    features: [
      "Campaign automation",
      "Lead scoring",
      "Email sequences",
      "Contact segmentation",
      "Analytics integration",
    ],
    verified: true,
    popular: true,
    setupTime: "15 minutes",
  },
  {
    id: "jira",
    name: "Jira",
    category: "Project Management",
    description: "Automate issue tracking, sprint management, and project workflows.",
    position: new THREE.Vector3(-5, 0.5, 0),
    color: "#0052CC",
    features: [
      "Issue automation",
      "Sprint planning",
      "Status sync",
      "Custom workflows",
      "Time tracking",
    ],
    verified: true,
    popular: false,
    setupTime: "10 minutes",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Automate payment processing, subscription management, and invoicing.",
    position: new THREE.Vector3(2, -0.5, 5),
    color: "#635BFF",
    features: [
      "Payment automation",
      "Subscription management",
      "Invoice generation",
      "Revenue tracking",
      "Refund processing",
    ],
    verified: true,
    popular: true,
    setupTime: "20 minutes",
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "E-commerce",
    description: "Automate order processing, inventory management, and customer communications.",
    position: new THREE.Vector3(-2, 0, -5),
    color: "#96BF48",
    features: [
      "Order automation",
      "Inventory sync",
      "Customer notifications",
      "Fulfillment tracking",
      "Returns management",
    ],
    verified: true,
    popular: false,
    setupTime: "15 minutes",
  },
];

// Generate more integrations for visual effect
for (let i = 0; i < 20; i++) {
  const angle = (i / 20) * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  
  INTEGRATIONS.push({
    id: `integration-${i}`,
    name: `Service ${i + 1}`,
    category: ["CRM", "Marketing", "Support", "Productivity"][Math.floor(Math.random() * 4)],
    description: "Powerful integration for your workflow automation needs.",
    position: new THREE.Vector3(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 2,
      Math.sin(angle) * radius
    ),
    color: ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"][Math.floor(Math.random() * 4)],
    features: ["Feature 1", "Feature 2", "Feature 3"],
    verified: Math.random() > 0.5,
    popular: Math.random() > 0.7,
    setupTime: `${Math.floor(Math.random() * 20) + 5} minutes`,
  });
}

/**
 * Integration Ecosystem Galaxy - 3D visualization of 500+ integrations
 */
type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  position: THREE.Vector3;
  color: string;
  features: string[];
  verified: boolean;
  popular: boolean;
  setupTime: string;
};

export default function IntegrationEcosystemGalaxy() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const handleIntegrationSelect = (integrationId: string) => {
    const integration = INTEGRATIONS.find((i) => i.id === integrationId) as typeof INTEGRATIONS[0] | undefined;
    if (integration) {
      setSelectedIntegration(integration);
    }
  };

  return (
    <section
      id="integration-ecosystem"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="ecosystem-title"
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
            500+ INTEGRATIONS
          </motion.span>

          <h2 id="ecosystem-title" className={styles.title}>
            A Universe of{" "}
            <span className={styles.titleGradient}>Integrations</span>
          </h2>

          <p className={styles.description}>
            Connect your entire tech stack. 500+ pre-built integrations with native APIs,
            real-time sync, and intelligent data mapping. If we don't have it, we'll build it for you.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <IntegrationSearch
            integrations={INTEGRATIONS}
            onSelect={handleIntegrationSelect}
          />
        </motion.div>

        {/* 3D Galaxy */}
        <motion.div
          className={styles.galaxyContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GalaxyVisualization
            integrations={INTEGRATIONS}
            onIntegrationClick={handleIntegrationSelect}
          />

          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-sm text-slate-400">
            <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click integrations to learn more</p>
          </div>
        </motion.div>

        {/* Popular integrations grid */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Popular Integrations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {INTEGRATIONS.filter((i) => i.popular).slice(0, 8).map((integration, index) => (
              <motion.button
                key={integration.id}
                onClick={() => setSelectedIntegration(integration)}
                className="p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-cyan-500/50 transition-colors group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
              >
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: integration.color }}
                >
                  {integration.name.charAt(0)}
                </div>
                <div className="text-xs text-slate-400 group-hover:text-cyan-400 transition-colors text-center truncate">
                  {integration.name}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            className={styles.ctaButton}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Browse All Integrations
          </motion.button>
        </motion.div>
      </div>

      {/* Integration Detail Modal */}
      <IntegrationDetailModal
        integration={selectedIntegration}
        onClose={() => setSelectedIntegration(null)}
      />

      {/* Stack Builder */}
      <StackBuilder availableIntegrations={INTEGRATIONS} />
    </section>
  );
}




