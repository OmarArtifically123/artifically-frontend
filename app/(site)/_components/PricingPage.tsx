"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BillingToggle from "@/components/pricing/BillingToggle";
import PlanCard from "@/components/pricing/PlanCard";
import TrustStrip from "@/components/pricing/TrustStrip";
import FAQAccordion from "@/components/pricing/FAQAccordion";
import FinalDecisionPanel from "@/components/pricing/FinalDecisionPanel";
import ValueCalculator from "@/components/pricing/ValueCalculator";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { BillingCadence, Plan } from "@/components/pricing/types";

export default function PricingPage() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  useEffect(() => {
    if (typeof document !== "undefined") {
      setDir(document.dir === "rtl" ? "rtl" : "ltr");
    }
  }, []);

  const [billing, setBilling] = useState<BillingCadence>("annual");
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useFocusTrap(isCalculatorOpen, dialogRef, {
    initialFocusRef: closeRef,
    returnFocusRef: triggerRef,
    onEscape: () => setCalculatorOpen(false),
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    if (isCalculatorOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCalculatorOpen]);

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        whoFor: "For teams launching their first AI receptionist.",
        tagline: "Confident launch without heavy setup.",
        priceMonthly: 299,
        priceAnnual: Math.round(299 * 12 * 0.8),
        deployment: "Live in under 10 minutes.",
        support: "Email with same-day response.",
        capabilities: [
          { label: "AI receptionist for calls & WhatsApp (Arabic + English)" },
          { label: "Inbound lead capture with follow-up sequences" },
          { label: "Up to 1,000 inbound events per month included" },
        ],
        limits: "Add usage as you grow with transparent overage.",
        ctaLabel: "Start Free Trial",
        ctaTo: "/signup",
      },
      {
        id: "professional",
        name: "Professional",
        whoFor: "For scaling teams that need governance and guardrails.",
        tagline: "Most popular for multi-location operations.",
        priceMonthly: 699,
        priceAnnual: Math.round(699 * 12 * 0.8),
        mostPopular: true,
        deployment: "Live this week with a success architect.",
        support: "Priority engineer plus success architect.",
        capabilities: [
          { label: "Omnichannel automation across voice, WhatsApp, web" },
          { label: "Advanced routing, approvals, analytics, audit trail" },
          { label: "Up to 12,000 inbound events/mo with burst credits" },
        ],
        limits: "Scale beyond included events with clear volume tiers.",
        ctaLabel: "Start Free Trial",
        ctaTo: "/signup",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        whoFor: "For regulated operations needing private deployment.",
        tagline: "Security-first with regional compliance support.",
        deployment: "White-glove rollout and security alignment.",
        support: "24/7 hotline plus dedicated regional squad.",
        capabilities: [
          { label: "Unlimited workflow and inbound volume" },
          { label: "Private or VPC deployment with data isolation" },
          { label: "Security review, custom SLAs, procurement lift" },
        ],
        limits: "Custom contract tuned to compliance requirements.",
        ctaLabel: "Talk to Deployment Lead",
        ctaTo: "/contact",
      },
    ],
    []
  );

  return (
    <div className="pricing-page" dir={dir}>
      <section className="hero" aria-labelledby="pricing-hero-title">
        <header className="hero-inner">
          <h1 id="pricing-hero-title">Launch automated operations today. Scale into enterprise governance anytime.</h1>
          <p className="hero-sub">
            Live in minutes, not months. 24/7 human support. Transparent pricing with zero setup fees and zero surprises.
          </p>
          <div className="hero-controls">
            <BillingToggle value={billing} onChange={setBilling} annualSavingsPercent={20} />
            <span className="hero-reassurance" aria-live="polite">
              Deployment timeline: minutes to days depending on plan. Arabic and English support included.
            </span>
          </div>
        </header>
      </section>

      <section id="plans" className="plans" aria-labelledby="plans-heading">
        <div className="plans-heading">
          <h2 id="plans-heading">Choose the plan built for your operations</h2>
          <p>Self-serve or talk to us; switch plans anytime. Prices update instantly with the billing cadence above.</p>
        </div>
        <div className="plan-grid">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} dir={dir} />
          ))}
        </div>
        <div className="enterprise-reassure" role="note" aria-live="polite">
          <span className="enterprise-tag">Private deployment</span>
          <span className="enterprise-tag">Security review + custom SLAs</span>
          <span className="enterprise-tag">Procurement-ready onboarding</span>
        </div>
        <div className="plan-actions">
          <button
            ref={triggerRef}
            type="button"
            className="savings-trigger"
            onClick={() => setCalculatorOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isCalculatorOpen}
            aria-controls="pricing-savings-dialog"
          >
            Estimate your savings
          </button>
        </div>
      </section>

      <section className="trust-faq" aria-labelledby="confidence-heading">
        <div className="trust-block">
          <h2 id="confidence-heading">Confidence without the clutter</h2>
          <TrustStrip />
        </div>
        <FAQAccordion />
      </section>

      <section className="final-strip" aria-labelledby="final-strip-heading">
        <FinalDecisionPanel />
      </section>

      {isCalculatorOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setCalculatorOpen(false);
            }
          }}
        >
          <div
            ref={dialogRef}
            id="pricing-savings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-savings-title"
            className="modal"
          >
            <header className="modal-header">
              <h2 id="pricing-savings-title">Estimate your savings</h2>
              <button
                ref={closeRef}
                type="button"
                className="modal-close"
                onClick={() => setCalculatorOpen(false)}
                aria-label="Close savings estimator"
              >
                Close
              </button>
            </header>
            <div className="modal-body">
              <ValueCalculator />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pricing-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero {
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 80%, var(--accent-primary) 20%),
            var(--bg-secondary)
          );
          border: 1px solid var(--border-strong);
          padding: clamp(1.75rem, 3vw, 2.5rem);
        }
        .hero-inner {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hero h1 {
          margin: 0;
          font-size: clamp(1.8rem, 3vw, 2.75rem);
          letter-spacing: -0.015em;
        }
        .hero-sub {
          margin: 0;
          font-size: clamp(1rem, 1.8vw, 1.25rem);
          color: var(--text-secondary);
        }
        .hero-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }
        .hero-reassurance {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .plans {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .plans-heading {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .plans-heading h2 {
          margin: 0;
          font-size: clamp(1.5rem, 2.2vw, 2rem);
        }
        .plans-heading p {
          margin: 0;
          color: var(--text-secondary);
          max-width: 40rem;
        }
        .plan-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 1100px) {
          .plan-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .plan-grid {
            grid-template-columns: 1fr;
          }
        }
        .enterprise-reassure {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          color: var(--text-secondary);
        }
        .enterprise-tag {
          border: 1px solid var(--border-strong);
          border-radius: 999px;
          padding: 0.35rem 0.85rem;
          font-weight: 600;
          background: var(--bg-secondary);
        }
        .plan-actions {
          display: flex;
          justify-content: flex-start;
        }
        .savings-trigger {
          border: 2px solid var(--border-strong);
          background: transparent;
          color: var(--text-primary);
          border-radius: 999px;
          padding: 0.65rem 1.25rem;
          font-weight: 700;
        }
        .savings-trigger:hover {
          background: var(--bg-secondary);
        }
        .savings-trigger:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 3px;
        }

        .trust-faq {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .trust-block {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .trust-block h2 {
          margin: 0;
          font-size: clamp(1.5rem, 2.2vw, 2rem);
        }

        .final-strip {
          border-top: 1px solid var(--border-strong);
          padding-top: 1.5rem;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: color-mix(in srgb, var(--bg-overlay, #000) 70%, transparent);
          display: grid;
          place-items: center;
          padding: 1rem;
          z-index: 60;
        }
        .modal {
          inline-size: min(60rem, 100%);
          max-height: 90vh;
          overflow: auto;
          background: var(--bg-surface, var(--bg-card));
          border: 2px solid var(--border-strong);
          border-radius: 20px;
          box-shadow: 0 20px 60px color-mix(in srgb, var(--shadow-strong, #000) 35%, transparent);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem 0;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        .modal-close {
          appearance: none;
          border: 2px solid transparent;
          background: transparent;
          color: var(--text-primary);
          font-size: 1.75rem;
          line-height: 1;
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
        }
        .modal-close:hover {
          border-color: var(--border-strong);
        }
        .modal-close:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }
        .modal-body {
          padding: 0 1.5rem 1.5rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .modal,
          .hero,
          .plan-grid,
          .trust-faq {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
