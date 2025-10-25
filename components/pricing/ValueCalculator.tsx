"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { calculateSavings } from "@/utils/calculateSavings";
import type { Plan } from "@/components/pricing/types";

type Props = {
  onRecommendPlan?: (planId: Plan["id"]) => void;
};

export default function ValueCalculator({ onRecommendPlan }: Props) {
  const [team, setTeam] = useState(45);
  const [rate, setRate] = useState(95);
  const results = useMemo(() => calculateSavings(team, rate), [team, rate]);
  const teamInputId = useId();
  const teamValueId = useId();
  const rateInputId = useId();
  const rateValueId = useId();

  const recommendedPlanId = useMemo(() => {
    if (team <= 10) return "starter";
    if (team <= 60) return "professional";
    return "enterprise";
  }, [team]);

  useEffect(() => onRecommendPlan?.(recommendedPlanId), [onRecommendPlan, recommendedPlanId]);

  return (
    <section className="value-calc" aria-labelledby="value-calc-title">
      <header className="calc-header">
        <h2 id="value-calc-title">Calculate your savings</h2>
        <p>See hard savings, time back, and ROI based on your team.</p>
      </header>

      <div className="inputs">
        <div className="input-group">
          <label htmlFor={teamInputId} className="label">Team size</label>
          <div className="slider-wrap">
            <input
              id={teamInputId}
              className="slider"
              type="range"
              min={1}
              max={1000}
              step={1}
              value={team}
              onChange={(e) => setTeam(Number(e.target.value))}
              aria-describedby={teamValueId}
              aria-valuemin={1}
              aria-valuemax={1000}
              aria-valuenow={team}
              aria-valuetext={`${team} people`}
            />
            <output id={teamValueId} className="value-bubble" aria-live="polite">{team} people</output>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor={rateInputId} className="label">Average fully-loaded hourly rate</label>
          <div className="slider-wrap">
            <input
              id={rateInputId}
              className="slider"
              type="range"
              min={20}
              max={200}
              step={1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-describedby={rateValueId}
              aria-valuemin={20}
              aria-valuemax={200}
              aria-valuenow={rate}
              aria-valuetext={`$${rate} per hour`}
            />
            <output id={rateValueId} className="value-bubble" aria-live="polite">${rate}/hr</output>
          </div>
        </div>
      </div>

      <div className="results">
        <p className="headline" aria-live="polite">${results.monthlySavings.toLocaleString()} monthly savings</p>
        <ul className="metrics" aria-label="Impact breakdown">
          <li>
            <strong>{results.hoursSavedPerWeek.toLocaleString()} hours/week</strong>
            <span>of repetitive work automated</span>
          </li>
          <li>
            <strong>{results.roi.toFixed(1)}× ROI</strong>
            <span>breakeven in about {(Math.max(1, Math.min(12, Math.round(2.5 + (10 - Number(results.roi))) ))) } months</span>
          </li>
          <li>
            <strong>≈ {Math.max(1, Math.round(results.hoursSavedPerWeek / 40))} FTEs</strong>
            <span>equivalent workload covered</span>
          </li>
        </ul>

        <div className="recommend" role="note" aria-live="polite">
          Based on your inputs, we recommend <strong>{labelForPlanId(recommendedPlanId)}</strong>.
          <a className="cta" href="#plans">Start your trial</a>
        </div>
      </div>

      <style jsx>{`
        .value-calc { border:1px solid var(--border-strong); border-radius: 16px; padding: 1.25rem; background: var(--bg-secondary); display:flex; flex-direction: column; gap: 1rem; }
        .calc-header h2{ margin:0; font-size: clamp(1.25rem, 1.6vw, 1.75rem); }
        .calc-header p{ margin:0; color: var(--text-secondary); }

        .inputs { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 900px) { .inputs { grid-template-columns: 1fr; } }
        .input-group { display:flex; flex-direction: column; gap: 0.5rem; }
        .label { font-weight:700; }

        .slider-wrap { position: relative; padding-block: 0.75rem; }
        .slider { inline-size: 100%; appearance: none; height: 0.5rem; background: var(--bg-tertiary); border:1px solid var(--border-default); border-radius: 9999px; }
        .slider:focus-visible { outline: 3px solid var(--border-focus); outline-offset: 2px; }
        .slider::-webkit-slider-thumb { appearance: none; inline-size: 1.25rem; block-size: 1.25rem; border-radius: 9999px; background: var(--accent-primary); border: 2px solid var(--text-inverse); }
        .slider::-moz-range-thumb { inline-size: 1.25rem; block-size: 1.25rem; border-radius: 9999px; background: var(--accent-primary); border: 2px solid var(--text-inverse); }

        .value-bubble { position: absolute; inset-block-start: -0.25rem; inset-inline-end: 0; color: var(--text-primary); font-weight: 700; }

        .results { border:1px solid var(--border-default); border-radius: 12px; padding: 1rem; background: var(--bg-card); display:flex; flex-direction: column; gap: 0.75rem; }
        .headline { margin:0; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -0.015em; }
        .metrics { list-style:none; display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0.75rem; margin:0; padding:0; }
        @media (max-width: 900px) { .metrics { grid-template-columns: 1fr; } }
        .metrics li{ display:flex; flex-direction: column; gap:0.25rem; border:1px solid var(--border-subtle); background: var(--bg-secondary); border-radius: 10px; padding: 0.75rem; }
        .metrics li > span { color: var(--text-secondary); }

        .recommend { display:flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; border-top: 1px solid var(--border-default); padding-top: 0.75rem; }
        .cta { margin-inline-start: auto; border:2px solid var(--accent-primary); background: var(--accent-primary); color: var(--text-inverse); text-decoration:none; border-radius: 10px; padding: 0.5rem 0.75rem; font-weight: 800; }
        .cta:hover { background: var(--accent-primary-hover); border-color: var(--accent-primary-hover); }
        .cta:focus-visible { outline: 3px solid var(--border-focus); outline-offset: 2px; }
      `}</style>
    </section>
  );
}

function labelForPlanId(id: string) {
  switch (id) {
    case "starter": return "Starter";
    case "professional": return "Professional";
    case "enterprise": return "Enterprise";
    default: return id;
  }
}

