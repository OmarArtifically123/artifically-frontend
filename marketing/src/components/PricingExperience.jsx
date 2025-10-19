"use client";

import { useCallback, useMemo, useState } from "react";

const BILLING_OPTIONS = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual (Save 20%)" },
];

const PLANS = [
  {
    id: "starter",
    tier: "Starter",
    icon: "rocket",
    monthly: 99,
    description: "Launch collaborative automations with guided workflows and foundational analytics.",
    features: [
      "5 automations",
      "Workflow analytics",
      "Email support",
      "1,000 monthly operations",
      "Community access",
    ],
    cta: { label: "Start Free Trial", href: "/signup", variant: "primary" },
  },
  {
    id: "professional",
    tier: "Professional",
    icon: "star",
    monthly: 249,
    description: "Scale across teams with AI copilots, dedicated success, and volume-based pricing.",
    features: [
      "Unlimited automations",
      "AI copilots",
      "Dedicated success architect",
      "Usage-based discounts",
      "Priority support",
      "10,000 monthly operations",
      "Advanced analytics",
      "Custom integrations",
    ],
    featured: true,
    cta: { label: "Start Free Trial", href: "/signup", variant: "primary" },
  },
  {
    id: "enterprise",
    tier: "Enterprise",
    icon: "building",
    monthly: 0,
    description: "Unlock private deployments, custom SLAs, and security reviews tailored to your org.",
    features: [
      "Custom SLAs",
      "Private deployment",
      "Onsite launch week",
      "Security reviews",
      "Unlimited operations",
      "White-glove support",
    ],
    cta: { label: "Contact Sales", href: "/contact", variant: "outline" },
  },
];

const FAQ_ITEMS = [
  {
    question: "How does billing work?",
    answer:
      "Plans are billed per workspace with flexible seat counts. Choose monthly to stay nimble or move to annual billing for a guaranteed 20% discount and reserved capacity.",
  },
  {
    question: "Can we scale usage as we grow?",
    answer:
      "Absolutely. Upgrade or downgrade plans anytime from the console, and automations scale automatically with your team size and execution volume.",
  },
  {
    question: "What support is included?",
    answer:
      "Starter includes 24/7 chat and email. Professional unlocks a dedicated success architect, and Enterprise adds white-glove onboarding with on-call coverage.",
  },
  {
    question: "Do you offer pilots?",
    answer:
      "Yes. Professional and Enterprise customers can launch a 30-day pilot with tailored success metrics so you can validate ROI with stakeholders.",
  },
  {
    question: "Can we switch plans?",
    answer:
      "You can change tiers at any point. Downgrades take effect at the next renewal and prorated credits automatically apply toward your new subscription.",
  },
  {
    question: "What's included in Enterprise?",
    answer:
      "Enterprise unlocks private cloud regions, bespoke integrations, and dedicated security reviews backed by contractual SLAs and governance controls. Your account team also tailors onboarding and governance workflows to match your compliance posture.",
  },
  {
    question: "How secure is the platform?",
    answer:
      "We maintain SOC 2 Type II compliance and support SSO and SCIM for identity controls. Granular audit logs ensure your security team can monitor every automation step in real time.",
  },
  {
    question: "What happens after the trial?",
    answer:
      "Trials seamlessly convert to the plan you select. Keep all workflows, data, and configuration without downtime or migration steps.",
  },
];

