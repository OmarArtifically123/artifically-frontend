"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { calculateSavings } from "@/utils/calculateSavings";
import type { Plan } from "@/components/pricing/types";

type Props = {
  onRecommendPlan?: (planId: Plan["id"]) => void;
};

export default function EnhancedValueCalculator({ onRecommendPlan }: Props) {
  const [teamSize, setTeamSize] = useState(45);
  const [hourlyRate, setHourlyRate] = useState(95);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const results = useMemo(() => calculateSavings(teamSize, hourlyRate), [teamSize, hourlyRate]);
  const paybackMonths = useMemo(() => {
    const baseline = results.roi <= 0 ? 12 : Math.round(Math.max(1, Math.min(12, 12 / results.roi)));
    return baseline;
  }, [results.roi]);
  const fteEquivalent = useMemo(
    () => Math.max(1, Math.round(results.hoursSavedPerWeek / 40)),
    [results.hoursSavedPerWeek]
  );

  const teamInputId = useId();
  const teamValueId = useId();
  const rateInputId = useId();
  const rateValueId = useId();

  const recommendedPlanId = useMemo<Plan["id"]>(() => {
    if (teamSize <= 10) return "starter";
    if (teamSize <= 60) return "professional";
    return "enterprise";
  }, [teamSize]);

  const annualSavings = results.monthlySavings * 12;
  const yearlyCost = recommendedPlanId === "starter" ? 299 * 12 : recommendedPlanId === "professional" ? 699 * 12 : 10000;
  const netBenefit = annualSavings - yearlyCost;

  useEffect(() => {
    onRecommendPlan?.(recommendedPlanId);
  }, [onRecommendPlan, recommendedPlanId]);

  return (
    <section className="enhanced-calculator" aria-labelledby="calculator-title">
      <header className="calculator-header">
        <div className="header-badge">
          <Icon name="calculator" size={16} aria-hidden />
          <span>ROI Calculator</span>
        </div>
        <h3 id="calculator-title">Calculate your savings</h3>
        <p className="calculator-subtitle">
          Adjust the sliders to see how Artifically can transform your operations and bottom
          line. All calculations update in real-time.
        </p>
      </header>

      {/* Input sliders */}
      <div className="calculator-inputs">
        <div className="input-group">
          <label htmlFor={teamInputId} className="input-label">
            <Icon name="users" size={18} aria-hidden />
            <span>Team size using Artifically</span>
          </label>
          <div className="slider-container">
            <input
              id={teamInputId}
              type="range"
              min={1}
              max={1000}
              step={1}
              value={teamSize}
              onChange={(event) => setTeamSize(Number(event.target.value))}
              aria-describedby={teamValueId}
              aria-valuemin={1}
              aria-valuemax={1000}
              aria-valuenow={teamSize}
              aria-valuetext={`${teamSize} people`}
              className="range-input"
            />
            <div className="range-track">
              <div
                className="range-fill"
                style={{ width: `${(teamSize / 1000) * 100}%` }}
              />
            </div>
          </div>
          <output id={teamValueId} className="slider-output" aria-live="polite">
            <span className="output-value">{teamSize}</span>
            <span className="output-unit">people</span>
          </output>
        </div>

        <div className="input-group">
          <label htmlFor={rateInputId} className="input-label">
            <Icon name="dollar-sign" size={18} aria-hidden />
            <span>Average hourly rate (fully loaded)</span>
          </label>
          <div className="slider-container">
            <input
              id={rateInputId}
              type="range"
              min={20}
              max={200}
              step={1}
              value={hourlyRate}
              onChange={(event) => setHourlyRate(Number(event.target.value))}
              aria-describedby={rateValueId}
              aria-valuemin={20}
              aria-valuemax={200}
              aria-valuenow={hourlyRate}
              aria-valuetext={`$${hourlyRate} per hour`}
              className="range-input"
            />
            <div className="range-track">
              <div
                className="range-fill"
                style={{ width: `${((hourlyRate - 20) / 180) * 100}%` }}
              />
            </div>
          </div>
          <output id={rateValueId} className="slider-output" aria-live="polite">
            <span className="output-value">${hourlyRate}</span>
            <span className="output-unit">/hour</span>
          </output>
        </div>
      </div>

      {/* Results dashboard */}
      <div className="calculator-results">
        {/* Main metric */}
        <div className="result-hero">
          <div className="hero-icon">
            <Icon name="trending-up" size={48} aria-hidden />
          </div>
          <div className="hero-content">
            <div className="hero-label">Estimated monthly savings</div>
            <div className="hero-value" aria-live="polite">
              ${results.monthlySavings.toLocaleString()}
            </div>
            <div className="hero-sublabel">
              ${annualSavings.toLocaleString()} per year
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="metrics-grid">
          <div className="metric-card metric-card--hours">
            <div className="metric-icon">
              <Icon name="clock" size={24} aria-hidden />
            </div>
            <div className="metric-content">
              <div className="metric-value">{results.hoursSavedPerWeek.toLocaleString()}</div>
              <div className="metric-label">hours/week saved</div>
              <div className="metric-description">
                Repetitive work handled by AI
              </div>
            </div>
          </div>

          <div className="metric-card metric-card--roi">
            <div className="metric-icon">
              <Icon name="zap" size={24} aria-hidden />
            </div>
            <div className="metric-content">
              <div className="metric-value">{results.roi.toFixed(1)}x</div>
              <div className="metric-label">Return on investment</div>
              <div className="metric-description">
                Breakeven in ~{paybackMonths} months
              </div>
            </div>
          </div>

          <div className="metric-card metric-card--fte">
            <div className="metric-icon">
              <Icon name="users" size={24} aria-hidden />
            </div>
            <div className="metric-content">
              <div className="metric-value">{fteEquivalent}</div>
              <div className="metric-label">FTE equivalent</div>
              <div className="metric-description">
                Workload capacity freed up
              </div>
            </div>
          </div>

          <div className="metric-card metric-card--benefit">
            <div className="metric-icon">
              <Icon name="dollar-sign" size={24} aria-hidden />
            </div>
            <div className="metric-content">
              <div className="metric-value">${(netBenefit / 1000).toFixed(0)}K</div>
              <div className="metric-label">Net annual benefit</div>
              <div className="metric-description">
                After platform costs
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown toggle */}
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="breakdown-toggle"
        >
          <span>{showBreakdown ? "Hide" : "Show"} detailed breakdown</span>
          <Icon
            name={showBreakdown ? "chevron-up" : "chevron-down"}
            size={20}
            aria-hidden
          />
        </button>

        {/* Detailed breakdown */}
        {showBreakdown && (
          <div className="breakdown-panel">
            <div className="breakdown-section">
              <div className="breakdown-title">Assumptions</div>
              <div className="breakdown-items">
                <div className="breakdown-item">
                  <span className="item-label">Hours saved per person per week</span>
                  <span className="item-value">2 hours</span>
                </div>
                <div className="breakdown-item">
                  <span className="item-label">Team members using Artifically</span>
                  <span className="item-value">{teamSize}</span>
                </div>
                <div className="breakdown-item">
                  <span className="item-label">Average hourly cost</span>
                  <span className="item-value">${hourlyRate}</span>
                </div>
                <div className="breakdown-item">
                  <span className="item-label">Weeks per year</span>
                  <span className="item-value">48</span>
                </div>
              </div>
            </div>

            <div className="breakdown-section">
              <div className="breakdown-title">Annual impact</div>
              <div className="breakdown-items">
                <div className="breakdown-item">
                  <span className="item-label">Total hours saved per year</span>
                  <span className="item-value">{(results.hoursSavedPerWeek * 48).toLocaleString()} hours</span>
                </div>
                <div className="breakdown-item">
                  <span className="item-label">Value of time saved</span>
                  <span className="item-value">${annualSavings.toLocaleString()}</span>
                </div>
                <div className="breakdown-item">
                  <span className="item-label">Estimated platform cost</span>
                  <span className="item-value">${yearlyCost.toLocaleString()}</span>
                </div>
                <div className="breakdown-item breakdown-item--highlight">
                  <span className="item-label">Net annual benefit</span>
                  <span className="item-value">${netBenefit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendation CTA */}
      <div className="calculator-recommendation" role="note" aria-live="polite">
        <div className="recommendation-content">
          <div className="recommendation-icon">
            <Icon name="lightbulb" size={24} aria-hidden />
          </div>
          <div className="recommendation-text">
            <strong>Based on your inputs,</strong> we recommend the{" "}
            <strong>{labelForPlanId(recommendedPlanId)}</strong> plan for your team.
          </div>
        </div>
        <a className="recommendation-cta" href="#plans">
          <span>View {labelForPlanId(recommendedPlanId)} plan</span>
          <Icon name="arrow-right" size={18} aria-hidden />
        </a>
      </div>

      <style jsx>{`
        .enhanced-calculator {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2.5rem;
          background: linear-gradient(
            135deg,
            var(--bg-card) 0%,
            color-mix(in srgb, var(--accent-primary) 5%, var(--bg-card)) 100%
          );
          border: 2px solid var(--border-default);
          border-radius: 24px;
        }

        .calculator-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          align-self: flex-start;
          padding: 0.5rem 1rem;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-primary) 30%, transparent);
          border-radius: 999px;
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 0.85rem;
        }

        .calculator-header h3 {
          margin: 0;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .calculator-subtitle {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 600px;
        }

        .calculator-inputs {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .input-label :global(svg) {
          color: var(--accent-primary);
        }

        .slider-container {
          position: relative;
          padding: 1rem 0;
        }

        .range-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 8px;
          background: var(--bg-secondary);
          border-radius: 999px;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .range-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
          );
          border-radius: 999px;
          transition: width 0.2s ease;
        }

        .range-input {
          position: relative;
          width: 100%;
          height: 8px;
          appearance: none;
          background: transparent;
          z-index: 1;
        }

        .range-input::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--accent-primary);
          box-shadow: 0 2px 8px color-mix(in srgb, var(--accent-primary) 30%, transparent);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .range-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .range-input::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--accent-primary);
          box-shadow: 0 2px 8px color-mix(in srgb, var(--accent-primary) 30%, transparent);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .range-input::-moz-range-thumb:hover {
          transform: scale(1.2);
        }

        .range-input:focus-visible {
          outline: none;
        }

        .range-input:focus-visible::-webkit-slider-thumb {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .slider-output {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          padding: 0.75rem 1.25rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border-default);
          border-radius: 12px;
        }

        .output-value {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-primary);
        }

        .output-unit {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .calculator-results {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .result-hero {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-primary) 15%, var(--bg-secondary)),
            var(--bg-secondary)
          );
          border: 2px solid var(--border-default);
          border-radius: 20px;
        }

        .hero-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border-radius: 20px;
          color: white;
          flex-shrink: 0;
        }

        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .hero-label {
          font-size: 0.95rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .hero-value {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          line-height: 1;
        }

        .hero-sublabel {
          font-size: 1rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .metrics-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .metric-card {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border-default);
          border-radius: 18px;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent-primary) 10%, transparent);
        }

        .metric-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border-radius: 12px;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }

        .metric-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .metric-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .breakdown-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          border: 2px solid var(--border-default);
          border-radius: 12px;
          background: var(--bg-secondary);
          font-weight: 700;
          color: var(--text-primary);
          transition: all 0.2s ease;
          align-self: flex-start;
        }

        .breakdown-toggle:hover {
          border-color: var(--accent-primary);
          background: var(--bg-card);
        }

        .breakdown-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border-default);
          border-radius: 18px;
          animation: panel-entrance 0.3s ease;
        }

        @keyframes panel-entrance {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .breakdown-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .breakdown-title {
          font-size: 0.85rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent-primary);
        }

        .breakdown-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--bg-card);
          border-radius: 10px;
        }

        .breakdown-item--highlight {
          background: color-mix(in srgb, var(--accent-primary) 10%, var(--bg-card));
          border: 1px solid var(--accent-primary);
          font-weight: 900;
        }

        .item-label {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .item-value {
          color: var(--text-primary);
          font-weight: 800;
        }

        .calculator-recommendation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.75rem 2rem;
          background: var(--bg-secondary);
          border: 2px solid var(--accent-primary);
          border-radius: 18px;
          flex-wrap: wrap;
        }

        .recommendation-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .recommendation-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--accent-primary) 15%, transparent);
          border-radius: 12px;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .recommendation-text {
          color: var(--text-primary);
          line-height: 1.6;
        }

        .recommendation-text strong {
          font-weight: 900;
          color: var(--accent-primary);
        }

        .recommendation-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-radius: 12px;
          font-weight: 900;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .recommendation-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }

        .recommendation-cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .enhanced-calculator {
            padding: 2rem 1.5rem;
          }

          .calculator-inputs {
            grid-template-columns: 1fr;
          }

          .result-hero {
            flex-direction: column;
            text-align: center;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .breakdown-panel {
            padding: 1.5rem;
          }

          .calculator-recommendation {
            flex-direction: column;
            align-items: stretch;
          }

          .recommendation-cta {
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .range-fill,
          .metric-card,
          .breakdown-panel,
          .recommendation-cta {
            transition: none !important;
            animation: none !important;
          }

          .range-input::-webkit-slider-thumb,
          .range-input::-moz-range-thumb {
            transition: none !important;
          }

          .range-input::-webkit-slider-thumb:hover,
          .range-input::-moz-range-thumb:hover,
          .metric-card:hover,
          .recommendation-cta:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

function labelForPlanId(id: Plan["id"]) {
  switch (id) {
    case "starter":
      return "Starter";
    case "professional":
      return "Professional";
    case "enterprise":
      return "Enterprise";
    default:
      return id;
  }
}

