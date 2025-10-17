"use client";

import { memo, useMemo, useState } from "react";

const PLAN_DATA = [
  {
    id: "starter",
    name: "Starter",
    monthly: 79,
    annual: 65,
    description: "Launch your first production workflow with automation blueprints and audit logging.",
    highlights: ["Up to 5 production automations", "SOC2-ready audit trails", "Email + community support"],
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 249,
    annual: 199,
    description: "Scale usage across teams with role-based access and private model hosting.",
    highlights: [
      "Unlimited automations",
      "Private model endpoints",
      "Workspace level analytics",
    ],
    badge: "Most popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 0,
    annual: 0,
    description: "Dedicated regions, on-prem connectors, and 24/7 support for regulated industries.",
    highlights: ["Dedicated region", "24/7 on-call", "On-premises data plane"],
    custom: true,
  },
];

const BILLING_OPTIONS = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual (save 18%)" },
];

function formatCurrency(amount) {
  if (!amount) {
    return "Custom";
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function PlanCard({ plan, billingCycle }) {
  const price = plan.custom ? "Contact" : formatCurrency(plan[billingCycle]);
  const priceSuffix = plan.custom ? "sales" : "/seat";

  return (
    <article className="pricing-card" data-plan={plan.id} data-featured={Boolean(plan.badge)}>
      {plan.badge ? <span className="pricing-card__badge">{plan.badge}</span> : null}
      <header>
        <h3>{plan.name}</h3>
        <p>{plan.description}</p>
      </header>
      <strong className="pricing-card__price">
        {price}
        {!plan.custom && <span>{`/month ${priceSuffix}`}</span>}
      </strong>
      <ul>
        {plan.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a className="pricing-card__cta" href={plan.custom ? "/contact" : "/signup"}>
        {plan.custom ? "Talk to sales" : "Start trial"}
      </a>
    </article>
  );
}

function PricingMatrix() {
  const [billingCycle, setBillingCycle] = useState("annual");

  const heading = useMemo(
    () => (billingCycle === "annual" ? "Annual" : "Monthly"),
    [billingCycle],
  );

  return (
    <section className="pricing-matrix" aria-label="Pricing plans">
      <header className="pricing-matrix__header">
        <div>
          <h2>Transparent pricing that scales with adoption</h2>
          <p>Switch plans at any time. Usage-based billing ensures you only pay for active automations.</p>
        </div>
        <fieldset className="pricing-matrix__toggle">
          <legend className="sr-only">Select billing cadence</legend>
          {BILLING_OPTIONS.map((option) => (
            <label key={option.id} data-active={billingCycle === option.id}>
              <input
                type="radio"
                name="billing"
                value={option.id}
                checked={billingCycle === option.id}
                onChange={() => setBillingCycle(option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </header>
      <div className="pricing-matrix__grid" role="list" aria-label={`${heading} pricing options`}>
        {PLAN_DATA.map((plan) => (
          <PlanCard key={plan.id} plan={plan} billingCycle={billingCycle} />
        ))}
      </div>
    </section>
  );
}

export default memo(PricingMatrix);