"use client";

import { useId } from "react";

const WORDMARK_WIDTH = 300;

// Infinity symbol path - same for all themes
const INFINITY_PATH =
  "M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z";

const ORBIT_RINGS = [
  { rx: 168, ry: 88, rotation: -12, opacity: 0.6 },
  { rx: 184, ry: 96, rotation: 18, opacity: 0.45 },
  { rx: 206, ry: 112, rotation: -28, opacity: 0.35 },
];

const STAR_COORDS = [
  { x: 74, y: 46, scale: 1.1 },
  { x: 156, y: 24, scale: 0.85 },
  { x: 224, y: 152, scale: 0.95 },
  { x: 302, y: 44, scale: 1.2 },
  { x: 354, y: 144, scale: 0.9 },
];

const DATA_STREAMS = [
  {
    d: "M66 126c36 22 70 32 106 32 46 0 84-14 124-42",
    strokeWidth: 2,
    opacity: 0.6,
  },
  {
    d: "M82 88c22-34 58-52 100-52 36 0 70 14 102 42",
    strokeWidth: 1.6,
    opacity: 0.45,
  },
  {
    d: "M132 58c18-12 38-18 58-18 22 0 44 8 70 28",
    strokeWidth: 1.4,
    opacity: 0.35,
  },
];

// Theme-aware color function
function getThemeColors(variant) {
  if (variant === "contrast") {
    // CONTRAST THEME: Electric, sharp, maximum saturation
    return {
      glyphStart: "#00eaff",
      glyphMid: "#ff00ff",
      glyphEnd: "#ffff00",
      accent: "#00ffe0",
      nodes: "#00d4ff",
      nodeOutline: "rgba(0, 234, 255, 0.8)",
      aurora: "rgba(0, 234, 255, 0.6)",
      plasma: "rgba(255, 0, 255, 0.5)",
      grid: "#00eaff",
      textGradientStart: "#ffffff",
      textGradientMid: "#00eaff",
      textGradientEnd: "#ffffff",
      textOutline: "none",
      tagline: "#ffffff",
      taglineGlow: "rgba(0, 234, 255, 0.4)",
      glow: "#00eaff",
      depthStart: "rgba(0, 0, 0, 0.6)",
      depthMid: "rgba(0, 234, 255, 0.2)",
      depthEnd: "rgba(255, 0, 255, 0.2)",
    };
  } else if (variant === "light") {
    // LIGHT THEME: Professional, vibrant, modern
    return {
      glyphStart: "#1f7eff",
      glyphMid: "#7c3aed",
      glyphEnd: "#ec4899",
      accent: "#0ea5e9",
      nodes: "#f59e0b",
      nodeOutline: "rgba(31, 126, 255, 0.6)",
      aurora: "rgba(14, 165, 233, 0.3)",
      plasma: "rgba(124, 58, 237, 0.25)",
      grid: "rgba(15, 23, 42, 0.15)",
      textGradientStart: "#000000",
      textGradientMid: "#165fd7",
      textGradientEnd: "#000000",
      textOutline: "rgba(31, 126, 255, 0.15)",
      tagline: "rgba(30, 41, 59, 0.8)",
      taglineGlow: "rgba(31, 126, 255, 0.2)",
      glow: "rgba(31, 126, 255, 0.5)",
      depthStart: "rgba(255, 255, 255, 0.5)",
      depthMid: "rgba(124, 58, 237, 0.15)",
      depthEnd: "rgba(14, 165, 233, 0.2)",
    };
  } else {
    // DARK THEME: Mysterious, deep, cosmic
    return {
      glyphStart: "#38bdf8",
      glyphMid: "#a855f7",
      glyphEnd: "#fde68a",
      accent: "#22d3ee",
      nodes: "#fbbf24",
      nodeOutline: "rgba(125, 211, 252, 0.55)",
      aurora: "rgba(14, 165, 233, 0.32)",
      plasma: "rgba(147, 197, 253, 0.22)",
      grid: "rgba(148, 163, 184, 0.18)",
      textGradientStart: "#f8fafc",
      textGradientMid: "#bae6fd",
      textGradientEnd: "#22d3ee",
      textOutline: "rgba(15, 118, 110, 0.45)",
      tagline: "rgba(226, 232, 240, 0.65)",
      taglineGlow: "rgba(34, 211, 238, 0.22)",
      glow: "rgba(59, 130, 246, 0.55)",
      depthStart: "rgba(15, 23, 42, 0.45)",
      depthMid: "rgba(124, 58, 237, 0.2)",
      depthEnd: "rgba(56, 189, 248, 0.3)",
    };
  }
}

