export default function FinalDecisionPanel() {
  return (
    <div className="final-panel">
      <h2 id="final-strip-heading">Your next step</h2>
      <div className="final-panel__grid">
        <div className="final-panel__card">
          <h3>Launch now</h3>
          <p>Get your AI receptionist, lead capture, and workflows running today.</p>
          <a className="final-panel__cta" href="#plans" aria-label="Start your free trial now">
            Start Free Trial
          </a>
          <p className="final-panel__note">
            Live in under a week with guided onboarding. Arabic and English support included.
          </p>
        </div>

        <div className="final-panel__card">
          <h3>Talk to a deployment lead</h3>
          <p>Review security, SLAs, and rollout expectations together.</p>
          <a className="final-panel__cta final-panel__cta--outline" href="/contact" aria-label="Schedule a deployment planning call">
            Schedule Deployment Call
          </a>
          <p className="final-panel__note">
            White-glove onboarding, procurement-ready documentation, and regional experts.
          </p>
        </div>
      </div>

      <style jsx>{`
        .final-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-strong);
          border-radius: 18px;
          padding: clamp(1.5rem, 3vw, 2rem);
        }
        .final-panel h2 {
          margin: 0;
          font-size: clamp(1.5rem, 2.2vw, 2rem);
        }
        .final-panel__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .final-panel__grid {
            grid-template-columns: 1fr;
          }
        }
        .final-panel__card {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border: 1px solid var(--border-default);
          border-radius: 14px;
          background: var(--bg-card);
          padding: 1.1rem;
        }
        .final-panel__card h3 {
          margin: 0;
          font-size: 1.3rem;
        }
        .final-panel__card p {
          margin: 0;
          color: var(--text-secondary);
        }
        .final-panel__cta {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem 1.1rem;
          border-radius: 12px;
          border: 2px solid var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
          font-weight: 800;
          text-decoration: none;
        }
        .final-panel__cta:hover {
          background: var(--accent-primary-hover);
          border-color: var(--accent-primary-hover);
        }
        .final-panel__cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }
        .final-panel__cta--outline {
          background: transparent;
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
        .final-panel__cta--outline:hover {
          background: var(--interactive-hover);
        }
        .final-panel__note {
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}
