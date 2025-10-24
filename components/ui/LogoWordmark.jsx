"use client";

import { useId } from "react";

// DARK THEME: Mysterious, glowing, deep space aesthetic with aurora effects
const DARK_COLORS = {
  // Deep space colors with mystical glow
  primary: "#38bdf8", // Bright cyan
  secondary: "#a855f7", // Deep purple
  tertiary: "#fde68a", // Golden yellow
  accent: "#22d3ee", // Electric cyan
  glow: "#7c3aed", // Violet glow
  aura: "rgba(147, 51, 234, 0.4)", // Purple aura
  nebula: "rgba(56, 189, 248, 0.3)", // Cyan nebula
  textPrimary: "#f8fafc", // Almost white
  textGlow: "#bae6fd", // Light cyan
  bgDeep: "#050510", // Deep space
};

// LIGHT THEME: Bright, professional, modern aesthetic with vibrant energy
const LIGHT_COLORS = {
  // Vibrant professional colors
  primary: "#1f7eff", // Professional blue
  secondary: "#7c3aed", // Royal purple
  tertiary: "#f59e0b", // Warm amber
  accent: "#0ea5e9", // Sky blue
  glow: "#ec4899", // Pink energy
  aura: "rgba(31, 126, 255, 0.2)", // Blue aura
  nebula: "rgba(124, 58, 237, 0.15)", // Purple tint
  textPrimary: "#000000", // Pure black
  textGlow: "#165fd7", // Deep blue
  bgDeep: "#ffffff", // Pure white
};

// CONTRAST THEME: Sharp, electric, neon aesthetic with maximum impact
const CONTRAST_COLORS = {
  // Electric neon colors with maximum contrast
  primary: "#00eaff", // Electric cyan
  secondary: "#ff00ff", // Neon magenta
  tertiary: "#ffff00", // Bright yellow
  accent: "#00ffe0", // Neon teal
  glow: "#ff00ff", // Magenta glow
  aura: "rgba(0, 234, 255, 0.6)", // Strong cyan aura
  nebula: "rgba(255, 0, 255, 0.5)", // Strong magenta
  textPrimary: "#ffffff", // Pure white
  textGlow: "#00eaff", // Electric cyan
  bgDeep: "#000000", // Pure black
};

const WORDMARK_WIDTH = 300;

