import { useId } from "react";

const LIGHT_COLORS = {
  glyphStart: "#38bdf8",
  glyphMid: "#8b5cf6",
  glyphEnd: "#f472b6",
  accent: "#22d3ee",
  nodes: "#facc15",
  nodeOutline: "rgba(14, 116, 144, 0.65)",
  glow: "rgba(56, 189, 248, 0.35)",
  text: "#0f172a",
  tagline: "rgba(30, 41, 59, 0.7)",
};

const DARK_COLORS = {
  glyphStart: "#38bdf8",
  glyphMid: "#a855f7",
  glyphEnd: "#facc15",
  accent: "#22d3ee",
  nodes: "#fbbf24",
  nodeOutline: "rgba(125, 211, 252, 0.55)",
  glow: "rgba(59, 130, 246, 0.45)",
  text: "#f8fafc",
  tagline: "rgba(226, 232, 240, 0.65)",
};

export default function LogoWordmark({ variant = "light", className, ...props }) {
  const gradientId = useId();
  const colors = variant === "dark" ? DARK_COLORS : LIGHT_COLORS;

  return (
    <svg
      viewBox="0 0 560 200"
      width="380"
      height="140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${gradientId}-title`}
      focusable="false"
      className={className}
      {...props}
    >
      <title id={`${gradientId}-title`}>Artifically</title>
      <defs>
        <linearGradient
          id={`${gradientId}-primary`}
          x1="40"
          y1="180"
          x2="420"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.glyphStart} />
          <stop offset="55%" stopColor={colors.glyphMid} />
          <stop offset="100%" stopColor={colors.glyphEnd} />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-stroke`}
          x1="60"
          y1="40"
          x2="400"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.glyphEnd} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-inner`}
          x1="70"
          y1="60"
          x2="390"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.75" />
          <stop offset="40%" stopColor={colors.glyphMid} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors.glyphEnd} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`${gradientId}-node`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="45%" stopColor={colors.nodes} stopOpacity="0.95" />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={colors.glow} floodOpacity="1" />
        </filter>
        <filter id={`${gradientId}-inner-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.09 0 0 0 0 0.23 0 0 0 0 0.35 0 0 0 0.6 0"
          />
        </filter>
      </defs>
      <g transform="translate(10 10)">
        <g filter={`url(#${gradientId}-glow)`} opacity="0.85">
          <path
            d="M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z"
            fill={`url(#${gradientId}-primary)`}
          />
        </g>
        <path
          d="M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z"
          fill="none"
          stroke={`url(#${gradientId}-stroke)`}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M116 66c22-30 60-30 82 0l12 16 12-16c22-30 60-30 82 0 18 24 18 54 0 78-22 30-60 30-82 0l-12-16-12 16c-22 30-60 30-82 0-18-24-18-54 0-78Z"
          fill={`url(#${gradientId}-inner)`}
          opacity="0.92"
        />
        <path
          d="M78 110c14-32 46-52 82-52 22 0 44 8 62 22"
          fill="none"
          stroke={colors.accent}
          strokeOpacity="0.6"
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${gradientId}-inner-glow)`}
        />
        <path
          d="M342 110c-14 32-46 52-82 52-22 0-44-8-62-22"
          fill="none"
          stroke={colors.glyphEnd}
          strokeOpacity="0.6"
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${gradientId}-inner-glow)`}
        />
        {[{ cx: 110, cy: 60 }, { cx: 110, cy: 160 }, { cx: 310, cy: 60 }, { cx: 310, cy: 160 }, { cx: 210, cy: 86 }, { cx: 210, cy: 140 }].map(
          ({ cx, cy }, index) => (
            <g key={index} transform={`translate(${cx} ${cy})`}>
              <circle r="16" fill={`url(#${gradientId}-node)`} opacity="0.9" />
              <circle r="18" fill="none" stroke={colors.nodeOutline} strokeWidth="1.5" strokeOpacity="0.6" />
            </g>
          ),
        )}
        <g transform="translate(280 58)">
          <text
            x="0"
            y="0"
            fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
            fontSize="38"
            fontWeight="700"
            letterSpacing="0.06em"
            fill={colors.text}
          >
            ARTIFICALLY
          </text>
          <rect x="0" y="12" width="260" height="2" fill={colors.accent} opacity="0.5" />
          <text
            x="0"
            y="52"
            fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
            fontSize="16"
            letterSpacing="0.32em"
            fontWeight="600"
            fill={colors.tagline}
          >
            AUTOMATION INTELLIGENCE
          </text>
        </g>
      </g>
    </svg>
  );
}