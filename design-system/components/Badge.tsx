"use client";

import { cn } from "../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "success" | "danger" | "warning";

type ToneStyle = {
  background: string;
  color: string;
  borderColor: string;
};

const toneMap: Record<BadgeTone, ToneStyle> = {
  neutral: {
    background: "var(--ads-badge-neutral-bg, #e2e8f0)",
    color: "var(--ads-badge-neutral-fg, #0f172a)",
    borderColor: "var(--ads-badge-neutral-border, #94a3b8)",
  },
  brand: {
    background: "var(--ads-badge-brand-bg, #d7e6ff)",
    color: "var(--ads-badge-brand-fg, #1048aa)",
    borderColor: "var(--ads-badge-brand-border, #4d9dff)",
  },
  success: {
    background: "var(--ads-badge-success-bg, #d1fae5)",
    color: "var(--ads-badge-success-fg, #064e3b)",
    borderColor: "var(--ads-badge-success-border, #34d399)",
  },
  danger: {
    background: "var(--ads-badge-danger-bg, #fee2e2)",
    color: "var(--ads-badge-danger-fg, #7f1d1d)",
    borderColor: "var(--ads-badge-danger-border, #f87171)",
  },
  warning: {
    background: "var(--ads-badge-warning-bg, #fff2c1)",
    color: "var(--ads-badge-warning-fg, #78350f)",
    borderColor: "var(--ads-badge-warning-border, #f59e0b)",
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
      data-tone={tone}
      style={{
        background: toneStyles.background,
        color: toneStyles.color,
        borderColor: toneStyles.borderColor,
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