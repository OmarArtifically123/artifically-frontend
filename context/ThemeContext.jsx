import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const ThemeContext = createContext();
const STORAGE_KEY = "theme";
const CONTRAST_STORAGE_KEY = "theme-contrast";
const CONTRAST_DEFAULT = "standard";

const resolveContrastAttribute = () => {
  if (typeof document === "undefined") return null;

  const attr = document.documentElement.getAttribute("data-contrast");
  if (attr === "high" || attr === CONTRAST_DEFAULT) {
    return attr;
  }

  const bodyAttr = document.body?.dataset?.contrast;
  if (bodyAttr === "high" || bodyAttr === CONTRAST_DEFAULT) {
    return bodyAttr;
  }

  return null;
};

const resolveThemeAttribute = () => {
  if (typeof document === "undefined") return null;

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") {
    return attr;
  }

  const bodyAttr = document.body?.dataset?.theme;
  if (bodyAttr === "dark" || bodyAttr === "light") {
    return bodyAttr;
  }

  return null;
};

const detectPreferredTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const detectPreferredContrast = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return CONTRAST_DEFAULT;
  }
  return window.matchMedia("(prefers-contrast: more)").matches ? "high" : CONTRAST_DEFAULT;
};

const readStoredTheme = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
};

const readStoredContrast = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(CONTRAST_STORAGE_KEY);
  return stored === "high" || stored === CONTRAST_DEFAULT ? stored : null;
};

const getInitialTheme = () => {
  const fromDom = resolveThemeAttribute();
  if (fromDom) {
    return fromDom;
  }

  return "dark";
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
      window.localStorage.setItem(STORAGE_KEY, theme);
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
    }
  }, [contrast]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        return;
      }
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-contrast: more)");
    const handleChange = (event) => {
      const stored = window.localStorage.getItem(CONTRAST_STORAGE_KEY);
      if (stored === "high" || stored === CONTRAST_DEFAULT) {
        return;
      }
      setContrast(event.matches ? "high" : CONTRAST_DEFAULT);
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleContrast = useCallback(() => {
    setContrast((prev) => (prev === "high" ? CONTRAST_DEFAULT : "high"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      darkMode: theme === "dark",
      toggleTheme,
      setTheme,
      contrast,
      highContrast: contrast === "high",
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