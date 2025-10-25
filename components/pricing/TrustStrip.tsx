import { Icon, type IconName } from "@/components/icons";

const ITEMS: ReadonlyArray<{ icon: IconName; title: string; desc: string }> = [
  { icon: "headphones", title: "24/7 human support", desc: "Real engineers on-call. No chatbot loops." },
  { icon: "globe", title: "Arabic + English", desc: "RTL-ready UI, bilingual playbooks, regional teams." },
  { icon: "shield", title: "Security-first", desc: "SOC 2 mindset, isolation options, procurement ready." },
  { icon: "activity", title: "Uptime & SLAs", desc: "We publish status, sign SLAs, and review incidents transparently." },
] as const;

export default function TrustStrip() {
  return (
    <ul className="trust-row" role="list" aria-label="Operational reassurances">
      {ITEMS.map((item) => (
        <li key={item.title} className="trust-row__item">
          <span className="trust-row__icon" aria-hidden>
            <Icon name={item.icon} size={18} />
          </span>
          <span className="trust-row__text">
            <strong>{item.title}</strong>
            <span>{item.desc}</span>
          </span>
        </li>
      ))}

      <style jsx>{`
        .trust-row {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .trust-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .trust-row {
            grid-template-columns: 1fr;
          }
        }
        .trust-row__item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          border: 1px solid var(--border-default);
          border-radius: 14px;
          padding: 0.85rem;
          background: var(--bg-card);
        }
        .trust-row__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 999px;
          border: 2px solid var(--border-strong);
          color: var(--accent-primary);
          background: var(--bg-secondary);
        }
        .trust-row__text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.95rem;
        }
        .trust-row__text strong {
          font-weight: 800;
        }
        .trust-row__text span {
          color: var(--text-secondary);
        }
      `}</style>
    </ul>
  );
}
