"use client";

import { useCallback } from "react";

export default function ScrollIndicator({ targetId, label = "Scroll to explore" }) {
  const handleScroll = useCallback(() => {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [targetId]);

  return (
    <button type="button" className="hero-scroll-indicator" onClick={handleScroll} aria-label={label}>
      <span className="hero-scroll-indicator__track" aria-hidden="true">
        <span className="hero-scroll-indicator__dot" aria-hidden="true" />
      </span>
      <span className="hero-scroll-indicator__label" aria-hidden="true">
        Scroll
      </span>
    </button>
  );
}