"use client";

import { useId } from "react";
import { Icon } from "@/components/icons";
import type { BillingCadence, Plan } from "@/components/pricing/types";

type Props = {
  plan: Plan;
  billing: BillingCadence;
  dir?: "ltr" | "rtl";
  emphasize?: boolean;
};

export default function PlanCard({ plan, billing, dir = undefined, emphasize = false }: Props) {
  const headingId = useId();
  const badgeId = useId();
  const priceMonthly = plan.priceMonthly ?? undefined;
  const priceAnnual = plan.priceAnnual ?? undefined;
  const showPrice = !!(priceMonthly || priceAnnual);
  const perMonthAnnual = priceAnnual ? Math.round(priceAnnual / 12) : undefined;

  const isEnterprise = !priceMonthly && !priceAnnual;

  return (
    <article className={`plan-card${plan.mostPopular ? " is-popular" : ""}${emphasize ? " is-emphasized" : ""}`} dir={dir} aria-labelledby={headingId}>
      {plan.mostPopular && (
        <div id={badgeId} className="plan-badge" aria-label="Most popular">
          <span aria-hidden="true">Most Popular</span>
        </div>
      )}

      <header className="plan-header">
        <div className="plan-title">
          <h3 id={headingId} className="plan-name">
            {plan.name}
            {plan.mostPopular && (
              <>
                <span className="sr-only"> — Most Popular</span>
                <span className="popular-chip" aria-hidden>Most Popular</span>
              </>
            )}
          </h3>
          <p className="plan-who">{plan.whoFor}</p>
          <p className="plan-tagline">{plan.tagline}</p>
        </div>

        {showPrice && (
          <div className="plan-price" aria-live="polite">
            {billing === "monthly" && priceMonthly != null && (
              <>
                <div className="price-row" aria-label="Price per month, billed monthly">
                  <span className="currency" aria-hidden>$</span>
                  <span className="amount">{priceMonthly.toLocaleString()}</span>
                  <span className="period">/month</span>
                </div>
              </>
            )}
            {billing === "annual" && priceAnnual != null && (
              <>
                <div className="price-row" aria-label="Total per year, billed annually">
                  <span className="currency" aria-hidden>$</span>
                  <span className="amount">{priceAnnual.toLocaleString()}</span>
                  <span className="period">/year</span>
                </div>
                <div className="price-note">
                  <span>
                    Equivalent to ${perMonthAnnual?.toLocaleString()} / month
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      <div className="plan-meta">
        <div className="meta-item">
          <Icon name="zap" size={18} aria-hidden className="meta-icon" />
          <div>
            <div className="meta-label">Deployment</div>
            <div className="meta-value">{plan.deployment}</div>
          </div>
        </div>
        <div className="meta-item">
          <Icon name="headphones" size={18} aria-hidden className="meta-icon" />
          <div>
            <div className="meta-label">Support</div>
            <div className="meta-value">{plan.support}</div>
          </div>
        </div>
      </div>

      <ul className="plan-capabilities" aria-label="Key capabilities">
        {plan.capabilities.map((cap) => (
          <li className="capability" key={cap.label}>
            <Icon name="check" size={18} aria-hidden className="cap-icon" />
            <div>
              <div className="cap-label">{cap.label}</div>
              {cap.description && <div className="cap-desc">{cap.description}</div>}
            </div>
          </li>
        ))}
      </ul>

      {plan.limits && (
        <p className="plan-limits" aria-label="Usage scale">{plan.limits}</p>
      )}

      <div className="plan-cta">
        <a href={plan.ctaTo ?? "#"} className={`cta ${isEnterprise ? "cta-secondary" : ""}`}>
          {plan.ctaLabel}
        </a>
      </div>

      <style jsx>{`
        .sr-only { position: absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        .plan-card { display:flex; flex-direction:column; justify-content:stretch; border:1px solid var(--border-default); background: var(--bg-card); border-radius: 16px; padding: 1.25rem; gap: 1rem; min-height: 100%; }
        .plan-card.is-popular { outline: 3px solid var(--accent-primary); outline-offset: 2px; }
        .plan-card.is-emphasized { border-color: var(--accent-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-primary) 35%, transparent); }
        .plan-badge { position: absolute; clip-path: inset(0); height:1px; width:1px; overflow:hidden; }

        .plan-header { display:flex; flex-direction:column; gap:0.5rem; }
        .plan-name { margin:0; font-size:1.25rem; display:flex; align-items:center; gap:0.5rem; flex-wrap: wrap; }
        .popular-chip { display:inline-flex; align-items:center; font-size: 0.75rem; font-weight: 900; color: var(--text-inverse); background: var(--text-primary); border: 2px solid var(--text-primary); border-radius: 999px; padding: 0.1rem 0.5rem; }
        .plan-who { margin:0; color: var(--text-secondary); font-size: 0.95rem; }
        .plan-tagline { margin:0; color: var(--text-primary); font-weight:600; }

        .plan-price { margin-block-start: 0.5rem; }
        .price-row { display:flex; align-items: baseline; gap:0.25rem; color: var(--text-primary); }
        .currency { font-size: 1.25rem; font-weight: 700; }
        .amount { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em; }
        .period { color: var(--text-secondary); font-weight: 600; }
        .price-note { color: var(--text-secondary); font-size: 0.875rem; }

        .plan-meta { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 0.75rem; }
        .meta-item { display:flex; gap:0.5rem; align-items: center; border:1px solid var(--border-subtle); border-radius: 10px; padding: 0.5rem 0.75rem; background: var(--bg-secondary); }
        .meta-icon { color: var(--accent-primary); }
        .meta-label { font-size: 0.75rem; color: var(--text-secondary); }
        .meta-value { font-size: 0.95rem; font-weight:600; color: var(--text-primary); }

        .plan-capabilities { list-style: none; margin:0; padding:0; display:flex; flex-direction:column; gap: 0.5rem; }
        .capability { display:flex; gap:0.5rem; align-items:flex-start; }
        .cap-icon { color: var(--accent-success); margin-top: 0.2rem; }
        .cap-label { font-weight: 600; }
        .cap-desc { color: var(--text-secondary); }

        .plan-limits { margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.95rem; }

        .plan-cta { margin-top: auto; }
        .cta { display:inline-flex; justify-content:center; align-items:center; gap:0.5rem; padding: 0.75rem 1rem; border-radius: 12px; border:2px solid var(--accent-primary); background: var(--accent-primary); color: var(--text-inverse); font-weight:800; text-decoration:none; }
        .cta:hover { background: var(--accent-primary-hover); border-color: var(--accent-primary-hover); }
        .cta:focus-visible { outline: 3px solid var(--border-focus); outline-offset: 2px; }
        .cta-secondary { background: transparent; color: var(--text-primary); border-color: var(--text-primary); }
        .cta-secondary:hover { background: var(--interactive-hover); }
      `}</style>
    </article>
  );
}
