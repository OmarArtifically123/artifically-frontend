import { useMemo, useState } from "react";

const featureTabs = [
  {
    id: "demos",
    icon: "🎬",
    label: "Interactive Demos",
    description:
      "Launch immersive WebGL or video walkthroughs that mirror your production data in a safe sandbox before deploying.",
    highlights: [
      { icon: "✨", title: "One-Click Previews", description: "Spin up guided previews with telemetry overlays instantly." },
      { icon: "🎧", title: "Guided Walkthroughs", description: "Narrated tours showcase key KPIs and decision points." },
      { icon: "🧪", title: "Sandboxed Data", description: "Inject scrubbed datasets to experience the workflow end-to-end." },
    ],
  },
  {
    id: "library",
    icon: "🗂️",
    label: "Workflow Library",
    description:
      "Browse modular blueprints curated by industry experts with playbooks that cover every department and KPI.",
    highlights: [
      { icon: "📚", title: "Version Control", description: "Track iterations with rollbacks and change approvals built-in." },
      { icon: "🧩", title: "Composable Blocks", description: "Drag, remix, and publish reusable automation components." },
      { icon: "🧑‍🤝‍🧑", title: "Role-Based Access", description: "Assign granular permissions for builders, reviewers, and approvers." },
    ],
  },
  {
    id: "compliance",
    icon: "🛡️",
    label: "Compliance Guardrails",
    description:
      "Meet regulatory requirements automatically with guardrails that enforce policies, retention, and audit trails.",
    highlights: [
      { icon: "📋", title: "Policy Templates", description: "Pre-built controls for SOC 2, HIPAA, GDPR, and ISO frameworks." },
      { icon: "🔍", title: "Automated Audits", description: "Continuous evidence collection keeps every workflow inspection-ready." },
      { icon: "🛡", title: "Redaction Pipelines", description: "Inline scrubbing removes sensitive data before it leaves your network." },
    ],
  },
  {
    id: "integrations",
    icon: "🔌",
    label: "Enterprise Integrations",
    description:
      "Connect mission-critical systems through secure connectors, streaming events, and bi-directional syncs.",
    highlights: [
      { icon: "🔐", title: "Secure Connectors", description: "Bring 250+ SaaS, data, and on-prem systems with scoped OAuth and SSO." },
      { icon: "🌐", title: "Event Streams", description: "Real-time webhooks and queues ensure every automation stays in sync." },
      { icon: "♻️", title: "Bi-Directional Sync", description: "Keep records updated everywhere with conflict resolution built-in." },
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
            <span aria-hidden="true">{tab.icon}</span>
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
                {activeTab.highlights.map((item) => (
                  <li key={item.title}>{item.title}: {item.description}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
        <div className="feature-list">
          {activeTab.highlights.map((feature) => (
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