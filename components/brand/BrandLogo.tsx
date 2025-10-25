"use client";

import { CSSProperties, forwardRef, useId } from "react";

type Variant = "full" | "compact" | "icon";

export interface BrandLogoProps {
  variant?: Variant;
  title?: string;
  desc?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * If true, enable subtle hover/tap feedback. Obeys reduced-motion.
   * Keep this off for footer or compliance surfaces.
   */
  interactive?: boolean;
}

/**
 * Core, minimal brand mark — engineered for legibility at 16–32px and above.
 * Monoline "A" with grounded geometry; accepts theme via CSS vars.
 */
export const BrandMark = forwardRef<SVGSVGElement, Omit<BrandLogoProps, "variant">>(
  ({ title = "Artifically mark", desc = "Stylized A mark representing automation and orchestration", className, style, interactive }, ref) => {
    const uid = useId();
    const titleId = `${uid}-title`;
    const descId = `${uid}-desc`;
    return (
      <svg
        ref={ref}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        viewBox="0 0 24 24"
        className={["ai-brand-mark", interactive ? "ai-brand--interactive" : "", className].filter(Boolean).join(" ")}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        {/*
          Monoline A:
          - Two legs with rounded caps
          - Elevated crossbar (slight upward arc) communicating continuity
          - No micro-detail for tiny sizes; silhouette remains iconic
        */}
        <g id="mark" stroke="var(--logo-mark, currentColor)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Legs */}
          <path d="M4 20.5 L12 3.5 L20 20.5" strokeWidth="2" />
          {/* Crossbar (slight arc) */}
          <path d="M7.8 14.5 C 10.5 13.5, 13.5 13.5, 16.2 14.5" strokeWidth="2" />
          {/* Optional subtle nodes for larger scales (hidden at very small sizes via CSS) */}
          <g id="nodes" fill="var(--logo-accent, currentColor)" opacity="var(--logo-node-opacity, 0.0)">
            <circle cx="12" cy="3.5" r="1.25" />
            <circle cx="7.8" cy="14.5" r="1" />
            <circle cx="16.2" cy="14.5" r="1" />
          </g>
        </g>
      </svg>
    );
  },
);
BrandMark.displayName = "BrandMark";

/**
 * Full horizontal lockup: mark + wordmark. Wordmark remains vector text for crispness.
 * Ideal for desktop header, hero, PDFs.
 */
export const BrandLogoFull = forwardRef<SVGSVGElement, BrandLogoProps>(
  (
    {
      title = "Artifically logo",
      desc = "Artifically full logo with mark and wordmark",
      className,
      style,
      interactive,
    },
    ref,
  ) => {
    const uid = useId();
    const titleId = `${uid}-title`;
    const descId = `${uid}-desc`;
    return (
      <svg
        ref={ref}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        viewBox="0 0 260 32"
        className={["ai-brand-logo ai-brand-logo--full", interactive ? "ai-brand--interactive" : "", className]
          .filter(Boolean)
          .join(" ")}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        {/* Mark */}
        <g id="symbol" transform="translate(0,4)">
          <BrandMark interactive={false} />
        </g>
        {/* Wordmark - set with robust font stack; inherits color */}
        <g id="wordmark" transform="translate(36, 22)">
          <text
            x="0"
            y="0"
            fontFamily="var(--logo-font, var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', system-ui, -apple-system, Arial, sans-serif))"
            fontWeight="700"
            fontSize="16"
            letterSpacing="0.02em"
            fill="var(--logo-word, currentColor)"
          >
            Artifically
          </text>
          {/* Optional bilingual companion for Arabic markets (hidden by default, can be enabled by CSS) */}
          <text
            id="wordmark-ar"
            x="0"
            y="0"
            dy="-10"
            fontFamily="var(--logo-font-ar, var(--logo-font, 'Inter', system-ui, sans-serif))"
            fontWeight="600"
            fontSize="10"
            letterSpacing="0.02em"
            fill="var(--logo-word-secondary, color-mix(in srgb, var(--logo-word, currentColor) 72%, transparent))"
            style={{ display: "var(--logo-ar-display, none)" }}
          >
            {/* Arabic transliteration intentionally configurable; set via CSS variable content when needed */}
          </text>
        </g>
      </svg>
    );
  },
);
BrandLogoFull.displayName = "BrandLogoFull";

/**
 * Compact lockup: mark + condensed wordmark. For mid-width nav.
 */
export const BrandLogoCompact = forwardRef<SVGSVGElement, BrandLogoProps>(
  ({ title = "Artifically logo", desc = "Artifically compact logo with mark and short wordmark", className, style, interactive }, ref) => {
    const uid = useId();
    const titleId = `${uid}-title`;
    const descId = `${uid}-desc`;
    return (
      <svg
        ref={ref}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        viewBox="0 0 200 28"
        className={["ai-brand-logo ai-brand-logo--compact", interactive ? "ai-brand--interactive" : "", className]
          .filter(Boolean)
          .join(" ")}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <g id="symbol" transform="translate(0,2)">
          <BrandMark interactive={false} />
        </g>
        <g id="wordmark" transform="translate(32, 20)">
          <text
            x="0"
            y="0"
            fontFamily="var(--logo-font, var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', system-ui, -apple-system, Arial, sans-serif))"
            fontWeight="700"
            fontSize="14"
            letterSpacing="0.01em"
            fill="var(--logo-word, currentColor)"
          >
            Artifically
          </text>
        </g>
      </svg>
    );
  },
);
BrandLogoCompact.displayName = "BrandLogoCompact";

/**
 * Generic BrandLogo wrapper that selects the appropriate variant.
 */
export function BrandLogo({ variant = "full", ...props }: BrandLogoProps) {
  if (variant === "icon") return <BrandMark {...props} />;
  if (variant === "compact") return <BrandLogoCompact {...props} />;
  return <BrandLogoFull {...props} />;
}

export default BrandLogo;

