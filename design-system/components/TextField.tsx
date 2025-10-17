"use client";

import { forwardRef } from "react";
import { cn } from "../utils/cn";
import type { InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error, className, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? undefined;
    const helperId = helperText ? `${fieldId}-helper` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <label className="ads-input-group" htmlFor={fieldId}>
        {label ? <span className="ads-label">{label}</span> : null}
        <input
          ref={ref}
          id={fieldId}
          className={cn("ads-field", className)}
          aria-invalid={Boolean(error)}
          aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
          {...rest}
        />
        {helperText ? (
          <span id={helperId} className="ads-helper-text">
            {helperText}
          </span>
        ) : null}
        {error ? (
          <span id={errorId} className="ads-helper-text" style={{ color: "var(--ads-color-semantic-status-danger, #ef4444)" }}>
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

TextField.displayName = "TextField";