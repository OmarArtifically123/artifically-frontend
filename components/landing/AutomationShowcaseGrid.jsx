"use client";

import { motion } from "framer-motion";

import AnimatedSection from "../AnimatedSection.jsx";
import { SPRING_CONFIGS } from "../../constants/animations.js";

const automationItems = [
  {
    id: "incident-triage",
    title: "Incident Triage Co-Pilot",
    description: "Route critical incidents with AI-prioritized severity scoring and escalation flows.",
    metrics: "MTTR ↓ 42%",
  },
  {
    id: "revenue-intelligence",
    title: "Revenue Intelligence Analyst",
    description: "Automate pipeline hygiene, close plan insights, and forecast reconciliation in minutes.",
    metrics: "Forecast accuracy ↑ 28%",
  },
  {
    id: "support-autoresolve",
    title: "Support Auto-Resolve",
    description: "Deflect repetitive tickets with natural-language summarization and verification loops.",
    metrics: "Resolution rate ↑ 61%",
  },
  {
    id: "finance-automation",
    title: "Finance Close Automation",
    description: "Streamline close prep, reconciliations, and policy checks with automated narratives.",
    metrics: "Close cycle ↓ 35%",
  },
  {
    id: "marketing-orchestration",
    title: "Marketing Orchestrator",
    description: "Trigger multi-channel nurture journeys as soon as intent spikes across product signals.",
    metrics: "Pipeline velocity ↑ 19%",
  },
  {
    id: "trust-safety",
    title: "Trust & Safety Guardian",
    description: "Protect communities with automated detection, reviewer queues, and compliance snapshots.",
    metrics: "False positives ↓ 47%",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 80ms between each child
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function AutomationCard({ title, description, metrics }) {
  return (
    <div className="automation-showcase__card">
      <div className="automation-showcase__card-header">
        <h3>{title}</h3>
        <span>{metrics}</span>
      </div>
      <p>{description}</p>
    </div>
  );
}

export default function AutomationShowcaseGrid() {
  return (
    <section className="automation-showcase" aria-labelledby="automation-showcase-heading">
      <div className="automation-showcase__inner">
        <AnimatedSection>
          <header className="automation-showcase__header">
            <p className="automation-showcase__eyebrow">CURATED AUTOMATIONS</p>
            <h2 id="automation-showcase-heading">Staggered deployment-ready automations</h2>
            <p className="automation-showcase__description">
              Explore a sampling of Artifically automations surfaced with precise motion choreography to emphasize clarity
              and intent.
            </p>
          </header>
        </AnimatedSection>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="automation-showcase__grid"
        >
          {automationItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { ...SPRING_CONFIGS.medium },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <AutomationCard {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}