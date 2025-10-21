"use client";

import { cn } from "../utils/cn";
import type { KeyboardEvent, ReactNode } from "react";

export interface SegmentedOption {
  id: string;
  label: ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  ariaLabel = "Segmented control",
  ariaLabelledBy,
}: SegmentedControlProps) {
  const focusRadio = (target: EventTarget | null, indexToFocus: number) => {
    if (!(target instanceof HTMLElement)) return;
    const container = target.parentElement;
    if (!container) return;
    const radios = container.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
    const nextButton = radios[indexToFocus];
    if (nextButton) {
      nextButton.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (options.length === 0) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const previous = (index - 1 + options.length) % options.length;
      onChange(options[previous].id);
      focusRadio(event.currentTarget, previous);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % options.length;
      onChange(options[next].id);
      focusRadio(event.currentTarget, next);
    }
  };

  return (
    <div
      className={cn("ads-segmented", className)}
      role="radiogroup"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          className="ads-segmented__option"
          data-active={option.id === value ? "true" : undefined}
          aria-checked={option.id === value ? "true" : "false"}
          tabIndex={option.id === value ? 0 : -1}
          onClick={() => onChange(option.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}