const SLIDERS = [
  {
    id: "teamSize",
    label: "Team size",
    min: 1,
    max: 250,
    step: 1,
    format: (value) => `${value} people`,
    defaultValue: 12,
  },
  {
    id: "hourlyRate",
    label: "Average hourly rate",
    min: 20,
    max: 300,
    step: 5,
    format: (value) => `$${value}/hr`,
    defaultValue: 85,
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function getIcon(type) {
  const commonProps = { width: 48, height: 48, fill: "none", strokeWidth: 1.5, stroke: "currentColor" };

  switch (type) {
    case "rocket":
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5c.75-.75 2.306-1.635 3.12-2.07a.75.75 0 0 1 .81.084l2.316 1.853a.75.75 0 0 0 .977-.033l3.687-3.687a12.081 12.081 0 0 0 3.04-5.137l.478-1.913-1.913.478a12.081 12.081 0 0 0-5.137 3.04l-3.687 3.687a.75.75 0 0 0-.033.977l1.853 2.316a.75.75 0 0 1-.033.977l-1.833 2.291a.75.75 0 0 1-.945.196c-.522-.275-1.685-.878-2.44-1.633-.755-.755-1.358-1.918-1.633-2.44a.75.75 0 0 1 .196-.945l2.291-1.833a.75.75 0 0 1 .977-.033l2.316 1.853"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
      );
    case "star":
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.48 3.499 2.013 4.079 4.502.655-3.257 3.176.769 4.487-4.027-2.118-4.028 2.118.77-4.487-3.258-3.176 4.503-.655 2.013-4.079Z"
          />
        </svg>
      );
    case "building":
      return (
        <svg {...commonProps} viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M4.5 21V7.125A2.625 2.625 0 0 1 7.125 4.5h9.75A2.625 2.625 0 0 1 19.5 7.125V21M9 8.25h.008v.008H9zM9 11.25h.008v.008H9zM9 14.25h.008v.008H9zM12 8.25h.008v.008H12zM12 11.25h.008v.008H12zM12 14.25h.008v.008H12zM15 8.25h.008v.008H15zM15 11.25h.008v.008H15zM15 14.25h.008v.008H15z"
          />
        </svg>
      );
    default:
      return null;
  }
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M16.667 5.833 8.75 13.75 5 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PricingPlanCard({ plan, billingCycle }) {
  const isAnnual = billingCycle === "annual";
  const monthlyPrice = plan.monthly;
  const annualPrice = plan.monthly ? Math.round(plan.monthly * 12 * 0.8) : 0;
  const showCustom = plan.monthly === 0;

  const priceValue = showCustom ? null : isAnnual ? annualPrice : monthlyPrice;
  const amountText = showCustom
    ? "Custom"
    : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(priceValue ?? 0);
  const period = showCustom ? "" : isAnnual ? "/year" : "/month";
  const altText = showCustom
    ? "Tailored pricing built around your governance requirements"
    : isAnnual
    ? `or ${formatCurrency(monthlyPrice)}/month billed monthly`
    : "Billed monthly with the flexibility to upgrade anytime";

  return (
    <article className="pricing-card" data-popular={plan.featured ? "true" : undefined}>
      {plan.featured ? <span className="pricing-card__badge">MOST POPULAR</span> : null}
      <header className="pricing-card__header">
        <span className="pricing-card__tier">{plan.tier}</span>
        <div className="pricing-card__icon" aria-hidden="true">
          {getIcon(plan.icon)}
        </div>
      </header>
      <div className="pricing-card__price">
        {!showCustom ? <span className="pricing-card__currency">$</span> : null}
        <span className="pricing-card__amount">{amountText}</span>
        {!showCustom && <span className="pricing-card__period">{period}</span>}
      </div>
      {!showCustom && isAnnual ? (
        <p className="pricing-card__alt" aria-live="polite">
          or <span className="pricing-card__alt--strike">{formatCurrency(monthlyPrice)}</span>/month billed monthly
        </p>
      ) : (
        <p className="pricing-card__alt">{altText}</p>
      )}
      <p className="pricing-card__description">{plan.description}</p>
      <ul className="pricing-card__features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a className="pricing-card__cta" data-variant={plan.cta.variant} href={plan.cta.href}>
        {plan.cta.label}
      </a>
    </article>
  );
}

function Slider({ label, min, max, step, value, onChange, formatValue }) {
  const [active, setActive] = useState(false);
  const percent = ((value - min) / (max - min)) * 100;

  const handlePointerUpdate = useCallback(
    (event) => {
      if (!event.currentTarget) return;
      const track = event.currentTarget;
      const rect = track.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const clampedRatio = Math.min(1, Math.max(0, ratio));
      const rawValue = min + clampedRatio * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.min(max, Math.max(min, steppedValue));
      onChange(clampedValue);
    },
    [max, min, onChange, step],
  );

  const handlePointerDown = useCallback(
    (event) => {
      event.preventDefault();
      const track = event.currentTarget;
      track.setPointerCapture(event.pointerId);
      setActive(true);
      handlePointerUpdate(event);
    },
    [handlePointerUpdate],
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!active) return;
      handlePointerUpdate(event);
    },
    [active, handlePointerUpdate],
  );

  const handlePointerUp = useCallback(
    (event) => {
      if (!active) return;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      setActive(false);
    },
    [active],
  );

  const handleKeyDown = useCallback(
    (event) => {
      let delta = 0;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        delta = -step;
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        delta = step;
      } else if (event.key === "Home") {
        onChange(min);
        event.preventDefault();
        return;
      } else if (event.key === "End") {
        onChange(max);
        event.preventDefault();
        return;
      }

      if (delta !== 0) {
        event.preventDefault();
        const next = Math.min(max, Math.max(min, value + delta));
        onChange(next);
      }
    },
    [max, min, onChange, step, value],
  );

  const valueLabel = formatValue(value);

  return (
    <div className="pricing-calculator__slider">
      <label>{label}</label>
      <div
        className="pricing-calculator__track"
        role="slider"
        tabIndex={0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="pricing-calculator__fill" style={{ width: `${percent}%` }} />
        <div className={`pricing-calculator__thumb${active ? " is-active" : ""}`} style={{ left: `${percent}%` }}>
          <span className="pricing-calculator__thumb-value">{valueLabel}</span>
        </div>
      </div>
    </div>
  );
}

