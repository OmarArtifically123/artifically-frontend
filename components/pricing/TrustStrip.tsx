import { Icon } from "@/components/icons";

export default function TrustStrip() {
  const items = [
    { icon: "headphones", title: "24/7 Support", desc: "Real humans. Dedicated success architect on Professional+." },
    { icon: "barChart", title: "Uptime & SLAs", desc: "We publish status, aim for 99.95%+, and sign SLAs." },
    { icon: "shield", title: "Security", desc: "SOC 2 mindset, data encryption, isolation options." },
    { icon: "database", title: "Private Deployment", desc: "Enterprise data residency and private deployments available." },
    { icon: "globe", title: "Arabic + English", desc: "Multilingual UI & support. RTL-ready interfaces." },
    { icon: "handshake", title: "Partner Onboarding", desc: "You get a deployment partner, not a chatbot link." },
  ] as const;

  return (
    <section className="trust" aria-labelledby="trust-title">
      <h2 id="trust-title">Built for operations you can depend on</h2>
      <ul className="trust-grid" role="list">
        {items.map((it) => (
          <li key={it.title} className="trust-card">
            <div className="trust-icon" aria-hidden>
              <Icon name={it.icon as any} size={20} />
            </div>
            <div className="trust-text">
              <strong className="trust-title">{it.title}</strong>
              <span className="trust-desc">{it.desc}</span>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .trust { display:flex; flex-direction: column; gap: 1rem; }
        .trust h2{ margin:0; font-size: clamp(1.25rem, 1.6vw, 1.75rem); }
        .trust-grid { list-style:none; margin:0; padding:0; display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
        @media (max-width: 900px) { .trust-grid { grid-template-columns: 1fr; } }
        .trust-card { display:flex; align-items: start; gap: 0.75rem; border:1px solid var(--border-default); background: var(--bg-card); border-radius: 12px; padding: 0.75rem; }
        .trust-icon { inline-size: 2rem; block-size: 2rem; display:grid; place-items:center; border:2px solid var(--border-strong); border-radius: 999px; color: var(--accent-primary); background: var(--bg-secondary); }
        .trust-text { display:flex; flex-direction: column; gap: 0.25rem; }
        .trust-title { font-weight: 800; }
        .trust-desc { color: var(--text-secondary); }
      `}</style>
    </section>
  );
}
