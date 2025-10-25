"use client";

import { useId, useMemo } from "react";
import { Icon } from "@/components/icons";
import type { BillingCadence, Plan } from "@/components/pricing/types";

type Props = {
  plan: Plan;
  billing: BillingCadence;
  dir?: "ltr" | "rtl";
};

export default function PlanCard({ plan, billing, dir }: Props) {
  const headingId = useId();
  const badgeId = useId();
  const isEnterprise = plan.priceMonthly == null && plan.priceAnnual == null;
  const annualTotal = plan.priceAnnual != null ? Math.round(plan.priceAnnual) : null;
  const monthlyPrice = plan.priceMonthly != null ? Math.round(plan.priceMonthly) : null;
  const annualPerMonth = annualTotal != null ? Math.round(annualTotal / 12) : null;

  const featureItems = useMemo(() => {
    const trimmed = plan.capabilities.slice(0, 3);
    if (!plan.support) {
      return trimmed.slice(0, 4);
    }
    return [...trimmed, { label: `Support: ${plan.support}` }];
  }, [plan.capabilities, plan.support]);

  return (
    <article
      className={`plan-card${plan.mostPopular ? " plan-card--popular" : ""}`}
      aria-labelledby={`${headingId}${plan.mostPopular ? ` ${badgeId}` : ""}`}
      dir={dir}
    >
      <header className="plan-card__header">
        {plan.mostPopular && (
          <span id={badgeId} className="plan-card__badge">
            Most popular
          </span>
        )}
        <h3 id={headingId} className="plan-card__name">
          {plan.name}
          {plan.mostPopular && <span className="sr-only"> - Most popular</span>}
        </h3>
        <p className="plan-card__who">{plan.whoFor}</p>
        {plan.tagline && <p className="plan-card__tagline">{plan.tagline}</p>}
      </header>

      <div className="plan-card__price" aria-live="polite">
        {isEnterprise ? (
          <div className="price-custom">
            <span className="price-custom__label">Custom pricing</span>
            <span className="price-custom__desc">Tailored contract based on volume and compliance scope.</span>
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
          </div>
        ) : annualTotal != null ? (
          <div className="price-stack">
            <div className="price-line" aria-label="Total per year, billed annually">
              <span className="price-line__currency" aria-hidden>
                $
              </span>
              <span className="price-line__amount">{annualTotal.toLocaleString()}</span>
              <span className="price-line__period">/year</span>
            </div>
            {annualPerMonth != null && (
              <div className="price-note" aria-label="Monthly equivalent when billed annually">
                Equivalent to ${annualPerMonth.toLocaleString()} per month
              </div>
            )}
          </div>
        ) : null}
      </div>

      <ul className="plan-card__features" aria-label="Key inclusions">
        {featureItems.map((capability) => (
          <li key={capability.label} className="plan-card__feature">
            <Icon name="check" size={18} aria-hidden className="plan-card__feature-icon" />
            <span>{capability.label}</span>
          </li>
        ))}
      </ul>

      {plan.limits && <p className="plan-card__limits">{plan.limits}</p>}

      <dl className="plan-card__essentials">
        <div>
          <dt>Go live speed</dt>
          <dd>{plan.deployment}</dd>
        </div>
      </dl>

      <div className="plan-card__cta">
        <a
          href={plan.ctaTo ?? "#"}
          className={`plan-card__button${isEnterprise ? " plan-card__button--outline" : ""}`}
          aria-label={`${plan.name} plan - ${plan.ctaLabel}`}
        >
          {plan.ctaLabel}
        </a>
      </div>

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
        .plan-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 1px solid var(--border-default);
          background: var(--bg-card);
          border-radius: 18px;
          padding: 1.5rem;
          min-height: 100%;
        }
        .plan-card--popular {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }
        .plan-card__header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .plan-card__badge {
          align-self: flex-start;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: 2px solid var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-radius: 999px;
          padding: 0.2rem 0.65rem;
        }
        .plan-card__name {
          margin: 0;
          font-size: 1.5rem;
        }
        .plan-card__who {
          margin: 0;
          color: var(--text-secondary);
        }
        .plan-card__tagline {
          margin: 0;
          font-weight: 600;
        }

        .plan-card__price {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .price-stack {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .price-line {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .price-line__currency {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .price-line__amount {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .price-line__period {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .price-note {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .price-custom {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .price-custom__label {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .price-custom__desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .plan-card__features {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .plan-card__feature {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }
        .plan-card__feature-icon {
          color: var(--accent-success);
          margin-top: 0.2rem;
        }

        .plan-card__limits {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .plan-card__essentials {
          display: grid;
          gap: 0.75rem;
          margin: 0;
          padding: 0;
        }
        .plan-card__essentials dt {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
        }
        .plan-card__essentials dd {
          margin: 0;
          font-weight: 600;
        }

        .plan-card__cta {
          margin-top: auto;
        }
        .plan-card__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 2px solid var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
          font-weight: 800;
          text-decoration: none;
        }
        .plan-card__button:hover {
          background: var(--accent-primary-hover);
          border-color: var(--accent-primary-hover);
        }
        .plan-card__button:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }
        .plan-card__button--outline {
          background: transparent;
          color: var(--text-primary);
          border-color: var(--text-primary);
        }
        .plan-card__button--outline:hover {
          background: var(--interactive-hover);
        }
      `}</style>
    </article>
  );
}
