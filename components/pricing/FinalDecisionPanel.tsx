export default function FinalDecisionPanel() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <h2 id="final-cta-title">Pick your starting path</h2>
      <div className="cta-grid">
        <div className="cta-card">
          <h3>Launch now</h3>
          <p>Get your AI receptionist, lead capture, and workflows running today.</p>
          <a className="btn" href="#plans" aria-label="Start free trial now">Start Free Trial</a>
          <p className="sub">Live in under a week, fully guided. Arabic + English supported.</p>
        </div>
        <div className="cta-card">
          <h3>Talk to a deployment lead</h3>
          <p>Review compliance, security, SLAs, and your rollout plan together.</p>
          <a className="btn outline" href="/contact" aria-label="Schedule deployment call">Schedule Deployment Call</a>
          <p className="sub">White‑glove onboarding. Procurement‑friendly. Security review included.</p>
        </div>
      </div>

      <style jsx>{`
        .final-cta { display:flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border-default); padding-top: 1rem; }
        .final-cta h2 { margin:0; font-size: clamp(1.25rem, 1.6vw, 1.75rem); }
        .cta-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 900px) { .cta-grid { grid-template-columns: 1fr; } }
        .cta-card { border:1px solid var(--border-strong); background: var(--bg-card); border-radius: 12px; padding: 1rem; display:flex; flex-direction: column; gap: 0.5rem; }
        .btn { display:inline-flex; justify-content:center; align-items:center; border:2px solid var(--accent-primary); background: var(--accent-primary); color: var(--text-inverse); border-radius: 10px; padding: 0.65rem 1rem; font-weight: 800; text-decoration: none; }
        .btn:hover { background: var(--accent-primary-hover); border-color: var(--accent-primary-hover); }
        .btn:focus-visible { outline: 3px solid var(--border-focus); outline-offset: 2px; }
        .btn.outline { background: transparent; color: var(--text-primary); border-color: var(--text-primary); }
        .btn.outline:hover { background: var(--interactive-hover); }
        .sub { margin:0; color: var(--text-secondary); font-size: 0.95rem; }
      `}</style>
    </section>
  );
}

