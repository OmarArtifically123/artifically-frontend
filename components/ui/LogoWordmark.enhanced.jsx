"use client";

import { useId } from "react";

const WORDMARK_WIDTH = 380;

// ENHANCED INFINITY SYMBOL with premium detailing
const INFINITY_PATH =
  "M210 86C184 50 151 28 110 28 64 28 28 64 28 110s36 82 82 82c41 0 74-22 100-58 26 36 59 58 100 58 46 0 82-36 82-82s-36-82-82-82c-41 0-74 22-100 58Z";

// Additional path for 3D depth effect
const INFINITY_DEPTH_PATH =
  "M210 90C186 56 155 36 116 36 73 36 36 73 36 116s37 80 80 80c39 0 70-20 94-54 24 34 55 54 94 54 43 0 80-37 80-80s-37-80-80-80c-39 0-70 20-94 54Z";

// Inner glow path
const INFINITY_INNER_PATH =
  "M210 96C190 68 165 52 134 52 98 52 68 82 68 118s30 66 66 66c31 0 56-16 76-44 20 28 45 44 76 44 36 0 66-30 66-66s-30-66-66-66c-31 0-56 16-76 44Z";

// Premium orbit rings with varied geometries
const ORBIT_RINGS = [
  { rx: 172, ry: 90, rotation: -10, opacity: 0.75, strokeDash: "8 16" },
  { rx: 188, ry: 98, rotation: 15, opacity: 0.6, strokeDash: "12 20" },
  { rx: 210, ry: 116, rotation: -25, opacity: 0.45, strokeDash: "6 18" },
  { rx: 234, ry: 130, rotation: 32, opacity: 0.3, strokeDash: "10 22" },
];

// Enhanced star coordinates with rotation
const STAR_COORDS = [
  { x: 74, y: 46, scale: 1.2, rotation: 15 },
  { x: 156, y: 24, scale: 0.95, rotation: -30 },
  { x: 224, y: 152, scale: 1.05, rotation: 45 },
  { x: 302, y: 44, scale: 1.35, rotation: -15 },
  { x: 354, y: 144, scale: 1.0, rotation: 60 },
  { x: 48, y: 136, scale: 0.8, rotation: -45 },
  { x: 372, y: 88, scale: 0.9, rotation: 30 },
];

// Enhanced data streams with bezier curves
const DATA_STREAMS = [
  {
    d: "M66 126c18 11 36 19 56 23 20 4 40 5 60 1 24-5 46-16 64-33",
    strokeWidth: 2.2,
    opacity: 0.7,
  },
  {
    d: "M82 88c11-17 26-31 44-40 18-9 38-13 58-11 20 2 39 10 55 23 16 13 28 30 37 49",
    strokeWidth: 1.8,
    opacity: 0.55,
  },
  {
    d: "M132 58c9-6 19-11 29-14 10-3 20-4 30-3 10 1 20 4 29 9 9 5 17 12 24 20",
    strokeWidth: 1.5,
    opacity: 0.4,
  },
];

// Energy particles for premium effect
const ENERGY_PARTICLES = [
  { cx: 90, cy: 74, r: 3, delay: 0 },
  { cx: 140, cy: 52, r: 2.5, delay: 0.3 },
  { cx: 180, cy: 110, r: 4, delay: 0.6 },
  { cx: 240, cy: 68, r: 3.5, delay: 0.9 },
  { cx: 290, cy: 138, r: 2.8, delay: 1.2 },
  { cx: 330, cy: 94, r: 3.2, delay: 1.5 },
];

