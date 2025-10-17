"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateSavings } from "../../utils/calculateSavings";

const TEAM_RANGE = { min: 1, max: 1000 };
const RATE_RANGE = { min: 20, max: 200 };

function clamp(value, { min, max }) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export default function ROICalculator({
  heading = "ROI Calculator",
  description = "Adjust the sliders to estimate your potential savings.",
  teamSize: teamSizeProp,
  hourlyRate: hourlyRateProp,
  onTeamSizeChange,
  onHourlyRateChange,
  onChange,
  initialTeamSize = 45,
  initialHourlyRate = 95,
  className = "",
  variant,
  id,
  style,
  headingLevel = 2,
}) {
  const isTeamControlled = typeof teamSizeProp === "number";
  const isRateControlled = typeof hourlyRateProp === "number";

  const [internalTeamSize, setInternalTeamSize] = useState(() =>
    clamp(teamSizeProp ?? initialTeamSize, TEAM_RANGE),
  );
  const [internalHourlyRate, setInternalHourlyRate] = useState(() =>
    clamp(hourlyRateProp ?? initialHourlyRate, RATE_RANGE),
  );

  useEffect(() => {
    if (isTeamControlled) {
      setInternalTeamSize(clamp(teamSizeProp, TEAM_RANGE));
    }
  }, [isTeamControlled, teamSizeProp]);

  useEffect(() => {
    if (isRateControlled) {
      setInternalHourlyRate(clamp(hourlyRateProp, RATE_RANGE));
    }
  }, [hourlyRateProp, isRateControlled]);

  const teamSize = isTeamControlled ? clamp(teamSizeProp, TEAM_RANGE) : internalTeamSize;
  const hourlyRate = isRateControlled ? clamp(hourlyRateProp, RATE_RANGE) : internalHourlyRate;

  const savings = useMemo(() => calculateSavings(teamSize, hourlyRate), [hourlyRate, teamSize]);

  useEffect(() => {
    onChange?.({ teamSize, hourlyRate, ...savings });
  }, [hourlyRate, onChange, savings, teamSize]);

  const handleTeamSizeChange = (value) => {
    const nextValue = clamp(Number(value), TEAM_RANGE);
    if (!isTeamControlled) {
      setInternalTeamSize(nextValue);
    }
    onTeamSizeChange?.(nextValue, calculateSavings(nextValue, hourlyRate));
  };

  const handleHourlyRateChange = (value) => {
    const nextValue = clamp(Number(value), RATE_RANGE);
    if (!isRateControlled) {
      setInternalHourlyRate(nextValue);
    }
    onHourlyRateChange?.(nextValue, calculateSavings(teamSize, nextValue));
  };

  const classes = ["roi-calculator"];
  if (variant) {
    classes.push(`roi-calculator--${variant}`);
  }
  if (className) {
    classes.push(className);
  }

  const normalizedHeading = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${normalizedHeading}`;

  return (
    <section className={classes.join(" ")} id={id} style={style}>
      <header className="roi-calculator__header">
        <Heading>{heading}</Heading>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="roi-calculator__controls">
        <SliderControl
          label="Team size"
          value={teamSize}
          min={TEAM_RANGE.min}
          max={TEAM_RANGE.max}
          onChange={handleTeamSizeChange}
        />
        <SliderControl
          label="Avg hourly rate"
          value={hourlyRate}
          min={RATE_RANGE.min}
          max={RATE_RANGE.max}
          prefix="$"
          onChange={handleHourlyRateChange}
        />
      </div>
      <div className="roi-result">
        <span className="roi-result__value">${savings.monthlySavings.toLocaleString()}</span>
        <span className="roi-result__caption">Estimated monthly savings</span>
        <div className="roi-result__meta">
          <span>Time saved: {savings.hoursSavedPerWeek} hrs/week</span>
          <span>Projected ROI: {savings.roi.toFixed(1)}x</span>
        </div>
      </div>
    </section>
  );
}

function SliderControl({ label, min, max, value, onChange, prefix = "" }) {
  return (
    <label className="slider-control">
      <span>
        {label}
        <strong>
          {prefix}
          {value}
        </strong>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}