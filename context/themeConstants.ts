export const THEME_STORAGE_KEY = "theme" as const;
export const THEME_LIGHT = "light" as const;
export const THEME_DARK = "dark" as const;
export const THEME_CONTRAST = "contrast" as const;

export const THEME_OPTIONS = [THEME_LIGHT, THEME_DARK, THEME_CONTRAST] as const;
export const THEME_DEFAULT = THEME_DARK;

// Legacy contrast constants (deprecated - kept for backward compatibility)
export const CONTRAST_STORAGE_KEY = "theme-contrast" as const;
export const CONTRAST_STANDARD = "standard" as const;
export const CONTRAST_HIGH = "high" as const;
export const CONTRAST_DEFAULT = CONTRAST_STANDARD;
export const CONTRAST_OPTIONS = [CONTRAST_STANDARD, CONTRAST_HIGH] as const;

export type ThemePreference = (typeof THEME_OPTIONS)[number];
export type ContrastPreference = (typeof CONTRAST_OPTIONS)[number];

/**
 * HERO_THEME_PALETTES - Comprehensive theme color palettes for hero background
 * 
 * Used by all hero components for consistent theming across:
 * - Particles (6-color palette)
 * - Geometric shapes (primary/secondary/accent)
 * - Neural connections (gradient colors)
 * - Background gradients (base/overlay colors)
 * - Data streams & grid (accent colors)
 */
export const HERO_THEME_PALETTES = {
  dark: {
    // Deep space aesthetic with mysterious premium feel
    primary: ["#0a0614", "#1a1b3f", "#2d1b69"], // Background gradient
    accent: ["#00d4ff", "#7c3aed", "#ec4899"], // Accent elements
    particles: [
      "#3b82f6", // Deep blue
      "#8b5cf6", // Deep purple
      "#0ea5e9", // Sky blue
      "#7c3aed", // Violet
      "#06b6d4", // Cyan
      "#4f46e5", // Indigo
    ],
    glow: "#00d4ff88", // Semi-transparent cyan glow
    geometric: {
      primary: "#7c3aed", // Main geometric shape color
      secondary: "#00d4ff", // Edge/wireframe color
      accent: "#ec4899", // Highlight color
    },
    connections: "#3b82f6", // Neural connection lines
    grid: "#06b6d4", // Background grid
    streams: "#7c3aed", // Data stream text
  },
  light: {
    // Bright, airy, energetic with vibrant rainbow feel
    primary: ["#ffffff", "#f0f9ff", "#e0f2fe"], // Background gradient
    accent: ["#1f7eff", "#ec4899", "#f59e0b"], // Accent elements
    particles: [
      "#1f7eff", // Vibrant blue
      "#ec4899", // Hot pink
      "#f59e0b", // Warm amber
      "#7c3aed", // Royal purple
      "#10b981", // Emerald green
      "#0ea5e9", // Sky blue
    ],
    glow: "#1f7effaa", // Semi-transparent blue glow
    geometric: {
      primary: "#ec4899", // Main geometric shape color
      secondary: "#1f7eff", // Edge/wireframe color
      accent: "#f59e0b", // Highlight color
    },
    connections: "#7c3aed", // Neural connection lines
    grid: "#0ea5e9", // Background grid
    streams: "#f59e0b", // Data stream text
  },
  contrast: {
    // Cyberpunk electric with maximum accessibility
    primary: ["#000000", "#000000", "#000000"], // Pure black background
    accent: ["#00eaff", "#ff00ff", "#ffff00"], // Electric neon accents
    particles: [
      "#00eaff", // Electric cyan
      "#ff00ff", // Neon magenta
      "#ffff00", // Electric yellow
      "#00ffe0", // Neon teal
      "#ff00aa", // Hot pink
      "#00d4ff", // Bright cyan
    ],
    glow: "#00eaff", // Full opacity cyan glow
    geometric: {
      primary: "#ff00ff", // Main geometric shape color
      secondary: "#00eaff", // Edge/wireframe color
      accent: "#ffff00", // Highlight color
    },
    connections: "#ffff00", // Neural connection lines (bright yellow)
    grid: "#00ffe0", // Background grid
    streams: "#00d4ff", // Data stream text
  },
} as const;

export type HeroThemePalette = typeof HERO_THEME_PALETTES[keyof typeof HERO_THEME_PALETTES];