function PricingCalculator() {
  const [values, setValues] = useState(
    () =>
      SLIDERS.reduce(
        (acc, slider) => {
          acc[slider.id] = slider.defaultValue;
          return acc;
        },
        {},
      ),
  );

  const savings = useMemo(() => {
    const teamSize = values.teamSize ?? SLIDERS[0].defaultValue;
    const hourlyRate = values.hourlyRate ?? SLIDERS[1].defaultValue;
    const monthlyHoursSaved = 34 * 4;
    const projected = Math.round(teamSize * hourlyRate * monthlyHoursSaved * 0.6);
    return projected;
  }, [values]);

  const handleChange = useCallback((id, nextValue) => {
    setValues((prev) => ({ ...prev, [id]: nextValue }));
  }, []);

  return (
    <section className="pricing-calculator">
      <div className="pricing-calculator__intro">
        <h2>Calculate Your Savings</h2>
        <p>Adjust team size and hourly rate to project ROI in seconds.</p>
      </div>
      <div className="pricing-calculator__controls">
        {SLIDERS.map((slider) => (
          <Slider
            key={slider.id}
            label={slider.label}
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={values[slider.id]}
            onChange={(next) => handleChange(slider.id, next)}
            formatValue={slider.format}
          />
        ))}
      </div>
      <div className="pricing-calculator__results">
        <div className="pricing-calculator__savings">{formatCurrency(savings)}</div>
        <span className="pricing-calculator__savings-label">ESTIMATED MONTHLY SAVINGS</span>
        <div className="pricing-calculator__metrics">
          <div>
            <span className="pricing-calculator__metric-value">34 hours/week</span>
            <span className="pricing-calculator__metric-label">Time saved</span>
          </div>
          <div>
            <span className="pricing-calculator__metric-value">10.5x</span>
            <span className="pricing-calculator__metric-label">Projected ROI</span>
          </div>
          <div>
            <span className="pricing-calculator__metric-value">2.3 months</span>
            <span className="pricing-calculator__metric-label">Break-even</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQAccordion() {
  const [openItems, setOpenItems] = useState(() => new Set());

  const toggleItem = useCallback((question) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  }, []);

  return (
    <section className="pricing-faq">
      <div className="pricing-faq__header">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div className="pricing-faq__items">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openItems.has(item.question);
          return (
            <div key={item.question} className={`pricing-faq__item${isOpen ? " is-open" : ""}`}>
              <button
                type="button"
                onClick={() => toggleItem(item.question)}
                aria-expanded={isOpen}
                className="pricing-faq__question"
              >
                <span>{item.question}</span>
                <span className="pricing-faq__chevron" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="pricing-faq__answer" data-open={isOpen ? "true" : "false"}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PricingExperience() {
  const [billingCycle, setBillingCycle] = useState("annual");

  const handleToggleKeyDown = useCallback((event, index) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = (index - 1 + BILLING_OPTIONS.length) % BILLING_OPTIONS.length;
      setBillingCycle(BILLING_OPTIONS[previousIndex].id);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (index + 1) % BILLING_OPTIONS.length;
      setBillingCycle(BILLING_OPTIONS[nextIndex].id);
    }
  }, []);

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <h1>Choose Your Growth Path</h1>
        <p>
          Start free, scale as you grow. All plans include core automations and 24/7 support.
        </p>
        <div className="pricing-hero__toggle" role="radiogroup" aria-label="Select billing frequency">
          {BILLING_OPTIONS.map((option, index) => {
            const isActive = billingCycle === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={`billing-toggle__option${isActive ? " is-active" : ""}`}
                onClick={() => setBillingCycle(option.id)}
                role="radio"
                aria-checked={isActive}
                onKeyDown={(event) => handleToggleKeyDown(event, index)}
              >
                <span>{option.label}</span>
                {option.id === "annual" ? <span className="billing-toggle__badge">20%</span> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="pricing-cards" aria-label="Pricing plans">
        {PLANS.map((plan) => (
          <PricingPlanCard key={plan.id} plan={plan} billingCycle={billingCycle} />
        ))}
      </section>

      <PricingCalculator />

      <FAQAccordion />
    </div>
  );
}

export default PricingExperience;