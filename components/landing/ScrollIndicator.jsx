"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_DURATION = 800;

export default function ScrollIndicator({ targetId, hostId, label = "Scroll to explore" }) {
  const indicatorRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const getHostElement = useCallback(() => {
    if (typeof document === "undefined") {
      return null;
    }

    if (hostId) {
      const explicitHost = document.getElementById(hostId);
      if (explicitHost instanceof HTMLElement) {
        return explicitHost;
      }
    }

    const indicator = indicatorRef.current;
    if (!indicator) {
      return null;
    }

    const sectionAncestor = indicator.closest("section");
    return sectionAncestor instanceof HTMLElement ? sectionAncestor : null;
  }, [hostId]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let frame = null;

    const updateScrollState = () => {
      frame = null;
      setHasUserScrolled(window.scrollY > 16);
    };

    const handleScroll = () => {
      if (frame !== null) {
        return;
      }
      frame = window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const hostSection = getHostElement();
    if (!hostSection) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hostSection) {
            setHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0);
          }
        });
      },
      { threshold: [0, 0.1] },
    );

    observer.observe(hostSection);

    return () => {
      observer.disconnect();
    };
  }, [getHostElement]);

  const findScrollTarget = useCallback(() => {
    if (typeof document === "undefined") {
      return null;
    }

    if (targetId) {
      const explicitTarget = document.getElementById(targetId);
      if (explicitTarget) {
        return explicitTarget;
      }
    }

    const hostSection = getHostElement();
    if (!hostSection) {
      return null;
    }

    let nextElement = hostSection.nextElementSibling;
    while (nextElement) {
      if (nextElement instanceof HTMLElement) {
        if (!nextElement.hasAttribute("hidden")) {
          return nextElement;
        }
      }
      nextElement = nextElement.nextElementSibling;
    }

    return null;
  }, [getHostElement, targetId]);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const target = findScrollTarget();
    if (!target) {
      return;
    }

    if (prefersReducedMotion) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const start = window.scrollY || window.pageYOffset || 0;
    const targetTop = target.getBoundingClientRect().top + start;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const destination = Math.min(targetTop, maxScroll);

    if (Math.abs(destination - start) < 1) {
      return;
    }

    let startTime = null;

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased = easeInOutCubic(progress);
      const nextPosition = start + (destination - start) * eased;
      window.scrollTo(0, nextPosition);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [findScrollTarget, prefersReducedMotion]);

  const isHidden = !heroVisible || hasUserScrolled;

  return (
    <button
      ref={indicatorRef}
      type="button"
      className={`hero-scroll-indicator${isHidden ? " hero-scroll-indicator--hidden" : ""}`}
      onClick={handleScroll}
      aria-label={label}
      aria-hidden={isHidden ? "true" : undefined}
      tabIndex={isHidden ? -1 : 0}
      data-reduced-motion={prefersReducedMotion ? "true" : undefined}
    >
      <span className="hero-scroll-indicator__mouse" aria-hidden="true">
        <span className="hero-scroll-indicator__wheel" aria-hidden="true" />
      </span>
      {label ? (
        <span className="hero-scroll-indicator__label" aria-hidden="true">
          {label}
        </span>
      ) : null}
    </button>
  );
}