export default function LogoWordmark({ variant = "light", className, ...props }) {
  const uniqueId = useId();
  const getId = (suffix) => `${uniqueId}-${suffix}`;
  const colors = getThemeColors(variant);

  return (
    <svg
      viewBox="0 0 640 220"
      width="420"
      height="164"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={getId("title")}
      focusable="false"
      className={className}
      suppressHydrationWarning
      {...props}
    >
      <title id={getId("title")}>Artifically wordmark</title>
      <defs>
        {/* Primary gradient for infinity symbol */}
        <linearGradient id={getId("primary")} x1="28" y1="208" x2="360" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.glyphStart} />
          <stop offset="48%" stopColor={colors.glyphMid} />
          <stop offset="96%" stopColor={colors.glyphEnd} />
        </linearGradient>

        {/* Depth gradient */}
        <linearGradient id={getId("depth")} x1="36" y1="196" x2="330" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.depthStart} />
          <stop offset="38%" stopColor={colors.depthMid} />
          <stop offset="74%" stopColor={colors.depthEnd} />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.45)" />
        </linearGradient>

        {/* Stroke gradient */}
        <linearGradient id={getId("stroke")} x1="68" y1="40" x2="420" y2="196" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
          <stop offset="55%" stopColor={colors.glyphMid} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors.glyphEnd} />
        </linearGradient>

        {/* Sheen gradient */}
        <linearGradient id={getId("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="0.55" stopColor={variant === "light" ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.65)"} />
          <stop offset="1" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        {/* Aura radial gradient */}
        <radialGradient id={getId("aura")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={variant === "contrast" ? "#ffffff" : "rgba(255, 255, 255, 0.85)"} />
          <stop offset="35%" stopColor={colors.plasma} />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </radialGradient>

        {/* Node gradient */}
        <radialGradient id={getId("node")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="38%" stopColor={colors.nodes} />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </radialGradient>

        {/* Spark gradient */}
        <radialGradient id={getId("spark")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="60%" stopColor={colors.nodes} stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>

        {/* Text gradient */}
        <linearGradient id={getId("text")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.textGradientStart} />
          <stop offset="55%" stopColor={colors.textGradientMid} />
          <stop offset="100%" stopColor={colors.textGradientEnd} />
        </linearGradient>

        {/* Tagline highlight */}
        <linearGradient id={getId("tagline-highlight")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor={colors.taglineGlow} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Grid pattern */}
        <pattern id={getId("grid")} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)">
          <path d="M0 0h14v14" fill="none" stroke={colors.grid} strokeWidth={variant === "contrast" ? "1.5" : "1"} />
          <path d="M0 7h14" stroke={colors.grid} strokeWidth={variant === "contrast" ? "1" : "0.6"} />
        </pattern>

        {/* Clip path for infinity loop */}
        <clipPath id={getId("loop-clip")}>
          <path d={INFINITY_PATH} />
        </clipPath>

        {/* Outer glow filter */}
        <filter id={getId("outer-glow")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={variant === "contrast" ? "16" : "12"} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={
              variant === "contrast"
                ? "0 0 0 0 0 0 0 0 0 0.92 0 0 0 0 1 0 0 0 0.9 0"
                : "0 0 0 0 0.2 0 0 0 0 0.48 0 0 0 0 0.72 0 0 0 0.65 0"
            }
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Stroke glow filter */}
        <filter id={getId("stroke-glow")} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation={variant === "contrast" ? "12" : "8"} floodColor={colors.glow} floodOpacity={variant === "contrast" ? "1" : "0.9"} />
        </filter>

        {/* Sparkle filter */}
        <filter id={getId("sparkle")} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Text glow filter */}
        <filter id={getId("text-glow")} x="-20%" y="-60%" width="140%" height="220%">
          <feDropShadow dx="0" dy="10" stdDeviation={variant === "contrast" ? "14" : "18"} floodColor={colors.glow} floodOpacity={variant === "contrast" ? "0.6" : "0.35"} />
        </filter>
      </defs>

      {/* Logo symbol */}
      <g transform="translate(32 26)">
        {/* Orbit rings */}
        <g opacity={variant === "contrast" ? "0.9" : "0.75"}>
          {ORBIT_RINGS.map(({ rx, ry, rotation, opacity }, index) => (
            <ellipse
              key={index}
              cx="178"
              cy="104"
              rx={rx}
              ry={ry}
              transform={`rotate(${rotation} 178 104)`}
              fill="none"
              stroke={colors.aurora}
              strokeWidth={variant === "contrast" ? "2.5" : "1.6"}
              strokeDasharray={variant === "contrast" ? "6 12" : "8 18"}
              strokeLinecap="round"
              opacity={opacity}
            />
          ))}
        </g>

        {/* Main infinity loop with glow */}
        <g filter={`url(#${getId("outer-glow")})`}>
          <path d={INFINITY_PATH} fill={`url(#${getId("primary")})`} />
        </g>

        {/* Inner effects (clipped to infinity shape) */}
        <g clipPath={`url(#${getId("loop-clip")})`}>
          <path d={INFINITY_PATH} fill={`url(#${getId("depth")})`} opacity="0.75" />
          <rect x="-20" y="8" width="380" height="196" fill={`url(#${getId("grid")})`} opacity={variant === "contrast" ? "0.6" : "0.35"} />
          <rect x="-40" y="-12" width="420" height="220" fill={`url(#${getId("sheen")})`} transform="rotate(-14 0 0)" opacity="0.55" />
        </g>

        {/* Infinity stroke with glow */}
        <path
          d={INFINITY_PATH}
          fill="none"
          stroke={`url(#${getId("stroke")})`}
          strokeWidth={variant === "contrast" ? "8" : "6"}
          strokeLinejoin="round"
          filter={`url(#${getId("stroke-glow")})`}
        />

        {/* Data streams */}
        {DATA_STREAMS.map(({ d, strokeWidth, opacity }, index) => (
          <path
            key={index}
            d={d}
            fill="none"
            stroke={colors.accent}
            strokeWidth={variant === "contrast" ? strokeWidth * 1.5 : strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={variant === "contrast" ? opacity * 1.3 : opacity}
            filter={variant === "contrast" ? "none" : `url(#${getId("sparkle")})`}
          />
        ))}

        {/* Central aura */}
        <ellipse cx="210" cy="108" rx="92" ry="54" fill={`url(#${getId("aura")})`} opacity={variant === "contrast" ? "0.7" : "0.45"} />

        {/* Connection nodes */}
        {[
          { cx: 110, cy: 60 },
          { cx: 110, cy: 162 },
          { cx: 310, cy: 60 },
          { cx: 310, cy: 162 },
          { cx: 210, cy: 86 },
          { cx: 210, cy: 140 },
        ].map(({ cx, cy }, index) => (
          <g key={index} transform={`translate(${cx} ${cy})`}>
            <circle r="18" fill={`url(#${getId("node")})`} opacity="0.95" />
            <circle r="22" fill="none" stroke={colors.nodeOutline} strokeWidth={variant === "contrast" ? "3" : "2"} strokeOpacity={variant === "contrast" ? "1" : "0.7"} />
            <circle r="6" fill="#fff" opacity={variant === "contrast" ? "1" : "0.8"} />
          </g>
        ))}

        {/* Stars */}
        {STAR_COORDS.map(({ x, y, scale }, index) => (
          <g key={index} transform={`translate(${x} ${y}) scale(${scale})`} filter={variant === "contrast" ? "none" : `url(#${getId("sparkle")})`} opacity={variant === "contrast" ? "1" : "0.9"}>
            <circle r="8" fill={`url(#${getId("spark")})`} />
            <path d="M0 -7L0 7" stroke="#fff" strokeWidth={variant === "contrast" ? "2" : "1.2"} strokeLinecap="round" />
            <path d="M-7 0L7 0" stroke="#fff" strokeWidth={variant === "contrast" ? "2" : "1.2"} strokeLinecap="round" />
          </g>
        ))}

        {/* Connection path */}
        <path
          d="M126 72c12-24 38-34 62-26 14 5 26 14 36 28l16 22 16-22c18-26 50-34 76-18 26 16 34 48 18 74-16 26-48 34-74 18-8-5-16-12-22-20"
          fill="none"
          stroke={variant === "contrast" ? colors.accent : "#fff"}
          strokeOpacity={variant === "contrast" ? "0.5" : "0.25"}
          strokeWidth={variant === "contrast" ? "3" : "2"}
          strokeDasharray={variant === "contrast" ? "4 8" : "6 12"}
        />

        {/* Center rings */}
        <circle cx="210" cy="108" r="32" fill="none" stroke={variant === "contrast" ? colors.accent : "rgba(255,255,255,0.35)"} strokeWidth={variant === "contrast" ? "2.5" : "1.6"} strokeDasharray="4 8" />
        <circle cx="210" cy="108" r="12" fill={`url(#${getId("spark")})`} opacity={variant === "contrast" ? "0.95" : "0.75"} />
      </g>

      {/* ARTIFICALLY text */}
      <g transform="translate(320 58)" filter={`url(#${getId("text-glow")})`}>
        <text
          x="0"
          y="0"
          fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="40"
          fontWeight="800"
          fill={`url(#${getId("text")})`}
          stroke={colors.textOutline !== "none" ? colors.textOutline : "none"}
          strokeWidth={colors.textOutline !== "none" ? "1.2" : "0"}
          style={{ paintOrder: "stroke fill" }}
          textLength={WORDMARK_WIDTH}
          lengthAdjust="spacingAndGlyphs"
        >
          ARTIFICALLY
        </text>

        {/* Underline */}
        <g transform="translate(0 16)">
          <rect
            x="0"
            y="0"
            width={WORDMARK_WIDTH}
            height={variant === "contrast" ? "4" : "3"}
            fill={colors.accent}
            opacity={variant === "contrast" ? "1" : "0.65"}
            rx="1.5"
          />
          <rect
            x="0"
            y={variant === "contrast" ? "6" : "8"}
            width={WORDMARK_WIDTH}
            height={variant === "contrast" ? "2" : "1.2"}
            fill={variant === "contrast" ? colors.glyphEnd : "#fff"}
            opacity={variant === "contrast" ? "0.8" : "0.25"}
          />
        </g>

        {/* Tagline background highlight */}
        <rect
          x="0"
          y="34"
          width={WORDMARK_WIDTH}
          height="18"
          fill={`url(#${getId("tagline-highlight")})`}
          rx="9"
          opacity="0.55"
        />

        {/* Tagline */}
        <text
          x="0"
          y="58"
          fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="14"
          fontWeight="600"
          letterSpacing="0.42em"
          fill={colors.tagline}
        >
          AUTOMATION • INTELLIGENCE • ORCHESTRATION
        </text>
      </g>
    </svg>
  );
}
