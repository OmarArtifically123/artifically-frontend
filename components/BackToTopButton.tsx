"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

const SCROLL_THRESHOLD = 360;

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const root = document.scrollingElement || document.documentElement;

    const handleScroll = () => {
      const offset = typeof window.scrollY === "number" ? window.scrollY : root?.scrollTop || 0;
      setVisible(offset > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return () => {};
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="back-to-top"
      data-visible={visible ? "true" : undefined}
      onClick={handleClick}
      aria-label="Back to top"
    >
      <span className="back-to-top__icon" aria-hidden="true">
        <Icon name="arrowRight" size={18} />
      </span>
      <span className="back-to-top__label">Back to top</span>
    </button>
  );
}