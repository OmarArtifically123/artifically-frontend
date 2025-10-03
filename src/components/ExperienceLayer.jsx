import { useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { MicroInteractionProvider } from "../context/MicroInteractionContext";
import useInteractiveEffects from "../hooks/useInteractiveEffects";
import useScrollChoreography from "../hooks/useScrollChoreography";
import useMicroInteractionSystem from "../hooks/useMicroInteractionSystem";
import useKineticTypography from "../hooks/useKineticTypography";
import { AnimationProvider } from "./animation/AnimationProvider";
import CustomCursor from "./animation/CustomCursor";

const THEME_PRESETS = {
  light: {
    themeKey: "daylight",
    tokens: {
      "--dynamic-primary": "hsl(241, 85%, 62%)",
      "--dynamic-secondary": "hsl(199, 94%, 58%)",
      "--dynamic-accent": "hsl(319, 88%, 68%)",
      "--dynamic-gradient":
        "linear-gradient(135deg, hsla(210, 100%, 97%, 0.95), hsla(199, 94%, 88%, 0.9))",
    },
    experience: {
      surface: "rgba(248, 250, 252, 0.9)",
      gradient:
        "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.18), transparent 55%), " +
        "radial-gradient(circle at 80% 15%, rgba(14, 165, 233, 0.16), transparent 55%), " +
        "radial-gradient(circle at 30% 85%, rgba(236, 72, 153, 0.12), transparent 55%), " +
        "linear-gradient(135deg, rgba(226, 232, 240, 0.95), rgba(191, 219, 254, 0.85))",
      glow: "0 45px 120px rgba(148, 163, 184, 0.25)",
      noise: "0.04",
    },
  },
  dark: {
    themeKey: "midnight",
    tokens: {
      "--dynamic-primary": "hsl(240, 92%, 72%)",
      "--dynamic-secondary": "hsl(199, 94%, 66%)",
      "--dynamic-accent": "hsl(318, 89%, 75%)",
      "--dynamic-gradient":
        "linear-gradient(135deg, hsla(222, 47%, 15%, 0.92), hsla(199, 94%, 32%, 0.88))",
    },
    experience: {
      surface: "rgba(15, 23, 42, 0.82)",
      gradient:
        "radial-gradient(circle at 12% 15%, rgba(99, 102, 241, 0.32), transparent 55%), " +
        "radial-gradient(circle at 85% 25%, rgba(14, 165, 233, 0.28), transparent 60%), " +
        "radial-gradient(circle at 35% 80%, rgba(236, 72, 153, 0.22), transparent 55%), " +
        "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75))",
      glow: "0 60px 140px rgba(15, 23, 42, 0.55)",
      noise: "0.08",
    },
  },
};

function useThemeTokens(darkMode) {
  const theme = useMemo(() => (darkMode ? THEME_PRESETS.dark : THEME_PRESETS.light), [darkMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    Object.entries(theme.tokens).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });

    const { surface, gradient, glow, noise } = theme.experience;
    root.style.setProperty("--experience-surface", surface);
    root.style.setProperty("--experience-gradient", gradient);
    root.style.setProperty("--experience-glow", glow);
    root.style.setProperty("--experience-noise", noise);

    if (document.body) {
      document.body.dataset.timeTheme = theme.themeKey;
    }
  }, [theme]);

  return theme;
}

export default function ExperienceLayer({ children }) {
  const { darkMode } = useTheme();
  const theme = useThemeTokens(darkMode);
  useInteractiveEffects();
  useScrollChoreography();
  useKineticTypography();

  return (
    <MicroInteractionProvider>
      <AnimationProvider>
        <CustomCursor />
        <MicroInteractionOrchestrator />
        <div className="experience-shell" data-theme-key={theme.themeKey}>
          <div className="experience-backdrop" aria-hidden="true" />
          <div className="experience-content">{children}</div>
        </div>
      </AnimationProvider>
    </MicroInteractionProvider>
  );
}

function MicroInteractionOrchestrator() {
  useMicroInteractionSystem();
  return null;
}