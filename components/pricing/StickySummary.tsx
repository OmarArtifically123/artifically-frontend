"use client";

import { useState } from "react";
import type { Automation, PlatformTier, BillingCadence } from "./types-v2";
import { trackPricingEvent, trackCheckoutStart } from "@/lib/pricing-analytics";

type Props = {
  selectedAutomations: Automation[];
  selectedTier: PlatformTier;
  billingCadence: BillingCadence;
  expectedVolume: number;
  onVolumeChange: (volume: number) => void;
  onRemoveAutomation: (automationId: string) => void;
  onChangeTier: () => void;
};

export default function StickySummary({
  selectedAutomations,
  selectedTier,
  billingCadence,
  expectedVolume,
  onVolumeChange,
  onRemoveAutomation,
  onChangeTier,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate costs
  const automationCosts = selectedAutomations.reduce((sum, a) => sum + a.priceMonthly, 0);
  const tierCost =
    selectedTier.priceAnnual && selectedTier.priceMonthly
      ? billingCadence === "annual"
        ? selectedTier.priceAnnual
        : selectedTier.priceMonthly
      : 0;

  const totalIncludedVolume =
    typeof selectedTier.limits.includedInteractions === "number"
      ? selectedTier.limits.includedInteractions
      : Infinity;

  const projectedOverage =
    expectedVolume > totalIncludedVolume
      ? (expectedVolume - totalIncludedVolume) * selectedTier.limits.overageRate
      : 0;

  const estimatedMonthlyTotal = automationCosts + tierCost + projectedOverage;

  // Simplified savings calc (would be more sophisticated in production)
  const estimatedAnnualSavings = Math.round(automationCosts * 3.5); // ~3.5x ROI assumption

  const handleCheckout = () => {
    trackCheckoutStart(
      estimatedMonthlyTotal,
      estimatedMonthlyTotal * 12,
      selectedAutomations.length,
      selectedTier.id
    );

    const automationIds = selectedAutomations.map((a) => a.id).join(",");
    window.location.href = `/checkout?automations=${automationIds}&tier=${selectedTier.id}&billing=${billingCadence}`;
  };

  const handleRemove = (automationId: string) => {
    onRemoveAutomation(automationId);
    trackPricingEvent("sticky_summary_remove_automation", { automation_id: automationId });
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      trackPricingEvent("sticky_summary_expand", {});
    }
  };

  return (
    <>
      {/* Desktop: Sticky Right Sidebar */}
      <div className="sticky-summary-desktop">
        <div className="summary-card">
          <h4 className="summary-title">Your bundle</h4>

          <div className="summary-section">
            <div className="section-header">Selected automations:</div>
            {selectedAutomations.length === 0 ? (
              <p className="empty-state">No automations selected yet</p>
            ) : (
              <div className="automation-list">
                {selectedAutomations.map((automation) => (
                  <div key={automation.id} className="summary-item">
                    <span className="item-name">
                      ✓ {automation.name}
                    </span>
                    <span className="item-price">${automation.priceMonthly}/mo</span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(automation.id)}
                      aria-label={`Remove ${automation.name}`}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="summary-section">
            <div className="section-header">Platform tier:</div>
            <div className="tier-display">
              {selectedTier.name} ({billingCadence})
              <span className="tier-price">${tierCost}/mo</span>
            </div>
            <button className="change-tier-btn" onClick={onChangeTier} type="button">
              Change tier
            </button>
          </div>

          <div className="summary-section">
            <label className="volume-label">
              Expected monthly volume:
              <input
                type="number"
                value={expectedVolume}
                onChange={(e) => onVolumeChange(parseInt(e.target.value) || 0)}
                className="volume-input"
                min="0"
                step="1000"
              />
              <span className="volume-unit">interactions</span>
            </label>
            {totalIncludedVolume !== Infinity && (
              <div className="volume-info">
                Included: {totalIncludedVolume.toLocaleString()} interactions
              </div>
            )}
            {projectedOverage > 0 && (
              <div className="overage-warning">
                Projected overage: ${Math.round(projectedOverage)}/mo
                <br />
                <small>
                  ({(expectedVolume - totalIncludedVolume).toLocaleString()} events ×{" "}
                  ${selectedTier.limits.overageRate}/event)
                </small>
              </div>
            )}
          </div>

          <div className="summary-total">
            <div className="total-label">Estimated total:</div>
            <div className="total-value">${Math.round(estimatedMonthlyTotal)}/mo</div>
          </div>

          {selectedAutomations.length > 0 && (
            <div className="savings-display">
              Est. annual savings vs. manual staffing:
              <strong> ${estimatedAnnualSavings.toLocaleString()}/mo</strong>
            </div>
          )}

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={selectedAutomations.length === 0}
            type="button"
          >
            Continue to checkout →
          </button>

          <p className="summary-microcopy">
            No credit card required for pilot. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Mobile: Sticky Bottom Sheet */}
      <div className="sticky-summary-mobile">
        <button
          className={`mobile-summary-toggle ${isExpanded ? "expanded" : ""}`}
          onClick={handleExpand}
          type="button"
        >
          <div className="mobile-summary-header">
            <span className="mobile-total">Your bundle: ${Math.round(estimatedMonthlyTotal)}/mo</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}
            >
              <path
                d="M5 12L10 7L15 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <div className="mobile-summary-content">
            <h4>Your bundle</h4>
            {selectedAutomations.map((automation) => (
              <div key={automation.id} className="mobile-item">
                ✓ {automation.name} — ${automation.priceMonthly}/mo
              </div>
            ))}
            <div className="mobile-tier">
              {selectedTier.name} — ${tierCost}/mo
            </div>
            {projectedOverage > 0 && (
              <div className="mobile-overage">+ ${Math.round(projectedOverage)}/mo overage</div>
            )}
          </div>
        )}

        <button
          className="mobile-checkout-btn"
          onClick={handleCheckout}
          disabled={selectedAutomations.length === 0}
          type="button"
        >
          Continue to checkout →
        </button>
      </div>

      <style jsx>{`
        /* Desktop Sticky Sidebar */
        .sticky-summary-desktop {
          display: none;
        }

        @media (min-width: 1024px) {
          .sticky-summary-desktop {
            display: block;
            position: sticky;
            top: 2rem;
            max-height: calc(100vh - 4rem);
            overflow-y: auto;
          }
        }

        .summary-card {
          padding: 2rem;
          background: rgba(11, 18, 32, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .summary-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 900;
          color: #E5E7EB;
        }

        .summary-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-header {
          font-size: 0.9rem;
          font-weight: 700;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .empty-state {
          margin: 0;
          font-size: 0.9rem;
          color: #6B7280;
          font-style: italic;
        }

        .automation-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .summary-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 0.9rem;
          color: #E5E7EB;
        }

        .item-name {
          font-weight: 600;
        }

        .item-price {
          color: #3B82F6;
          font-weight: 700;
        }

        .remove-btn {
          width: 24px;
          height: 24px;
          padding: 0;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 6px;
          color: #EF4444;
          font-size: 1.25rem;
          line-height: 1;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: scale(1.1);
        }

        .tier-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 0.9rem;
          color: #E5E7EB;
          font-weight: 600;
        }

        .tier-price {
          color: #3B82F6;
          font-weight: 700;
        }

        .change-tier-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(59, 130, 246, 0.4);
          border-radius: 8px;
          color: #3B82F6;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .change-tier-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
        }

        .volume-label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #9CA3AF;
          font-weight: 600;
        }

        .volume-input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #E5E7EB;
          font-size: 1rem;
          font-weight: 600;
        }

        .volume-unit {
          font-size: 0.8rem;
          color: #6B7280;
        }

        .volume-info {
          font-size: 0.85rem;
          color: #6B7280;
        }

        .overage-warning {
          padding: 0.75rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          font-size: 0.85rem;
          color: #F59E0B;
        }

        .overage-warning small {
          font-size: 0.75rem;
          color: #9CA3AF;
        }

        .summary-total {
          padding: 1.5rem 0;
          border-top: 2px solid rgba(255, 255, 255, 0.2);
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .total-label {
          font-size: 0.9rem;
          color: #9CA3AF;
          margin-bottom: 0.5rem;
        }

        .total-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: #E5E7EB;
        }

        .savings-display {
          padding: 1rem;
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.3);
          border-radius: 10px;
          font-size: 0.9rem;
          color: #9CA3AF;
          text-align: center;
        }

        .savings-display strong {
          display: block;
          margin-top: 0.25rem;
          font-size: 1.1rem;
          color: #14B8A6;
        }

        .checkout-btn {
          padding: 1.25rem 2rem;
          background: #3B82F6;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 800;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #2563EB;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .summary-microcopy {
          margin: 0;
          font-size: 0.8rem;
          color: #6B7280;
          text-align: center;
          line-height: 1.5;
        }

        /* Mobile Sticky Bottom */
        .sticky-summary-mobile {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(11, 18, 32, 0.98);
          backdrop-filter: blur(20px);
          border-top: 2px solid rgba(59, 130, 246, 0.4);
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.5);
        }

        @media (min-width: 1024px) {
          .sticky-summary-mobile {
            display: none;
          }
        }

        .mobile-summary-toggle {
          width: 100%;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #E5E7EB;
          cursor: pointer;
        }

        .mobile-summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-total {
          font-size: 1.1rem;
          font-weight: 800;
        }

        .mobile-summary-content {
          padding: 0 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #9CA3AF;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-summary-content h4 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          color: #E5E7EB;
        }

        .mobile-item, .mobile-tier, .mobile-overage {
          font-size: 0.85rem;
        }

        .mobile-overage {
          color: #F59E0B;
        }

        .mobile-checkout-btn {
          width: calc(100% - 3rem);
          margin: 0 1.5rem 1rem;
          padding: 1rem 2rem;
          background: #3B82F6;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
        }

        .mobile-checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
