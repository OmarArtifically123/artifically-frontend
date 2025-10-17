"use client";

import { cn } from "../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  helperText?: ReactNode;
  delta?: number;
  deltaLabel?: string;
}

export function Stat({ label, value, helperText, delta, deltaLabel, className, ...rest }: StatProps) {
  const direction = delta === undefined ? null : delta === 0 ? "neutral" : delta > 0 ? "up" : "down";
  const formattedDelta =
    delta === undefined
      ? null
      : `${delta > 0 ? "+" : ""}${new Intl.NumberFormat(undefined, {
          maximumFractionDigits: 1,
        }).format(delta)}`;

  return (
    <div className={cn("ads-card ads-stat", className)} {...rest}>
      <span className="ads-label">{label}</span>
      <span className="ads-stat__value">{value}</span>
      {helperText ? <span className="ads-text-subtle">{helperText}</span> : null}
      {formattedDelta ? (
        <span className="ads-stat__trend" data-direction={direction ?? undefined}>
          <span aria-hidden>{direction === "up" ? "▲" : direction === "down" ? "▼" : "•"}</span>
          <span>{formattedDelta}</span>
          {deltaLabel ? <span className="ads-helper-text">{deltaLabel}</span> : null}
        </span>
      ) : null}
    </div>
  );
}