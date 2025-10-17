import { forwardRef } from "react";
import { cn } from "../utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      trailingIcon,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn("ads-button", className)}
        data-variant={variant}
        data-size={size}
        data-disabled={isDisabled ? "true" : undefined}
        disabled={isDisabled}
        {...rest}
      >
        {icon ? <span aria-hidden>{icon}</span> : null}
        <span>{loading ? "Loading…" : children}</span>
        {trailingIcon ? <span aria-hidden>{trailingIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";