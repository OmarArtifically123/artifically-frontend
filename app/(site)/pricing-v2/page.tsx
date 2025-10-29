"use client";

import { useEffect, useRef, useState } from "react";
import RevenuePricingHero from "@/components/pricing/RevenuePricingHero";
import AutomationCard from "@/components/pricing/AutomationCard";
import PlatformTierCard from "@/components/pricing/PlatformTierCard";
import StickySummary from "@/components/pricing/StickySummary";
import ROICalculatorSection from "@/components/pricing/ROICalculatorSection";
// import TestimonialsSection from "@/components/pricing/TestimonialsSection"; // Removed to avoid false claims
import TrustBadgesSection from "@/components/pricing/TrustBadgesSection";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import EnterpriseCTABlock from "@/components/pricing/EnterpriseCTABlock";
import { AUTOMATIONS, PLATFORM_TIERS } from "@/components/pricing/pricing-data";
import type { BillingCadence, PlatformTier } from "@/components/pricing/types-v2";
import { trackPricingPageView, trackPricingEvent } from "@/lib/pricing-analytics";

export default function RevenuePricingPage() {
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<PlatformTier["id"]>("growth");
  const [billingCadence, setBillingCadence] = useState<BillingCadence>("annual");
  const [expectedVolume, setExpectedVolume] = useState(10000);

  const bundleBuilderRef = useRef<HTMLElement>(null);
  const tierSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPricingPageView();
  }, []);

  const selectedTier = PLATFORM_TIERS.find((t) => t.id === selectedTierId) || PLATFORM_TIERS[1];
  const selectedAutomationObjects = AUTOMATIONS.filter((a) =>
    selectedAutomations.includes(a.id)
  );

  const scrollToBundleBuilder = () => {
    bundleBuilderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTierSelector = () => {
    tierSelectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAutomationToggle = (automationId: string) => {
    setSelectedAutomations((prev) =>
      prev.includes(automationId)
        ? prev.filter((id) => id !== automationId)
        : [...prev, automationId]
    );
  };

  const handleTierSelect = (tierId: PlatformTier["id"]) => {
    setSelectedTierId(tierId);
  };

  const handleBillingToggle = () => {
    const newCadence: BillingCadence = billingCadence === "monthly" ? "annual" : "monthly";
    setBillingCadence(newCadence);
    trackPricingEvent("billing_toggle_changed", { from: billingCadence, to: newCadence });
  };

  const handleRemoveAutomation = (automationId: string) => {
    setSelectedAutomations((prev) => prev.filter((id) => id !== automationId));
  };

  // Sort tiers for display: Scale (anchor) → Growth (recommended) → Essentials → Enterprise
  const sortedTiers = [
    PLATFORM_TIERS.find((t) => t.id === "scale"),
    PLATFORM_TIERS.find((t) => t.id === "growth"),
    PLATFORM_TIERS.find((t) => t.id === "essentials"),
    PLATFORM_TIERS.find((t) => t.id === "enterprise"),
  ].filter(Boolean) as PlatformTier[];

  return (
    <div className="revenue-pricing-page">
      {/* Hero */}
      <RevenuePricingHero onScrollToBundleBuilder={scrollToBundleBuilder} />

      {/* Bundle Builder */}
      <section ref={bundleBuilderRef} id="bundle-builder" className="bundle-builder-section">
        <header className="section-header">
          <h2>Build your bundle in 2 steps</h2>
          <p>Choose automations. Choose your governance tier. See your total instantly.</p>
        </header>

        <div className="builder-layout">
          <div className="builder-main">
            {/* Step 1: Automations */}
            <div className="builder-step">
              <h3 className="step-title">
                <span className="step-number">1</span>
                Choose your automations
              </h3>
              <div className="automation-grid">
                {AUTOMATIONS.map((automation) => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    isSelected={selectedAutomations.includes(automation.id)}
                    onToggle={handleAutomationToggle}
                  />
                ))}
              </div>
            </div>

            {/* Step 2: Platform Tiers */}
            <div className="builder-step" ref={tierSelectorRef}>
              <h3 className="step-title">
                <span className="step-number">2</span>
                Choose your governance & support tier
              </h3>

              {/* Annual Toggle */}
              <div className="billing-toggle">
                <button
                  className={`billing-option ${billingCadence === "monthly" ? "active" : ""}`}
                  onClick={() => billingCadence === "annual" && handleBillingToggle()}
                  type="button"
                  aria-pressed={billingCadence === "monthly"}
                >
                  Monthly
                </button>
                <button
                  className={`billing-option ${billingCadence === "annual" ? "active" : ""}`}
                  onClick={() => billingCadence === "monthly" && handleBillingToggle()}
                  type="button"
                  aria-pressed={billingCadence === "annual"}
                >
                  Annual
                  <span className="save-badge">Save 20%</span>
                </button>
              </div>

              {/* Tier Cards */}
              <div className="tier-grid">
                {sortedTiers.map((tier) => (
                  <PlatformTierCard
                    key={tier.id}
                    tier={tier}
                    isSelected={tier.id === selectedTierId}
                    billingCadence={billingCadence}
                    onSelect={handleTierSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Summary (Desktop Only) */}
          {selectedAutomations.length > 0 && (
            <aside className="sticky-summary-sidebar">
              <StickySummary
                selectedAutomations={selectedAutomationObjects}
                selectedTier={selectedTier}
                billingCadence={billingCadence}
                expectedVolume={expectedVolume}
                onVolumeChange={setExpectedVolume}
                onRemoveAutomation={handleRemoveAutomation}
                onChangeTier={scrollToTierSelector}
              />
            </aside>
          )}
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculatorSection />

      {/* Testimonials - Removed to avoid false claims */}
      {/* <TestimonialsSection /> */}

      {/* Trust Badges */}
      <TrustBadgesSection />

      {/* FAQ */}
      <PricingFAQ />

      {/* Enterprise CTA */}
      <EnterpriseCTABlock />

      <style jsx>{`
        .revenue-pricing-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0B1220 0%, #121829 50%, #0B1220 100%);
          color: #E5E7EB;
        }

        .revenue-pricing-page > * {
          max-width: 1600px;
          margin-left: auto;
          margin-right: auto;
          padding-left: clamp(1rem, 4vw, 3rem);
          padding-right: clamp(1rem, 4vw, 3rem);
        }

        .revenue-pricing-page > :first-child {
          padding-top: 3rem;
        }

        .bundle-builder-section {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          margin: 0 0 1rem;
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #E5E7EB;
        }

        .section-header p {
          margin: 0;
          font-size: 1.15rem;
          color: #9CA3AF;
        }

        .builder-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          position: relative;
        }

        @media (min-width: 1280px) {
          .builder-layout {
            grid-template-columns: 1fr 400px;
            gap: 4rem;
          }
        }

        .builder-main {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .builder-step {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .step-title {
          margin: 0;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 900;
          color: #E5E7EB;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #3B82F6, #5B6BFF);
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 900;
          color: white;
          flex-shrink: 0;
        }

        .automation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
        }

        .billing-toggle {
          display: flex;
          gap: 0.5rem;
          padding: 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          width: fit-content;
        }

        .billing-option {
          padding: 0.85rem 1.75rem;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #9CA3AF;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .billing-option.active {
          background: #3B82F6;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .billing-option:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        .save-badge {
          font-size: 0.75rem;
          padding: 0.3rem 0.65rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          font-weight: 800;
        }

        .tier-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .sticky-summary-sidebar {
          display: none;
        }

        @media (min-width: 1280px) {
          .sticky-summary-sidebar {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .automation-grid {
            grid-template-columns: 1fr;
          }

          .tier-grid {
            grid-template-columns: 1fr;
          }

          .billing-toggle {
            width: 100%;
          }

          .billing-option {
            flex: 1;
            justify-content: center;
          }

          .builder-main {
            gap: 3.5rem;
          }
        }
      `}</style>
    </div>
  );
}
