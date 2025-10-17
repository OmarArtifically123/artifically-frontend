import { useState } from "react";
import ROICalculator from "../components/roi/ROICalculator";
import { Icon } from "../components/icons";

const billingOptions = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual (Save 20%)" },
];

const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    icon: "rocket",
    priceMonthly: 249,
    priceAnnual: 249 * 12 * 0.8,
    spotlight: false,
    features: [
      "5 automations",
      "Workflow analytics",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: "briefcase",
    priceMonthly: 549,
    priceAnnual: 549 * 12 * 0.8,
    spotlight: true,
    features: [
      "Unlimited automations",
      "AI copilots",
      "Dedicated success architect",
      "Usage-based discounts",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: "building",
    priceMonthly: 0,
    priceAnnual: 0,
    spotlight: false,
    features: [
      "Custom SLAs",
      "Private deployment",
      "Onsite launch week",
      "Security reviews",
    ],
    custom: "Talk to sales",
  },
];

const faqItems = [
  {
    question: "How does billing work?",
    answer:
      "Choose monthly to stay flexible or annual to lock pricing and unlock a 20% discount.",
  },
  {
    question: "Can we scale usage as we grow?",
    answer:
      "Yes. Add automations or seats at any time. Your plan rebalances automatically with pro-rated credits.",
  },
  {
    question: "What support is included?",
    answer:
      "Every plan includes 24/7 incident response, a shared Slack channel, and quarterly architecture reviews.",
  },
  {
    question: "Do you offer pilots?",
    answer:
      "Enterprise teams launch a 30-day pilot with production parity, SOC 2 reports, and custom success plans.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("annual");
  const [openFaqs, setOpenFaqs] = useState([faqItems[0].question]);

  const multiplier = billing === "annual" ? 12 * 0.8 : 1;

  return (
    <main className="section-shell" style={{ gap: "clamp(2.5rem, 4vw, 3.5rem)", paddingBottom: "6rem" }}>
      <header className="section-header">
        <span className="section-eyebrow">Transparent Pricing</span>
        <h1 className="section-title">Choose Your Growth Path</h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem", borderRadius: "999px", background: "color-mix(in oklch, var(--glass-2) 80%, transparent)", border: "1px solid color-mix(in oklch, white 10%, transparent)" }}>
          {billingOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setBilling(option.id)}
              style={{
                borderRadius: "999px",
                padding: "0.6rem 1.4rem",
                border: "none",
                background:
                  billing === option.id
                    ? "color-mix(in oklch, var(--brand-primary) 25%, transparent)"
                    : "transparent",
                color: "color-mix(in oklch, white 85%, var(--gray-200))",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <section className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--landing-grid-gap)" }}>
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} multiplier={multiplier} billing={billing} />
        ))}
      </section>

      <ROICalculator
        heading="Calculate Your Savings"
        description="Adjust team size and hourly rate to project ROI in seconds."
        variant="panel"
        id="pricing-roi-calculator"
        style={{ marginTop: "2rem" }}
      />

      <section style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "white" }}>Frequently Asked Questions</h2>
        <div style={{ display: "grid", gap: "1rem" }}>
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
                      : [...prev, item.question]
                  )
                }
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}

function PricingCard({ tier, multiplier, billing }) {
  const isCustom = tier.custom;
  const price = tier.priceMonthly * multiplier;
  const displayPrice = isCustom
    ? tier.custom
    : billing === "annual"
    ? `$${Math.round(price).toLocaleString()}`
    : `$${tier.priceMonthly}`;
  const cadence = isCustom ? "" : billing === "annual" ? "/year" : "/month";

  return (
    <article
      className="feature-card"
      style={{
        borderRadius: "calc(var(--landing-radius-xl) * 0.7)",
        border: tier.spotlight
          ? "1px solid color-mix(in oklch, var(--brand-glow) 45%, transparent)"
          : undefined,
        boxShadow: tier.spotlight ? "0 25px 65px color-mix(in oklch, var(--brand-glow) 28%, transparent)" : undefined,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {tier.spotlight && (
        <span
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            padding: "0.35rem 0.8rem",
            borderRadius: "999px",
            background: "color-mix(in oklch, var(--brand-glow) 35%, transparent)",
            color: "white",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Most Popular
        </span>
      )}
      <div style={{ display: "grid", gap: "0.45rem" }}>
        <span style={{ fontSize: "2rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={tier.icon} size={28} />
        </span>
        <h3 style={{ fontSize: "1.5rem", color: "white" }}>{tier.name}</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
          <span style={{ fontSize: "2.4rem", fontWeight: 700, color: "white" }}>{displayPrice}</span>
          {cadence && <span style={{ color: "color-mix(in oklch, white 70%, var(--gray-300))" }}>{cadence}</span>}
        </div>
      </div>
      <ul style={{ display: "grid", gap: "0.45rem", paddingLeft: "1.1rem", marginTop: "1rem" }}>
        {tier.features.map((feature) => (
          <li
            key={feature}
            style={{ display: "flex", gap: "0.5rem", color: "color-mix(in oklch, white 78%, var(--gray-200))" }}
          >
            <Icon name="check" size={16} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="cta-primary"
        style={{ width: "100%", marginTop: "1.5rem" }}
      >
        {isCustom ? "Contact Sales" : "Start Free Trial"}
      </button>
    </article>
  );
}

function FaqItem({ item, isOpen, panelId, triggerId, onToggle }) {
  return (
    <article
      className="feature-card"
      style={{
        borderRadius: "calc(var(--landing-radius-xl) * 0.6)",
        cursor: "pointer",
        border: isOpen
          ? "1px solid color-mix(in oklch, var(--brand-glow) 45%, transparent)"
          : undefined,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          width: "100%",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          fontSize: "1rem",
        }}
      >
        <span style={{ fontWeight: 600 }}>{item.question}</span>
        <span
          aria-hidden="true"
          style={{ transform: `rotate(${isOpen ? 90 : 0}deg)`, transition: "transform 0.2s ease" }}
        >
          <Icon name="arrowRight" size={16} aria-hidden="true" />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-hidden={!isOpen}
        aria-labelledby={triggerId}
        style={{
          maxHeight: isOpen ? "320px" : "0px",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.25s ease, opacity 0.2s ease",
          paddingTop: isOpen ? "0.85rem" : "0",
        }}
      >
        <p style={{ color: "color-mix(in oklch, white 75%, var(--gray-300))" }}>{item.answer}</p>
      </div>
    </article>
  );
}