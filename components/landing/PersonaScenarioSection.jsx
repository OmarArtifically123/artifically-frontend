"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import AnimatedSection from "../AnimatedSection";
import { Icon } from "../icons";
import { SPRING_CONFIGS } from "../../constants/animations.js";

const personas = [
  {
    id: "finance",
    role: "Finance",
    title: "Finance Leadership",
    description:
      "Automate close prep, forecast workflows, and vendor triage with built-in controls and visibility.",
    features: ["Automated reconciliations", "Variance alerts in your inbox", "Self-serve spend approvals"],
    href: "/marketplace?persona=finance",
    icon: "dollar",
  },
  {
    id: "support",
    role: "Support",
    title: "Support Operations",
    description:
      "Coach agents in the moment, auto-summarise incidents, and protect CSAT without adding headcount.",
    features: ["Live agent co-pilot", "Autonomous deflection flows", "Sentiment heatmaps"],
    href: "/marketplace?persona=support",
    icon: "headphones",
  },
  {
    id: "operations",
    role: "Operations",
    title: "Operations Leaders",
    description:
      "Connect tooling, route escalations, and keep execs in the loop with real-time, governed automations.",
    features: ["Adaptive routing logic", "Audit-ready timelines", "Executive pulse reports"],
    href: "/marketplace?persona=operations",
    icon: "workflow",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function PersonaScenarioSection() {
  const cards = useMemo(() => personas, []);

  return (
    <section className="persona-scenarios" aria-labelledby="persona-scenarios-heading">
      <div className="persona-scenarios__inner">
        <AnimatedSection>
          <header className="persona-scenarios__header">
            <p className="persona-scenarios__eyebrow">SCENARIO-BASED NAVIGATION</p>
            <h2 id="persona-scenarios-heading">Choose the journey that matches your role</h2>
            <p className="persona-scenarios__description">
              Skip generic tours. Tell us who you are and we&apos;ll tailor automations, ROI snapshots, and recommended
              playbooks instantly.
            </p>
          </header>
        </AnimatedSection>
        <motion.div
          className="persona-scenarios__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {cards.map((persona) => (
            <motion.article
              key={persona.id}
              variants={itemVariants}
              className="persona-scenarios__card"
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { ...SPRING_CONFIGS.medium },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <PersonaCardContent persona={persona} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PersonaCardContent({ persona }) {
  return (
    <>
      <span className="persona-scenarios__icon" aria-hidden="true">
        <Icon name={persona.icon} size={28} />
      </span>
      <h3>{persona.title}</h3>
      <p>{persona.description}</p>
      <ul>
        {persona.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" size={18} className="persona-scenarios__feature-icon" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a className="persona-scenarios__cta" href={persona.href}>
        <span>Start with {persona.role}</span>
        <span className="persona-scenarios__cta-arrow" aria-hidden="true">
          →
        </span>
      </a>
    </>
  );
}