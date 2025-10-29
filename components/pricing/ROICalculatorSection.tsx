"use client";

import { useState } from "react";
import { trackPricingEvent } from "@/lib/pricing-analytics";

export default function ROICalculatorSection() {
  const [calls, setCalls] = useState(2000);
  const [hourlyWage, setHourlyWage] = useState(15);
  const [automationPercent, setAutomationPercent] = useState(70);
  const [showResults, setShowResults] = useState(false);

  // Calculation logic
  const avgCallDuration = 8; // minutes
  const monthlySavings = Math.round(
    (calls * ((hourlyWage / 60) * avgCallDuration) * automationPercent) / 100
  );
  const hoursSaved = Math.round((calls * avgCallDuration * automationPercent) / 100 / 60);

  const handleCalculate = () => {
    setShowResults(true);
    trackPricingEvent("roi_calculator_complete", {
      monthly_savings: monthlySavings,
      hours_saved: hoursSaved,
      automation_percent: automationPercent,
    });
  };

  const handleContinue = () => {
    trackPricingEvent("roi_calculator_cta_click", { monthly_savings: monthlySavings });
    window.location.href = `/checkout?roi_savings=${monthlySavings}`;
  };

  return (
    <section className="roi-section" aria-labelledby="roi-title">
      <h2 id="roi-title">Estimate your savings in 60 seconds</h2>
      <p className="roi-subtitle">
        Most customers recoup costs in under 6 weeks.
      </p>

      <div className="roi-calculator">
        <div className="roi-inputs">
          <label className="input-group">
            <span className="label-text">Monthly inbound calls / messages</span>
            <input
              type="number"
              value={calls}
              onChange={(e) => {
                setCalls(parseInt(e.target.value) || 0);
                setShowResults(false);
              }}
              onFocus={() => trackPricingEvent("roi_calculator_engage", {})}
              placeholder="e.g., 2000"
              min="0"
            />
          </label>

          <label className="input-group">
            <span className="label-text">Avg hourly wage ($)</span>
            <input
              type="number"
              value={hourlyWage}
              onChange={(e) => {
                setHourlyWage(parseInt(e.target.value) || 0);
                setShowResults(false);
              }}
              placeholder="e.g., 15"
              min="0"
            />
          </label>

          <label className="input-group">
            <span className="label-text">% you'd like automated</span>
            <div className="slider-container">
              <input
                type="range"
                value={automationPercent}
                onChange={(e) => {
                  setAutomationPercent(parseInt(e.target.value));
                  setShowResults(false);
                }}
                min="0"
                max="100"
                step="5"
                className="slider"
              />
              <span className="slider-value">{automationPercent}%</span>
            </div>
          </label>

          <button className="calculate-btn" onClick={handleCalculate} type="button">
            Calculate savings
          </button>
        </div>

        {showResults && (
          <div className="roi-output">
            <div className="output-headline">You could save</div>
            <div className="output-savings">
              <strong>${monthlySavings.toLocaleString()}/month</strong>
            </div>
            <div className="output-details">
              in labor costs and reclaim <strong>{hoursSaved} hours/month</strong>
            </div>
            
            <button className="roi-cta" onClick={handleContinue} type="button">
              Continue with this bundle →
            </button>
            
            <p className="output-microcopy">
              We'll send you a PDF summary you can share with finance.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .roi-section {
          padding: 4rem 2rem;
          text-align: center;
        }

        h2 {
          margin: 0 0 1rem;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 900;
          color: #E5E7EB;
        }

        .roi-subtitle {
          margin: 0 0 3rem;
          font-size: 1.1rem;
          color: #9CA3AF;
        }

        .roi-calculator {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .roi-inputs {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
        }

        .label-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #E5E7EB;
        }

        .roi-inputs input[type="number"] {
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #E5E7EB;
          font-size: 1.1rem;
          font-weight: 600;
          transition: border-color 0.3s ease;
        }

        .roi-inputs input[type="number"]:focus {
          outline: none;
          border-color: #3B82F6;
          background: rgba(255, 255, 255, 0.08);
        }

        .slider-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .slider {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          outline: none;
          appearance: none;
          cursor: pointer;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider-value {
          min-width: 50px;
          font-size: 1.25rem;
          font-weight: 800;
          color: #3B82F6;
        }

        .calculate-btn {
          padding: 1.15rem 2rem;
          background: transparent;
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 12px;
          color: #3B82F6;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .calculate-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        .calculate-btn:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 3px;
        }

        .roi-output {
          padding: 2.5rem;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15),
            rgba(91, 107, 255, 0.1)
          );
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .output-headline {
          font-size: 1.1rem;
          color: #9CA3AF;
        }

        .output-savings {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #3B82F6;
          line-height: 1;
        }

        .output-details {
          font-size: 1.2rem;
          color: #E5E7EB;
          line-height: 1.6;
        }

        .output-details strong {
          color: #14B8A6;
        }

        .roi-cta {
          margin-top: 1rem;
          padding: 1.25rem 2.5rem;
          background: #3B82F6;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 800;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .roi-cta:hover {
          background: #2563EB;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .roi-cta:focus-visible {
          outline: 3px solid white;
          outline-offset: 3px;
        }

        .output-microcopy {
          margin: 0;
          font-size: 0.85rem;
          color: #6B7280;
        }

        @media (max-width: 768px) {
          .roi-section {
            padding: 3rem 1.5rem;
          }

          .roi-inputs,
          .roi-output {
            padding: 1.75rem;
          }

          .output-savings {
            font-size: 2.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .roi-output {
            animation: none;
          }

          .calculate-btn:hover,
          .roi-cta:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
