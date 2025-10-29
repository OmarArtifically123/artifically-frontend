"use client";

import { useId, useMemo, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Icon } from "@/components/icons";
import type { BillingCadence, Plan } from "@/components/pricing/types";

type Props = {
  plan: Plan;
  billing: BillingCadence;
  dir?: "ltr" | "rtl";
  index?: number;
  onCompare?: (planId: string) => void;
};

export default function EnhancedPlanCard({ plan, billing, dir, index = 0, onCompare }: Props) {
  const headingId = useId();
  const badgeId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const isEnterprise = plan.priceMonthly == null && plan.priceAnnual == null;
  const annualTotal = plan.priceAnnual != null ? Math.round(plan.priceAnnual) : null;
  const monthlyPrice = plan.priceMonthly != null ? Math.round(plan.priceMonthly) : null;
  const annualPerMonth = annualTotal != null ? Math.round(annualTotal / 12) : null;

  const savings = useMemo(() => {
    if (billing === "annual" && monthlyPrice && annualTotal) {
      const monthlyTotal = monthlyPrice * 12;
      const saved = monthlyTotal - annualTotal;
      const percent = Math.round((saved / monthlyTotal) * 100);
      return { amount: saved, percent };
    }
    return null;
  }, [billing, monthlyPrice, annualTotal]);

  const featureItems = useMemo(() => {
    const trimmed = plan.capabilities.slice(0, 3);
    if (!plan.support) {
      return trimmed.slice(0, 4);
    }
    return [...trimmed, { label: `Support: ${plan.support}` }];
  }, [plan.capabilities, plan.support]);

  return (
    <article
      ref={ref}
      className={`
        enhanced-plan-card
        ${plan.mostPopular ? "enhanced-plan-card--popular" : ""}
        ${inView ? "enhanced-plan-card--visible" : ""}
      `}
      aria-labelledby={`${headingId}${plan.mostPopular ? ` ${badgeId}` : ""}`}
      dir={dir}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="enhanced-plan-card__glow" aria-hidden="true" />

      {/* Popular badge */}
      {plan.mostPopular && (
        <div className="popular-badge-wrapper">
          <span id={badgeId} className="popular-badge">
            <span className="popular-badge__icon">⭐</span>
            <span>Most popular</span>
            <span className="popular-badge__shine" />
          </span>
        </div>
      )}

      <header className="enhanced-plan-card__header">
        <h3 id={headingId} className="plan-name">
          {plan.name}
          {plan.mostPopular && <span className="sr-only"> - Most popular</span>}
        </h3>
        <p className="plan-who">{plan.whoFor}</p>
        {plan.tagline && (
          <p className="plan-tagline">
            <Icon name="check-circle" size={16} aria-hidden className="tagline-icon" />
            {plan.tagline}
          </p>
        )}
      </header>

      {/* Price section with savings indicator */}
      <div className="enhanced-plan-card__price" aria-live="polite">
        {isEnterprise ? (
          <div className="price-custom">
            <div className="price-custom__icon">
              <Icon name="sparkles" size={32} aria-hidden />
            </div>
            <span className="price-custom__label">Custom pricing</span>
            <span className="price-custom__desc">
              Tailored contract based on volume and compliance scope.
            </span>
          </div>
        ) : billing === "monthly" && monthlyPrice != null ? (
          <div className="price-stack">
            <div className="price-line" aria-label="Price per month, billed monthly">
              <span className="price-line__currency" aria-hidden>
                $
              </span>
              <span className="price-line__amount">{monthlyPrice.toLocaleString()}</span>
              <span className="price-line__period">/month</span>
            </div>
            <div className="price-note">Billed monthly</div>
          </div>
        ) : annualTotal != null ? (
          <div className="price-stack">
            {savings && (
              <div className="savings-badge">
                <Icon name="zap" size={14} aria-hidden />
                Save ${savings.amount.toLocaleString()} ({savings.percent}%)
              </div>
            )}
            <div className="price-line" aria-label="Total per year, billed annually">
              <span className="price-line__currency" aria-hidden>
                $
              </span>
              <span className="price-line__amount">{annualTotal.toLocaleString()}</span>
              <span className="price-line__period">/year</span>
            </div>
            {annualPerMonth != null && (
              <div className="price-note" aria-label="Monthly equivalent when billed annually">
                ${annualPerMonth.toLocaleString()}/month when paid annually
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Features list with icons */}
      <ul className="enhanced-plan-card__features" aria-label="Key inclusions">
        {featureItems.map((capability, idx) => (
          <li
            key={capability.label}
            className="feature-item"
            style={{ animationDelay: `${index * 0.1 + idx * 0.05}s` }}
          >
            <div className="feature-icon-wrapper">
              <Icon name="check" size={18} aria-hidden className="feature-icon" />
            </div>
            <span className="feature-text">{capability.label}</span>
          </li>
        ))}
      </ul>

      {/* Limits */}
      {plan.limits && <p className="plan-limits">{plan.limits}</p>}

      {/* Deployment speed badge */}
      <div className="plan-essentials">
        <div className="essential-item">
          <Icon name="clock" size={16} aria-hidden className="essential-icon" />
          <div className="essential-content">
            <dt className="essential-label">Go live speed</dt>
            <dd className="essential-value">{plan.deployment}</dd>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="enhanced-plan-card__actions">
        <a
          href={plan.ctaTo ?? "#"}
          className={`plan-cta ${isEnterprise ? "plan-cta--outline" : "plan-cta--primary"}`}
          aria-label={`${plan.name} plan - ${plan.ctaLabel}`}
        >
          <span>{plan.ctaLabel}</span>
          {!isEnterprise && (
            <Icon
              name="arrow-right"
              size={18}
              aria-hidden
              className="plan-cta__icon"
            />
          )}
        </a>
        
        {onCompare && (
          <button
            type="button"
            onClick={() => onCompare(plan.id)}
            className="compare-btn"
            aria-label={`Compare ${plan.name} plan`}
          >
            <Icon name="layout-grid" size={16} aria-hidden />
            Compare plans
          </button>
        )}
      </div>

      {/* Hover tooltip */}
      {isHovered && plan.mostPopular && (
        <div className="hover-tooltip" role="tooltip">
          Best value for growing teams
        </div>
      )}

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .enhanced-plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border: 2px solid var(--border-default);
          background: var(--bg-card);
          border-radius: 24px;
          padding: 2rem;
          min-height: 100%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateY(30px);
        }

        .enhanced-plan-card--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .enhanced-plan-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-primary);
          box-shadow: 0 20px 60px color-mix(in srgb, var(--accent-primary) 20%, transparent);
        }

        .enhanced-plan-card--popular {
          border-color: var(--accent-primary);
          border-width: 3px;
          background: linear-gradient(
            135deg,
            var(--bg-card) 0%,
            color-mix(in srgb, var(--accent-primary) 5%, var(--bg-card)) 100%
          );
        }

        .enhanced-plan-card--popular:hover {
          box-shadow: 0 24px 70px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }

        .enhanced-plan-card__glow {
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }

        .enhanced-plan-card:hover .enhanced-plan-card__glow {
          opacity: 0.15;
        }

        .popular-badge-wrapper {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .popular-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1.2rem;
          background: linear-gradient(
            135deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
          );
          color: var(--text-inverse);
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 20px color-mix(in srgb, var(--accent-primary) 40%, transparent);
          overflow: hidden;
        }

        .popular-badge__icon {
          font-size: 1rem;
          animation: star-spin 3s linear infinite;
        }

        @keyframes star-spin {
          0%, 90% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .popular-badge__shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in srgb, white 30%, transparent) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0%, 60% {
            transform: translateX(-100%);
          }
          80% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .enhanced-plan-card__header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .plan-name {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .plan-who {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .plan-tagline {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          padding: 0.6rem 1rem;
          background: color-mix(in srgb, var(--accent-success) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-success) 30%, transparent);
          border-radius: 12px;
          color: var(--accent-success);
        }

        .tagline-icon {
          color: var(--accent-success);
        }

        .enhanced-plan-card__price {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border-radius: 18px;
          border: 1px solid var(--border-subtle);
        }

        .price-stack {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .savings-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          align-self: flex-start;
          padding: 0.35rem 0.75rem;
          background: linear-gradient(
            120deg,
            color-mix(in srgb, var(--accent-success) 20%, transparent),
            color-mix(in srgb, var(--accent-success) 10%, transparent)
          );
          border: 1px solid color-mix(in srgb, var(--accent-success) 40%, transparent);
          border-radius: 8px;
          color: var(--accent-success);
          font-size: 0.85rem;
          font-weight: 800;
          animation: savings-pulse 2s ease-in-out infinite;
        }

        @keyframes savings-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        .price-line {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .price-line__currency {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-secondary);
        }

        .price-line__amount {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .price-line__period {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .price-note {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .price-custom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }

        .price-custom__icon {
          color: var(--accent-primary);
          animation: float-icon 3s ease-in-out infinite;
        }

        @keyframes float-icon {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .price-custom__label {
          font-size: 1.75rem;
          font-weight: 900;
        }

        .price-custom__desc {
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .enhanced-plan-card__features {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 10px;
          transition: background 0.2s ease;
          opacity: 0;
          animation: feature-entrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes feature-entrance {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .feature-item:hover {
          background: var(--bg-secondary);
        }

        .feature-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: color-mix(in srgb, var(--accent-success) 15%, transparent);
          flex-shrink: 0;
        }

        .feature-icon {
          color: var(--accent-success);
        }

        .feature-text {
          flex: 1;
          line-height: 1.5;
        }

        .plan-limits {
          margin: 0;
          padding: 1rem;
          background: var(--bg-secondary);
          border-left: 3px solid var(--accent-primary);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .plan-essentials {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .essential-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
        }

        .essential-icon {
          color: var(--accent-primary);
        }

        .essential-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .essential-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .essential-value {
          margin: 0;
          font-weight: 700;
          color: var(--text-primary);
        }

        .enhanced-plan-card__actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: auto;
        }

        .plan-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-radius: 14px;
          font-weight: 900;
          text-decoration: none;
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .plan-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            color-mix(in srgb, white 20%, transparent) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .plan-cta:hover::before {
          transform: translateX(100%);
        }

        .plan-cta--primary {
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-color: var(--accent-primary);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }

        .plan-cta--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px color-mix(in srgb, var(--accent-primary) 40%, transparent);
        }

        .plan-cta--outline {
          background: transparent;
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .plan-cta--outline:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .plan-cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 3px;
        }

        .plan-cta__icon {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .plan-cta:hover .plan-cta__icon {
          transform: translateX(3px);
        }

        .compare-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-default);
          background: transparent;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .compare-btn:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .compare-btn:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .hover-tooltip {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.5rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 12px color-mix(in srgb, black 15%, transparent);
          animation: tooltip-entrance 0.2s ease;
        }

        @keyframes tooltip-entrance {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .hover-tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid var(--border-default);
        }

        @media (prefers-reduced-motion: reduce) {
          .enhanced-plan-card,
          .enhanced-plan-card__glow,
          .popular-badge__icon,
          .popular-badge__shine,
          .savings-badge,
          .price-custom__icon,
          .feature-item,
          .plan-cta,
          .hover-tooltip {
            animation: none !important;
            transition: none !important;
          }

          .enhanced-plan-card:hover,
          .plan-cta:hover,
          .plan-cta--primary:hover {
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}

