import { useEffect, useRef, useState } from "react";
import * as m from "framer-motion/m";

const loadGsap = () => import("../../lib/gsapConfig");

const baseStyles = {
  width: 20,
  height: 20,
  borderRadius: "50%",
  position: "fixed",
  pointerEvents: "none",
  zIndex: 9999,
  mixBlendMode: "difference",
};

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let cancelled = false;
    let cleanup = () => {};

    const setup = async () => {
      try {
        const { gsap } = await loadGsap();
        if (cancelled || !cursorRef.current) {
          return;
        }

        const moveCursor = (event) => {
          gsap.to(cursorRef.current, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.18,
            ease: "power2.out",
          });
        };

        const handleDown = () => setIsActive(true);
        const handleUp = () => setIsActive(false);
        const handleEnter = () => setIsHovering(true);
        const handleLeave = () => setIsHovering(false);

        const hoverables = Array.from(document.querySelectorAll("a, button, [data-cursor-hover]"));

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleDown);
        window.addEventListener("mouseup", handleUp);
        hoverables.forEach((element) => {
          element.addEventListener("mouseenter", handleEnter);
          element.addEventListener("mouseleave", handleLeave);
        });

        cleanup = () => {
          window.removeEventListener("mousemove", moveCursor);
          window.removeEventListener("mousedown", handleDown);
          window.removeEventListener("mouseup", handleUp);
          hoverables.forEach((element) => {
            element.removeEventListener("mouseenter", handleEnter);
            element.removeEventListener("mouseleave", handleLeave);
          });
          if (cursorRef.current) {
            gsap.killTweensOf(cursorRef.current);
          }
        };
      } catch (error) {
        console.warn("Failed to initialize custom cursor animation", error);
      }
    };

    setup();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <m.div
      ref={cursorRef}
      className="custom-cursor"
      animate={{
        scale: isHovering ? 1.8 : isActive ? 0.75 : 1,
        backgroundColor: isHovering ? "var(--brand-glow)" : "var(--brand-primary)",
        opacity: 0.85,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={baseStyles}
    />
  );
}