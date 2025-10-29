"use client";

import type { PlatformTier, BillingCadence } from "./types-v2";
import { trackPricingEvent } from "@/lib/pricing-analytics";

type Props = {
  tier: PlatformTier;
  isSelected: boolean;
  billingCadence: BillingCadence;
  onSelect: (tierId: PlatformTier["id"]) => void;
};

export default function PlatformTierCard({ tier, isSelected, billingCadence, onSelect }: Props) {
  const price =
    tier.priceAnnual && tier.priceMonthly
      ? billingCadence === "annual"
        ? tier.priceAnnual
        : tier.priceMonthly
      : null;

  const annualSavings =
    tier.priceMonthly && tier.priceAnnual ? tier.priceMonthly * 12 - tier.priceAnnual * 12 : 0;

  const handleSelect = () => {
    onSelect(tier.id);
    trackPricingEvent("plan_selected", { tier_id: tier.id, billing_cycle: billingCadence });
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackPricingEvent("plan_cta_click", { tier_id: tier.id, cta_label: tier.ctaLabel });
    
    if (tier.ctaUrl.startsWith("#")) {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      className={`platform-tier-card ${isSelected ? "selected" : ""} ${
        tier.isRecommended ? "recommended" : ""
      } ${tier.isPriceAnchor ? "anchor" : ""}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      aria-pressed={isSelected}
    >
      {tier.badge && <div className="tier-badge">{tier.badge}</div>}

      <h4 className="tier-name">{tier.name}</h4>
      <p className="tier-positioning">{tier.positioningStatement}</p>

      <div className="tier-price-section">
        {price !== null ? (
          <>
            <div className="price-main">${price}/mo</div>
            <div className="price-billing">
              {billingCadence === "annual"
                ? `billed annually ($${(price * 12).toLocaleString()}/yr)`
                : "billed monthly"}
            </div>
            {billingCadence === "annual" && annualSavings > 0 && (
              <div className="savings-badge">Save ${annualSavings.toLocaleString()}/year</div>
            )}
          </>
        ) : (
          <div className="price-main">Custom pricing</div>
        )}
      </div>

      <div className="tier-limits">
        <strong>
          {tier.limits.maxAutomations === "unlimited" ? "Unlimited" : tier.limits.maxAutomations}
        </strong>{" "}
        automations
        <br />
        <strong>
          {tier.limits.includedInteractions === Infinity
            ? "Unlimited"
            : tier.limits.includedInteractions.toLocaleString()}
        </strong>{" "}
        interactions/mo
        <br />
        <span className="overage-rate">
          ${tier.limits.overageRate}/event overage
        </span>
      </div>

      <div className="tier-support">
        <strong>Support:</strong> {tier.support.sla}
      </div>

      <div className="tier-features-preview">
        <div className="feature-group">
          <strong>Security:</strong>
          <ul>
            {tier.security.slice(0, 2).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="feature-group">
          <strong>Channels:</strong> {tier.channels.join(", ")}
        </div>
      </div>

      <a
        href={tier.ctaUrl}
        className="tier-cta"
        onClick={handleCtaClick}
        aria-label={`${tier.ctaLabel} for ${tier.name} plan`}
      >
        {tier.ctaLabel}
      </a>

      {tier.ctaMicrocopy && <p className="tier-microcopy">{tier.ctaMicrocopy}</p>}

      <style jsx>{`
        .platform-tier-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .platform-tier-card:hover {
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }

        .platform-tier-card.selected {
          border-color: rgba(20, 184, 166, 0.8);
          background: rgba(20, 184, 166, 0.05);
        }

        .platform-tier-card.recommended {
          border-color: rgba(91, 107, 255, 0.6);
          box-shadow: 0 0 32px rgba(91, 107, 255, 0.3);
          transform: scale(1.02);
        }

        .platform-tier-card.recommended:hover {
          box-shadow: 0 0 40px rgba(91, 107, 255, 0.4), 0 12px 32px rgba(0, 0, 0, 0.4);
        }

        .platform-tier-card:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        .tier-badge {
          padding: 0.6rem 1rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(91, 107, 255, 0.2));
          border: 1px solid rgba(91, 107, 255, 0.4);
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #5B6BFF;
          text-align: center;
        }

        .tier-name {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 900;
          color: #E5E7EB;
        }

        .tier-positioning {
          margin: 0;
          font-size: 0.95rem;
          color: #9CA3AF;
          line-height: 1.5;
        }

        .tier-price-section {
          padding: 1.5rem 0;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .price-main {
          font-size: 3rem;
          font-weight: 900;
          color: #E5E7EB;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .price-billing {
          font-size: 0.9rem;
          color: #6B7280;
        }

        .savings-badge {
          margin-top: 0.75rem;
          padding: 0.6rem 1rem;
          background: rgba(20, 184, 166, 0.2);
          border: 1px solid rgba(20, 184, 166, 0.4);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #14B8A6;
          display: inline-block;
        }

        .tier-limits {
          font-size: 0.95rem;
          color: #9CA3AF;
          line-height: 1.7;
        }

        .tier-limits strong {
          color: #E5E7EB;
          font-weight: 800;
        }

        .overage-rate {
          display: inline-block;
          margin-top: 0.25rem;
          padding: 0.25rem 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 6px;
          font-size: 0.8rem;
          color: #3B82F6;
        }

        .tier-support {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #9CA3AF;
        }

        .tier-support strong {
          color: #E5E7EB;
          font-weight: 800;
        }

        .tier-features-preview {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-group {
          font-size: 0.85rem;
          color: #9CA3AF;
        }

        .feature-group strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #E5E7EB;
          font-weight: 800;
        }

        .feature-group ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .feature-group li {
          padding-left: 1.25rem;
          position: relative;
        }

        .feature-group li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #14B8A6;
          font-weight: 800;
        }

        .tier-cta {
          padding: 1.15rem 2rem;
          background: #3B82F6;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          display: block;
        }

        .tier-cta:hover {
          background: #2563EB;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .tier-cta:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        .recommended .tier-cta {
          background: linear-gradient(135deg, #3B82F6, #5B6BFF);
        }

        .recommended .tier-cta:hover {
          background: linear-gradient(135deg, #2563EB, #4C5FEB);
        }

        .tier-microcopy {
          margin: 0;
          font-size: 0.8rem;
          color: #6B7280;
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .price-main {
            font-size: 2.5rem;
          }

          .tier-name {
            font-size: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .platform-tier-card,
          .tier-cta {
            transition: none;
          }

          .platform-tier-card:hover,
          .platform-tier-card.recommended,
          .tier-cta:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
