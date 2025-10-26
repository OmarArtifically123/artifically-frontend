"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { Plan } from "@/components/pricing/types";

interface ROICalculatorProps {
  className?: string;
  onRecommendPlan?: (planId: Plan["id"]) => void;
}

export default function ROICalculator({ className, onRecommendPlan }: ROICalculatorProps) {
  const [employees, setEmployees] = useState(50);
  const [avgSalary, setAvgSalary] = useState(60000);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [currentToolsCost, setCurrentToolsCost] = useState(500);

  const employeesInputId = useId();
  const employeesValueId = useId();
  const salaryInputId = useId();
  const salaryValueId = useId();
  const hoursInputId = useId();
  const hoursValueId = useId();
  const toolsInputId = useId();
  const toolsValueId = useId();

  // Calculate hourly rate from annual salary
  const hourlyRate = useMemo(() => {
    return Math.round(avgSalary / 2080); // 2080 work hours per year
  }, [avgSalary]);

  // Calculate annual labor cost of manual work
  const annualLaborCost = useMemo(() => {
    return Math.round(employees * hoursPerWeek * 52 * hourlyRate);
  }, [employees, hoursPerWeek, hourlyRate]);

  // Estimated time saved with automation (60%)
  const timeSavedPercent = 60;
  const hoursSavedPerWeek = useMemo(() => {
    return Math.round(hoursPerWeek * (timeSavedPercent / 100));
  }, [hoursPerWeek]);

  // Annual savings calculation
  const annualTimeSavings = useMemo(() => {
    return Math.round(annualLaborCost * (timeSavedPercent / 100));
  }, [annualLaborCost]);

  const annualToolsSavings = useMemo(() => {
    // Assume we can replace 50% of current tools cost
    return Math.round(currentToolsCost * 12 * 0.5);
  }, [currentToolsCost]);

  const totalAnnualSavings = useMemo(() => {
    return annualTimeSavings + annualToolsSavings;
  }, [annualTimeSavings, annualToolsSavings]);

  // Recommended tier based on employee count
  const recommendedPlan = useMemo(() => {
    if (employees <= 10) return "starter";
    if (employees <= 50) return "professional";
    return "enterprise";
  }, [employees]);

  // Estimated platform cost based on recommended tier
  const estimatedPlatformCost = useMemo(() => {
    switch (recommendedPlan) {
      case "free":
        return 0;
      case "starter":
        return 99 * 12; // $99/mo
      case "professional":
        return 249 * 12; // $249/mo
      case "enterprise":
        return 5000 * 12; // Estimate $5k/mo for enterprise
      default:
        return 0;
    }
  }, [recommendedPlan]);

  // Net savings after platform cost
  const netAnnualSavings = useMemo(() => {
    return totalAnnualSavings - estimatedPlatformCost;
  }, [totalAnnualSavings, estimatedPlatformCost]);

  // ROI multiplier
  const roiMultiplier = useMemo(() => {
    if (estimatedPlatformCost === 0) return 0;
    return (totalAnnualSavings / estimatedPlatformCost).toFixed(1);
  }, [totalAnnualSavings, estimatedPlatformCost]);

  // Break-even timeline
  const breakevenMonths = useMemo(() => {
    if (netAnnualSavings <= 0) return 12;
    const monthlySavings = netAnnualSavings / 12;
    return Math.max(1, Math.round(estimatedPlatformCost / 12 / monthlySavings));
  }, [netAnnualSavings, estimatedPlatformCost]);

  useEffect(() => {
    onRecommendPlan?.(recommendedPlan);
  }, [onRecommendPlan, recommendedPlan]);

  return (
    <section
      className={`roi-calculator ${className || ""}`}
      aria-labelledby="roi-calculator-title"
    >
      <header className="roi-calculator__header">
        <h2 id="roi-calculator-title">Calculate Your ROI</h2>
        <p className="roi-calculator__subtitle">
          See how much time and money you'll save with AI automation. Adjust the inputs to match your business.
        </p>
      </header>

      <div className="roi-calculator__content">
        <div className="roi-calculator__inputs">
          <div className="roi-calculator__field">
            <label htmlFor={employeesInputId}>
              Number of employees
            </label>
            <div className="roi-calculator__slider">
              <input
                id={employeesInputId}
                type="range"
                min={1}
                max={500}
                step={1}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                aria-describedby={employeesValueId}
                aria-valuemin={1}
                aria-valuemax={500}
                aria-valuenow={employees}
                aria-valuetext={`${employees} employees`}
              />
              <output id={employeesValueId} aria-live="polite">
                {employees.toLocaleString()}
              </output>
            </div>
          </div>

          <div className="roi-calculator__field">
            <label htmlFor={salaryInputId}>
              Average salary
            </label>
            <div className="roi-calculator__slider">
              <input
                id={salaryInputId}
                type="range"
                min={30000}
                max={200000}
                step={5000}
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value))}
                aria-describedby={salaryValueId}
                aria-valuemin={30000}
                aria-valuemax={200000}
                aria-valuenow={avgSalary}
                aria-valuetext={`$${avgSalary.toLocaleString()} per year`}
              />
              <output id={salaryValueId} aria-live="polite">
                ${avgSalary.toLocaleString()}/yr
              </output>
            </div>
          </div>

          <div className="roi-calculator__field">
            <label htmlFor={hoursInputId}>
              Hours spent on manual tasks per week
            </label>
            <div className="roi-calculator__slider">
              <input
                id={hoursInputId}
                type="range"
                min={1}
                max={40}
                step={1}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                aria-describedby={hoursValueId}
                aria-valuemin={1}
                aria-valuemax={40}
                aria-valuenow={hoursPerWeek}
                aria-valuetext={`${hoursPerWeek} hours per week`}
              />
              <output id={hoursValueId} aria-live="polite">
                {hoursPerWeek}h/week
              </output>
            </div>
          </div>

          <div className="roi-calculator__field">
            <label htmlFor={toolsInputId}>
              Current tools cost per month
            </label>
            <div className="roi-calculator__slider">
              <input
                id={toolsInputId}
                type="range"
                min={0}
                max={10000}
                step={100}
                value={currentToolsCost}
                onChange={(e) => setCurrentToolsCost(Number(e.target.value))}
                aria-describedby={toolsValueId}
                aria-valuemin={0}
                aria-valuemax={10000}
                aria-valuenow={currentToolsCost}
                aria-valuetext={`$${currentToolsCost.toLocaleString()} per month`}
              />
              <output id={toolsValueId} aria-live="polite">
                ${currentToolsCost.toLocaleString()}/mo
              </output>
            </div>
          </div>
        </div>

        <div className="roi-calculator__results">
          <div className="roi-calculator__highlight" aria-live="polite">
            <div className="roi-calculator__savings">
              <span className="roi-calculator__label">Annual Savings</span>
              <span className="roi-calculator__amount">
                ${netAnnualSavings.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="roi-calculator__metrics">
            <div className="roi-calculator__metric">
              <span className="roi-calculator__metric-label">Time Saved</span>
              <span className="roi-calculator__metric-value">
                {hoursSavedPerWeek}h/week
              </span>
              <span className="roi-calculator__metric-desc">
                ~{timeSavedPercent}% of manual work automated
              </span>
            </div>

            <div className="roi-calculator__metric">
              <span className="roi-calculator__metric-label">ROI</span>
              <span className="roi-calculator__metric-value">
                {roiMultiplier}x
              </span>
              <span className="roi-calculator__metric-desc">
                Return on investment
              </span>
            </div>

            <div className="roi-calculator__metric">
              <span className="roi-calculator__metric-label">Break-even</span>
              <span className="roi-calculator__metric-value">
                {breakevenMonths} {breakevenMonths === 1 ? "month" : "months"}
              </span>
              <span className="roi-calculator__metric-desc">
                Time to recover investment
              </span>
            </div>
          </div>

          <div className="roi-calculator__recommendation" role="note" aria-live="polite">
            <div className="roi-calculator__recommendation-text">
              Based on your inputs, we recommend the{" "}
              <strong>{getPlanLabel(recommendedPlan)}</strong> plan
            </div>
            <a
              href="#plans"
              className="roi-calculator__cta"
              aria-label={`View ${getPlanLabel(recommendedPlan)} plan details`}
            >
              View Plans
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .roi-calculator {
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 80%, var(--accent-primary) 20%),
            var(--bg-secondary)
          );
          border: 2px solid var(--border-strong);
          padding: clamp(2rem, 4vw, 3rem);
          margin-bottom: 3rem;
        }

        .roi-calculator__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .roi-calculator__header h2 {
          margin: 0 0 0.5rem;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .roi-calculator__subtitle {
          margin: 0;
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 50rem;
          margin-inline: auto;
        }

        .roi-calculator__content {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 1024px) {
          .roi-calculator__content {
            grid-template-columns: 1fr;
          }
        }

        .roi-calculator__inputs {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 768px) {
          .roi-calculator__inputs {
            grid-template-columns: 1fr;
          }
        }

        .roi-calculator__field {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .roi-calculator__field label {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .roi-calculator__slider {
          position: relative;
          padding-block: 0.75rem;
        }

        .roi-calculator__slider input[type="range"] {
          width: 100%;
          appearance: none;
          height: 0.5rem;
          border-radius: 999px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-default);
          cursor: pointer;
        }

        .roi-calculator__slider input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 3px solid var(--text-inverse);
          cursor: grab;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--shadow-strong) 30%, transparent);
        }

        .roi-calculator__slider input[type="range"]::-moz-range-thumb {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 3px solid var(--text-inverse);
          cursor: grab;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--shadow-strong) 30%, transparent);
        }

        .roi-calculator__slider input[type="range"]:active::-webkit-slider-thumb {
          cursor: grabbing;
        }

        .roi-calculator__slider input[type="range"]:active::-moz-range-thumb {
          cursor: grabbing;
        }

        .roi-calculator__slider input[type="range"]:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .roi-calculator__slider output {
          position: absolute;
          top: 0;
          right: 0;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--accent-primary);
        }

        .roi-calculator__results {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .roi-calculator__highlight {
          background: var(--bg-card);
          border: 2px solid var(--accent-primary);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 24px color-mix(in srgb, var(--accent-primary) 20%, transparent);
        }

        .roi-calculator__savings {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }

        .roi-calculator__label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .roi-calculator__amount {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary, var(--accent-primary)));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .roi-calculator__metrics {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 768px) {
          .roi-calculator__metrics {
            grid-template-columns: 1fr;
          }
        }

        .roi-calculator__metric {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .roi-calculator__metric-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .roi-calculator__metric-value {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--accent-primary);
        }

        .roi-calculator__metric-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .roi-calculator__recommendation {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .roi-calculator__recommendation-text {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .roi-calculator__recommendation-text strong {
          font-weight: 800;
          color: var(--accent-primary);
        }

        .roi-calculator__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: 2px solid var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
          font-weight: 800;
          font-size: 1rem;
          text-decoration: none;
          white-space: nowrap;
          min-height: 48px;
        }

        .roi-calculator__cta:hover {
          background: var(--accent-primary-hover);
          border-color: var(--accent-primary-hover);
          transform: translateY(-2px);
        }

        .roi-calculator__cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .roi-calculator__cta:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

function getPlanLabel(planId: Plan["id"]): string {
  switch (planId) {
    case "free":
      return "Free";
    case "starter":
      return "Starter";
    case "professional":
      return "Professional";
    case "enterprise":
      return "Enterprise";
    default:
      return planId;
  }
}
