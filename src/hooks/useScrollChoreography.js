import { useEffect } from "react";

export default function useScrollChoreography() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const body = document.body;
    if (!body) {
      return undefined;
    }

    let rafId = null;

    const clearAnimatedStyles = () => {
      body.removeAttribute("data-motion-ready");

      const animatedElements = body.querySelectorAll("[data-animate]");
      animatedElements.forEach((element) => {
        element.dataset.animateInitialized = "true";
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
        element.style.removeProperty("filter");
        element.style.removeProperty("backdrop-filter");
        element.style.removeProperty("-webkit-backdrop-filter");
        element.style.removeProperty("will-change");
      });
    };

    const scheduleClear = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(clearAnimatedStyles);
    };

    scheduleClear();

    window.addEventListener("resize", scheduleClear);
    window.addEventListener("orientationchange", scheduleClear);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("resize", scheduleClear);
      window.removeEventListener("orientationchange", scheduleClear);

      const animatedElements = body.querySelectorAll("[data-animate]");
      animatedElements.forEach((element) => {
        delete element.dataset.animateInitialized;
      });
    };
  }, []);
}