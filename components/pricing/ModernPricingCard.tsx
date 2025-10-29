"use client";

import { useState } from "react";
import type { BillingCadence, Plan } from "@/components/pricing/types";

type Props = {
  plan: Plan;
  billing: BillingCadence;
  featured?: boolean;
};

export default function ModernPricingCard({ plan, billing, featured = false }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const isEnterprise = plan.priceMonthly == null && plan.priceAnnual == null;
  const annualTotal = plan.priceAnnual != null ? Math.round(plan.priceAnnual) : null;
  const monthlyPrice = plan.priceMonthly != null ? Math.round(plan.priceMonthly) : null;
  const annualPerMonth = annualTotal != null ? Math.round(annualTotal / 12) : null;

  const displayPrice = billing === "monthly" ? monthlyPrice : annualPerMonth;

  return (
    <article
      className={`modern-card ${featured ? "modern-card--featured" : ""} ${isHovered ? "modern-card--hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="card-header">
        {featured && <div className="featured-badge">Most popular</div>}
        <h3 className="card-title">{plan.name}</h3>
        <p className="card-description">{plan.whoFor}</p>
      </div>

      {/* Pricing */}
      <div className="card-pricing">
        {isEnterprise ? (
          <>
            <div className="price-custom">Let's talk</div>
            <div className="price-period">Custom pricing</div>
          </>
        ) : (
          <>
            <div className="price-amount">
              <span className="price-currency">$</span>
              {displayPrice}
            </div>
            <div className="price-period">
              per month{billing === "annual" && ", billed annually"}
            </div>
            {billing === "annual" && monthlyPrice && (
              <div className="price-savings">
                Save ${(monthlyPrice * 12 - (annualTotal || 0)).toLocaleString()} per year
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <a href={plan.ctaTo ?? "/signup"} className={`card-cta ${featured ? "card-cta--featured" : ""}`}>
        {plan.ctaLabel}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 10H15M15 10L11 6M15 10L11 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      {/* Features */}
      <div className="card-features">
        <div className="features-label">What's included:</div>
        <ul className="features-list">
          {plan.capabilities.map((cap, idx) => (
            <li key={idx} className="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#e0e7ff" />
                <path
                  d="M7 10L9 12L13 8"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{cap.label}</span>
            </li>
          ))}
          {plan.support && (
            <li className="feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#e0e7ff" />
                <path
                  d="M7 10L9 12L13 8"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{plan.support}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
          <path d="M8 4V8L11 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>{plan.deployment}</span>
      </div>

      <style jsx>{`
        .modern-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 2.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .modern-card--featured {
          border-color: #6366f1;
          border-width: 2px;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
        }

        .modern-card--featured:hover {
          box-shadow: 0 24px 48px rgba(99, 102, 241, 0.2);
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .featured-badge {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          padding: 0.375rem 0.875rem;
          background: #6366f1;
          color: white;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-title {
          margin: 0;
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
        }

        .card-description {
          margin: 0;
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .card-pricing {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 2rem 0;
        }

        .price-amount {
          font-size: 4rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .price-currency {
          font-size: 2.5rem;
          font-weight: 700;
          color: #6b7280;
        }

        .price-period {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        .price-savings {
          display: inline-flex;
          align-self: flex-start;
          padding: 0.375rem 0.75rem;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .price-custom {
          font-size: 3rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: #111827;
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          border: 2px solid #111827;
          transition: all 0.2s ease;
          margin-bottom: 2rem;
        }

        .card-cta:hover {
          background: #000;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .card-cta--featured {
          background: #6366f1;
          border-color: #6366f1;
        }

        .card-cta--featured:hover {
          background: #5558e3;
        }

        .card-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .features-label {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
        }

        .features-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: #374151;
          line-height: 1.6;
        }

        .feature-item svg {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 2rem;
          margin-top: auto;
          border-top: 1px solid #f3f4f6;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .modern-card {
            padding: 2rem;
          }

          .price-amount {
            font-size: 3rem;
          }

          .price-currency {
            font-size: 2rem;
          }
        }
      `}</style>
    </article>
  );
}

