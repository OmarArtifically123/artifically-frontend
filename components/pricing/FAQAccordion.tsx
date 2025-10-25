"use client";

import { useId, useState } from "react";

type Item = { q: string; a: string };

const DEFAULT_ITEMS: Item[] = [
  {
    q: "Do you run structured pilots?",
    a: "Yes. Pilots mirror production, include success criteria, and the fee credits to rollout if you continue.",
  },
  {
    q: "How fast can we go live?",
    a: "Starter launches in minutes. Professional is live this week with a success architect. Enterprise includes guided rollout with security alignment.",
  },
  {
    q: "How secure is Artifically?",
    a: "We support isolation options, security reviews, and custom SLAs for enterprise. Our team helps you clear procurement and audit questions.",
  },
  {
    q: "What happens after the free trial?",
    a: "We do not lock you out. Workflows stay available, and you can upgrade when you are ready with zero hidden fees.",
  },
] as const;

export default function FAQAccordion({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div role="region" aria-labelledby={`${baseId}-title`} className="faq">
      <h2 id={`${baseId}-title`}>Answers to common questions</h2>
      <ul className="faq__list">
        {items.map((item, index) => {
          const buttonId = `${baseId}-button-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          const isOpen = openIndex === index;
          return (
            <li key={buttonId} className="faq__item">
              <button
                type="button"
                id={buttonId}
                className="faq__question"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden>
                  {isOpen ? "-" : "+"}
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="faq__answer"
              >
                <p>{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .faq {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .faq h2 {
          margin: 0;
          font-size: clamp(1.3rem, 2vw, 1.75rem);
        }
        .faq__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .faq__item {
          border: 1px solid var(--border-default);
          border-radius: 14px;
          background: var(--bg-card);
        }
        .faq__question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          width: 100%;
          padding: 0.9rem 1rem;
          background: transparent;
          border: 0;
          font-weight: 700;
          color: var(--text-primary);
          text-align: start;
        }
        .faq__question:hover {
          background: var(--bg-secondary);
        }
        .faq__question:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }
        .faq__icon {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1;
        }
        .faq__answer {
          padding: 0 1rem 1rem;
        }
        .faq__answer p {
          margin: 0;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
