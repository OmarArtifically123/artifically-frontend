import { forwardRef, useEffect, useRef, useState } from "react";
import useMicroInteractions from "../../hooks/useMicroInteractions";

const MagneticButton = forwardRef(function MagneticButton(
  { children, strength = 0.28, onPointerDown, onPointerUp, onClick, variant = "default", ...props },
  forwardedRef,
) {
  const internalRef = useRef(null);
  const buttonRef = forwardedRef || internalRef;
  const { dispatchInteraction } = useMicroInteractions();
  const frameRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [magnetEnabled, setMagnetEnabled] = useState(() => true);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMagnetEnabled(!query.matches);
    update();

    const add = query.addEventListener?.bind(query) ?? query.addListener?.bind(query);
    const remove = query.removeEventListener?.bind(query) ?? query.removeListener?.bind(query);
    add?.("change", update);

    return () => {
      remove?.("change", update);
    };
  }, []);

  useEffect(() => () => {
    if (frameRef.current && typeof window !== "undefined") {
      window.cancelAnimationFrame(frameRef.current);
    }
  }, []);

  const scheduleOffset = (next) => {
    if (!magnetEnabled) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    if (frameRef.current && typeof window !== "undefined") {
      window.cancelAnimationFrame(frameRef.current);
    }

    if (typeof window === "undefined") {
      setOffset(next);
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setOffset(next);
    });
  };

  const handleMove = (event) => {
    const current = buttonRef?.current;
    if (!current || !magnetEnabled) return;
    const rect = current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const next = {
      x: (event.clientX - centerX) * strength,
      y: (event.clientY - centerY) * strength,
    };
    scheduleOffset(next);
  };

  const handleLeave = () => {
    setIsHovering(false);
    scheduleOffset({ x: 0, y: 0 });
  };

  const handleClick = (event) => {
    dispatchInteraction({ intent: "action", pattern: variant === "primary" ? "cta-primary" : "interactive" });
    if (typeof onClick === "function") {
      onClick(event);
    }
  };

  const transform = `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0) scale(${isPressed ? 0.96 : isHovering ? 1.045 : 1}) rotate(${variant === "primary" && isHovering ? 0.2 : 0}deg)`;

  return (
    <button
      ref={buttonRef}
      data-cursor-hover
      data-magnetic
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerEnter={() => setIsHovering(true)}
      onPointerDown={(event) => {
        setIsPressed(true);
        dispatchInteraction({ intent: "acknowledge" });
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        setIsPressed(false);
        dispatchInteraction({ intent: "celebrate", payload: { strength: variant === "primary" ? 1 : 0.6 } });
        onPointerUp?.(event);
      }}
      onBlur={() => {
        setIsPressed(false);
        scheduleOffset({ x: 0, y: 0 });
      }}
      onClick={handleClick}
      style={{
        transform,
        transition: magnetEnabled
          ? "transform 160ms cubic-bezier(0.33, 1, 0.68, 1)"
          : "transform 140ms ease",
        willChange: "transform",
      }}
      {...props}
    >
      {children}
    </button>
  );
});

export default MagneticButton;