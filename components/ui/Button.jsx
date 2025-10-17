"use client";

import { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import useMicroInteractions from "../../hooks/useMicroInteractions";
import { cn } from "../../utils/cn";
import { createRipple } from "../../utils/createRipple";

const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export const ButtonShine = () => (
  <motion.span
    aria-hidden="true"
    className="button__shine"
    animate={{ x: [-120, 240] }}
    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
  />
);

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      magnetic = false,
      haptic = true,
      ripple = true,
      glowOnHover = true,
      shine = true,
      iconLeft,
      iconRight,
      className,
      onClick,
      ...props
    },
    forwardedRef
  ) => {
    const { dispatchInteraction } = useMicroInteractions();
    const internalRef = useRef(null);
    const mergedRef = (node) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        // eslint-disable-next-line no-param-reassign
        forwardedRef.current = node;
      }
    };

    const handleClick = (event) => {
      if (haptic && typeof dispatchInteraction === "function") {
        dispatchInteraction("success");
      }
      if (ripple) {
        createRipple(event, internalRef.current);
      }
      onClick?.(event);
    };

    return (
      <motion.button
        ref={mergedRef}
        type="button"
        {...buttonMotion}
        data-magnetic={magnetic}
        className={cn(
          "button",
          `button--${variant}`,
          `button--${size}`,
          {
            "button--magnetic": magnetic,
            "button--glow": glowOnHover,
          },
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {iconLeft && <span className="button__icon button__icon--left">{iconLeft}</span>}
        <span className="button__content">{children}</span>
        {iconRight && <span className="button__icon button__icon--right">{iconRight}</span>}
        {shine && <ButtonShine />}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;