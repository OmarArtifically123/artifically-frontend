"use client";

import { forwardRef } from "react";
import { cn } from "../utils/cn";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface SelectFieldProps<T = string> extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: Array<SelectOption<T>>;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, helperText, error, className, options, placeholder, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? undefined;
    const helperId = helperText ? `${fieldId}-helper` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;

    return (
      <label className="ads-input-group" htmlFor={fieldId}>
        {label ? <span className="ads-label">{label}</span> : null}
        <select
          ref={ref}
          id={fieldId}
          className={cn("ads-field", className)}
          aria-invalid={Boolean(error)}
          aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
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

SelectField.displayName = "SelectField";