"use client";

import { useId, useState } from "react";

type Item = { q: string; a: string };

const DEFAULTS: Item[] = [
  { q: "Do you offer pilots?", a: "Yes. We run structured pilots that mirror production. You keep what we build. Pilot cost is credited to rollout if you continue." },
  { q: "How secure is the platform?", a: "All data is encrypted in transit and at rest. Access is strictly scoped. Enterprise can isolate data and deploy privately. We pass security reviews and help with audit questions." },
  { q: "What happens after the trial?", a: "We downgrade gracefully. Your automations remain accessible. You can reactivate any time—no surprise lockouts." },
  { q: "Can we switch plans?", a: "Yes. Upgrades apply instantly. Downgrades take effect at term end. Annual captures a 20% discount." },
  { q: "Do you support Arabic?", a: "Yes. Arabic and English are first‑class across UI, RTL layout, and support." },
  { q: "How fast can we go live?", a: "Starter: under 10 minutes. Professional: live this week with a success architect. Enterprise: white‑glove onboarding with security alignment." },
];

export default function FAQAccordion({ items = DEFAULTS }: { items?: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section aria-labelledby={`${base}-title`} className="faq">
      <h2 id={`${base}-title`}>Questions, answered clearly</h2>
      <ul className="faq-list">
        {items.map((it, idx) => {
          const idBtn = `${base}-btn-${idx}`;
          const idPanel = `${base}-panel-${idx}`;
          const isOpen = open === idx;
          return (
            <li key={idBtn} className="faq-item">
              <button
                id={idBtn}
                aria-expanded={isOpen}
                aria-controls={idPanel}
                className="faq-q"
                onClick={() => setOpen(isOpen ? null : idx)}
              >
                <span>{it.q}</span>
                <span className="faq-icon" aria-hidden>{isOpen ? "−" : "+"}</span>
              </button>
              <div
                id={idPanel}
                role="region"
                aria-labelledby={idBtn}
                hidden={!isOpen}
                className="faq-a"
              >
                <p>{it.a}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .faq { display:flex; flex-direction: column; gap: 1rem; }
        .faq h2 { margin:0; font-size: clamp(1.25rem, 1.6vw, 1.75rem); }
        .faq-list { list-style:none; margin:0; padding:0; display:flex; flex-direction: column; gap: 0.5rem; }
        .faq-item { border:1px solid var(--border-default); border-radius: 12px; background: var(--bg-card); }
        .faq-q { inline-size:100%; text-align:start; background: transparent; border:0; font-weight:800; padding: 0.875rem 1rem; color: var(--text-primary); display:flex; justify-content: space-between; align-items:center; }
        .faq-q:focus-visible { outline: 3px solid var(--border-focus); outline-offset: 2px; }
        .faq-a { padding: 0 1rem 0.875rem; }
        .faq-a p { margin:0; color: var(--text-secondary); }
        .faq-icon { font-size: 1.25rem; }
      `}</style>
    </section>
  );
}