// Premium theme colors with sophisticated gradients
function getThemeColors(variant) {
  if (variant === "contrast") {
    // HIGH CONTRAST: Maximum impact, electric energy, perfect accessibility
    return {
      // Infinity symbol gradients
      glyphStart: "#00ffff",
      glyphMid: "#80ffff",
      glyphEnd: "#ffffff",
      glyphAccent: "#00e5ff",
      
      // Depth and dimension
      depthDark: "rgba(0, 0, 0, 0.95)",
      depthMid: "rgba(0, 240, 255, 0.35)",
      depthLight: "rgba(0, 255, 255, 0.25)",
      depthHighlight: "rgba(255, 255, 255, 0.6)",
      
      // Effects and accents
      accent: "#00ffff",
      nodes: "#00ffff",
      nodeCore: "#ffffff",
      nodeOutline: "rgba(0, 255, 255, 1)",
      
      // Atmospheric effects
      aurora: "rgba(0, 240, 255, 0.75)",
      plasma: "rgba(0, 200, 255, 0.6)",
      energy: "#00ffff",
      
      // Grid and patterns
      grid: "#00ffff",
      gridOpacity: 0.7,
      
      // Typography
      textGradientStart: "#ffffff",
      textGradientMid: "#00ffff",
      textGradientEnd: "#ffffff",
      textOutline: "rgba(0, 240, 255, 0.8)",
      textShadow: "rgba(0, 255, 255, 0.9)",
      
      // Tagline
      tagline: "#ffffff",
      taglineGlow: "rgba(0, 240, 255, 0.5)",
      
      // Glows and shadows
      primaryGlow: "#00ffff",
      secondaryGlow: "#00e5ff",
      shadowColor: "rgba(0, 240, 255, 0.8)",
      
      // Metallic effects
      metallic: "rgba(255, 255, 255, 0.9)",
      metallicDark: "rgba(0, 200, 255, 0.8)",
    };
  } else if (variant === "light") {
    // LIGHT MODE: Professional, sophisticated, premium feel
    return {
      // Infinity symbol gradients
      glyphStart: "#0066ff",
      glyphMid: "#8b5cf6",
      glyphEnd: "#ec4899",
      glyphAccent: "#0ea5e9",
      
      // Depth and dimension
      depthDark: "rgba(255, 255, 255, 0.6)",
      depthMid: "rgba(139, 92, 246, 0.2)",
      depthLight: "rgba(14, 165, 233, 0.25)",
      depthHighlight: "rgba(255, 255, 255, 0.9)",
      
      // Effects and accents
      accent: "#0ea5e9",
      nodes: "#f59e0b",
      nodeCore: "#ffffff",
      nodeOutline: "rgba(14, 165, 233, 0.75)",
      
      // Atmospheric effects
      aurora: "rgba(14, 165, 233, 0.4)",
      plasma: "rgba(139, 92, 246, 0.35)",
      energy: "#0ea5e9",
      
      // Grid and patterns
      grid: "rgba(15, 23, 42, 0.2)",
      gridOpacity: 0.45,
      
      // Typography
      textGradientStart: "#0f172a",
      textGradientMid: "#0066ff",
      textGradientEnd: "#8b5cf6",
      textOutline: "rgba(14, 165, 233, 0.25)",
      textShadow: "rgba(0, 102, 255, 0.4)",
      
      // Tagline
      tagline: "rgba(15, 23, 42, 0.85)",
      taglineGlow: "rgba(14, 165, 233, 0.3)",
      
      // Glows and shadows
      primaryGlow: "rgba(14, 165, 233, 0.6)",
      secondaryGlow: "rgba(139, 92, 246, 0.5)",
      shadowColor: "rgba(0, 102, 255, 0.4)",
      
      // Metallic effects
      metallic: "rgba(255, 255, 255, 0.95)",
      metallicDark: "rgba(14, 165, 233, 0.4)",
    };
  } else {
    // DARK MODE: Cosmic, mysterious, captivating depth
    return {
      // Infinity symbol gradients
      glyphStart: "#38bdf8",
      glyphMid: "#a855f7",
      glyphEnd: "#fde68a",
      glyphAccent: "#22d3ee",
      
      // Depth and dimension
      depthDark: "rgba(15, 23, 42, 0.6)",
      depthMid: "rgba(139, 92, 246, 0.3)",
      depthLight: "rgba(56, 189, 248, 0.35)",
      depthHighlight: "rgba(253, 230, 138, 0.4)",
      
      // Effects and accents
      accent: "#22d3ee",
      nodes: "#fbbf24",
      nodeCore: "#fef3c7",
      nodeOutline: "rgba(34, 211, 238, 0.7)",
      
      // Atmospheric effects
      aurora: "rgba(14, 165, 233, 0.45)",
      plasma: "rgba(168, 85, 247, 0.35)",
      energy: "#22d3ee",
      
      // Grid and patterns
      grid: "rgba(148, 163, 184, 0.25)",
      gridOpacity: 0.4,
      
      // Typography
      textGradientStart: "#f8fafc",
      textGradientMid: "#bae6fd",
      textGradientEnd: "#22d3ee",
      textOutline: "rgba(34, 211, 238, 0.5)",
      textShadow: "rgba(34, 211, 238, 0.6)",
      
      // Tagline
      tagline: "rgba(226, 232, 240, 0.75)",
      taglineGlow: "rgba(34, 211, 238, 0.3)",
      
      // Glows and shadows
      primaryGlow: "rgba(59, 130, 246, 0.7)",
      secondaryGlow: "rgba(168, 85, 247, 0.6)",
      shadowColor: "rgba(34, 211, 238, 0.5)",
      
      // Metallic effects
      metallic: "rgba(253, 230, 138, 0.7)",
      metallicDark: "rgba(56, 189, 248, 0.5)",
    };
  }
}

