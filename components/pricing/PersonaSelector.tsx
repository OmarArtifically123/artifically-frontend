"use client";

import { useId } from "react";
import type { Persona } from "@/components/pricing/types";

type Props = {
  personas: Persona[];
  value: Persona["id"] | null;
  onChange: (id: Persona["id"]) => void;
};

export default function PersonaSelector({ personas, value, onChange }: Props) {
  const groupId = useId();

  return (
    <div className="persona-selector" role="radiogroup" aria-labelledby={`${groupId}-label`}>
      <h3 id={`${groupId}-label`} className="persona-title">Who are you buying for?</h3>
      <div className="persona-grid">
        {personas.map((p) => {
          const checked = value === p.id;
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={checked}
              aria-describedby={`${groupId}-${p.id}-desc`}
              className={`persona-card${checked ? " is-active" : ""}`}
              onClick={() => onChange(p.id)}
            >
              <div className="persona-card__content">
                <div className="persona-card__header">
                  <span className="persona-card__dot" aria-hidden="true" />
                  <span className="persona-card__title">{p.title}</span>
                </div>
                <p id={`${groupId}-${p.id}-desc`} className="persona-card__desc">{p.description}</p>
                <span className="persona-card__recommend" aria-live="polite">
                  Recommended: <strong>{labelForPlanId(p.recommendedPlanId)}</strong>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .persona-title { margin: 0 0 0.75rem; font-size: 1rem; color: var(--text-secondary); }
        .persona-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0.75rem; }
        @media (max-width: 900px) { .persona-grid { grid-template-columns: 1fr; } }

        .persona-card {
          background: var(--bg-card);
          border: 2px solid var(--border-default);
          border-radius: var(--ads-radii-lg, 12px);
          text-align: start;
          padding: 1rem;
          color: var(--text-primary);
        }
        .persona-card:hover { border-color: var(--border-strong); }
        .persona-card:focus-visible { outline: 3px solid var(--border-focus); outline-offset: 2px; }
        .persona-card.is-active { border-color: var(--accent-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-primary) 35%, transparent); }

        .persona-card__header { display: inline-flex; align-items: center; gap: 0.5rem; }
        .persona-card__dot { inline-size: 0.625rem; block-size: 0.625rem; border-radius: 999px; background: var(--accent-primary); box-shadow: inset 0 0 0 2px var(--bg-card); }
        .persona-card__title { font-weight: 700; }
        .persona-card__desc { margin: 0.5rem 0; color: var(--text-secondary); line-height: 1.6; }
        .persona-card__recommend { display: inline-block; font-size: 0.875rem; color: var(--text-primary); border-top: 1px solid var(--border-default); padding-top: 0.5rem; }
      `}</style>
    </div>
  );
}

function labelForPlanId(id: string) {
  switch (id) {
    case "starter": return "Starter";
    case "professional": return "Professional";
    case "enterprise": return "Enterprise";
    default: return id;
  }
}

