export const THEME_STORAGE_KEY = "theme" as const;
export const THEME_LIGHT = "light" as const;
export const THEME_DARK = "dark" as const;
export const THEME_CONTRAST = "contrast" as const;
export const THEME_SYSTEM = "system" as const;

export const THEME_OPTIONS = [THEME_LIGHT, THEME_DARK, THEME_CONTRAST, THEME_SYSTEM] as const;
export const THEME_DEFAULT = THEME_DARK;

// Legacy contrast constants (deprecated - kept for backward compatibility)
export const CONTRAST_STORAGE_KEY = "theme-contrast" as const;
export const CONTRAST_STANDARD = "standard" as const;
export const CONTRAST_HIGH = "high" as const;
export const CONTRAST_DEFAULT = CONTRAST_STANDARD;
export const CONTRAST_OPTIONS = [CONTRAST_STANDARD, CONTRAST_HIGH] as const;

export type ThemePreference = (typeof THEME_OPTIONS)[number];
export type ContrastPreference = (typeof CONTRAST_OPTIONS)[number];