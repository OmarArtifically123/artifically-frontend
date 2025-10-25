"use client";

import { CSSProperties, forwardRef, useId } from "react";

/**
 * Artifically brand identity system.
 * The geometry is intentionally layered:
 *  - BrandMark delivers the automation hub symbol with orbiting flows.
 *  - WordmarkGlyph encodes the custom upper-case logotype.
 *  - Variants (icon, compact, full, vertical) share one canonical drawing
 *    and are responsive via CSS variables so light/dark/contrast themes stay in sync.
 *  - RTL support is handled via paired lockup groups toggled by data-direction/dir.
 * Theme values, high-contrast palettes, and motion semantics live in global.css.
 */

type Variant = "full" | "compact" | "icon" | "vertical";
type Direction = "ltr" | "rtl";

export interface BrandLogoProps {
  variant?: Variant;
  /** Force lockup direction; defaults to document direction. */
  direction?: Direction;
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

const cx = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(" ");

const MARK_VIEWBOX = "0 0 64 64";
const FULL_VIEWBOX = "0 0 324 64";
const COMPACT_VIEWBOX = "0 0 288 56";
const VERTICAL_VIEWBOX = "0 0 240 148";

const MarkGlyph = () => (
  <g className="ai-brand__glyph">
    <path
      className="ai-brand__shield"
      d="M32 3.5C24.4 9.3 18.4 17.4 14.4 26.7C11.3 33.8 12.3 41.3 17.5 47.2C22.8 53.1 27.8 56.5 32 58.4C36.2 56.5 41.2 53.1 46.5 47.2C51.7 41.3 52.7 33.8 49.6 26.7C45.6 17.4 39.6 9.3 32 3.5Z"
    />
    <path
      className="ai-brand__orbit ai-brand__orbit--primary"
      d="M20.2 36.4C25.5 26.1 28.8 22.7 32 22.7C35.2 22.7 38.5 26.1 43.8 36.4C40.4 43.7 35.5 48.1 32 49.4C28.5 48.1 23.6 43.7 20.2 36.4Z"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="ai-brand__orbit ai-brand__orbit--secondary"
      d="M22.8 44.6C27.9 49.1 36.1 49.1 41.2 44.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle className="ai-brand__core" cx={32} cy={36} r={5.6} />
    <path
      className="ai-brand__arrow"
      d="M32 10.6L38.7 19.7C39.2 20.4 38.7 21.4 37.8 21.4H26.2C25.3 21.4 24.8 20.4 25.3 19.7L32 10.6Z"
    />
    <circle className="ai-brand__node ai-brand__node--left" cx={20.6} cy={42.8} r={2.4} />
    <circle className="ai-brand__node ai-brand__node--right" cx={43.4} cy={42.8} r={2.4} />
    <circle className="ai-brand__node ai-brand__node--top" cx={32} cy={18.4} r={1.8} />
    <circle className="ai-brand__halo" cx={32} cy={34} r={20.6} fill="none" />
  </g>
);

const WordmarkGlyph = () => (
  <g className="ai-brand__wordmark" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0 0)">
      <path d="M2 26L10 2L18 26" />
      <path d="M6.2 16.3Q10 12.1 13.8 16.3" />
    </g>
    <g transform="translate(25 0)">
      <path d="M0 26V2" />
      <path d="M0 4H10C16 4 18 8 18 12C18 16.8 14.8 20 10 20H0" />
      <path d="M10 20L18 26" />
    </g>
    <g transform="translate(50 0)">
      <path d="M0 2H20" />
      <path d="M10 2V26" />
    </g>
    <g transform="translate(75 0)">
      <path d="M0 2H8" />
      <path d="M4 2V26" />
      <path d="M0 26H8" />
    </g>
    <g transform="translate(88 0)">
      <path d="M0 2V26" />
      <path d="M0 2H18" />
      <path d="M0 14H14" />
    </g>
    <g transform="translate(111 0)">
      <path d="M0 2H8" />
      <path d="M4 2V26" />
      <path d="M0 26H8" />
    </g>
    <g transform="translate(124 0)">
      <path d="M18 6C16 4 12 2 8 2C3 2 0 7 0 14C0 21 3 26 8 26C12 26 16 24 18 22" />
    </g>
    <g transform="translate(149 0)">
      <path d="M2 26L10 2L18 26" />
      <path d="M6.2 16.3Q10 12.1 13.8 16.3" />
    </g>
    <g transform="translate(174 0)">
      <path d="M0 2V26" />
      <path d="M0 26H14" />
    </g>
    <g transform="translate(193 0)">
      <path d="M0 2V26" />
      <path d="M0 26H14" />
    </g>
    <g transform="translate(212 0)">
      <path d="M0 2L10 14L20 2" />
      <path d="M10 14V26" />
    </g>
  </g>
);

