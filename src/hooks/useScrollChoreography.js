import { useEffect } from "react";

const loadGsap = () => import("../lib/gsapConfig");

const SPEEDS = {
  micro: 0.35,
  fast: 0.6,
  medium: 0.9,
  slow: 1.2,
  cinematic: 1.6,
};

const PRESETS = {
  "fade-up": {
    from: { opacity: 0, y: 36 },
    to: { opacity: 1, y: 0 },
  },
  "fade-in": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "slide-left": {
    from: { opacity: 0, x: 42 },
    to: { opacity: 1, x: 0 },
  },
  "slide-right": {
    from: { opacity: 0, x: -42 },
    to: { opacity: 1, x: 0 },
  },
  "scale-in": {
    from: { opacity: 0, scale: 0.94 },
    to: { opacity: 1, scale: 1 },
  },
  "blur-up": {
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
  },
  lift: {
    from: { opacity: 0, y: 48, rotateX: -8 },
    to: { opacity: 1, y: 0, rotateX: 0 },
  },
};

const CONTEXT_SETTINGS = {
  default: {
    start: "top 88%",
    end: "bottom 65%",
    scrub: false,
    multiplier: 1,
  },
  form: {
    start: "top 95%",
    end: "bottom 80%",
    scrub: false,
    multiplier: 0.8,
    ease: "power2.out",
  },
  panel: {
    start: "top 90%",
    end: "bottom 70%",
    scrub: false,
    multiplier: 1.05,
  },
  dashboard: {
    start: "top 85%",
    end: "bottom 60%",
    scrub: 0.28,
    multiplier: 1.15,
  },
  story: {
    start: "top 82%",
    end: "bottom 55%",
    scrub: 0.35,
    multiplier: 1.25,
  },
};

function getContextKey(element) {
  if (!element) return "default";
  const explicit = element.dataset.animateContext;
  if (explicit) return explicit;
  if (element.closest?.("form")) return "form";
  if (element.closest?.(".hero-panel")) return "panel";
  if (element.closest?.(".dashboard") || element.dataset.metric === "true") {
    return "dashboard";
  }
  return "default";
}

export default function useScrollChoreography() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let cancelled = false;
    let teardown = () => {};

    const setup = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGsap();
        if (cancelled) {
          return;
        }
        teardown = initializeScrollChoreography(gsap, ScrollTrigger);
      } catch (error) {
        console.warn("Failed to initialize scroll choreography", error);
      }
    };

    setup();

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);
}

function initializeScrollChoreography(gsap, ScrollTrigger) {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (reduceMotion?.matches) {
    return () => {};
  }

  const processed = new WeakSet();
  const disposers = [];
  let refreshPending = false;
  const body = document.body;
  if (body) {
    body.dataset.motionReady = "true";
  }

  const queueRefresh = () => {
    if (refreshPending) return;
    refreshPending = true;
    window.requestAnimationFrame(() => {
      refreshPending = false;
      ScrollTrigger.refresh();
    });
  };

  const registerElement = (element) => {
    if (!element || processed.has(element)) return;
    processed.add(element);

    const presetKey = element.dataset.animate || "fade-up";
    const preset = PRESETS[presetKey] || PRESETS["fade-up"];
    const speedKey = element.dataset.animateSpeed || "medium";
    const duration = Number(element.dataset.animateDuration || SPEEDS[speedKey] || SPEEDS.medium);
    const baseDelay = Number(element.dataset.animateDelay || 0);
    const order = Number(element.dataset.animateOrder || 0);
    const cascade = element.dataset.animateCascade ? Number(element.dataset.animateCascade) : 0.08;
    const computedDelay = baseDelay + (order > 0 ? order * cascade : 0);
    const ease = element.dataset.animateEase || preset.ease || "power3.out";

    const contextKey = getContextKey(element);
    const contextConfig = CONTEXT_SETTINGS[contextKey] || CONTEXT_SETTINGS.default;
    const triggerSelector = element.dataset.animateTrigger;
    const triggerElement = triggerSelector
      ? triggerSelector === "self"
        ? element
        : document.querySelector(triggerSelector)
      : element.closest?.("[data-animate-root]") || element;

    const scrubAttr = element.dataset.animateScrub;
    const scrub =
      scrubAttr != null
        ? scrubAttr === "" || scrubAttr === "true" || scrubAttr === "1"
        : contextConfig.scrub;
    const onceAttr = element.dataset.animateOnce;
    const once = scrub ? false : onceAttr == null ? true : onceAttr !== "false";

    const fromVars = { ...preset.from, immediateRender: false };
    const toVars = {
      ...preset.to,
      duration: duration * (contextConfig.multiplier || 1),
      ease: ease || "power3.out",
      delay: computedDelay,
      onComplete: () => {
        element.style.removeProperty("will-change");
      },
    };

    if (!fromVars.filter && toVars.filter === undefined) {
      delete fromVars.filter;
      delete toVars.filter;
    }

    element.style.willChange = "opacity, transform";

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement || element,
        start: element.dataset.animateStart || contextConfig.start,
        end: element.dataset.animateEnd || contextConfig.end,
        scrub,
        once,
        toggleActions: once ? "play none none none" : "play none none reverse",
      },
      defaults: { ease },
    });

    timeline.fromTo(element, fromVars, toVars, 0);
    element.dataset.animateInitialized = "true";

    disposers.push(() => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      element.style.removeProperty("will-change");
      delete element.dataset.animateInitialized;
    });

    queueRefresh();
  };

  const scan = (root = document) => {
    if (!root.querySelectorAll) return;
    root.querySelectorAll("[data-animate]").forEach((element) => registerElement(element));
  };

  scan();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches("[data-animate]")) {
          registerElement(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll("[data-animate]").forEach((element) => registerElement(element));
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const handleResize = () => queueRefresh();
  window.addEventListener("resize", handleResize, { passive: true });

  const handleThemeChange = () => {
    queueRefresh();
  };

  window.addEventListener("artifically-theme-change", handleThemeChange);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("artifically-theme-change", handleThemeChange);
    disposers.forEach((dispose) => dispose());
    if (body) {
      delete body.dataset.motionReady;
    }
  };
}