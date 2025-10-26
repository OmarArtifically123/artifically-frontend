"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import AnimatedSection from "../AnimatedSection.jsx";
import { ANIMATION_TIMINGS, SPRING_CONFIGS } from "../../constants/animations.js";

const featureTabs = [
  {
    id: "demos",
    label: "Interactive Demos",
  },
  {
    id: "library",
    label: "Workflow Library",
  },
  {
    id: "compliance",
    label: "Compliance Guardrails",
  },
  {
    id: "integrations",
    label: "Enterprise Integrations",
  },
];

const panelVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMINGS.slow / 1000,
      delay: ANIMATION_TIMINGS.micro / 1000,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: ANIMATION_TIMINGS.fast / 1000,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function FeaturesShowcaseSection() {
  const [active, setActive] = useState(featureTabs[0].id);
  const activeTab = useMemo(
    () => featureTabs.find((tab) => tab.id === active) ?? featureTabs[0],
    [active],
  );

  const handleKeyDown = (e, currentIndex) => {
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % featureTabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + featureTabs.length) % featureTabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = featureTabs.length - 1;
    } else {
      return;
    }

    setActive(featureTabs[newIndex].id);
    // Focus will be managed by React re-render
  };

  return (
    <section
      id="features-showcase"
      className="features-capabilities"
      aria-labelledby="features-title"
    >
      <div className="features-capabilities__inner">
        <AnimatedSection>
          <header className="features-capabilities__header">
            <p className="features-capabilities__eyebrow">EVERYTHING YOU NEED</p>
            <h2 id="features-title" className="features-capabilities__title">
              Artifically combines AI copilots, human-in-the-loop controls, and pre-built
              playbooks so every team moves faster without compromising trust.
            </h2>
          </header>
        </AnimatedSection>

        <nav
          className="features-capabilities__tabs"
          role="tablist"
          aria-label="Key platform capabilities"
        >
          {featureTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              type="button"
              id={`feature-tab-${tab.id}`}
              className="features-capabilities__tab"
              role="tab"
              aria-controls={`feature-panel-${tab.id}`}
              aria-selected={active === tab.id}
              tabIndex={active === tab.id ? 0 : -1}
              data-active={active === tab.id ? "true" : undefined}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              whileHover={{
                scale: 1.03,
                transition: { type: "spring", ...SPRING_CONFIGS.medium },
              }}
              whileTap={{ scale: 0.96 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </nav>

        <div className="features-capabilities__panels">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeTab.id}
              className="features-capabilities__panel"
              id={`feature-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`feature-tab-${activeTab.id}`}
              aria-live="polite"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="features-capabilities__panel-shell">
                {activeTab.id === "demos" && <InteractiveDemosContent />}
                {activeTab.id === "library" && <WorkflowLibraryContent />}
                {activeTab.id === "compliance" && <ComplianceGuardrailsContent />}
                {activeTab.id === "integrations" && <EnterpriseIntegrationsContent />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function InteractiveDemosContent() {
  return (
    <div className="features-capabilities__panel-grid">
      <div className="features-capabilities__panel-copy">
        <h3>Launch immersive WebGL or video walkthroughs</h3>
        <p>
          Spin up interactive scenes that mirror your production environment in a safe sandbox. Review how automations
          behave with scrubbed datasets, instrumentation overlays, and guided voice narration before a single change
          touches production.
        </p>
        <p>
          Product, operations, and compliance teams can co-review every branch of an automation, annotate key decision
          points, and capture approvals in context—no more disconnected slide decks.
        </p>
        <ul className="features-capabilities__list">
          <li>Branch-by-branch walkthroughs rendered directly from workflow logic.</li>
          <li>Guided commentary and hotspots that surface KPIs, ownership, and risk signals.</li>
          <li>Session replays archived for auditors with timestamped approval history.</li>
        </ul>
        <Link className="features-capabilities__cta" href="/demos">
          Launch a demo →
        </Link>
      </div>
      <div className="features-capabilities__panel-visual">
        <div className="features-capabilities__mockup features-capabilities__mockup--demos">
          <div className="features-capabilities__mockup-header">
            <span>WebGL Sandbox</span>
            <span>Live preview</span>
          </div>
          <div className="features-capabilities__mockup-body">
            <div className="features-capabilities__mockup-preview" />
            <div className="features-capabilities__mockup-sidebar">
              <strong>Steps</strong>
              <ol>
                <li>Initialize synthetic dataset</li>
                <li>Simulate branching dialog</li>
                <li>Validate policy guardrails</li>
                <li>Capture approvals</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const workflowHighlights = [
  {
    title: "Launch-ready playbooks",
    description: "Pre-orchestrated flows for revenue, support, trust & safety, and operations.",
  },
  {
    title: "Composable modules",
    description: "Mix human approvals, AI copilots, and RPA steps with drag-and-drop ease.",
  },
  {
    title: "Versioned governance",
    description: "Ship confidently with diff views, policy gates, and change tracking baked in.",
  },
];

function WorkflowLibraryContent() {
  return (
    <div className="features-capabilities__panel-grid">
      <div className="features-capabilities__panel-copy">
        <h3>Publish from a curated workflow catalog</h3>
        <p>
          Explore a continuously growing library of cross-functional playbooks crafted with industry experts. Filter by
          KPI, complexity, or integration stack, then tailor the blueprint to your team in minutes.
        </p>
        <p>
          Each workflow ships with documentation, testing harnesses, and rollout plans so program leads can adopt at
          enterprise scale without slowing down IT.
        </p>
      </div>
      <div className="features-capabilities__panel-visual">
        <div className="features-capabilities__catalog">
          {workflowHighlights.map((highlight) => (
            <article key={highlight.title} className="features-capabilities__catalog-card">
              <h4>{highlight.title}</h4>
              <p>{highlight.description}</p>
              <button type="button">Preview playbook</button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const complianceBadges = [
  "SOC 2 Type II",
  "GDPR",
  "ISO 27001",
  "HIPAA",
  "FedRAMP Ready",
  "CCPA",
  "PCI DSS",
];

function ComplianceGuardrailsContent() {
  return (
    <div className="features-capabilities__panel-grid">
      <div className="features-capabilities__panel-copy">
        <h3>Embed compliance from the first draft</h3>
        <p>
          Automated guardrails monitor every run for policy violations, data residency conflicts, and access anomalies.
          Real-time alerts, hold-to-run controls, and tamper-evident logs give security teams instant visibility.
        </p>
        <p>
          Map controls to frameworks once and propagate updates across every workflow without refactoring core logic.
        </p>
        <ul className="features-capabilities__list">
          <li>Evidence snapshots generated automatically for auditors and stakeholders.</li>
          <li>Fine-grained retention and redaction pipelines keep sensitive records protected.</li>
          <li>Approval matrices aligned to regional policy variations and duty-of-care standards.</li>
        </ul>
      </div>
      <div className="features-capabilities__panel-visual">
        <div className="features-capabilities__badge-board">
          {complianceBadges.map((badge) => (
            <span key={badge} className="features-capabilities__badge">
              {badge}
            </span>
          ))}
          <div className="features-capabilities__badge-note">
            Continuous monitoring maps every control back to its certification requirement, so audit prep drops from
            months to hours.
          </div>
        </div>
      </div>
    </div>
  );
}

const integrationLogos = [
  { name: "Salesforce", color: "#00A1E0" },
  { name: "SAP", color: "#0FA9FF" },
  { name: "ServiceNow", color: "#4DAA57" },
  { name: "Workday", color: "#3A7BD5" },
  { name: "Snowflake", color: "#56CCF2" },
  { name: "Oracle", color: "#E74C3C" },
  { name: "Slack", color: "#4A154B" },
  { name: "Databricks", color: "#FF5F45" },
];

function EnterpriseIntegrationsContent() {
  return (
    <div className="features-capabilities__panel-grid">
      <div className="features-capabilities__panel-copy">
        <h3>Connect the enterprise stack without friction</h3>
        <p>
          Synchronize mission-critical systems with bi-directional connectors, streaming APIs, and managed queues that
          keep data fresh everywhere. Configure routing, retries, and fallback logic through a visual policy builder.
        </p>
        <p>
          From CRM and ERP to bespoke on-prem services, the integration fabric respects governance, throttling, and
          observability requirements out of the box.
        </p>
        <ul className="features-capabilities__list">
          <li>Granular scopes with OAuth, SSO, and service accounts managed centrally.</li>
          <li>Streaming webhooks translate events into actionable workflow triggers.</li>
          <li>Health dashboards highlight latency, error budgets, and recent releases.</li>
        </ul>
      </div>
      <div className="features-capabilities__panel-visual">
        <div className="features-capabilities__logo-grid">
          {integrationLogos.map((logo) => (
            <span
              key={logo.name}
              className="features-capabilities__logo"
              style={{ "--logo-color": logo.color }}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}