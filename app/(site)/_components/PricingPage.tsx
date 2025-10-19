// @ts-nocheck
"use client";

import { useState } from "react";
import ROICalculator from "@/components/roi/ROICalculator";
import { Icon } from "@/components/icons";

type BillingCadence = "monthly" | "annual";

type BillingOption = {
  id: BillingCadence;
  label: string;
  badge?: string;
};

const billingOptions: BillingOption[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual (Save 20%)", badge: "20%" },
];

type PricingTier = {
  id: string;
  name: string;
  icon: string;
  priceMonthly?: number;
  priceAnnual?: number;
  spotlight?: boolean;
  description: string;
  features: string[];
  ctaLabel?: string;
};

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    icon: "rocket",
    priceMonthly: 249,
    priceAnnual: Math.round(249 * 12 * 0.8),
    description: "For teams automating their first playbooks and validating new workflows.",
    features: [
      "5 automations",
      "Workflow analytics",
      "Email support",
      "1,000 monthly operations",
      "Community access",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: "star",
    priceMonthly: 549,
    priceAnnual: Math.round(549 * 12 * 0.8),
    spotlight: true,
    description: "Best for scaling teams that want to launch AI copilots with guidance and guardrails.",
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
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: "building",
    description: "Built for global operations that require custom governance, security, and partnership.",
    features: [
      "Custom SLAs",
      "Private deployment",
      "Onsite launch week",
      "Security reviews",
      "Unlimited operations",
      "White-glove support",
    ],
    ctaLabel: "Contact Sales",
  },
];

type FaqItemData = {
  question: string;
  answer: string;
};

const faqItems: FaqItemData[] = [
  {
    question: "How does billing work?",
    answer:
      "Choose monthly if you want flexibility or switch to annual to lock pricing and capture a guaranteed 20% savings on your total contract.",
  },
  {
    question: "Can we scale usage as we grow?",
    answer:
      "Absolutely. Increase automations, seats, or environments at any time and we instantly pro-rate charges so you only pay for what you use.",
  },
  {
    question: "What support is included?",
    answer:
      "All plans include 24/7 incident response, workflow diagnostics, and a dedicated Slack channel with real humans monitoring every alert.",
  },
  {
    question: "Do you offer pilots?",
    answer:
      "Yes. We spin up production-parity pilots in under a week, pair you with a solutions architect, and share success metrics throughout the trial.",
  },
  {
    question: "Can we switch plans?",
    answer:
      "Plans can be upgraded or downgraded in a few clicks. Downgrades take effect at the end of the term while upgrades unlock features instantly.",
  },
  {
    question: "What's included in Enterprise?",
    answer:
      "Enterprise customers receive bespoke onboarding, security reviews, roadmap previews, and a named team of automation specialists on call.",
  },
  {
    question: "How secure is the platform?",
    answer:
      "We maintain SOC 2 Type II compliance, encryption in transit and at rest, and optional private deployments to keep sensitive data isolated.",
  },
  {
    question: "What happens after the trial?",
    answer:
      "At the end of your trial we review adoption metrics together, recommend the right tier, and transition everything without any downtime.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCadence>("annual");
  const [openFaqs, setOpenFaqs] = useState([faqItems[0].question]);

  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <h1>Choose Your Growth Path</h1>
        <p>
          Start free, scale as you grow. All plans include core automations and 24/7
          support.
        </p>
        <div className="pricing-toggle" role="group" aria-label="Billing cadence">
          {billingOptions.map((option) => {
            const isActive = billing === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={isActive ? "active" : ""}
                onClick={() => setBilling(option.id)}
              >
                <span>{option.label}</span>
                {option.badge ? <span className="badge">{option.badge}</span> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="pricing-cards">
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} billing={billing} />
        ))}
      </section>

      <ROICalculator
        heading="Calculate Your Savings"
        description="Adjust team size and hourly rate to project ROI in seconds."
        id="pricing-roi-calculator"
        variant="pricing"
      />

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="pricing-faq__items">
          {faqItems.map((item, index) => {
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;
            const isOpen = openFaqs.includes(item.question);
            return (
              <FaqItem
                key={item.question}
                item={item}
                isOpen={isOpen}
                panelId={panelId}
                triggerId={triggerId}
                onToggle={() =>
                  setOpenFaqs((prev) =>
                    prev.includes(item.question)
                      ? prev.filter((question) => question !== item.question)
                      : [...prev, item.question],
                  )
                }
              />
            );
          })}
        </div>
      </section>

      <style jsx>{`
        .pricing-page {
          display: flex;
          flex-direction: column;
          gap: 6rem;
          padding-bottom: 6rem;
        }

        .pricing-hero {
          padding: 100px 40px 60px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .pricing-hero h1 {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .pricing-hero p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0;
        }

        .pricing-toggle {
          display: inline-flex;
          gap: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .pricing-toggle button {
          position: relative;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          transition: all 200ms ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .pricing-toggle button.active {
          background: #a78bfa;
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .pricing-toggle .badge {
          position: absolute;
          top: -10px;
          right: -6px;
          background: #22c55e;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 999px;
        }

        .pricing-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        @media (max-width: 1024px) {
          .pricing-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .pricing-hero {
            padding: 80px 24px 50px;
          }

          .pricing-cards {
            grid-template-columns: 1fr;
            padding: 0 24px;
          }
        }

        .pricing-faq {
          max-width: 800px;
          margin: 100px auto;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }

        .pricing-faq h2 {
          font-size: 36px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin: 0;
        }

        .pricing-faq__items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .pricing-faq {
            padding: 0 24px;
            margin: 80px auto;
          }
        }
      `}</style>
    </main>
  );
}

