import { cn } from "../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  className,
  title,
  subtitle,
  media,
  actions,
  footer,
  children,
  ...rest
}: CardProps) {
  return (
    <article className={cn("ads-card", className)} {...rest}>
      {media}
      {(title || subtitle || actions) && (
        <header className="ads-card__header">
          {title ? <h3 className="ads-heading">{title}</h3> : null}
          {subtitle ? <p className="ads-text-subtle">{subtitle}</p> : null}
          {actions ? <div className="ads-card__footer">{actions}</div> : null}
        </header>
      )}
      {children}
      {footer ? <footer className="ads-card__footer">{footer}</footer> : null}
    </article>
  );
}