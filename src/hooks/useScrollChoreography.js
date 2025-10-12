import { useEffect } from "react";

export default function useScrollChoreography() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const body = document.body;
    if (!body) {
      return undefined;
    }

    body.removeAttribute("data-motion-ready");

    const animatedElements = Array.from(body.querySelectorAll("[data-animate]"));
    animatedElements.forEach((element) => {
      element.dataset.animateInitialized = "true";
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      element.style.removeProperty("filter");
      element.style.removeProperty("backdrop-filter");
      element.style.removeProperty("-webkit-backdrop-filter");
      element.style.removeProperty("will-change");
    });

    return () => {
      animatedElements.forEach((element) => {
        delete element.dataset.animateInitialized;
      });
    };
  }, []);
}