// DARK THEME DESIGN: Infinity loop with particle effects
function DarkThemeLogo({ colors, getId }) {
  const INFINITY_PATH =
    "M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z";

  const ORBIT_RINGS = [
    { rx: 168, ry: 88, rotation: -12, opacity: 0.6 },
    { rx: 184, ry: 96, rotation: 18, opacity: 0.45 },
    { rx: 206, ry: 112, rotation: -28, opacity: 0.35 },
  ];

  const STARS = [
    { x: 74, y: 46, scale: 1.1 },
    { x: 156, y: 24, scale: 0.85 },
    { x: 224, y: 152, scale: 0.95 },
    { x: 302, y: 44, scale: 1.2 },
    { x: 354, y: 144, scale: 0.9 },
  ];

  return (
    <g transform="translate(32 26)">
      {/* Orbit rings */}
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
            stroke={colors.aura.replace('0.4)', '0.6)')}
            strokeWidth="1.6"
            strokeDasharray="8 18"
            strokeLinecap="round"
            opacity={opacity}
          />
        ))}
      </g>

      {/* Infinity loop with glow */}
      <g filter={`url(#${getId("outer-glow")})`}>
        <path d={INFINITY_PATH} fill={`url(#${getId("primary-gradient")})`} />
      </g>

      {/* Inner effects */}
      <g clipPath={`url(#${getId("loop-clip")})`}>
        <path d={INFINITY_PATH} fill={`url(#${getId("depth-gradient")})`} opacity="0.75" />
        <ellipse cx="210" cy="108" rx="92" ry="54" fill={`url(#${getId("aura-gradient")})`} opacity="0.6" />
      </g>

      {/* Stroke with glow */}
      <path
        d={INFINITY_PATH}
        fill="none"
        stroke={`url(#${getId("stroke-gradient")})`}
        strokeWidth="6"
        strokeLinejoin="round"
        filter={`url(#${getId("stroke-glow")})`}
      />

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
          <circle r="18" fill={`url(#${getId("node-gradient")})`} opacity="0.95" />
          <circle r="22" fill="none" stroke={colors.accent} strokeWidth="2" strokeOpacity="0.7" />
          <circle r="6" fill="#fff" opacity="0.9" />
        </g>
      ))}

      {/* Stars */}
      {STARS.map(({ x, y, scale }, index) => (
        <g key={index} transform={`translate(${x} ${y}) scale(${scale})`} filter={`url(#${getId("sparkle")})`} opacity="0.9">
          <circle r="8" fill={`url(#${getId("spark-gradient")})`} />
          <path d="M0 -7L0 7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M-7 0L7 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

// LIGHT THEME DESIGN: Geometric crystal with energy rays
function LightThemeLogo({ colors, getId }) {
  const CRYSTAL_PATH = "M210 20 L310 110 L210 200 L110 110 Z";
  const OUTER_CRYSTAL = "M210 10 L330 110 L210 210 L90 110 Z";

  const ENERGY_RAYS = [
    { x1: 210, y1: 20, x2: 210, y2: -10, width: 3 },
    { x1: 310, y1: 110, x2: 340, y2: 110, width: 3 },
    { x1: 210, y1: 200, x2: 210, y2: 230, width: 3 },
    { x1: 110, y1: 110, x2: 80, y2: 110, width: 3 },
  ];

  const ORBITING_DOTS = [
    { angle: 0, radius: 110 },
    { angle: 90, radius: 110 },
    { angle: 180, radius: 110 },
    { angle: 270, radius: 110 },
  ];

  return (
    <g transform="translate(32 26)">
      {/* Energy rays */}
      {ENERGY_RAYS.map(({ x1, y1, x2, y2, width }, index) => (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={`url(#${getId("ray-gradient")})`}
          strokeWidth={width}
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      {/* Outer crystal glow */}
      <path
        d={OUTER_CRYSTAL}
        fill="none"
        stroke={colors.aura.replace('0.2)', '0.4)')}
        strokeWidth="2"
        strokeDasharray="10 8"
        opacity="0.6"
      />

      {/* Main crystal with gradient */}
      <path
        d={CRYSTAL_PATH}
        fill={`url(#${getId("crystal-gradient")})`}
        filter={`url(#${getId("crystal-glow")})`}
      />

      {/* Crystal facets */}
      <g opacity="0.4">
        <line x1="210" y1="20" x2="210" y2="200" stroke="#fff" strokeWidth="1" />
        <line x1="110" y1="110" x2="310" y2="110" stroke="#fff" strokeWidth="1" />
        <line x1="160" y1="65" x2="260" y2="155" stroke="#fff" strokeWidth="0.8" />
        <line x1="260" y1="65" x2="160" y2="155" stroke="#fff" strokeWidth="0.8" />
      </g>

      {/* Crystal stroke */}
      <path
        d={CRYSTAL_PATH}
        fill="none"
        stroke={`url(#${getId("crystal-stroke")})`}
        strokeWidth="5"
        strokeLinejoin="miter"
      />

      {/* Orbiting energy dots */}
      {ORBITING_DOTS.map(({ angle, radius }, index) => {
        const rad = (angle * Math.PI) / 180;
        const x = 210 + Math.cos(rad) * radius;
        const y = 110 + Math.sin(rad) * radius;
        return (
          <g key={index} transform={`translate(${x} ${y})`}>
            <circle r="12" fill={`url(#${getId("energy-dot")})`} opacity="0.9" />
            <circle r="15" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.5" />
          </g>
        );
      })}

      {/* Center core */}
      <circle cx="210" cy="110" r="20" fill={`url(#${getId("core-gradient")})`} opacity="0.95" />
      <circle cx="210" cy="110" r="8" fill="#fff" opacity="0.9" />
    </g>
  );
}

// CONTRAST THEME DESIGN: Sharp hexagon with electric bolts
function ContrastThemeLogo({ colors, getId }) {
  const HEXAGON_PATH = "M210 30 L290 90 L290 150 L210 210 L130 150 L130 90 Z";
  const OUTER_HEX = "M210 20 L300 85 L300 155 L210 220 L120 155 L120 85 Z";

  const LIGHTNING_BOLTS = [
    { d: "M210 30 L200 80 L210 80 L200 120" },
    { d: "M290 90 L270 110 L280 110 L260 140" },
    { d: "M290 150 L270 140 L280 130 L260 110" },
    { d: "M210 210 L220 170 L210 170 L220 140" },
    { d: "M130 150 L150 140 L140 130 L160 110" },
    { d: "M130 90 L150 110 L140 110 L160 140" },
  ];

  const CORNER_NODES = [
    { x: 210, y: 30 },
    { x: 290, y: 90 },
    { x: 290, y: 150 },
    { x: 210, y: 210 },
    { x: 130, y: 150 },
    { x: 130, y: 90 },
  ];

  return (
    <g transform="translate(32 26)">
      {/* Electric aura */}
      <path
        d={OUTER_HEX}
        fill="none"
        stroke={colors.aura.replace('0.6)', '0.8)')}
        strokeWidth="4"
        strokeLinejoin="miter"
        opacity="0.8"
      />

      {/* Lightning bolts */}
      {LIGHTNING_BOLTS.map(({ d }, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          stroke={index % 2 === 0 ? colors.primary : colors.secondary}
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.9"
          filter={`url(#${getId("lightning-glow")})`}
        />
      ))}

      {/* Main hexagon with sharp gradient */}
      <path
        d={HEXAGON_PATH}
        fill={`url(#${getId("hex-gradient")})`}
        filter={`url(#${getId("hex-glow")})`}
      />

      {/* Inner electric lines */}
      <g opacity="0.7">
        <line x1="210" y1="30" x2="210" y2="210" stroke={colors.tertiary} strokeWidth="2" />
        <line x1="130" y1="90" x2="290" y2="150" stroke={colors.primary} strokeWidth="1.5" />
        <line x1="290" y1="90" x2="130" y2="150" stroke={colors.secondary} strokeWidth="1.5" />
      </g>

      {/* Hexagon sharp stroke */}
      <path
        d={HEXAGON_PATH}
        fill="none"
        stroke={`url(#${getId("hex-stroke")})`}
        strokeWidth="6"
        strokeLinejoin="miter"
      />

      {/* Corner nodes with electric effect */}
      {CORNER_NODES.map(({ x, y }, index) => (
        <g key={index} transform={`translate(${x} ${y})`}>
          <circle r="15" fill={colors.primary} opacity="0.3" />
          <polygon
            points="0,-10 8,0 0,10 -8,0"
            fill={index % 2 === 0 ? colors.primary : colors.secondary}
            stroke="#fff"
            strokeWidth="2"
          />
        </g>
      ))}

      {/* Center electric core */}
      <polygon
        points="210,95 225,110 210,125 195,110"
        fill={colors.tertiary}
        stroke={colors.primary}
        strokeWidth="3"
      />
      <circle cx="210" cy="110" r="6" fill="#fff" />
    </g>
  );
}

export default function LogoWordmark({ variant = "light", className, ...props }) {
  const uniqueId = useId();
  const getId = (suffix) => `${uniqueId}-${suffix}`;

  // Select color palette based on theme
  const colors = variant === "contrast" ? CONTRAST_COLORS : variant === "dark" ? DARK_COLORS : LIGHT_COLORS;

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
      <title id={getId("title")}>Artifically logo</title>
      <defs>
        {/* DARK THEME GRADIENTS */}
        {variant === "dark" && (
          <>
            <linearGradient id={getId("primary-gradient")} x1="28" y1="208" x2="360" y2="16">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="48%" stopColor={colors.secondary} />
              <stop offset="96%" stopColor={colors.tertiary} />
            </linearGradient>
            <linearGradient id={getId("depth-gradient")} x1="36" y1="196" x2="330" y2="28">
              <stop offset="0%" stopColor="rgba(15, 23, 42, 0.45)" />
              <stop offset="50%" stopColor="rgba(124, 58, 237, 0.2)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.3)" />
            </linearGradient>
            <linearGradient id={getId("stroke-gradient")} x1="68" y1="40" x2="420" y2="196">
              <stop offset="0%" stopColor={colors.accent} stopOpacity="0.9" />
              <stop offset="50%" stopColor={colors.glow} />
              <stop offset="100%" stopColor={colors.tertiary} />
            </linearGradient>
            <radialGradient id={getId("aura-gradient")} cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="40%" stopColor={colors.nebula} />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
            <radialGradient id={getId("node-gradient")} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="50%" stopColor={colors.accent} />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
            <radialGradient id={getId("spark-gradient")} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="60%" stopColor={colors.tertiary} stopOpacity="0.7" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
            <filter id={getId("outer-glow")} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.22 0 0 0 0 0.74 0 0 0 0 0.97 0 0 0 0.7 0" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={getId("stroke-glow")} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={colors.glow} floodOpacity="0.9" />
            </filter>
            <filter id={getId("sparkle")} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <clipPath id={getId("loop-clip")}>
              <path d="M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z" />
            </clipPath>
          </>
        )}

        {/* LIGHT THEME GRADIENTS */}
        {variant === "light" && (
          <>
            <linearGradient id={getId("crystal-gradient")} x1="110" y1="20" x2="310" y2="200">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.accent} />
            </linearGradient>
            <linearGradient id={getId("crystal-stroke")} x1="110" y1="110" x2="310" y2="110">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.glow} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
            <linearGradient id={getId("ray-gradient")} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
              <stop offset="50%" stopColor={colors.accent} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0" />
            </linearGradient>
            <radialGradient id={getId("energy-dot")} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="50%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.accent} />
            </radialGradient>
            <radialGradient id={getId("core-gradient")} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="70%" stopColor={colors.tertiary} />
              <stop offset="100%" stopColor={colors.glow} />
            </radialGradient>
            <filter id={getId("crystal-glow")} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={colors.primary} floodOpacity="0.6" />
            </filter>
          </>
        )}

        {/* CONTRAST THEME GRADIENTS */}
        {variant === "contrast" && (
          <>
            <linearGradient id={getId("hex-gradient")} x1="130" y1="30" x2="290" y2="210">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.primary} />
            </linearGradient>
            <linearGradient id={getId("hex-stroke")} x1="120" y1="120" x2="300" y2="120">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="33%" stopColor={colors.tertiary} />
              <stop offset="66%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.accent} />
            </linearGradient>
            <filter id={getId("hex-glow")} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={colors.primary} floodOpacity="0.9" />
            </filter>
            <filter id={getId("lightning-glow")} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fff" floodOpacity="0.9" />
            </filter>
          </>
        )}

        {/* TEXT GRADIENTS (all themes) */}
        <linearGradient id={getId("text-gradient")} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor={colors.textPrimary} />
          <stop offset="50%" stopColor={colors.textGlow} />
          <stop offset="100%" stopColor={colors.textPrimary} />
        </linearGradient>
        <filter id={getId("text-glow")} x="-20%" y="-60%" width="140%" height="220%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor={colors.textGlow} floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Render theme-specific logo */}
      {variant === "dark" && <DarkThemeLogo colors={colors} getId={getId} />}
      {variant === "light" && <LightThemeLogo colors={colors} getId={getId} />}
      {variant === "contrast" && <ContrastThemeLogo colors={colors} getId={getId} />}

      {/* ARTIFICALLY text (all themes) */}
      <g transform="translate(320 78)" filter={`url(#${getId("text-glow")})`}>
        <text
          x="0"
          y="0"
          fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="40"
          fontWeight="800"
          fill={`url(#${getId("text-gradient")})`}
          stroke={variant === "contrast" ? colors.textPrimary : "none"}
          strokeWidth={variant === "contrast" ? "0.5" : "0"}
          textLength={WORDMARK_WIDTH}
          lengthAdjust="spacingAndGlyphs"
        >
          ARTIFICALLY
        </text>

        {/* Underline */}
        <rect
          x="0"
          y="12"
          width={WORDMARK_WIDTH}
          height={variant === "contrast" ? "4" : "3"}
          fill={variant === "contrast" ? colors.tertiary : colors.textGlow}
          opacity={variant === "contrast" ? "1" : "0.6"}
          rx="1.5"
        />

        {/* Tagline */}
        <text
          x="0"
          y="50"
          fontFamily="var(--font-sans, 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="13"
          fontWeight="600"
          letterSpacing="0.38em"
          fill={colors.textPrimary}
          opacity={variant === "contrast" ? "1" : "0.75"}
        >
          AUTOMATION • INTELLIGENCE • ORCHESTRATION
        </text>
      </g>
    </svg>
  );
}
