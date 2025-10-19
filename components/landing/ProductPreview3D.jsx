"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import { getNetworkInformation, prefersLowPower } from "../../utils/networkPreferences";
import {
  HERO_PREVIEW_DIMENSIONS,
  HERO_PREVIEW_IMAGE,
  HERO_PREVIEW_SOURCES,
} from "./heroPreviewAssets";

const requestIdle = (callback) => {
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(callback, { timeout: 1400 });
  }
  return setTimeout(() => callback({ didTimeout: true, timeRemaining: () => 0 }), 160);
};

const cancelIdle = (handle) => {
  if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(handle);
    return;
  }
  clearTimeout(handle);
};

export default function ProductPreview3D({ label = "Automation preview", theme = "dark" }) {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const rafRef = useRef();
  const animationAngle = useRef({ x: -18, y: 32 });
  const targetAngle = useRef({ x: -12, y: 38 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [prefersLowPowerMode, setPrefersLowPowerMode] = useState(() => prefersLowPower());
  const isDocumentVisible = useDocumentVisibility();
  const descriptionId = useId();
  const [isEnhanced, setIsEnhanced] = useState(false);

  const allowInteractivity = useMemo(
    () => isEnhanced && !prefersReducedMotion && !prefersLowPowerMode,
    [isEnhanced, prefersLowPowerMode, prefersReducedMotion],
  );
  const shouldAnimate = allowInteractivity && isInViewport && isDocumentVisible;
  const previewDescription = allowInteractivity
    ? "Interactive 3D preview of the automation workspace that responds to pointer movement."
    : "Static preview of the automation workspace highlighting its layout.";

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (isEnhanced || prefersReducedMotion || prefersLowPowerMode) {
      return undefined;
    }

    const handle = requestIdle(() => {
      setIsEnhanced(true);
    });

    return () => cancelIdle(handle);
  }, [isEnhanced, prefersLowPowerMode, prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const connection = getNetworkInformation();
    if (!connection) {
      return undefined;
    }

    const updatePreference = () => setPrefersLowPowerMode(prefersLowPower(connection));

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", updatePreference);
      return () => connection.removeEventListener("change", updatePreference);
    }

    connection.onchange = updatePreference;
    return () => {
      connection.onchange = null;
    };
  }, []);

  useEffect(() => {
    if (!isEnhanced) {
      return undefined;
    }

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === element) {
            setIsInViewport(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [isEnhanced]);

  useEffect(() => {
    if (!isEnhanced) {
      return undefined;
    }

    const frame = frameRef.current;
    if (!frame) return undefined;

    if (!allowInteractivity) {
      setIsInteracting(false);
      targetAngle.current = { x: -12, y: 38 };
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      animationAngle.current = { ...targetAngle.current };
      frame.style.transform = `rotateX(${targetAngle.current.x}deg) rotateY(${targetAngle.current.y}deg)`;
      return undefined;
    }

    const update = () => {
      animationAngle.current.x += (targetAngle.current.x - animationAngle.current.x) * 0.05;
      animationAngle.current.y += (targetAngle.current.y - animationAngle.current.y) * 0.05;

      const { x, y } = animationAngle.current;
      frame.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;

      if (!isInteracting) {
        targetAngle.current.y += 0.04;
      }

      if (shouldAnimate || isInteracting) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    if (shouldAnimate || isInteracting) {
      rafRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [allowInteractivity, isEnhanced, isInteracting, shouldAnimate]);

  useEffect(() => {
    if (!isEnhanced) {
      return undefined;
    }

    const frame = frameRef.current;
    if (!frame || !allowInteractivity) return undefined;

    const handlePointerMove = (event) => {
      const rect = frame.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const percentX = (offsetX / rect.width) * 2 - 1;
      const percentY = (offsetY / rect.height) * 2 - 1;

      targetAngle.current = {
        x: -18 * percentY,
        y: 32 * percentX,
      };
    };

    const handlePointerEnter = () => {
      setIsInteracting(true);
    };

    const handlePointerLeave = () => {
      setIsInteracting(false);
      targetAngle.current = { x: -12, y: 38 };
    };

    frame.addEventListener("pointermove", handlePointerMove);
    frame.addEventListener("pointerenter", handlePointerEnter);
    frame.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      frame.removeEventListener("pointermove", handlePointerMove);
      frame.removeEventListener("pointerenter", handlePointerEnter);
      frame.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [allowInteractivity, isEnhanced]);

  return (
    <div ref={containerRef} className={`product-preview product-preview--${theme}`}>
      <p id={descriptionId} className="sr-only">
        {previewDescription}
      </p>
      <div className="product-preview__glow" aria-hidden="true" />
      <div
        className="product-preview__frame"
        ref={frameRef}
        role="img"
        aria-label={label}
        aria-describedby={descriptionId}
        data-interactive={allowInteractivity ? "true" : undefined}
      >
        <div className="product-preview__surface" data-enhanced={isEnhanced ? "true" : undefined}>
          <div
            className="product-preview__static-layer"
            data-visible={!isEnhanced ? "true" : undefined}
            aria-hidden={isEnhanced}
          >
            <picture className="product-preview__image-shell">
              {HERO_PREVIEW_SOURCES.map((source) => (
                <source key={source.type} {...source} />
              ))}
              <img
                src={HERO_PREVIEW_IMAGE}
                alt="Artifically automation workspace preview"
                width={HERO_PREVIEW_DIMENSIONS.width}
                height={HERO_PREVIEW_DIMENSIONS.height}
                loading="eager"
                decoding="async"
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 540px"
              />
            </picture>
          </div>
        <div className="product-preview__interactive" aria-hidden={!isEnhanced}>
            <header className="product-preview__toolbar">
              <span />
              <span />
              <span />
            </header>
            <div className="product-preview__grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="product-preview__node" data-index={index}>
                  <div />
                  <span />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}