type PricingCardProps = {
  tier: PricingTier;
  billing: BillingCadence;
};

function PricingCard({ tier, billing }: PricingCardProps) {
  const isCustom = !tier.priceMonthly;
  const isAnnual = billing === "annual" && tier.priceAnnual;
  const displayPrice = isCustom
    ? "Custom"
    : isAnnual
    ? tier.priceAnnual
    : tier.priceMonthly;

  return (
    <article
      className={`pricing-card${tier.spotlight ? " pricing-card--spotlight" : ""}`}
    >
      {tier.spotlight && <span className="pricing-card__badge">MOST POPULAR</span>}
      <header className="pricing-card__header">
        <span className="pricing-card__tier">{tier.name}</span>
        <Icon name={tier.icon} size={48} className="pricing-card__icon" />
        <div className="pricing-card__price">
          {isCustom ? (
            <span className="pricing-card__custom">Custom</span>
          ) : (
            <>
              <span className="pricing-card__currency">$</span>
              <span className="pricing-card__amount">{displayPrice?.toLocaleString()}</span>
              <span className="pricing-card__period">{isAnnual ? "/year" : "/month"}</span>
            </>
          )}
        </div>
        {!isCustom && (
          <p className="pricing-card__note">
            {isAnnual ? (
              <>
                or <span className="pricing-card__strike">${tier.priceMonthly?.toLocaleString()}</span>
                /month billed monthly
              </>
            ) : (
              <>Billed monthly</>
            )}
          </p>
        )}
        <p className="pricing-card__description">{tier.description}</p>
      </header>

      <ul className="pricing-card__features">
        {tier.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" size={20} className="pricing-card__feature-icon" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`pricing-card__cta${isCustom ? " pricing-card__cta--secondary" : ""}`}
      >
        {tier.ctaLabel ?? "Start Free Trial"}
      </button>

      <style jsx>{`
        .pricing-card {
          padding: 40px 32px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          transition: transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .pricing-card--spotlight {
          transform: scale(1.05);
          border: 2px solid rgba(139, 92, 246, 0.5);
          box-shadow: 0 16px 48px rgba(139, 92, 246, 0.2);
          background: rgba(29, 24, 56, 0.85);
        }

        .pricing-card--spotlight:hover {
          transform: scale(1.08) translateY(-4px);
        }

        .pricing-card__badge {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 20px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: white;
        }

        .pricing-card__header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pricing-card__tier {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
        }

        .pricing-card__icon {
          color: #a78bfa;
        }

        .pricing-card__price {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-top: 8px;
        }

        .pricing-card__custom {
          font-size: 32px;
          font-weight: 600;
          color: white;
        }

        .pricing-card__currency {
          font-size: 32px;
          font-weight: 600;
          color: white;
        }

        .pricing-card__amount {
          font-size: 56px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }

        .pricing-card__period {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
        }

        .pricing-card__note {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .pricing-card__strike {
          text-decoration: line-through;
        }

        .pricing-card__description {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin: 0 0 8px;
        }

        .pricing-card__features {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pricing-card__features li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.5;
        }

        .pricing-card__features li:last-child {
          border-bottom: none;
        }

        .pricing-card__feature-icon {
          flex-shrink: 0;
          color: #4ade80;
        }

        .pricing-card__cta {
          margin-top: auto;
          padding: 16px 32px;
          width: 100%;
          background: linear-gradient(135deg, #a78bfa, #ec4899);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          border: none;
          cursor: pointer;
          transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }

        .pricing-card__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4);
        }

        .pricing-card__cta--secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pricing-card__cta--secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: #a78bfa;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .pricing-card__amount {
            font-size: 48px;
          }
        }
      `}</style>
    </article>
  );
}

type FaqItemProps = {
  item: FaqItemData;
  isOpen: boolean;
  panelId: string;
  triggerId: string;
  onToggle: () => void;
};

function FaqItem({ item, isOpen, panelId, triggerId, onToggle }: FaqItemProps) {
  return (
    <article className={`pricing-faq__item${isOpen ? " pricing-faq__item--open" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="pricing-faq__question"
      >
        <span>{item.question}</span>
        <Icon
          name="chevronDown"
          size={20}
          className="pricing-faq__chevron"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-hidden={!isOpen}
        aria-labelledby={triggerId}
        className="pricing-faq__answer"
      >
        <p>{item.answer}</p>
      </div>

      <style jsx>{`
        .pricing-faq__item {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.04);
          transition: border-color 200ms ease, background 200ms ease;
        }

        .pricing-faq__item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .pricing-faq__item--open .pricing-faq__chevron {
          transform: rotate(180deg);
        }

        .pricing-faq__question {
          width: 100%;
          padding: 24px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 17px;
          font-weight: 600;
          color: white;
          transition: color 200ms ease;
        }

        .pricing-faq__chevron {
          color: rgba(255, 255, 255, 0.6);
          transition: transform 300ms ease;
        }

        .pricing-faq__answer {
          padding: ${isOpen ? "0 28px 24px" : "0 28px"};
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          max-height: ${isOpen ? "500px" : "0"};
          overflow: hidden;
          transition: max-height 400ms ease-out, padding 200ms ease;
        }

        .pricing-faq__answer p {
          margin: 0;
          opacity: ${isOpen ? 1 : 0};
          transition: opacity 300ms ease ${isOpen ? "100ms" : "0ms"};
        }
      `}</style>
    </article>
  );
}