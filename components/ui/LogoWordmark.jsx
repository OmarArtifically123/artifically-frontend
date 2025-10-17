import { useId } from "react";

const LIGHT_COLORS = {
  glyphStart: "#7dd3fc",
  glyphMid: "#c084fc",
  glyphEnd: "#f9a8d4",
  accent: "#34d399",
  nodes: "#facc15",
  nodeOutline: "rgba(14, 116, 144, 0.65)",
  aurora: "rgba(59, 130, 246, 0.22)",
  plasma: "rgba(56, 189, 248, 0.3)",
  grid: "rgba(15, 23, 42, 0.12)",
  textGradientStart: "#0f172a",
  textGradientMid: "#2563eb",
  textGradientEnd: "#0369a1",
  textOutline: "rgba(15, 23, 42, 0.26)",
  tagline: "rgba(30, 41, 59, 0.7)",
  taglineGlow: "rgba(59, 130, 246, 0.18)",
  glow: "rgba(59, 130, 246, 0.45)",
};

const DARK_COLORS = {
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
};

const WORDMARK_WIDTH = 300;

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
  { x: 422, y: 62, scale: 0.75 },
  { x: 260, y: 102, scale: 1.35 },
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

const INFINITY_PATH =
  "M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z";

export default function LogoWordmark({ variant = "light", className, ...props }) {
  const uniqueId = useId();
  const colors = variant === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const getId = (suffix) => `${uniqueId}-${suffix}`;

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
      {...props}
    >
      <title id={getId("title")}>Artifically wordmark</title>
      <defs>
        <linearGradient id={getId("primary")} x1="28" y1="208" x2="360" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.glyphStart} />
          <stop offset="48%" stopColor={colors.glyphMid} />
          <stop offset="96%" stopColor={colors.glyphEnd} />
        </linearGradient>
        <linearGradient id={getId("depth")} x1="36" y1="196" x2="330" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0.45)" />
          <stop offset="38%" stopColor="rgba(15, 23, 42, 0.18)" />
          <stop offset="74%" stopColor="rgba(255, 255, 255, 0.12)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.45)" />
        </linearGradient>
        <linearGradient id={getId("stroke")} x1="68" y1="40" x2="420" y2="196" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
          <stop offset="55%" stopColor={colors.glyphMid} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors.glyphEnd} />
        </linearGradient>
        <linearGradient id={getId("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="0.55" stopColor="rgba(255, 255, 255, 0.65)" />
          <stop offset="1" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
        <radialGradient id={getId("aura")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255, 255, 255, 0.85)" />
          <stop offset="35%" stopColor={colors.plasma} />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </radialGradient>
        <radialGradient id={getId("node")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="38%" stopColor={colors.nodes} />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </radialGradient>
        <radialGradient id={getId("spark")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="60%" stopColor={colors.nodes} stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
        <linearGradient id={getId("text")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.textGradientStart} />
          <stop offset="55%" stopColor={colors.textGradientMid} />
          <stop offset="100%" stopColor={colors.textGradientEnd} />
        </linearGradient>
        <linearGradient id={getId("tagline-highlight")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor={colors.taglineGlow} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <pattern id={getId("grid")} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)">
          <path d="M0 0h14v14" fill="none" stroke={colors.grid} strokeWidth="1" />
          <path d="M0 7h14" stroke={colors.grid} strokeWidth="0.6" />
        </pattern>
        <clipPath id={getId("loop-clip")}>
          <path d={INFINITY_PATH} />
        </clipPath>
        <filter id={getId("outer-glow")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.2 0 0 0 0 0.48 0 0 0 0 0.72 0 0 0 0.65 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={getId("stroke-glow")} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={colors.glow} floodOpacity="0.9" />
        </filter>
        <filter id={getId("sparkle")} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={getId("text-glow")} x="-20%" y="-60%" width="140%" height="220%">
          <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor={colors.glow} floodOpacity="0.35" />
        </filter>
      </defs>
      <g transform="translate(32 26)">
        <g opacity="0.75">
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
              strokeWidth="1.6"
              strokeDasharray="8 18"
              strokeLinecap="round"
              opacity={opacity}
            />
          ))}
        </g>
        <g filter={`url(#${getId("outer-glow")})`}>
          <path d={INFINITY_PATH} fill={`url(#${getId("primary")})`} />
        </g>
        <g clipPath={`url(#${getId("loop-clip")})`}>
          <path d={INFINITY_PATH} fill={`url(#${getId("depth")})`} opacity="0.75" />
          <rect x="-20" y="8" width="380" height="196" fill={`url(#${getId("grid")})`} opacity="0.35" />
          <rect x="-40" y="-12" width="420" height="220" fill={`url(#${getId("sheen")})`} transform="rotate(-14 0 0)" opacity="0.55" />
        </g>
        <path
          d={INFINITY_PATH}
          fill="none"
          stroke={`url(#${getId("stroke")})`}
          strokeWidth="6"
          strokeLinejoin="round"
          filter={`url(#${getId("stroke-glow")})`}
        />
        {DATA_STREAMS.map(({ d, strokeWidth, opacity }, index) => (
          <path
            key={index}
            d={d}
            fill="none"
            stroke={colors.accent}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={opacity}
            filter={`url(#${getId("sparkle")})`}
          />
        ))}
        <ellipse cx="210" cy="108" rx="92" ry="54" fill={`url(#${getId("aura")})`} opacity="0.45" />
        {[{ cx: 110, cy: 60 }, { cx: 110, cy: 162 }, { cx: 310, cy: 60 }, { cx: 310, cy: 162 }, { cx: 210, cy: 86 }, { cx: 210, cy: 140 }].map(
          ({ cx, cy }, index) => (
            <g key={index} transform={`translate(${cx} ${cy})`}>
              <circle r="18" fill={`url(#${getId("node")})`} opacity="0.95" />
              <circle r="22" fill="none" stroke={colors.nodeOutline} strokeWidth="2" strokeOpacity="0.7" />
              <circle r="6" fill="#fff" opacity="0.8" />
            </g>
          ),
        )}
        {STAR_COORDS.map(({ x, y, scale }, index) => (
          <g key={index} transform={`translate(${x} ${y}) scale(${scale})`} filter={`url(#${getId("sparkle")})`} opacity="0.9">
            <circle r="8" fill={`url(#${getId("spark")})`} />
            <path d="M0 -7L0 7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M-7 0L7 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ))}
        <path
          d="M126 72c12-24 38-34 62-26 14 5 26 14 36 28l16 22 16-22c18-26 50-34 76-18 26 16 34 48 18 74-16 26-48 34-74 18-8-5-16-12-22-20"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.25"
          strokeWidth="2"
          strokeDasharray="6 12"
        />
        <circle cx="210" cy="108" r="32" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.6" strokeDasharray="4 8" />
        <circle cx="210" cy="108" r="12" fill={`url(#${getId("spark")})`} opacity="0.75" />
      </g>
      <g transform="translate(320 58)" filter={`url(#${getId("text-glow")})`}>
        <text
          x="0"
          y="0"
          fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="40"
          fontWeight="800"
          fill={`url(#${getId("text")})`}
          stroke={colors.textOutline}
          strokeWidth="1.2"
          style={{ paintOrder: "stroke fill" }}
          textLength={WORDMARK_WIDTH}
          lengthAdjust="spacingAndGlyphs"
        >
          ARTIFICALLY
        </text>
        <g transform="translate(0 16)">
          <rect
            x="0"
            y="0"
            width={WORDMARK_WIDTH}
            height="3"
            fill={colors.accent}
            opacity="0.65"
            rx="1.5"
          />
          <rect
            x="0"
            y="8"
            width={WORDMARK_WIDTH}
            height="1.2"
            fill="#fff"
            opacity="0.25"
          />
        </g>
        <rect
          x="0"
          y="34"
          width={WORDMARK_WIDTH}
          height="18"
          fill={`url(#${getId("tagline-highlight")})`}
          rx="9"
          opacity="0.55"
        />
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