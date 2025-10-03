import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

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

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    const hoverables = document.querySelectorAll("a, button, [data-cursor-hover]");
    hoverables.forEach((element) => {
      element.addEventListener("mouseenter", handleEnter);
      element.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      hoverables.forEach((element) => {
        element.removeEventListener("mouseenter", handleEnter);
        element.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <motion.div
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