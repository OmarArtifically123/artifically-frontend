import { useId } from "react";

const LIGHT_COLORS = {
  glyphStart: "#38bdf8",
  glyphEnd: "#6366f1",
  text: "#0f172a",
  tagline: "rgba(30, 41, 59, 0.7)",
};

const DARK_COLORS = {
  glyphStart: "#60a5fa",
  glyphEnd: "#a855f7",
  text: "#f8fafc",
  tagline: "rgba(226, 232, 240, 0.65)",
};

export default function LogoWordmark({ variant = "light", className, ...props }) {
  const gradientId = useId();
  const colors = variant === "dark" ? DARK_COLORS : LIGHT_COLORS;

  return (
    <svg
      viewBox="0 0 220 48"
      width="164"
      height="48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${gradientId}-title`}
      focusable="false"
      className={className}
      {...props}
    >
      <title id={`${gradientId}-title`}>Artifically</title>
      <defs>
        <linearGradient id={`${gradientId}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.glyphStart} />
          <stop offset="100%" stopColor={colors.glyphEnd} />
        </linearGradient>
      </defs>
      <g transform="translate(6 4)">
        <path
          d="M28.8 0.5c-1.4 0-2.6 0.7-3.3 1.9l-8.4 15.4-4.6-8.4C11.8 7.2 10.6 6.5 9.2 6.5H2.8c-2.1 0-3.4 2.3-2.4 4.1l11.1 19.8c0.7 1.2 1.9 1.9 3.3 1.9h6.4c1.4 0 2.6-0.7 3.3-1.9L35.6 4.6C36.5 2.8 35.2 0.5 33.1 0.5z"
          fill={`url(#${gradientId}-gradient)`}
        />
        <path
          d="M59.2 32h-6.8V10.6h6.8zm15.5-17.6h-5.2V32h-6.8V14.4h-5.2V10.6h17.1zm3.3-0.2c2.6 0 4.7 0.6 6.1 1.7 1.5 1.1 2.2 2.7 2.2 4.8v0.4c0 2.4-1.2 4.1-3.7 5.1l4.7 8.2h-7.3l-3.8-7.2h-1.9V32H66.7V10.6zm-1.5 4.4h-3.3v4.7h3.3c1.2 0 1.8-0.5 1.8-1.6v-1.6c0-1.1-0.6-1.5-1.8-1.5zm26.2-4.6c2.6 0 4.6 0.6 5.9 1.9 1.3 1.3 2 3.1 2 5.5V32h-6.6v-1.7c-1.1 1.4-2.7 2.1-4.9 2.1-2.1 0-3.7-0.5-4.9-1.5-1.2-1-1.8-2.4-1.8-4.3 0-3.6 2.5-5.6 7.6-6.1l3.5-0.4v-0.3c0-1.4-0.6-2.1-1.8-2.1-1.2 0-2 0.7-2.3 2h-6.4c0.2-2.1 1-3.7 2.6-4.8 1.6-1.1 3.6-1.6 6.1-1.6zm-1 13.9c1.1 0 1.9-0.3 2.6-0.9 0.7-0.6 1-1.4 1-2.4v-0.5l-2.4 0.3c-1.7 0.2-2.5 0.9-2.5 2 0 1 0.4 1.5 1.3 1.5zm30.6-9.1h-4.6V32h-6.8V18.7h-4.6v-4.3h4.6v-2.1c0-2.4 0.8-4.2 2.3-5.5 1.5-1.3 3.5-2 6.1-2 1.6 0 3.1 0.2 4.5 0.7l-1.4 4.6c-0.7-0.2-1.3-0.3-1.9-0.3-0.9 0-1.5 0.2-1.9 0.7-0.4 0.4-0.6 1.1-0.6 1.9v1.3h4.6zM150 9.9c2.8 0 4.9 0.7 6.3 2.1 1.4 1.4 2.1 3.4 2.1 6.1V32h-6.8V18.4c0-1.5-0.3-2.6-0.9-3.3-0.6-0.7-1.5-1.1-2.6-1.1-1.2 0-2 0.4-2.7 1.1-0.6 0.7-0.9 1.8-0.9 3.2V32h-6.8V18.4c0-1.5-0.3-2.6-0.9-3.3-0.6-0.7-1.5-1.1-2.6-1.1-1.1 0-2 0.4-2.6 1.1-0.6 0.7-0.9 1.8-0.9 3.2V32h-6.8V10.6h6.5v1.8c1.2-1.6 3-2.4 5.4-2.4 2.5 0 4.4 0.9 5.6 2.7 1.4-1.8 3.4-2.7 6-2.7zM180.7 6v7.1h-6.8V6zm0 4.6V32h-6.8V10.6z"
          fill={colors.text}
        />
        <text
          x="46"
          y="40"
          fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="10"
          letterSpacing="0.34em"
          fontWeight="600"
          fill={colors.tagline}
        >
          AUTOMATION
        </text>
      </g>
    </svg>
  );
}