import { cn } from "../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type AlertTone = "info" | "success" | "warning" | "danger";

const toneIcon: Record<AlertTone, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  danger: "⛔",
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function Alert({ tone = "info", title, description, actions, className, children, ...rest }: AlertProps) {
  return (
    <div className={cn("ads-alert", className)} role="alert" data-tone={tone} {...rest}>
      <span aria-hidden>{toneIcon[tone]}</span>
      <div style={{ display: "grid", gap: "0.25rem" }}>
        {title ? <p className="ads-heading" style={{ fontSize: "1rem" }}>{title}</p> : null}
        {description ? <p className="ads-text-subtle">{description}</p> : null}
        {children}
        {actions ? <div className="ads-card__footer">{actions}</div> : null}
      </div>
    </div>
  );
}