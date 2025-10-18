"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

import {
  CONTRAST_DEFAULT,
  CONTRAST_HIGH,
  CONTRAST_OPTIONS,
  CONTRAST_STORAGE_KEY,
  THEME_DARK,
  THEME_LIGHT,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "./themeConstants";

const ThemeContext = createContext();

const THEME_SET = new Set(THEME_OPTIONS);
const CONTRAST_SET = new Set(CONTRAST_OPTIONS);

const resolveContrastAttribute = () => {
  if (typeof document === "undefined") return null;

  const attr = document.documentElement.getAttribute("data-contrast");
  if (attr && CONTRAST_SET.has(attr)) {
    return attr;
  }

  const bodyAttr = document.body?.dataset?.contrast;
  if (bodyAttr && CONTRAST_SET.has(bodyAttr)) {
    return bodyAttr;
  }

  return null;
};

const resolveThemeAttribute = () => {
  if (typeof document === "undefined") return null;

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr && THEME_SET.has(attr)) {
    return attr;
  }

  const bodyAttr = document.body?.dataset?.theme;
  if (bodyAttr && THEME_SET.has(bodyAttr)) {
    return bodyAttr;
  }

  return null;
};

const detectPreferredTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return THEME_DARK;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_DARK : THEME_LIGHT;
};

const detectPreferredContrast = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return CONTRAST_DEFAULT;
  }
  return window.matchMedia("(prefers-contrast: more)").matches ? CONTRAST_HIGH : CONTRAST_DEFAULT;
};

const readStoredTheme = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_SET.has(stored) ? stored : null;
};

const readStoredContrast = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(CONTRAST_STORAGE_KEY);
  return CONTRAST_SET.has(stored) ? stored : null;
};

const getInitialTheme = () => {
  const fromDom = resolveThemeAttribute();
  if (fromDom) {
    return fromDom;
  }

  return THEME_DARK;
};

const getInitialContrast = () => {
  const fromDom = resolveContrastAttribute();
  if (fromDom) {
    return fromDom;
  }
  return CONTRAST_DEFAULT;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [contrast, setContrast] = useState(getInitialContrast);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = readStoredTheme();
    const preferred = stored ?? detectPreferredTheme();

    setTheme((current) => (current === preferred ? current : preferred));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = readStoredContrast();
    const preferred = stored ?? detectPreferredContrast();

    setContrast((current) => (current === preferred ? current : preferred));
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    if (document.body) {
      document.body.dataset.theme = theme;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      window.__SSR_THEME__ = theme;
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-contrast", contrast);

    if (document.body) {
      document.body.dataset.contrast = contrast;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONTRAST_STORAGE_KEY, contrast);
      window.__SSR_CONTRAST__ = contrast;
    }
  }, [contrast]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && THEME_SET.has(stored)) {
        return;
      }
      setTheme(event.matches ? THEME_DARK : THEME_LIGHT);
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-contrast: more)");
    const handleChange = (event) => {
      const stored = window.localStorage.getItem(CONTRAST_STORAGE_KEY);
      if (stored && CONTRAST_SET.has(stored)) {
        return;
      }
      setContrast(event.matches ? CONTRAST_HIGH : CONTRAST_DEFAULT);
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEME_DARK ? THEME_LIGHT : THEME_DARK));
  }, []);

  const toggleContrast = useCallback(() => {
    setContrast((prev) => (prev === CONTRAST_HIGH ? CONTRAST_DEFAULT : CONTRAST_HIGH));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      darkMode: theme === THEME_DARK,
      toggleTheme,
      setTheme,
      contrast,
      highContrast: contrast === CONTRAST_HIGH,
      toggleContrast,
      setContrast,
    }),
    [theme, contrast, toggleTheme, toggleContrast]
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