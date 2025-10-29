import { TRUST_BADGES } from "./pricing-data";
import { trackPricingEvent } from "@/lib/pricing-analytics";

export default function TrustBadgesSection() {
  return (
    <section className="trust-section" aria-labelledby="trust-title">
      <h3 id="trust-title">Built for security reviews and procurement</h3>
      
      <div className="trust-badges">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.id} className="trust-badge">
            {badge.label}
          </div>
        ))}
      </div>
      
      <p className="trust-microcopy">
        We pass security reviews. Ask for the compliance one-pager.
      </p>
      
      <a
        href="/compliance-summary.pdf"
        className="compliance-link"
        onClick={() => trackPricingEvent("compliance_pdf_download", {})}
        download
      >
        Download compliance summary (PDF) →
      </a>

      <style jsx>{`
        .trust-section {
          padding: 4rem 2rem;
          text-align: center;
        }

        h3 {
          margin: 0 0 2.5rem;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 900;
          color: #E5E7EB;
        }

        .trust-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto 2rem;
        }

        .trust-badge {
          padding: 0.85rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #E5E7EB;
          transition: all 0.3s ease;
        }

        .trust-badge:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
          color: #3B82F6;
        }

        .trust-microcopy {
          margin: 0 0 1.5rem;
          font-size: 1rem;
          color: #6B7280;
        }

        .compliance-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          background: transparent;
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 12px;
          color: #3B82F6;
          font-weight: 800;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .compliance-link:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        .compliance-link:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .trust-section {
            padding: 3rem 1.5rem;
          }

          .trust-badges {
            gap: 0.75rem;
          }

          .trust-badge {
            padding: 0.65rem 1.25rem;
            font-size: 0.85rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trust-badge:hover,
          .compliance-link:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