export default function LogoWordmarkEnhanced({ variant = "light", className = "", animated = true, ...props }) {
  const uniqueId = useId();
  const getId = (suffix) => `${uniqueId}-${suffix}`;
  const colors = getThemeColors(variant);

  return (
    <svg
      viewBox="0 0 680 240"
      width="460"
      height="180"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={getId("title")}
      focusable="false"
      className={className}
      suppressHydrationWarning
      {...props}
    >
      <title id={getId("title")}>Artifically - AI Automation Marketplace</title>
      
      <defs>
        {/* PREMIUM GRADIENTS - Multi-stop sophisticated color transitions */}
        
        {/* Primary infinity gradient with 5 stops for smooth transitions */}
        <linearGradient id={getId("primary")} x1="0%" y1="100%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.glyphStart} />
          <stop offset="25%" stopColor={colors.glyphStart} />
          <stop offset="50%" stopColor={colors.glyphMid} />
          <stop offset="75%" stopColor={colors.glyphEnd} />
          <stop offset="100%" stopColor={colors.glyphEnd} />
        </linearGradient>

        {/* Diagonal gradient for dramatic effect */}
        <linearGradient id={getId("diagonal")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.glyphStart} stopOpacity="0.9" />
          <stop offset="33%" stopColor={colors.glyphMid} />
          <stop offset="66%" stopColor={colors.glyphAccent} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors.glyphEnd} />
        </linearGradient>

        {/* Depth gradient for 3D effect */}
        <linearGradient id={getId("depth")} x1="20%" y1="90%" x2="80%" y2="10%">
          <stop offset="0%" stopColor={colors.depthDark} />
          <stop offset="35%" stopColor={colors.depthMid} />
          <stop offset="70%" stopColor={colors.depthLight} />
          <stop offset="100%" stopColor={colors.depthHighlight} />
        </linearGradient>

        {/* Metallic shine gradient */}
        <linearGradient id={getId("metallic")} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.metallic} stopOpacity="0" />
          <stop offset="30%" stopColor={colors.metallic} stopOpacity="0.85" />
          <stop offset="70%" stopColor={colors.metallicDark} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.metallic} stopOpacity="0" />
        </linearGradient>

        {/* Stroke gradient with enhanced depth */}
        <linearGradient id={getId("stroke")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.9" />
          <stop offset="25%" stopColor={colors.glyphStart} />
          <stop offset="50%" stopColor={colors.glyphMid} />
          <stop offset="75%" stopColor={colors.glyphEnd} />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0.85" />
        </linearGradient>

        {/* Premium sheen with sophisticated positioning */}
        <linearGradient id={getId("sheen")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="25%" stopColor={variant === "light" ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.25)"} />
          <stop offset="50%" stopColor={variant === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.7)"} />
          <stop offset="75%" stopColor={variant === "light" ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.25)"} />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        {/* RADIAL GRADIENTS for depth and dimension */}
        
        {/* Enhanced aura with multiple color stops */}
        <radialGradient id={getId("aura")} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={variant === "contrast" ? "#ffffff" : "rgba(255, 255, 255, 0.9)"} stopOpacity="0.95" />
          <stop offset="25%" stopColor={colors.glyphMid} stopOpacity="0.6" />
          <stop offset="50%" stopColor={colors.plasma} stopOpacity="0.4" />
          <stop offset="75%" stopColor={colors.aurora} stopOpacity="0.2" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" stopOpacity="0" />
        </radialGradient>

        {/* Premium node gradient */}
        <radialGradient id={getId("node")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.nodeCore} stopOpacity="1" />
          <stop offset="30%" stopColor={colors.nodes} stopOpacity="0.95" />
          <stop offset="60%" stopColor={colors.nodes} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors.nodes} stopOpacity="0" />
        </radialGradient>

        {/* Enhanced spark with energy */}
        <radialGradient id={getId("spark")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor={colors.nodes} stopOpacity="0.85" />
          <stop offset="70%" stopColor={colors.accent} stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" stopOpacity="0" />
        </radialGradient>

        {/* Energy particle gradient */}
        <radialGradient id={getId("energy")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.energy} stopOpacity="1" />
          <stop offset="50%" stopColor={colors.accent} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.energy} stopOpacity="0" />
        </radialGradient>

        {/* TEXT GRADIENTS - Premium typography effects */}
        
        {/* Main text gradient with sophisticated color flow */}
        <linearGradient id={getId("text")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.textGradientStart} />
          <stop offset="30%" stopColor={colors.textGradientMid} />
          <stop offset="50%" stopColor={colors.textGradientEnd} />
          <stop offset="70%" stopColor={colors.textGradientMid} />
          <stop offset="100%" stopColor={colors.textGradientStart} />
        </linearGradient>

        {/* Tagline highlight with subtle shimmer */}
        <linearGradient id={getId("tagline-highlight")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
          <stop offset="20%" stopColor={colors.taglineGlow} stopOpacity="0.3" />
          <stop offset="50%" stopColor={colors.taglineGlow} stopOpacity="0.6" />
          <stop offset="80%" stopColor={colors.taglineGlow} stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
        </linearGradient>

        {/* PATTERNS - Geometric sophistication */}
        
        {/* Enhanced grid with dual-layer complexity */}
        <pattern id={getId("grid")} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="skewX(-16)">
          <path 
            d="M0 0h16v16" 
            fill="none" 
            stroke={colors.grid} 
            strokeWidth={variant === "contrast" ? "1.8" : "1.2"} 
            opacity={colors.gridOpacity}
          />
          <path 
            d="M0 8h16 M8 0v16" 
            stroke={colors.grid} 
            strokeWidth={variant === "contrast" ? "1.2" : "0.8"} 
            opacity={colors.gridOpacity * 0.6}
          />
          <circle 
            cx="8" 
            cy="8" 
            r="1.5" 
            fill={colors.grid} 
            opacity={colors.gridOpacity * 0.5}
          />
        </pattern>

        {/* Hexagonal pattern for premium tech feel */}
        <pattern id={getId("hexagons")} width="20" height="17.32" patternUnits="userSpaceOnUse">
          <path 
            d="M10 0L18.66 5v10L10 20l-8.66-5V5z" 
            fill="none" 
            stroke={colors.grid} 
            strokeWidth="0.5" 
            opacity={colors.gridOpacity * 0.3}
          />
        </pattern>

        {/* CLIP PATHS */}
        
        {/* Main infinity clip */}
        <clipPath id={getId("loop-clip")}>
          <path d={INFINITY_PATH} />
        </clipPath>

        {/* Inner infinity clip for layering */}
        <clipPath id={getId("inner-clip")}>
          <path d={INFINITY_INNER_PATH} />
        </clipPath>

        {/* FILTERS - Professional visual effects */}
        
        {/* Outer glow with enhanced intensity */}
        <filter id={getId("outer-glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={variant === "contrast" ? "20" : "16"} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={
              variant === "contrast"
                ? "0 0 0 0 0 0 0 0 0 0.94 0 0 0 0 1 0 0 0 1 0"
                : variant === "light"
                ? "0 0 0 0 0.05 0 0 0 0 0.65 0 0 0 0 0.91 0 0 0 0.75 0"
                : "0 0 0 0 0.22 0 0 0 0 0.83 0 0 0 0 0.93 0 0 0 0.8 0"
            }
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Premium stroke glow */}
        <filter id={getId("stroke-glow")} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={variant === "contrast" ? "14" : "10"} result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={variant === "contrast" ? "6" : "4"} result="blur2" />
          <feColorMatrix in="blur1" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="glow1" />
          <feColorMatrix in="blur2" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.2 0" result="glow2" />
          <feMerge>
            <feMergeNode in="glow1" />
            <feMergeNode in="glow2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Sparkle effect for stars */}
        <filter id={getId("sparkle")} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feColorMatrix in="blur" type="saturate" values="1.5" result="saturated" />
          <feMerge>
            <feMergeNode in="saturated" />
            <feMergeNode in="saturated" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Text glow with premium depth */}
        <filter id={getId("text-glow")} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={variant === "contrast" ? "16" : "20"} result="blur" />
          <feColorMatrix 
            in="blur" 
            type="matrix" 
            values={
              variant === "contrast"
                ? "0 0 0 0 0  0 0 0 0 0.94  0 0 0 0 1  0 0 0 0.7 0"
                : variant === "light"
                ? "0 0 0 0 0  0 0 0 0 0.4  0 0 0 0 1  0 0 0 0.4 0"
                : "0 0 0 0 0.13  0 0 0 0 0.83  0 0 0 0 0.93  0 0 0 0.5 0"
            }
            result="coloredGlow"
          />
          <feMerge>
            <feMergeNode in="coloredGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop shadow for depth */}
        <filter id={getId("drop-shadow")} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow 
            dx="0" 
            dy={variant === "light" ? "8" : "6"} 
            stdDeviation={variant === "contrast" ? "12" : "10"} 
            floodColor={colors.shadowColor} 
            floodOpacity={variant === "contrast" ? "0.9" : "0.6"} 
          />
        </filter>

        {/* Energy pulse filter */}
        <filter id={getId("energy-pulse")} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* LOGO SYMBOL - Enhanced with premium details */}
      <g transform="translate(40 30)">
        
        {/* Background atmospheric glow */}
        <ellipse 
          cx="210" 
          cy="108" 
          rx="140" 
          ry="95" 
          fill={`url(#${getId("aura")})`} 
          opacity={variant === "contrast" ? "0.6" : "0.35"}
          filter={`url(#${getId("outer-glow")})`}
        />

        {/* Outer orbit rings - enhanced with premium styling */}
        <g opacity={variant === "contrast" ? "0.95" : "0.8"}>
          {ORBIT_RINGS.map(({ rx, ry, rotation, opacity, strokeDash }, index) => (
            <ellipse
              key={`orbit-${index}`}
              cx="210"
              cy="108"
              rx={rx}
              ry={ry}
              transform={`rotate(${rotation} 210 108)`}
              fill="none"
              stroke={`url(#${getId("stroke")})`}
              strokeWidth={variant === "contrast" ? "3" : "2"}
              strokeDasharray={strokeDash}
              strokeLinecap="round"
              opacity={opacity}
            />
          ))}
        </g>

        {/* 3D Depth layer - creates dimension */}
        <g opacity="0.4" filter={`url(#${getId("drop-shadow")})`}>
          <path 
            d={INFINITY_DEPTH_PATH} 
            fill={`url(#${getId("depth")})`}
          />
        </g>

        {/* Main infinity loop with premium glow */}
        <g filter={`url(#${getId("outer-glow")})`}>
          <path 
            d={INFINITY_PATH} 
            fill={`url(#${getId("primary")})`}
          />
        </g>

        {/* Inner effects (clipped to infinity shape) */}
        <g clipPath={`url(#${getId("loop-clip")})`}>
          {/* Depth gradient layer */}
          <path 
            d={INFINITY_PATH} 
            fill={`url(#${getId("depth")})`} 
            opacity="0.6" 
          />
          
          {/* Grid pattern overlay */}
          <rect 
            x="-30" 
            y="0" 
            width="480" 
            height="220" 
            fill={`url(#${getId("grid")})`} 
            opacity={variant === "contrast" ? "0.7" : "0.45"} 
          />
          
          {/* Hexagonal tech pattern */}
          <rect 
            x="-30" 
            y="0" 
            width="480" 
            height="220" 
            fill={`url(#${getId("hexagons")})`} 
            opacity="0.25" 
          />
          
          {/* Metallic sheen */}
          <rect 
            x="-50" 
            y="-20" 
            width="520" 
            height="260" 
            fill={`url(#${getId("sheen")})`} 
            transform="rotate(-18 210 108)" 
            opacity="0.7" 
          />
          
          {/* Secondary sheen for depth */}
          <rect 
            x="-50" 
            y="-20" 
            width="520" 
            height="260" 
            fill={`url(#${getId("sheen")})`} 
            transform="rotate(22 210 108)" 
            opacity="0.4" 
          />
        </g>

        {/* Premium infinity stroke with enhanced glow */}
        <path
          d={INFINITY_PATH}
          fill="none"
          stroke={`url(#${getId("stroke")})`}
          strokeWidth={variant === "contrast" ? "10" : "7"}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${getId("stroke-glow")})`}
        />

        {/* Inner light core */}
        <g clipPath={`url(#${getId("inner-clip")})`}>
          <path 
            d={INFINITY_INNER_PATH} 
            fill={`url(#${getId("metallic")})`}
            opacity="0.9"
          />
        </g>

        {/* Enhanced data streams */}
        {DATA_STREAMS.map(({ d, strokeWidth, opacity }, index) => (
          <g key={`stream-${index}`}>
            {/* Glow layer */}
            <path
              d={d}
              fill="none"
              stroke={colors.accent}
              strokeWidth={(variant === "contrast" ? strokeWidth * 2 : strokeWidth * 1.5)}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={variant === "contrast" ? opacity * 0.5 : opacity * 0.3}
              filter={`url(#${getId("outer-glow")})`}
            />
            {/* Main stream */}
            <path
              d={d}
              fill="none"
              stroke={`url(#${getId("diagonal")})`}
              strokeWidth={variant === "contrast" ? strokeWidth * 1.8 : strokeWidth * 1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={variant === "contrast" ? opacity * 1.4 : opacity}
            />
          </g>
        ))}

        {/* Central aura with enhanced radiance */}
        <ellipse 
          cx="210" 
          cy="108" 
          rx="100" 
          ry="60" 
          fill={`url(#${getId("aura")})`} 
          opacity={variant === "contrast" ? "0.85" : "0.5"} 
        />

        {/* Energy particles - animated floating elements */}
        {ENERGY_PARTICLES.map(({ cx, cy, r, delay }, index) => (
          <circle
            key={`particle-${index}`}
            cx={cx}
            cy={cy}
            r={r}
            fill={`url(#${getId("energy")})`}
            opacity="0.8"
            filter={`url(#${getId("energy-pulse")})`}
          >
            {animated && (
              <>
                <animate
                  attributeName="opacity"
                  values="0.4;0.9;0.4"
                  dur="3s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values={`${r};${r * 1.5};${r}`}
                  dur="3s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        ))}

        {/* Premium connection nodes */}
        {[
          { cx: 110, cy: 60 },
          { cx: 110, cy: 162 },
          { cx: 310, cy: 60 },
          { cx: 310, cy: 162 },
          { cx: 210, cy: 86 },
          { cx: 210, cy: 140 },
        ].map(({ cx, cy }, index) => (
          <g key={`node-${index}`} transform={`translate(${cx} ${cy})`}>
            {/* Outer glow */}
            <circle 
              r="28" 
              fill={`url(#${getId("node")})`} 
              opacity="0.6" 
              filter={`url(#${getId("outer-glow")})`}
            />
            {/* Main node */}
            <circle 
              r="20" 
              fill={`url(#${getId("node")})`} 
              opacity="1" 
            />
            {/* Outline ring */}
            <circle 
              r="24" 
              fill="none" 
              stroke={colors.nodeOutline} 
              strokeWidth={variant === "contrast" ? "3.5" : "2.5"} 
              strokeOpacity={variant === "contrast" ? "1" : "0.85"} 
            />
            {/* Inner highlight */}
            <circle 
              r="8" 
              fill={colors.nodeCore} 
              opacity={variant === "contrast" ? "1" : "0.9"} 
            />
            {/* Core spark */}
            <circle 
              r="3" 
              fill="#ffffff" 
              opacity="1" 
            />
          </g>
        ))}

        {/* Enhanced stars with rotation */}
        {STAR_COORDS.map(({ x, y, scale, rotation }, index) => (
          <g 
            key={`star-${index}`} 
            transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotation})`} 
            filter={`url(#${getId("sparkle")})`} 
            opacity={variant === "contrast" ? "1" : "0.95"}
          >
            {/* Star glow */}
            <circle 
              r="10" 
              fill={`url(#${getId("spark")})`} 
              opacity="0.8"
            />
            {/* Vertical beam */}
            <path 
              d="M0 -9L0 9" 
              stroke="#fff" 
              strokeWidth={variant === "contrast" ? "2.5" : "1.6"} 
              strokeLinecap="round" 
            />
            {/* Horizontal beam */}
            <path 
              d="M-9 0L9 0" 
              stroke="#fff" 
              strokeWidth={variant === "contrast" ? "2.5" : "1.6"} 
              strokeLinecap="round" 
            />
            {/* Diagonal beams */}
            <path 
              d="M-6 -6L6 6 M-6 6L6 -6" 
              stroke="#fff" 
              strokeWidth={variant === "contrast" ? "1.5" : "1"} 
              strokeLinecap="round" 
              opacity="0.7"
            />
          </g>
        ))}

        {/* Premium connection paths */}
        <path
          d="M126 72c12-24 38-34 62-26 14 5 26 14 36 28l16 22 16-22c18-26 50-34 76-18 26 16 34 48 18 74-16 26-48 34-74 18-8-5-16-12-22-20"
          fill="none"
          stroke={variant === "contrast" ? colors.accent : `url(#${getId("diagonal")})`}
          strokeOpacity={variant === "contrast" ? "0.65" : "0.35"}
          strokeWidth={variant === "contrast" ? "3.5" : "2.5"}
          strokeDasharray={variant === "contrast" ? "5 10" : "8 14"}
          strokeLinecap="round"
        />

        {/* Center focal rings */}
        <circle 
          cx="210" 
          cy="108" 
          r="38" 
          fill="none" 
          stroke={variant === "contrast" ? colors.accent : `url(#${getId("stroke")})`} 
          strokeWidth={variant === "contrast" ? "3" : "2"} 
          strokeDasharray="6 10" 
          opacity={variant === "contrast" ? "0.8" : "0.5"}
        />
        <circle 
          cx="210" 
          cy="108" 
          r="48" 
          fill="none" 
          stroke={variant === "contrast" ? colors.accent : `url(#${getId("stroke")})`} 
          strokeWidth={variant === "contrast" ? "2" : "1.5"} 
          strokeDasharray="4 12" 
          opacity={variant === "contrast" ? "0.5" : "0.3"}
        />
        
        {/* Central core with premium spark */}
        <circle 
          cx="210" 
          cy="108" 
          r="14" 
          fill={`url(#${getId("spark")})`} 
          opacity={variant === "contrast" ? "1" : "0.85"} 
        />
      </g>

      {/* PREMIUM TYPOGRAPHY - World-class wordmark */}
      <g transform="translate(360 64)" filter={`url(#${getId("text-glow")})`}>
        {/* Main ARTIFICALLY text */}
        <text
          x="0"
          y="0"
          fontFamily="var(--brand-logo-font-family, var(--font-inter), 'Inter', 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="44"
          fontWeight="750"
          letterSpacing="0.16em"
          fill={`url(#${getId("text")})`}
          stroke={colors.textOutline !== "none" ? colors.textOutline : "none"}
          strokeWidth={colors.textOutline !== "none" ? "1.2" : "0"}
          style={{ 
            paintOrder: "stroke fill", 
            textRendering: "optimizeLegibility",
            fontVariantNumeric: "proportional-nums"
          }}
        >
          ARTIFICALLY
        </text>

        {/* Premium underline system */}
        <g transform="translate(0 18)">
          {/* Main underline with gradient */}
          <rect
            x="0"
            y="0"
            width={WORDMARK_WIDTH}
            height={variant === "contrast" ? "5" : "3.5"}
            fill={`url(#${getId("diagonal")})`}
            opacity={variant === "contrast" ? "1" : "0.8"}
            rx="2"
          />
          {/* Accent underline */}
          <rect
            x="0"
            y={variant === "contrast" ? "7" : "6"}
            width={WORDMARK_WIDTH}
            height={variant === "contrast" ? "2.5" : "1.8"}
            fill={variant === "contrast" ? colors.glyphEnd : `url(#${getId("stroke")})`}
            opacity={variant === "contrast" ? "0.9" : "0.4"}
            rx="1"
          />
          {/* Highlight line */}
          <rect
            x="0"
            y="-3"
            width={WORDMARK_WIDTH}
            height="1"
            fill={variant === "light" ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)"}
            opacity="0.6"
          />
        </g>

        {/* Tagline background with premium glow */}
        <rect
          x="0"
          y="40"
          width={WORDMARK_WIDTH}
          height="22"
          fill={`url(#${getId("tagline-highlight")})`}
          rx="11"
          opacity="0.65"
        />

        {/* Premium tagline */}
        <text
          x="0"
          y="66"
          fontFamily="var(--font-sans, 'Inter', 'SF Pro Text', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="15"
          fontWeight="650"
          letterSpacing="0.45em"
          fill={colors.tagline}
          style={{ 
            textRendering: "optimizeLegibility",
            fontVariantCaps: "all-small-caps"
          }}
        >
          AUTOMATION • INTELLIGENCE • ORCHESTRATION
        </text>

        {/* Subtle tagline glow */}
        <text
          x="0"
          y="66"
          fontFamily="var(--font-sans, 'Inter', 'SF Pro Text', 'Segoe UI', 'Helvetica Neue', sans-serif)"
          fontSize="15"
          fontWeight="650"
          letterSpacing="0.45em"
          fill={colors.taglineGlow}
          opacity="0.4"
          filter={`url(#${getId("outer-glow")})`}
          style={{ 
            textRendering: "optimizeLegibility",
            fontVariantCaps: "all-small-caps"
          }}
        >
          AUTOMATION • INTELLIGENCE • ORCHESTRATION
        </text>
      </g>
    </svg>
  );
}

