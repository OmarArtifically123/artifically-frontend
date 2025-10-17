"use client";

import { cn } from "../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "success" | "danger" | "warning";

const toneMap: Record<BadgeTone, Record<string, string>> = {
  neutral: {
    background: "color-mix(in srgb, var(--ads-color-palette-neutral-500, #64748b) 16%, transparent)",
    color: "var(--ads-color-semantic-text-default, #0f172a)",
  },
  brand: {
    background: "color-mix(in srgb, var(--ads-color-semantic-brand-primary, #1f7eff) 18%, transparent)",
    color: "var(--ads-color-semantic-brand-primary, #1f7eff)",
  },
  success: {
    background: "color-mix(in srgb, var(--ads-color-semantic-status-success, #10b981) 18%, transparent)",
    color: "var(--ads-color-semantic-status-success, #10b981)",
  },
  danger: {
    background: "color-mix(in srgb, var(--ads-color-semantic-status-danger, #ef4444) 18%, transparent)",
    color: "var(--ads-color-semantic-status-danger, #ef4444)",
  },
  warning: {
    background: "color-mix(in srgb, var(--ads-color-semantic-status-warning, #f59e0b) 18%, transparent)",
    color: "var(--ads-color-semantic-status-warning, #f59e0b)",
  },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function Badge({
  tone = "brand",
  className,
  children,
  startIcon,
  endIcon,
  style,
  ...rest
}: BadgeProps) {
  const toneStyles = toneMap[tone];
  return (
    <span
      className={cn("ads-badge", className)}
      style={{
        ...toneStyles,
        ...style,
      }}
      {...rest}
    >
      {startIcon ? <span aria-hidden>{startIcon}</span> : null}
      <span>{children}</span>
      {endIcon ? <span aria-hidden>{endIcon}</span> : null}
    </span>
  );
}