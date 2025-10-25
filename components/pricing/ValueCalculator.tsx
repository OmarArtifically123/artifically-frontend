"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { calculateSavings } from "@/utils/calculateSavings";
import type { Plan } from "@/components/pricing/types";

type Props = {
  onRecommendPlan?: (planId: Plan["id"]) => void;
};

export default function ValueCalculator({ onRecommendPlan }: Props) {
  const [teamSize, setTeamSize] = useState(45);
  const [hourlyRate, setHourlyRate] = useState(95);

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

  useEffect(() => {
    onRecommendPlan?.(recommendedPlanId);
  }, [onRecommendPlan, recommendedPlanId]);

  return (
    <section className="calculator" aria-labelledby="savings-calculator-title">
      <header className="calculator__header">
        <h3 id="savings-calculator-title">Model your savings</h3>
        <p>Adjust a few inputs to see automation impact. Numbers update instantly.</p>
      </header>

      <div className="calculator__inputs">
        <div className="calculator__field">
          <label htmlFor={teamInputId}>Team size using Artifically</label>
          <div className="calculator__slider">
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
            />
            <output id={teamValueId} aria-live="polite">
              {teamSize} people
            </output>
          </div>
        </div>

        <div className="calculator__field">
          <label htmlFor={rateInputId}>Average fully loaded hourly rate</label>
          <div className="calculator__slider">
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
            />
            <output id={rateValueId} aria-live="polite">
              ${hourlyRate}/hr
            </output>
          </div>
        </div>
      </div>

      <div className="calculator__results">
        <p className="calculator__headline" aria-live="polite">
          ${results.monthlySavings.toLocaleString()} monthly savings
        </p>
        <ul className="calculator__metrics" aria-label="Impact breakdown">
          <li>
            <strong>{results.hoursSavedPerWeek.toLocaleString()} hours/week</strong>
            <span>Repetitive work handled by automations</span>
          </li>
          <li>
            <strong>{results.roi.toFixed(1)}x ROI</strong>
            <span>Breakeven in about {paybackMonths} months</span>
          </li>
          <li>
            <strong>Approx. {fteEquivalent} FTEs</strong>
            <span>Equivalent workload covered</span>
          </li>
        </ul>

        <div className="calculator__recommendation" role="note" aria-live="polite">
          Based on your inputs, you are likely a <strong>{labelForPlanId(recommendedPlanId)}</strong> team.
          <a className="calculator__cta" href="#plans">
            Compare plans
          </a>
        </div>
      </div>

      <style jsx>{`
        .calculator {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 1px solid var(--border-strong);
          border-radius: 18px;
          padding: 1.5rem;
          background: var(--bg-secondary);
        }
        .calculator__header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .calculator__header h3 {
          margin: 0;
          font-size: clamp(1.25rem, 1.8vw, 1.7rem);
        }
        .calculator__header p {
          margin: 0;
          color: var(--text-secondary);
        }

        .calculator__inputs {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 900px) {
          .calculator__inputs {
            grid-template-columns: 1fr;
          }
        }
        .calculator__field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .calculator__field label {
          font-weight: 700;
        }
        .calculator__slider {
          position: relative;
          padding-block: 0.75rem;
        }
        .calculator__slider input[type="range"] {
          width: 100%;
          appearance: none;
          height: 0.5rem;
          border-radius: 999px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-default);
        }
        .calculator__slider input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 2px solid var(--text-inverse);
        }
        .calculator__slider input[type="range"]::-moz-range-thumb {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 2px solid var(--text-inverse);
        }
        .calculator__slider input[type="range"]:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }
        .calculator__slider output {
          position: absolute;
          top: -0.2rem;
          right: 0;
          font-weight: 700;
          color: var(--text-primary);
        }

        .calculator__results {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border: 1px solid var(--border-default);
          border-radius: 14px;
          background: var(--bg-card);
          padding: 1.1rem;
        }
        .calculator__headline {
          margin: 0;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.015em;
        }
        .calculator__metrics {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.75rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 900px) {
          .calculator__metrics {
            grid-template-columns: 1fr;
          }
        }
        .calculator__metrics li {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          background: var(--bg-secondary);
          padding: 0.75rem;
        }
        .calculator__metrics li span {
          color: var(--text-secondary);
        }

        .calculator__recommendation {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          align-items: center;
          border-top: 1px solid var(--border-default);
          padding-top: 0.75rem;
        }
        .calculator__recommendation strong {
          font-weight: 800;
        }
        .calculator__cta {
          margin-left: auto;
          border: 2px solid var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          font-weight: 800;
          text-decoration: none;
        }
        .calculator__cta:hover {
          background: var(--accent-primary-hover);
          border-color: var(--accent-primary-hover);
        }
        .calculator__cta:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .calculator,
          .calculator__metrics,
          .calculator__cta {
            transition: none !important;
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
