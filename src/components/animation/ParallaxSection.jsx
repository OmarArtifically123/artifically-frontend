import { forwardRef, useEffect, useRef } from "react";

function assignRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object") {
    ref.current = value;
  }
}

const ParallaxSection = forwardRef(function ParallaxSection(
  { children, speed = 0, className = "", style },
  forwardedRef,
) {
  const localRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const node = localRef.current;
    if (!node || Math.abs(speed) < 0.05) {
      return undefined;
    }

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (motionQuery?.matches) {
      node.style.removeProperty("--parallax-shift");
      return undefined;
    }

    let frame = null;

    const update = () => {
      frame = null;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const midpoint = rect.top + rect.height / 2;
      const distanceFromCenter = midpoint - viewportHeight / 2;
      const shift = distanceFromCenter * speed;
      node.style.setProperty("--parallax-shift", `${shift.toFixed(2)}px`);
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [speed]);

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        assignRef(forwardedRef, node);
      }}
      className={`parallax-section ${className}`.trim()}
      style={{
        transform: "translate3d(0, var(--parallax-shift, 0px), 0)",
        willChange: Math.abs(speed) >= 0.05 ? "transform" : undefined,
        ...style,
      }}
      data-parallax-speed={speed}
    >
      {children}
    </div>
  );
});

export default ParallaxSection;