import { useMemo, useState } from "react";
import { calculateSavings } from "../../utils/calculateSavings";

const TEAM_OPTIONS = [
  { label: "20", value: 20 },
  { label: "45", value: 45 },
  { label: "85", value: 85 },
];

const RATE_OPTIONS = [
  { label: "$45", value: 45 },
  { label: "$85", value: 85 },
  { label: "$140", value: 140 },
];

export default function HeroRoiCalculator() {
  const [teamSize, setTeamSize] = useState(45);
  const [hourlyRate, setHourlyRate] = useState(85);

  const savings = useMemo(() => calculateSavings(teamSize, hourlyRate), [teamSize, hourlyRate]);

  return (
    <section className="hero-roi" aria-label="Quick ROI estimator">
      <header>
        <p className="hero-roi__eyebrow">Estimate your first win</p>
        <h2>See how quickly Artifically pays for itself</h2>
      </header>
      <div className="hero-roi__grid">
        <fieldset className="hero-roi__options">
          <legend>Team size</legend>
          <div role="radiogroup" aria-label="Team size">
            {TEAM_OPTIONS.map((option) => (
              <label key={option.value} className="hero-roi__choice">
                <input
                  type="radio"
                  name="hero-roi-team"
                  value={option.value}
                  checked={teamSize === option.value}
                  onChange={() => setTeamSize(option.value)}
                />
                <span>{option.label} people</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="hero-roi__options">
          <legend>Average hourly rate</legend>
          <div role="radiogroup" aria-label="Average hourly rate">
            {RATE_OPTIONS.map((option) => (
              <label key={option.value} className="hero-roi__choice">
                <input
                  type="radio"
                  name="hero-roi-rate"
                  value={option.value}
                  checked={hourlyRate === option.value}
                  onChange={() => setHourlyRate(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="hero-roi__result" role="status" aria-live="polite">
          <p className="hero-roi__label">Projected monthly savings</p>
          <p className="hero-roi__value">${savings.monthlySavings.toLocaleString()}</p>
          <dl className="hero-roi__meta">
            <div>
              <dt>Weekly hours reclaimed</dt>
              <dd>{savings.hoursSavedPerWeek} hrs</dd>
            </div>
            <div>
              <dt>Projected ROI</dt>
              <dd>{savings.roi.toFixed(1)}x</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="hero-roi__footnote">
        Calculations update instantly—export the assumptions when you open the marketplace or share with finance.
      </p>
    </section>
  );
}