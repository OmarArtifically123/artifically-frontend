import { forwardRef, useRef } from "react";
import * as m from "framer-motion/m";
import { useSpring } from "framer-motion";
import useMicroInteractions from "../../hooks/useMicroInteractions";

const springConfig = { stiffness: 220, damping: 18, mass: 0.4 };

const MagneticButton = forwardRef(function MagneticButton(
  { children, strength = 0.28, onPointerDown, onPointerUp, onClick, variant = "default", ...props },
  forwardedRef,
) {
  const internalRef = useRef(null);
  const buttonRef = forwardedRef || internalRef;
  const { dispatchInteraction } = useMicroInteractions();
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMove = (event) => {
    const current = buttonRef?.current;
    if (!current) return;
    const rect = current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) * strength);
    y.set((event.clientY - centerY) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (event) => {
    dispatchInteraction({ intent: "action", pattern: variant === "primary" ? "cta-primary" : "interactive" });
    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  return (
    <m.button
      ref={buttonRef}
      data-cursor-hover
      data-magnetic
      style={{ x, y, willChange: "transform" }}
      whileHover={{ scale: 1.045, rotate: variant === "primary" ? 0.2 : 0 }}
      whileTap={{ scale: 0.96 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerDown={(event) => {
        dispatchInteraction({ intent: "acknowledge" });
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        dispatchInteraction({ intent: "celebrate", payload: { strength: variant === "primary" ? 1 : 0.6 } });
        onPointerUp?.(event);
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </m.button>
  );
});

export default MagneticButton;