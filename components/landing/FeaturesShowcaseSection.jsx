"use client";

import { useMemo, useState } from "react";
import { Icon } from "../icons";

const featureTabs = [
  {
    id: "demos",
    icon: "clapperboard",
    label: "Interactive Demos",
    description:
      "Launch immersive WebGL or video walkthroughs that mirror your production data in a safe sandbox before deploying.",
    preview: {
      eyebrow: "WebGL sandbox",
      icon: "flask",
      title: "Launch a safe sandbox",
      description:
        "Preview how the automation responds with your data, then promote it to production in one click.",
        stats: [
        { label: "Interactive flows", value: "28" },
        { label: "Adoption", value: "92%" },
      ],
    },
    highlights: [
      { icon: "sparkles", title: "One-Click Previews", description: "Spin up guided previews with telemetry overlays instantly." },
      { icon: "headphones", title: "Guided Walkthroughs", description: "Narrated tours showcase key KPIs and decision points." },
      { icon: "flask", title: "Sandboxed Data", description: "Inject scrubbed datasets to experience the workflow end-to-end." },
    ],
  },
  {
    id: "library",
    icon: "folders",
    label: "Workflow Library",
    description:
      "Browse modular blueprints curated by industry experts with playbooks that cover every department and KPI.",
    preview: {
      eyebrow: "Library spotlight",
      icon: "book",
      title: "Curated blueprints",
      description:
        "Remix modular components vetted by industry experts and publish with guardrails already in place.",
      stats: [
        { label: "Playbooks", value: "350+" },
        { label: "Industries", value: "18" },
      ],
    },
    highlights: [
      { icon: "book", title: "Version Control", description: "Track iterations with rollbacks and change approvals built-in." },
      { icon: "puzzle", title: "Composable Blocks", description: "Drag, remix, and publish reusable automation components." },
      { icon: "users", title: "Role-Based Access", description: "Assign granular permissions for builders, reviewers, and approvers." },
    ],
  },
  {
    id: "compliance",
    icon: "shield",
    label: "Compliance Guardrails",
    description:
      "Meet regulatory requirements automatically with guardrails that enforce policies, retention, and audit trails.",
    preview: {
      eyebrow: "Compliance heatmap",
      icon: "search",
      title: "Automated audits",
      description:
        "Continuously capture evidence, redline risky steps, and keep every policy aligned with the latest frameworks.",
      stats: [
        { label: "Controls automated", value: "120" },
        { label: "Audit prep", value: "< 2 hrs" },
      ],
    },
    highlights: [
      { icon: "clipboard", title: "Policy Templates", description: "Pre-built controls for SOC 2, HIPAA, GDPR, and ISO frameworks." },
      { icon: "search", title: "Automated Audits", description: "Continuous evidence collection keeps every workflow inspection-ready." },
      { icon: "shieldOutline", title: "Redaction Pipelines", description: "Inline scrubbing removes sensitive data before it leaves your network." },
    ],
  },
  {
    id: "integrations",
    icon: "plug",
    label: "Enterprise Integrations",
    description:
      "Connect mission-critical systems through secure connectors, streaming events, and bi-directional syncs.",
    preview: {
      eyebrow: "Integration map",
      icon: "refresh",
      title: "Bi-directional sync",
      description:
        "Stream data between 250+ connectors with conflict resolution that keeps every system in lockstep.",
      stats: [
        { label: "Connectors", value: "250+" },
        { label: "Sync latency", value: "< 60s" },
      ],
    },
    highlights: [
      { icon: "lock", title: "Secure Connectors", description: "Bring 250+ SaaS, data, and on-prem systems with scoped OAuth and SSO." },
      { icon: "globe", title: "Event Streams", description: "Real-time webhooks and queues ensure every automation stays in sync." },
      { icon: "recycle", title: "Bi-Directional Sync", description: "Keep records updated everywhere with conflict resolution built-in." },
    ],
  },
];

export default function FeaturesShowcaseSection() {
  const [active, setActive] = useState(featureTabs[0].id);
  const activeTab = useMemo(
    () => featureTabs.find((tab) => tab.id === active) ?? featureTabs[0],
    [active],
  );

  return (
    <section id="features-showcase" className="section-shell" aria-labelledby="features-title">
      <header className="section-header">
        <span className="section-eyebrow">Everything You Need</span>
        <h2 id="features-title" className="section-title">
          Built for Modern Enterprises
        </h2>
        <p className="section-subtitle">
          Artifically combines AI copilots, human-in-the-loop controls, and pre-built playbooks so every team moves faster without compromising trust.
        </p>
      </header>
      <div className="feature-tabs" role="tablist" aria-label="Key platform capabilities">
        {featureTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`feature-tab-${tab.id}`}
            aria-controls={`feature-panel-${tab.id}`}
            aria-selected={active === tab.id}
            className="feature-tab"
            data-active={active === tab.id}
            onClick={() => setActive(tab.id)}
          >
            <span aria-hidden="true" className="feature-tab__icon">
              <Icon name={tab.icon} size={20} />
            </span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="feature-content">
        <article
          key={activeTab.id}
          id={`feature-panel-${activeTab.id}`}
          className="demo-preview"
          role="tabpanel"
          aria-labelledby={`feature-tab-${activeTab.id}`}
          aria-live="polite"
        >
          <header style={{ display: "grid", gap: "0.4rem" }}>
            <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.8rem", color: "color-mix(in oklch, white 72%, var(--gray-400))" }}>
              {activeTab.preview.eyebrow}
            </span>
            <h3 style={{ fontSize: "1.6rem", color: "white" }}>{activeTab.label}</h3>
          </header>
          <p style={{ marginTop: "0.5rem", color: "color-mix(in oklch, white 78%, var(--gray-200))" }}>{activeTab.description}</p>
          <div
            style={{
              marginTop: "1.5rem",
              borderRadius: "24px",
              padding: "2rem",
              border: "1px solid color-mix(in oklch, white 12%, transparent)",
              background:
                "linear-gradient(140deg, color-mix(in oklch, var(--brand-primary) 28%, transparent) 0%, color-mix(in oklch, var(--brand-depth) 85%, black) 100%)",
              minHeight: "220px",
              display: "grid",
              gap: "1.25rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span className="feature-preview__icon" aria-hidden="true">
                <Icon name={activeTab.preview.icon} size={32} />
              </span>
              <div>
                <strong style={{ color: "white", fontSize: "1.1rem" }}>{activeTab.preview.title}</strong>
                <p style={{ marginTop: "0.35rem", color: "color-mix(in oklch, white 80%, var(--gray-200))" }}>
                  {activeTab.preview.description}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
              {activeTab.preview.stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "grid",
                    gap: "0.25rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.9rem",
                    background: "color-mix(in oklch, var(--glass-2) 70%, transparent)",
                    border: "1px solid color-mix(in oklch, white 12%, transparent)",
                    minWidth: "120px",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklch, white 70%, var(--gray-300))" }}>
                    {stat.label}
                  </span>
                  <strong style={{ fontSize: "1.35rem", color: "white" }}>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
        <div className="feature-list">
          {activeTab.highlights.map((feature) => (
            <article key={feature.title} className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                <Icon name={feature.icon} size={26} />
              </span>
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}