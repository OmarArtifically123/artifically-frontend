"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_CONTRAST,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  THEME_DEFAULT,
} from "./themeConstants";

const ThemeContext = createContext();

const THEME_SET = new Set(THEME_OPTIONS);

const resolveThemeAttribute = () => {
  if (typeof document === "undefined") return null;

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr && (attr === THEME_LIGHT || attr === THEME_DARK || attr === THEME_CONTRAST)) {
    return attr;
  }

  const bodyAttr = document.body?.dataset?.theme;
  if (bodyAttr && (bodyAttr === THEME_LIGHT || bodyAttr === THEME_DARK || bodyAttr === THEME_CONTRAST)) {
    return bodyAttr;
  }

  return null;
};

const detectSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return THEME_DARK;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_DARK : THEME_LIGHT;
};

const readStoredTheme = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_SET.has(stored) ? stored : null;
};

const getInitialTheme = () => {
  const fromDom = resolveThemeAttribute();
  if (fromDom) {
    return fromDom;
  }

  return THEME_DEFAULT;
};

// No more system mode - just return the theme directly

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(getInitialTheme);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = readStoredTheme();
    if (stored) {
      setThemePreference(stored);
    }
  }, []);

  // Effective theme is just the preference (no more system mode)
  const effectiveTheme = themePreference;

  // Apply theme to DOM
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const themeToApply = effectiveTheme;

    root.setAttribute("data-theme", themeToApply);
    root.classList.remove(THEME_LIGHT, THEME_DARK, THEME_CONTRAST);
    root.classList.add(`theme-${themeToApply}`);

    if (document.body) {
      document.body.dataset.theme = themeToApply;
    }

    if (typeof window !== "undefined") {
      window.__SSR_THEME__ = themeToApply;
    }
  }, [effectiveTheme]);

  // Persist theme preference to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  }, [themePreference]);

  // No more system preference tracking

  const setTheme = useCallback((newTheme) => {
    if (THEME_SET.has(newTheme)) {
      setThemePreference(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference((prev) => {
      if (prev === THEME_LIGHT) return THEME_DARK;
      if (prev === THEME_DARK) return THEME_CONTRAST;
      return THEME_LIGHT;
    });
  }, []);

  const value = useMemo(
    () => ({
      // Current user preference
      themePreference,
      // Actual theme (same as preference now)
      theme: effectiveTheme,
      // Convenience flags
      isLight: effectiveTheme === THEME_LIGHT,
      isDark: effectiveTheme === THEME_DARK,
      isContrast: effectiveTheme === THEME_CONTRAST,
      // Legacy compatibility
      darkMode: effectiveTheme === THEME_DARK,
      // Methods
      setTheme,
      toggleTheme,
    }),
    [themePreference, effectiveTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}