const markLabel = {
  title: "Artifically automation mark",
  desc: "Symbol of a continuous, always-on operations hub with guided automation flows",
};

const fullLabel = {
  title: "Artifically logo",
  desc: "Artifically full logo lockup with automation mark and engineered wordmark",
};

const compactLabel = {
  title: "Artifically compact logo",
  desc: "Compact horizontal lockup of Artifically mark and wordmark",
};

const verticalLabel = {
  title: "Artifically vertical logo",
  desc: "Stacked Artifically mark above the wordmark for vertical layouts",
};

const withBaseClass = (
  base: string,
  interactive: BrandLogoProps["interactive"],
  userClassName?: string,
) => cx("ai-brand", base, interactive ? "ai-brand--interactive" : null, userClassName);

const directionAttr = (direction?: Direction) => (direction ? { "data-direction": direction } : undefined);

export const BrandMark = forwardRef<SVGSVGElement, Omit<BrandLogoProps, "variant">>(
  (
    {
      title = markLabel.title,
      desc = markLabel.desc,
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
        viewBox={MARK_VIEWBOX}
        className={withBaseClass("ai-brand--mark", interactive, className)}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <MarkGlyph />
      </svg>
    );
  },
);
BrandMark.displayName = "BrandMark";

export const BrandLogoFull = forwardRef<SVGSVGElement, BrandLogoProps>(
  (
    {
      title = fullLabel.title,
      desc = fullLabel.desc,
      className,
      style,
      interactive,
      direction,
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
        viewBox={FULL_VIEWBOX}
        className={withBaseClass("ai-brand--full", interactive, className)}
        style={style}
        {...directionAttr(direction)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <g className="ai-brand__lockup ai-brand__lockup--ltr">
          <g transform="translate(0 0)">
            <MarkGlyph />
          </g>
          <g transform="translate(84 16)">
            <WordmarkGlyph />
          </g>
        </g>
        <g className="ai-brand__lockup ai-brand__lockup--rtl">
          <g transform="translate(260 0)">
            <MarkGlyph />
          </g>
          <g transform="translate(0 16)">
            <WordmarkGlyph />
          </g>
        </g>
      </svg>
    );
  },
);
BrandLogoFull.displayName = "BrandLogoFull";

export const BrandLogoCompact = forwardRef<SVGSVGElement, BrandLogoProps>(
  (
    {
      title = compactLabel.title,
      desc = compactLabel.desc,
      className,
      style,
      interactive,
      direction,
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
        viewBox={COMPACT_VIEWBOX}
        className={withBaseClass("ai-brand--compact", interactive, className)}
        style={style}
        {...directionAttr(direction)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <g className="ai-brand__lockup ai-brand__lockup--ltr">
          <g transform="translate(0 0)">
            <MarkGlyph />
          </g>
          <g transform="translate(78 14) scale(0.87)">
            <WordmarkGlyph />
          </g>
        </g>
        <g className="ai-brand__lockup ai-brand__lockup--rtl">
          <g transform="translate(224 0)">
            <MarkGlyph />
          </g>
          <g transform="translate(0 14) scale(0.87)">
            <WordmarkGlyph />
          </g>
        </g>
      </svg>
    );
  },
);
BrandLogoCompact.displayName = "BrandLogoCompact";

export const BrandLogoVertical = forwardRef<SVGSVGElement, BrandLogoProps>(
  (
    {
      title = verticalLabel.title,
      desc = verticalLabel.desc,
      className,
      style,
      interactive,
      direction,
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
        viewBox={VERTICAL_VIEWBOX}
        className={withBaseClass("ai-brand--vertical", interactive, className)}
        style={style}
        {...directionAttr(direction)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <g transform="translate(88 0)">
          <MarkGlyph />
        </g>
        <g transform="translate(4 96)">
          <WordmarkGlyph />
        </g>
      </svg>
    );
  },
);
BrandLogoVertical.displayName = "BrandLogoVertical";

export function BrandLogo({ variant = "full", ...props }: BrandLogoProps) {
  if (variant === "icon") return <BrandMark {...props} />;
  if (variant === "compact") return <BrandLogoCompact {...props} />;
  if (variant === "vertical") return <BrandLogoVertical {...props} />;
  return <BrandLogoFull {...props} />;
}

export default BrandLogo;
