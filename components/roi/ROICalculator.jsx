"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateSavings } from "../../utils/calculateSavings";

const TEAM_RANGE = { min: 1, max: 1000 };
const RATE_RANGE = { min: 20, max: 200 };

function clamp(value, { min, max }) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

const TEAM_OPTIONS = [20, 45, 85];

export default function ROICalculator({
  eyebrow,
  heading = "See how quickly Artifically pays for itself",
  description,
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
  const eyebrowText = eyebrow ?? "ESTIMATE YOUR FIRST WIN";
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

  const animatedMonthlySavings = useAnimatedNumber(savings.monthlySavings, {
    duration: 800,
  });

  const sliderProgress = Math.min(
    1,
    Math.max(0, (hourlyRate - RATE_RANGE.min) / (RATE_RANGE.max - RATE_RANGE.min)),
  );

  return (
    <section className={classes.join(" ")} id={id} style={style}>
      <div className="roi-calculator__inner">
        <header className="roi-calculator__header">
          <p className="roi-calculator__eyebrow">{eyebrowText}</p>
          <Heading>{heading}</Heading>
          {description ? <p className="roi-calculator__supporting">{description}</p> : null}
        </header>
        <div className="roi-calculator__card">
          <div className="roi-calculator__inputs">
            <div className="roi-calculator__field">
              <span className="roi-calculator__label">Team size</span>
              <div className="roi-calculator__team-options">
                {TEAM_OPTIONS.map((option) => {
                  const id = `roi-team-size-${option}`;
                  const isSelected = teamSize === option;
                  return (
                    <label
                      key={option}
                      htmlFor={id}
                      className={[
                        "roi-calculator__team-option",
                        isSelected ? "roi-calculator__team-option--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <input
                        type="radio"
                        id={id}
                        name="roi-team-size"
                        value={option}
                        checked={isSelected}
                        onChange={() => handleTeamSizeChange(option)}
                      />
                      <span>{option} people</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="roi-calculator__field">
              <span className="roi-calculator__label">Average hourly rate</span>
              <div className="roi-calculator__input-wrapper">
                <span className="roi-calculator__input-prefix">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={RATE_RANGE.min}
                  max={RATE_RANGE.max}
                  value={hourlyRate}
                  onChange={(event) => handleHourlyRateChange(event.target.value)}
                  className="roi-calculator__input"
                />
              </div>
              <div
                className="roi-calculator__slider"
                style={{ "--slider-progress": sliderProgress }}
              >
                <input
                  type="range"
                  min={RATE_RANGE.min}
                  max={RATE_RANGE.max}
                  value={hourlyRate}
                  onChange={(event) => handleHourlyRateChange(event.target.value)}
                />
                <span className="roi-calculator__slider-value">
                  ${hourlyRate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="roi-calculator__results">
            <p className="roi-calculator__results-caption">ESTIMATED MONTHLY SAVINGS</p>
            <p className="roi-calculator__results-value">
              ${animatedMonthlySavings.toLocaleString()}
            </p>
            <div className="roi-calculator__results-details">
              <p>Time saved: {savings.hoursSavedPerWeek} hours/week</p>
              <p>Projected ROI: {savings.roi.toFixed(1)}x</p>
            </div>
            <button type="button" className="cta-primary roi-calculator__cta">
              <span className="cta-primary__label">Start Saving Now →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function useAnimatedNumber(value, { duration = 800 } = {}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = previousValueRef.current;
    const change = value - from;
    let frame;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const nextValue = Math.round(from + change * easeOut(progress));
      setAnimatedValue(nextValue);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    previousValueRef.current = value;

    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return animatedValue;
}