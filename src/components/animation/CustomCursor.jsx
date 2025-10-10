import { useEffect, useRef, useState } from "react";

const baseStyles = {
  width: 20,
  height: 20,
  borderRadius: "50%",
  position: "fixed",
  pointerEvents: "none",
  zIndex: 9999,
  mixBlendMode: "difference",
  left: 0,
  top: 0,
  transform: "translate(-50%, -50%)",
  transition: "transform 140ms cubic-bezier(0.33, 1, 0.68, 1), background-color 220ms ease, opacity 180ms ease",
  willChange: "transform, background-color, opacity",
};

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const node = cursorRef.current;
    if (!node) return undefined;

    let frameId = null;

    const moveCursor = (event) => {
      if (!cursorRef.current) return;
      const { clientX, clientY } = event;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        if (!cursorRef.current) return;
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      });
    };

    const handleDown = () => setIsActive(true);
    const handleUp = () => setIsActive(false);
    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    const hoverables = Array.from(document.querySelectorAll("a, button, [data-cursor-hover]"));

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    hoverables.forEach((element) => {
      element.addEventListener("mouseenter", handleEnter);
      element.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      hoverables.forEach((element) => {
        element.removeEventListener("mouseenter", handleEnter);
        element.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  const scale = isHovering ? 1.8 : isActive ? 0.75 : 1;
  const backgroundColor = isHovering ? "var(--brand-glow)" : "var(--brand-primary)";

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        ...baseStyles,
        transform: `translate(-50%, -50%) scale(${scale})`,
        backgroundColor,
        opacity: isHovering ? 0.9 : 0.82,
      }}
    />
  );
}