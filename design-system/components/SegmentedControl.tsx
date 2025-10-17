"use client";

import { cn } from "../utils/cn";
import type { ReactNode } from "react";

export interface SegmentedOption {
  id: string;
  label: ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("ads-segmented", className)} role="tablist" aria-label="Segmented control">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          className="ads-segmented__option"
          data-active={option.id === value ? "true" : undefined}
          aria-selected={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}