"use client";

import { forwardRef } from "react";
import { cn } from "../utils/cn";
import type { InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

/**
 * Detects optimal input type for mobile keyboards based on field name/type
 * Improves mobile UX by showing the right keyboard layout
 */
function getOptimalInputType(
  name?: string,
  type?: string,
  autoComplete?: string,
): string {
  // Respect explicit type if provided and not 'text'
  if (type && type !== "text") {
    return type;
  }

  // Use autocomplete hint if available
  if (autoComplete) {
    if (autoComplete.includes("email")) return "email";
    if (autoComplete.includes("tel")) return "tel";
    if (autoComplete.includes("url")) return "url";
  }

  // Detect from field name
  const fieldName = name?.toLowerCase() || "";
  if (
    fieldName.includes("email") ||
    fieldName.includes("e-mail") ||
    fieldName.includes("mail")
  ) {
    return "email";
  }
  if (
    fieldName.includes("phone") ||
    fieldName.includes("tel") ||
    fieldName.includes("mobile")
  ) {
    return "tel";
  }
  if (fieldName.includes("url") || fieldName.includes("website")) {
    return "url";
  }
  if (fieldName.includes("number") || fieldName.includes("amount")) {
    return "number";
  }
  if (fieldName.includes("date")) {
    return "date";
  }

  return type || "text";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error, className, id, type, autoComplete, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? undefined;
    const helperId = helperText ? `${fieldId}-helper` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;

    // Auto-detect optimal input type for mobile keyboards
    const optimalType = getOptimalInputType(rest.name, type, autoComplete);

    return (
      <label className="ads-input-group" htmlFor={fieldId}>
        {label ? <span className="ads-label">{label}</span> : null}
        <input
          ref={ref}
          id={fieldId}
          type={optimalType}
          autoComplete={autoComplete}
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