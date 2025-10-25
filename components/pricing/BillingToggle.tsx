"use client";

import { useEffect, useId } from "react";
import type { BillingCadence } from "@/components/pricing/types";

type Props = {
  value: BillingCadence;
  onChange: (next: BillingCadence) => void;
  annualSavingsPercent?: number; // e.g., 20 for 20%
};

export default function BillingToggle({ value, onChange, annualSavingsPercent = 20 }: Props) {
  const groupId = useId();
  const monthlyId = `${groupId}-monthly`;
  const annualId = `${groupId}-annual`;

  useEffect(() => {
    // Announce changes politely for screen readers
    const region = document.getElementById(`${groupId}-live`);
    if (region) {
      region.textContent = value === "annual" ? `Annual billing selected. Save ${annualSavingsPercent} percent.` : "Monthly billing selected.";
    }
  }, [annualSavingsPercent, groupId, value]);

  function handleKey(e: React.KeyboardEvent<HTMLButtonElement>, current: BillingCadence) {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(current === "annual" ? "monthly" : "annual");
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(current === "monthly" ? "annual" : "monthly");
    }
  }

  return (
    <div className="billing-toggle" role="radiogroup" aria-label="Billing cadence" aria-describedby={`${groupId}-desc`}>
      <span id={`${groupId}-desc`} className="sr-only">
        Toggle between monthly billing and annual billing which saves {annualSavingsPercent} percent.
      </span>

      <button
        id={monthlyId}
        role="radio"
        aria-checked={value === "monthly"}
        className={`toggle-option${value === "monthly" ? " is-active" : ""}`}
        onClick={() => onChange("monthly")}
        onKeyDown={(e) => handleKey(e, "monthly")}
      >
        <span className="toggle-label">Monthly</span>
      </button>

      <button
        id={annualId}
        role="radio"
        aria-checked={value === "annual"}
        aria-label={`Annual, save ${annualSavingsPercent} percent`}
        className={`toggle-option${value === "annual" ? " is-active" : ""}`}
        onClick={() => onChange("annual")}
        onKeyDown={(e) => handleKey(e, "annual")}
      >
        <span className="toggle-label">Annual</span>
        <span className="toggle-badge" aria-hidden="true">Save {annualSavingsPercent}%</span>
      </button>

      <div id={`${groupId}-live`} className="sr-only" aria-live="polite" />

      <style jsx>{`
        .billing-toggle {
          display: inline-flex;
          gap: 0.25rem;
          padding: 0.25rem;
          border: 2px solid var(--border-strong);
          border-radius: var(--ads-radii-pill, 9999px);
          background: var(--bg-secondary);
        }
        .toggle-option {
          appearance: none;
          border: 2px solid transparent;
          background: transparent;
          color: var(--text-primary);
          padding: 0.5rem 0.875rem;
          border-radius: var(--ads-radii-pill, 9999px);
          font-weight: 600;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .toggle-option:hover { border-color: var(--border-default); }
        .toggle-option:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }
        .toggle-option.is-active {
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-color: var(--accent-primary);
        }
        .toggle-badge {
          font-size: 0.75rem;
          font-weight: 800;
          border: 2px solid currentColor;
          padding-inline: 0.4rem;
          padding-block: 0.15rem;
          border-radius: 9999px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}
