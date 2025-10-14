import { useState } from "react";

const featureTabs = [
  {
    id: "demos",
    icon: "🎯",
    label: "Interactive Demos",
    description: "Spin up a sandboxed automation replica to experience the workflow and outcomes before you deploy to production.",
  },
  {
    id: "governance",
    icon: "🛡️",
    label: "Enterprise Governance",
    description: "Role-based controls, SOC 2 compliance, and real-time monitoring to keep every automation audit-ready.",
  },
  {
    id: "connectors",
    icon: "🔌",
    label: "150+ Connectors",
    description: "Connect CRMs, ERPs, data warehouses, and internal tools with pre-authenticated pipelines.",
  },
  {
    id: "ai",
    icon: "🤖",
    label: "Adaptive AI",
    description: "Fine-tune models with your data, and let guardrails ensure safe responses across every channel.",
  },
];

const featureList = [
  {
    icon: "✨",
    title: "One-Click Previews",
    description: "Launch a guided preview with sample data, voiceover, and telemetry overlays in seconds.",
  },
  {
    icon: "🧠",
    title: "Smart Recommendations",
    description: "ML-powered suggestions highlight the automations that match your current stack and KPIs.",
  },
  {
    icon: "📊",
    title: "Live Impact Reports",
    description: "See time saved, error rates avoided, and ROI multipliers from day one.",
  },
  {
    icon: "🤝",
    title: "Collaborative Reviews",
    description: "Invite stakeholders to leave inline feedback, approvals, and deployment notes.",
  },
];

export default function FeaturesShowcaseSection() {
  const [active, setActive] = useState(featureTabs[0].id);
  const activeTab = featureTabs.find((tab) => tab.id === active) ?? featureTabs[0];

  return (
    <section className="section-shell" aria-labelledby="features-title">
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
            aria-selected={active === tab.id}
            className="feature-tab"
            data-active={active === tab.id}
            onClick={() => setActive(tab.id)}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="feature-content">
        <article className="demo-preview" role="tabpanel" aria-live="polite">
          <header style={{ display: "grid", gap: "0.4rem" }}>
            <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.8rem", color: "color-mix(in oklch, white 72%, var(--gray-400))" }}>
              {activeTab.label}
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
              <span style={{ fontSize: "2rem" }}>🧪</span>
              <div>
                <strong style={{ color: "white", fontSize: "1.1rem" }}>Launch a safe sandbox</strong>
                <p style={{ marginTop: "0.35rem", color: "color-mix(in oklch, white 80%, var(--gray-200))" }}>
                  Preview how the automation responds with your data, then promote it to production in one click.
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklch, white 65%, var(--gray-400))" }}>
                Highlights
              </span>
              <ul style={{ display: "grid", gap: "0.35rem", paddingLeft: "1.1rem", color: "color-mix(in oklch, white 75%, var(--gray-200))" }}>
                <li>Real production-like datasets streamed into the preview</li>
                <li>Live guardrail monitoring with explainability traces</li>
                <li>Suggested follow-up automations based on impact</li>
              </ul>
            </div>
          </div>
        </article>
        <div className="feature-list">
          {featureList.map((feature) => (
            <article key={feature.title} className="feature-card">
              <span style={{ fontSize: "1.6rem" }}>{feature.icon}</span>
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}