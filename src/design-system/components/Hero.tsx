import { cn } from "../utils/cn";
import type { ReactNode } from "react";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
}

export function Hero({ eyebrow, title, description, actions, media, className, ...rest }: HeroProps) {
  return (
    <section className={cn("ads-hero", className)} {...rest}>
      <div>
        {eyebrow ? <p className="ads-badge" style={{ marginBottom: "0.75rem" }}>{eyebrow}</p> : null}
        <h1 className="ads-hero__title">{title}</h1>
        {description ? <p className="ads-text-subtle" style={{ color: "inherit" }}>{description}</p> : null}
        {actions ? <div className="ads-card__footer">{actions}</div> : null}
      </div>
      {media}
    </section>
  );
}