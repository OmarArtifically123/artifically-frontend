"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BillingToggle from "@/components/pricing/BillingToggle";
import PricingHero from "@/components/pricing/PricingHero";
import PremiumPlanCard from "@/components/pricing/PremiumPlanCard";
import FeatureComparisonTable from "@/components/pricing/FeatureComparisonTable";
import PremiumStats from "@/components/pricing/PremiumStats";
import EnhancedValueCalculator from "@/components/pricing/EnhancedValueCalculator";
import TrustIndicators from "@/components/pricing/TrustIndicators";
import EnhancedFAQ from "@/components/pricing/EnhancedFAQ";
import FinalDecisionPanel from "@/components/pricing/FinalDecisionPanel";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { BillingCadence, Plan } from "@/components/pricing/types";

export default function EnhancedPricingPage() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [billing, setBilling] = useState<BillingCadence>("annual");
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);
  const [selectedPlanForComparison, setSelectedPlanForComparison] = useState<string | null>(null);
  
  const plansRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDir(document.dir === "rtl" ? "rtl" : "ltr");
    }
  }, []);

  useFocusTrap(isCalculatorOpen, dialogRef, {
    initialFocusRef: closeRef,
    returnFocusRef: triggerRef,
    onEscape: () => setCalculatorOpen(false),
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    
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

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCompare = (planId: string) => {
    setSelectedPlanForComparison(planId);
    // Scroll to comparison table
    const comparisonSection = document.getElementById("comparison-section");
    comparisonSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="enhanced-pricing-page" dir={dir}>
      {/* Hero Section */}
      <PricingHero onScrollToPlans={scrollToPlans} />

      {/* Plans Section */}
      <section
        ref={plansRef}
        id="plans"
        className="plans-section"
        aria-labelledby="plans-heading"
      >
        <header className="plans-header">
          <div className="plans-header__content">
            <h2 id="plans-heading">Choose the plan built for your operations</h2>
            <p className="plans-subtitle">
              Self-serve or talk to us; switch plans anytime. Prices update instantly with the
              billing cadence below.
            </p>
          </div>

          <div className="plans-header__controls">
            <BillingToggle value={billing} onChange={setBilling} annualSavingsPercent={20} />
            <button
              ref={triggerRef}
              type="button"
              className="calculator-trigger"
              onClick={() => setCalculatorOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isCalculatorOpen}
              aria-controls="pricing-calculator-dialog"
            >
              <span>Calculate your savings</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="calculator-icon"
              >
                <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 7h6M7 10h6M7 13h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        {/* Plan Cards */}
        <div className="plan-grid">
          {plans.map((plan, index) => (
            <PremiumPlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              dir={dir}
              index={index}
              onCompare={handleCompare}
            />
          ))}
        </div>

        {/* Enterprise badges */}
        <div className="enterprise-badges" role="note">
          <div className="badge-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L12.5 7.5L18 8.5L14 13L15 18.5L10 15.5L5 18.5L6 13L2 8.5L7.5 7.5L10 2Z" fill="currentColor" />
            </svg>
            <span>Private deployment</span>
          </div>
          <div className="badge-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" fill="currentColor" />
            </svg>
            <span>Security review + custom SLAs</span>
          </div>
          <div className="badge-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Procurement-ready onboarding</span>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <PremiumStats />

      {/* Feature Comparison Section */}
      <div id="comparison-section">
        <FeatureComparisonTable plans={plans} />
      </div>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* FAQ Section */}
      <EnhancedFAQ />

      {/* Final CTA */}
      <FinalDecisionPanel />

      {/* Calculator Modal */}
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
            id="pricing-calculator-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calculator-modal-title"
            className="modal"
          >
            <header className="modal-header">
              <h2 id="calculator-modal-title">Calculate your ROI</h2>
              <button
                ref={closeRef}
                type="button"
                className="modal-close"
                onClick={() => setCalculatorOpen(false)}
                aria-label="Close calculator"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </header>
            <div className="modal-body">
              <EnhancedValueCalculator />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .enhanced-pricing-page {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          padding: 2rem 0;
        }

        .plans-section {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .plans-header {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .plans-header__content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .plans-header h2 {
          margin: 0;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .plans-subtitle {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        .plans-header__controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .calculator-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          border: 2px solid var(--border-strong);
          border-radius: 999px;
          background: transparent;
          color: var(--text-primary);
          font-weight: 800;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .calculator-trigger:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .calculator-trigger:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 3px;
        }

        .calculator-icon {
          color: currentColor;
        }

        .plan-grid {
          display: grid;
          gap: 2rem;
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

        .enterprise-badges {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: 18px;
        }

        .badge-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .badge-item svg {
          color: var(--accent-primary);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: color-mix(in srgb, var(--bg-overlay, #000) 80%, transparent);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          padding: 1rem;
          z-index: 60;
          animation: backdrop-entrance 0.3s ease;
        }

        @keyframes backdrop-entrance {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal {
          width: min(90rem, 95%);
          max-height: 90vh;
          overflow: auto;
          background: var(--bg-surface, var(--bg-card));
          border: 2px solid var(--border-strong);
          border-radius: 24px;
          box-shadow: 0 24px 80px color-mix(in srgb, var(--shadow-strong, #000) 50%, transparent);
          display: flex;
          flex-direction: column;
          animation: modal-entrance 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modal-entrance {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2.5rem;
          border-bottom: 2px solid var(--border-default);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 900;
        }

        .modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 2px solid var(--border-default);
          border-radius: 10px;
          background: transparent;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .modal-close:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .modal-body {
          padding: 2.5rem;
        }

        @media (max-width: 768px) {
          .enhanced-pricing-page {
            gap: 3rem;
            padding: 1rem 0;
          }

          .modal-header {
            padding: 1.5rem;
          }

          .modal-body {
            padding: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .calculator-trigger,
          .modal-backdrop,
          .modal {
            animation: none !important;
            transition: none !important;
          }

          .calculator-trigger:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

