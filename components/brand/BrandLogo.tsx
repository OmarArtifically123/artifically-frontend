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
const FULL_VIEWBOX = "0 0 400 64";
const COMPACT_VIEWBOX = "0 0 336 56";
const VERTICAL_VIEWBOX = "0 0 264 176";

const MarkGlyph = () => (
  <g className="ai-brand__glyph">
    <path
      className="ai-brand__halo"
      d="M32 4C18.1929 4 6 16.1929 6 30C6 43.8071 18.1929 56 32 56C45.8071 56 58 43.8071 58 30C58 16.1929 45.8071 4 32 4Z"
      fill="none"
    />
    <path
      className="ai-brand__loop"
      fillRule="evenodd"
      d="M19 16C10.5741 16 6 24.6809 6 32C6 39.3191 10.5741 48 19 48C24.7538 48 30.5401 44.0555 33.8492 38.4372C37.1583 44.0555 42.9446 48 48.6983 48C57.1259 48 62 39.3191 62 32C62 24.6809 57.1259 16 48.6983 16C42.9446 16 37.1583 19.9445 33.8492 25.5628C30.5401 19.9445 24.7538 16 19 16ZM19 22C24.5975 22 29.3862 27.5459 31.6206 32C29.3862 36.4541 24.5975 42 19 42C13.6269 42 10 36.6513 10 32C10 27.3487 13.6269 22 19 22ZM48.6983 22C43.1008 22 38.3121 27.5459 36.0777 32C38.3121 36.4541 43.1008 42 48.6983 42C54.0714 42 58 36.6513 58 32C58 27.3487 54.0714 22 48.6983 22Z"
    />
    <path
      className="ai-brand__flow"
      d="M12 32C12 22.6 17.8 18 23.5 18C29.6 18 34.4 22.6 36.7 27.6C39.5 33.8 44.8 38 50.5 38C55.2 38 58 34 58 29.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      className="ai-brand__bridge"
      d="M24 46C28.1 52 35.9 52 40 46"
      fill="none"
      strokeLinecap="round"
    />
    <circle className="ai-brand__core" cx={32} cy={32} r={3.6} />
    <circle className="ai-brand__node ai-brand__node--intake" cx={18.2} cy={32} r={3.3} />
    <circle className="ai-brand__node ai-brand__node--orchestrate" cx={32} cy={22} r={2.6} />
    <circle className="ai-brand__node ai-brand__node--handoff" cx={45.8} cy={32} r={3.3} />
    <circle className="ai-brand__node ai-brand__node--resolve" cx={32} cy={42} r={2.6} />
  </g>
);

const WordmarkGlyph = () => (
  <g className="ai-brand__wordmark" aria-label="Artifically">
    <text className="ai-brand__wordmark-text" x={0} y={28}>
      ARTIFICALLY
    </text>
  </g>
);

const markLabel = {
  title: "Artifically infinity automation mark",
  desc: "Infinity loop symbol with orchestrated nodes representing continuous, always-on automation",
};

const fullLabel = {
  title: "Artifically full logo lockup",
  desc: "Artifically infinity mark paired with the custom wordmark for primary brand usage",
};

const compactLabel = {
  title: "Artifically compact logo",
  desc: "Compact horizontal lockup balancing the infinity automation mark with the Artifically wordmark",
};

const verticalLabel = {
  title: "Artifically vertical logo",
  desc: "Stacked configuration of the infinity automation mark above the Artifically wordmark",
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
          <g transform="translate(96 16)">
            <WordmarkGlyph />
          </g>
        </g>
        <g className="ai-brand__lockup ai-brand__lockup--rtl">
          <g transform="translate(336 0)">
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
          <g transform="translate(84 14) scale(0.88)">
            <WordmarkGlyph />
          </g>
        </g>
        <g className="ai-brand__lockup ai-brand__lockup--rtl">
          <g transform="translate(272 0)">
            <MarkGlyph />
          </g>
          <g transform="translate(0 14) scale(0.88)">
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
        <g transform="translate(100 0)">
          <MarkGlyph />
        </g>
        <g transform="translate(6 122) scale(0.95)">
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
