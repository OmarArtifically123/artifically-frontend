"use client";

import { forwardRef } from "react";
import { cn } from "../utils/cn";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? undefined;
    const descriptionId = description ? `${fieldId}-description` : undefined;

    return (
      <label className={cn("ads-checkbox", className)} htmlFor={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          className="ads-field"
          style={{ width: "1.25rem", height: "1.25rem" }}
          aria-describedby={descriptionId}
          {...rest}
        />
        <span>
          {label ? <span className="ads-label" style={{ color: "inherit" }}>{label}</span> : null}
          {description ? (
            <span id={descriptionId} className="ads-helper-text">
              {description}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";