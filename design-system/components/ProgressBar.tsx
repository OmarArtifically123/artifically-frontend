import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValue?: boolean;
}

export function ProgressBar({ value, max = 100, showValue = true, className, ...rest }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = Number(((clamped / max) * 100).toFixed(2));

  return (
    <div
      className={cn("ads-progress", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      {...rest}
    >
      <div className="ads-progress__value" style={{ width: `${percentage}%` }} />
      {showValue ? (
        <span className="ads-helper-text" style={{ marginLeft: "0.5rem" }}>
          {percentage}%
        </span>
      ) : null}
    </div>
  );
}