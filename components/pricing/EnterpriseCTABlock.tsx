import { trackPricingEvent } from "@/lib/pricing-analytics";

export default function EnterpriseCTABlock() {
  return (
    <section className="enterprise-section" aria-labelledby="enterprise-title">
      <div className="enterprise-container">
        <div className="enterprise-content">
          <h2 id="enterprise-title">
            Need private deployment, data residency, or procurement approval?
          </h2>
          
          <ul className="enterprise-list">
            <li>Private/VPC deployment</li>
            <li>Custom SLAs</li>
            <li>Procurement-safe invoicing</li>
            <li>Audit trails & SSO</li>
            <li>Data residency on request</li>
          </ul>
          
          <p className="enterprise-proof">
            Security already reviewed by healthcare, finance, and government clients.
          </p>
        </div>

        <div className="enterprise-ctas">
          <a
            href="/contact?tier=enterprise"
            className="enterprise-cta-btn primary"
            onClick={() => trackPricingEvent("enterprise_cta_calendar_click", {})}
          >
            Talk to deployment lead
          </a>
          
          <button
            className="enterprise-cta-btn secondary"
            onClick={() => trackPricingEvent("enterprise_cta_chat_click", {})}
            type="button"
          >
            Ask security right now →
          </button>
        </div>
      </div>

      <style jsx>{`
        .enterprise-section {
          padding: 4rem 2rem;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(91, 107, 255, 0.05) 100%
          );
          border-radius: 24px;
          border: 2px solid rgba(91, 107, 255, 0.2);
        }

        .enterprise-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          align-items: center;
          text-align: center;
        }

        .enterprise-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        h2 {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 900;
          color: #E5E7EB;
          line-height: 1.3;
        }

        .enterprise-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          justify-content: center;
        }

        .enterprise-list li {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #E5E7EB;
          position: relative;
          padding-left: 2.5rem;
        }

        .enterprise-list li::before {
          content: "✓";
          position: absolute;
          left: 1rem;
          color: #14B8A6;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .enterprise-proof {
          margin: 0;
          font-size: 1rem;
          color: #9CA3AF;
          font-style: italic;
        }

        .enterprise-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          justify-content: center;
        }

        .enterprise-cta-btn {
          padding: 1.15rem 2.25rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
        }

        .enterprise-cta-btn.primary {
          background: #3B82F6;
          color: white;
          border-color: #3B82F6;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }

        .enterprise-cta-btn.primary:hover {
          background: #2563EB;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
        }

        .enterprise-cta-btn.secondary {
          background: transparent;
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.4);
        }

        .enterprise-cta-btn.secondary:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        .enterprise-cta-btn:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .enterprise-section {
            padding: 3rem 1.5rem;
          }

          .enterprise-list {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .enterprise-list li {
            text-align: left;
          }

          .enterprise-ctas {
            flex-direction: column;
            width: 100%;
          }

          .enterprise-cta-btn {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .enterprise-cta-btn:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
