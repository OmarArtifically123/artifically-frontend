"use client";

import { Icon, type IconName } from "@/components/icons";

const SECURITY_BADGES: Array<{ icon: IconName; title: string; description: string }> = [
  {
    icon: "shield-check",
    title: "SOC 2 Type II",
    description: "Certified",
  },
  {
    icon: "lock",
    title: "GDPR",
    description: "Compliant",
  },
  {
    icon: "check-circle",
    title: "ISO 27001",
    description: "Certified",
  },
  {
    icon: "shield",
    title: "HIPAA",
    description: "Available",
  },
];

const GUARANTEES: Array<{ icon: IconName; title: string; description: string }> = [
  {
    icon: "zap",
    title: "99.9% Uptime SLA",
    description: "Guaranteed availability with automatic failover",
  },
  {
    icon: "refresh-cw",
    title: "14-Day Free Trial",
    description: "Full access, no credit card required",
  },
  {
    icon: "dollar-sign",
    title: "Money-Back Guarantee",
    description: "Full refund within 30 days if not satisfied",
  },
  {
    icon: "users",
    title: "24/7 Support",
    description: "Human support team available around the clock",
  },
  {
    icon: "database",
    title: "Data Portability",
    description: "Export your data anytime in standard formats",
  },
  {
    icon: "trending-up",
    title: "No Lock-in",
    description: "Cancel anytime with zero penalties",
  },
];

export default function TrustIndicators() {
  return (
    <section className="trust-indicators" aria-labelledby="trust-title">
      {/* Security badges */}
      <div className="trust-section">
        <div className="section-header">
          <Icon name="shield-check" size={24} aria-hidden className="section-icon" />
          <h3 id="trust-title">Enterprise-grade security & compliance</h3>
        </div>

        <div className="security-badges">
          {SECURITY_BADGES.map((badge) => (
            <div key={badge.title} className="security-badge">
              <div className="badge-icon">
                <Icon name={badge.icon} size={32} aria-hidden />
              </div>
              <div className="badge-content">
                <div className="badge-title">{badge.title}</div>
                <div className="badge-description">{badge.description}</div>
              </div>
              <div className="badge-verified">
                <Icon name="check" size={16} aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantees grid */}
      <div className="trust-section">
        <div className="section-header">
          <Icon name="award" size={24} aria-hidden className="section-icon" />
          <h3>Our commitments to you</h3>
        </div>

        <div className="guarantees-grid">
          {GUARANTEES.map((guarantee, idx) => (
            <div
              key={guarantee.title}
              className="guarantee-card"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="guarantee-icon">
                <Icon name={guarantee.icon} size={24} aria-hidden />
              </div>
              <div className="guarantee-content">
                <div className="guarantee-title">{guarantee.title}</div>
                <div className="guarantee-description">{guarantee.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust statement */}
      <div className="trust-statement">
        <div className="statement-content">
          <div className="statement-icon">
            <Icon name="heart" size={32} aria-hidden />
          </div>
          <div className="statement-text">
            <h4>Trusted by 500+ teams across 20+ countries</h4>
            <p>
              Join leading organizations who trust Artifically for their mission-critical
              operations. From startups to Fortune 500 companies, our customers rely on us
              for security, reliability, and exceptional support.
            </p>
          </div>
        </div>

        <div className="statement-stats">
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Active customers</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-value">20+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-value">4.9/5</div>
            <div className="stat-label">Customer rating</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .trust-indicators {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding: 3rem 0;
        }

        .trust-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-icon {
          color: var(--accent-primary);
        }

        .section-header h3 {
          margin: 0;
          font-size: clamp(1.25rem, 2vw, 1.75rem);
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .security-badges {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .security-badge {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 2px solid var(--border-default);
          border-radius: 18px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .security-badge:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
          box-shadow: 0 12px 30px color-mix(in srgb, var(--accent-primary) 15%, transparent);
        }

        .badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-primary) 15%, transparent),
            color-mix(in srgb, var(--accent-secondary) 10%, transparent)
          );
          border-radius: 14px;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .badge-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .badge-title {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--text-primary);
        }

        .badge-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .badge-verified {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--accent-success);
          border-radius: 50%;
          color: white;
        }

        .guarantees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .guarantee-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 2px solid var(--border-default);
          border-radius: 16px;
          transition: all 0.3s ease;
          opacity: 0;
          animation: card-entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes card-entrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .guarantee-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent-primary) 10%, transparent);
        }

        .guarantee-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border-radius: 12px;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .guarantee-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .guarantee-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .guarantee-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .trust-statement {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2.5rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-primary) 10%, var(--bg-card)),
            var(--bg-card)
          );
          border: 2px solid var(--border-default);
          border-radius: 24px;
        }

        .statement-content {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .statement-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border-radius: 16px;
          color: white;
          flex-shrink: 0;
        }

        .statement-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .statement-text h4 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .statement-text p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
        }

        .statement-stats {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 2rem;
          padding: 2rem;
          background: var(--bg-secondary);
          border-radius: 18px;
          border: 1px solid var(--border-subtle);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--accent-primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .stat-divider {
          width: 1px;
          height: 50px;
          background: var(--border-default);
        }

        @media (max-width: 768px) {
          .trust-indicators {
            gap: 2rem;
            padding: 2rem 0;
          }

          .security-badges {
            grid-template-columns: 1fr;
          }

          .guarantees-grid {
            grid-template-columns: 1fr;
          }

          .trust-statement {
            padding: 2rem 1.5rem;
          }

          .statement-content {
            flex-direction: column;
          }

          .statement-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-divider {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .security-badge,
          .guarantee-card {
            animation: none !important;
            transition: none !important;
          }

          .security-badge:hover,
          .guarantee-card:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

