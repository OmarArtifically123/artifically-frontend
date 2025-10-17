import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { MicroInteractionProvider } from "../context/MicroInteractionContext";
import useInteractiveEffects from "../hooks/useInteractiveEffects";
import useMicroInteractionSystem from "../hooks/useMicroInteractionSystem";
import useKineticTypography from "../hooks/useKineticTypography";

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

function useExperienceActivation(enableExperience) {
  const [state, setState] = useState({
    pointerFine: false,
    reducedMotion: false,
    activated: false,
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setState((prev) => ({ ...prev, pointerFine: false, reducedMotion: false, activated: false }));
      return;
    }

    const pointerQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMediaState = () => {
      setState((prev) => ({
        pointerFine: pointerQuery.matches,
        reducedMotion: motionQuery.matches,
        activated: prev.activated && pointerQuery.matches && !motionQuery.matches,
      }));
    };

    updateMediaState();
    const pointerAdd = pointerQuery.addEventListener
      ? pointerQuery.addEventListener.bind(pointerQuery)
      : pointerQuery.addListener?.bind(pointerQuery);
    const pointerRemove = pointerQuery.removeEventListener
      ? pointerQuery.removeEventListener.bind(pointerQuery)
      : pointerQuery.removeListener?.bind(pointerQuery);
    const motionAdd = motionQuery.addEventListener
      ? motionQuery.addEventListener.bind(motionQuery)
      : motionQuery.addListener?.bind(motionQuery);
    const motionRemove = motionQuery.removeEventListener
      ? motionQuery.removeEventListener.bind(motionQuery)
      : motionQuery.removeListener?.bind(motionQuery);

    pointerAdd?.("change", updateMediaState);
    motionAdd?.("change", updateMediaState);

    return () => {
      pointerRemove?.("change", updateMediaState);
      motionRemove?.("change", updateMediaState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const { pointerFine, reducedMotion } = state;
    const eligible = enableExperience && pointerFine && !reducedMotion;

    if (!eligible) {
      setState((prev) => ({ ...prev, activated: false }));
      return undefined;
    }

    let cancelled = false;

    const activate = () => {
      if (cancelled) return;
      setState((prev) => ({ ...prev, activated: true }));
    };

    const options = { once: true };
    window.addEventListener("pointermove", activate, options);
    window.addEventListener("pointerdown", activate, options);
    window.addEventListener("keydown", activate, options);
    window.addEventListener("focusin", activate, options);

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
      window.removeEventListener("focusin", activate);
    };
  }, [enableExperience, state.pointerFine, state.reducedMotion]);

  const eligible = enableExperience && state.pointerFine && !state.reducedMotion;
  const activated = eligible && state.activated;

  return {
    eligible,
    activated,
    pointerFine: state.pointerFine,
    reducedMotion: state.reducedMotion,
  };
}

export default function ExperienceLayer({ children, enableExperience = false }) {
  const { darkMode } = useTheme();
  const theme = useThemeTokens(darkMode);
  const { eligible, activated, pointerFine, reducedMotion } = useExperienceActivation(enableExperience);
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const gsapRef = useRef(null);

  useInteractiveEffects(activated);
  useInteractiveEffects();
  useKineticTypography();

  useEffect(() => {
    let isMounted = true;
    let ctx;
    let ScrollTriggerModule;

    const teardown = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      ctx?.revert();

      if (ScrollTriggerModule) {
        ScrollTriggerModule.getAll().forEach((instance) => instance.kill());
      }

      if (gsapRef.current && containerRef.current) {
        const targets = containerRef.current.querySelectorAll("[data-experience-animate]");
        gsapRef.current.killTweensOf(targets);
      }
    };

    if (reducedMotion) {
      teardown();
      return teardown;
    }

    const setup = async () => {
      if (!containerRef.current) return;
      try {
        const { gsap, ScrollTrigger } = await import("../lib/gsapConfig");
        if (!isMounted || !containerRef.current) {
          return;
        }

        gsapRef.current = gsap;
        ScrollTriggerModule = ScrollTrigger;

        ctx = gsap.context(() => {
          const base = containerRef.current;
          const elements = gsap.utils.toArray(base.querySelectorAll("[data-experience-animate]"));

          if (!elements.length) {
            return;
          }

          timelineRef.current = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: base,
              start: "top center",
              end: "bottom center",
              scrub: 1,
              once: false,
            },
          });

          elements.forEach((element, index) => {
            const mode = element.dataset.experienceAnimate ?? "lift";

            if (mode === "static") {
              gsap.set(element, { autoAlpha: 1, y: 0, clearProps: "transform" });
              return;
            }

            const fromVars = { autoAlpha: 0 };
            const toVars = { autoAlpha: 1, duration: 0.9, delay: index * 0.08 };

            if (mode !== "fade") {
              fromVars.y = 42;
              toVars.y = 0;
            }

            timelineRef.current?.fromTo(element, fromVars, toVars, 0);
          });
        }, containerRef);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("Failed to initialize experience timeline", error);
        }
      }
    };

    setup();

    return () => {
      isMounted = false;
      teardown();
    };
  }, [reducedMotion]);

  return (
    <MicroInteractionProvider enabled={eligible}>
      <MicroInteractionOrchestrator
        enabled={activated}
        pointerFine={pointerFine}
        reducedMotion={reducedMotion}
      />
      <div ref={containerRef} className="experience-shell" data-theme-key={theme.themeKey}>
        <div className="experience-backdrop" aria-hidden="true" data-experience-animate="backdrop" />
        <div className="experience-content" data-experience-animate="static">
          {children}
        </div>
      </div>
    </MicroInteractionProvider>
  );
}

function MicroInteractionOrchestrator({ enabled, pointerFine, reducedMotion }) {
  useMicroInteractionSystem({ enabled, pointerFine, reducedMotion });
  return null;
}