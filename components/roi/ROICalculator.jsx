"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
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

  const classes = ["pricing-calculator"];
  if (variant) {
    classes.push(`pricing-calculator--${variant}`);
  }
  if (className) {
    classes.push(className);
  }

  const normalizedHeading = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${normalizedHeading}`;

  const animatedMonthlySavings = useAnimatedNumber(savings.monthlySavings, {
    duration: 800,
  });

  const normalize = (value) => Math.max(0, Math.min(value, 1));
  const teamPercentage =
    (teamSize - TEAM_RANGE.min) / (TEAM_RANGE.max - TEAM_RANGE.min);
  const ratePercentage =
    (hourlyRate - RATE_RANGE.min) / (RATE_RANGE.max - RATE_RANGE.min);
  const teamPosition = normalize(teamPercentage);
  const ratePosition = normalize(ratePercentage);
  const teamSliderInputId = useId();
  const teamSliderValueId = useId();
  const rateSliderInputId = useId();
  const rateSliderValueId = useId();

  return (
    <section className={classes.join(" ")} id={id} style={style}>
      <header className="pricing-calculator__header">
        <Heading>{heading}</Heading>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="pricing-calculator__sliders">
        <div className="pricing-calculator__slider-group">
          <label className="pricing-calculator__label" htmlFor={teamSliderInputId}>
            Team size
          </label>
          <div
            className="pricing-slider"
            style={{ "--slider-position": `${teamPosition * 100}%` }}
          >
            <div className="pricing-slider__track" />
            <div
              className="pricing-slider__fill"
              style={{ width: `${teamPosition * 100}%` }}
            />
            <input
              id={teamSliderInputId}
              type="range"
              min={TEAM_RANGE.min}
              max={TEAM_RANGE.max}
              value={teamSize}
              onChange={(event) => handleTeamSizeChange(event.target.value)}
              className="pricing-slider__input"
              aria-describedby={teamSliderValueId}
              aria-valuetext={`${teamSize.toLocaleString()} people`}
            />
            <div className="pricing-slider__value" id={teamSliderValueId}>
              {teamSize.toLocaleString()} people
            </div>
          </div>
        </div>

        <div className="pricing-calculator__slider-group">
          <label className="pricing-calculator__label" htmlFor={rateSliderInputId}>
            Average hourly rate
          </label>
          <div
            className="pricing-slider"
            style={{ "--slider-position": `${ratePosition * 100}%` }}
          >
            <div className="pricing-slider__track" />
            <div
              className="pricing-slider__fill"
              style={{ width: `${ratePosition * 100}%` }}
            />
            <input
              id={rateSliderInputId}
              type="range"
              min={RATE_RANGE.min}
              max={RATE_RANGE.max}
              value={hourlyRate}
              onChange={(event) => handleHourlyRateChange(event.target.value)}
              className="pricing-slider__input"
              aria-describedby={rateSliderValueId}
              aria-valuetext={`$${hourlyRate.toLocaleString()}/hr`}
            />
            <div className="pricing-slider__value" id={rateSliderValueId}>
              ${hourlyRate.toLocaleString()}/hr
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-calculator__results">
        <p className="pricing-calculator__results-value">
          ${animatedMonthlySavings.toLocaleString()}
        </p>
        <p className="pricing-calculator__results-label">ESTIMATED MONTHLY SAVINGS</p>
        <div className="pricing-calculator__metrics">
          <div className="pricing-calculator__metric">
            <span className="pricing-calculator__metric-value">34 hours/week</span>
            <span className="pricing-calculator__metric-label">Time saved</span>
          </div>
          <div className="pricing-calculator__metric">
            <span className="pricing-calculator__metric-value">10.5x</span>
            <span className="pricing-calculator__metric-label">Projected ROI</span>
          </div>
          <div className="pricing-calculator__metric">
            <span className="pricing-calculator__metric-value">2.3 months</span>
            <span className="pricing-calculator__metric-label">Break-even</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-calculator {
          max-width: 900px;
          margin: 100px auto;
          padding: 60px 48px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .pricing-calculator__header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pricing-calculator__header :global(h1),
        .pricing-calculator__header :global(h2),
        .pricing-calculator__header :global(h3),
        .pricing-calculator__header :global(h4),
        .pricing-calculator__header :global(h5),
        .pricing-calculator__header :global(h6) {
          font-size: clamp(28px, 4vw, 32px);
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .pricing-calculator__header p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .pricing-calculator__sliders {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .pricing-calculator__slider-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pricing-calculator__label {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .pricing-slider {
          position: relative;
          height: 60px;
        }

        .pricing-slider__track,
        .pricing-slider__fill {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 8px;
          border-radius: 4px;
        }

        .pricing-slider__track {
          width: 100%;
          background: rgba(255, 255, 255, 0.15);
        }

        .pricing-slider__fill {
          background: linear-gradient(90deg, #a78bfa, #ec4899);
        }

        .pricing-slider__input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: none;
          margin: 0;
          appearance: none;
          cursor: pointer;
        }

        .pricing-slider__input::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          background: white;
          border: 4px solid #a78bfa;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 200ms ease, box-shadow 200ms ease;
          cursor: grab;
          position: relative;
        }

        .pricing-slider__input::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: white;
          border: 4px solid #a78bfa;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 200ms ease, box-shadow 200ms ease;
          cursor: grab;
        }

        .pricing-slider__input:active::-webkit-slider-thumb,
        .pricing-slider__input:focus-visible::-webkit-slider-thumb {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
          cursor: grabbing;
        }

        .pricing-slider__input:active::-moz-range-thumb,
        .pricing-slider__input:focus-visible::-moz-range-thumb {
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
          cursor: grabbing;
        }

        .pricing-slider__input::-webkit-slider-runnable-track {
          height: 8px;
          background: transparent;
        }

        .pricing-slider__input::-moz-range-track {
          height: 8px;
          background: transparent;
        }

        .pricing-slider__value {
          position: absolute;
          left: var(--slider-position);
          bottom: 32px;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          white-space: nowrap;
        }

        .pricing-calculator__results {
          padding: 40px;
          background: radial-gradient(
            circle at top left,
            rgba(139, 92, 246, 0.15),
            transparent 70%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pricing-calculator__results-value {
          font-size: clamp(48px, 6vw, 64px);
          font-weight: 700;
          color: transparent;
          background: linear-gradient(135deg, #a78bfa, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
          margin: 0;
        }

        @media (forced-colors: active) {
          .pricing-calculator__results-value {
            forced-color-adjust: none;
            background: none !important;
            color: CanvasText !important;
            -webkit-text-fill-color: CanvasText !important;
          }
        }
          
        .pricing-calculator__results-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin: 0;
        }

        .pricing-calculator__metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .pricing-calculator__metric {
          text-align: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pricing-calculator__metric-value {
          font-size: 28px;
          font-weight: 700;
          color: white;
        }

        .pricing-calculator__metric-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .pricing-calculator {
            padding: 48px 28px;
            margin: 80px auto;
          }

          .pricing-slider__value {
            bottom: 40px;
          }

          .pricing-calculator__metrics {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .pricing-calculator {
            padding: 40px 24px;
          }
        }
      `}</style>
    </section>
  );
}

function useAnimatedNumber(value, { duration = 800 } = {}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = previousValueRef.current;
    const delta = value - from;

    let frame;

    function update(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = from + delta * eased;
      setAnimatedValue(nextValue);
      if (progress < 1) {
        frame = requestAnimationFrame(update);
      }
    }

    frame = requestAnimationFrame(update);
    previousValueRef.current = value;

    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return animatedValue;
}