export default function IncludedAllPlans() {
  const items: { label: string; desc: string }[] = [
    { label: "Core automations", desc: "Build, schedule, and monitor workflows across channels." },
    { label: "AI receptionist & lead capture", desc: "Inbound calls and WhatsApp handled in Arabic + English." },
    { label: "Multilingual", desc: "Arabic and English support are first-class." },
    { label: "24/7 support", desc: "Real humans on-call for incidents and onboarding." },
    { label: "Security & compliance", desc: "Data isolation options and audit-friendly logging." },
    { label: "Uptime mindset", desc: "Designed for reliability. We publish status and SLAs." },
  ];

  return (
    <section className="included-band" aria-label="Included in every plan">
      <div className="band-inner">
        <h3 className="band-title">Included in every plan</h3>
        <ul className="band-list">
          {items.map((it) => (
            <li key={it.label} className="band-item">
              <span className="band-label">{it.label}</span>
              <span className="band-desc">{it.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .included-band { border: 2px solid var(--border-strong); border-radius: 16px; padding: 1rem; background: var(--bg-secondary); }
        .band-inner { display: grid; grid-template-columns: 220px 1fr; gap: 1rem; align-items: start; }
        @media (max-width: 900px) { .band-inner { grid-template-columns: 1fr; } }
        .band-title { margin: 0.125rem 0 0; font-size: 1rem; color: var(--text-primary); }
        .band-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0.75rem 1rem; }
        @media (max-width: 900px) { .band-list { grid-template-columns: 1fr; } }
        .band-item { display: grid; grid-template-columns: 1fr; border: 1px solid var(--border-default); background: var(--bg-card); border-radius: 10px; padding: 0.75rem; }
        .band-label { font-weight: 700; }
        .band-desc { color: var(--text-secondary); }
      `}</style>
    </section>
  );
}

