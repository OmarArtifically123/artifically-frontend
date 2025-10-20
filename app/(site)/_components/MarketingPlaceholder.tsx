import Link from "next/link";
import type { ReactNode } from "react";

export type MarketingPlaceholderCta = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
};

const CTA_VARIANT_CLASS: Record<NonNullable<MarketingPlaceholderCta["variant"]>, string> = {
  primary: "button--primary",
  secondary: "button--secondary",
  ghost: "button--ghost",
};

type MarketingPlaceholderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  ctas?: MarketingPlaceholderCta[];
  children?: ReactNode;
};

export default function MarketingPlaceholder({
  title,
  description,
  eyebrow,
  ctas = [],
  children,
}: MarketingPlaceholderProps) {
  return (
    <section
      className="marketing-placeholder"
      data-animate-root
      style={{
        padding: "var(--space-3xl) 0 var(--space-2xl)",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <div
          className="glass-card glass-card--subtle"
          style={{
            padding: "var(--space-2xl) clamp(1.5rem, 1.25rem + 1vw, 3rem)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
            alignItems: "center",
          }}
        >
          {eyebrow ? (
            <span
              className="hero-eyebrow"
              style={{
                marginBottom: "var(--space-sm)",
              }}
            >
              {eyebrow}
            </span>
          ) : null}
          <h1
            style={{
              fontSize: "clamp(2.25rem, 1.75rem + 2vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              maxWidth: "48rem",
              margin: 0,
              color: "var(--color-text-tertiary, rgba(226, 240, 255, 0.72))",
              fontSize: "clamp(1.1rem, 1rem + 0.35vw, 1.35rem)",
              lineHeight: 1.7,
            }}
          >
            {description}
          </p>
          {children ? (
            <div
              className="marketing-placeholder__content"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
                alignItems: "center",
              }}
            >
              {children}
            </div>
          ) : null}
          {ctas.length > 0 ? (
            <div
              className="marketing-placeholder__actions"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "var(--space-sm)",
                marginTop: "var(--space-md)",
              }}
            >
              {ctas.map(({ href, label, variant = "primary", external }) => {
                const variantClass = CTA_VARIANT_CLASS[variant];
                return (
                  <Link
                    key={`${href}-${label}`}
                    className={`button button--lg ${variantClass}`}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                  >
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}