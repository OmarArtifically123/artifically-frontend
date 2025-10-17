"use client";

import { useId } from "react";
import { cn } from "../utils/cn";
import type { InputHTMLAttributes } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
}

export function Switch({ label, helperText, className, id, checked, onChange, ...rest }: SwitchProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const helperId = helperText ? `${fieldId}-helper` : undefined;

  return (
    <label className={cn("ads-switch", className)} htmlFor={fieldId} data-checked={checked ? "true" : undefined}>
      <input
        id={fieldId}
        type="checkbox"
        role="switch"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        aria-describedby={helperId}
        {...rest}
      />
      <span className="ads-switch__track">
        <span className="ads-switch__thumb" />
      </span>
      <span>
        {label ? <span className="ads-label" style={{ color: "inherit" }}>{label}</span> : null}
        {helperText ? (
          <span id={helperId} className="ads-helper-text">
            {helperText}
          </span>
        ) : null}
      </span>
    </label>
  );
}