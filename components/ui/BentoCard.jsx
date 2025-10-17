"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const borderVariants = {
  rest: { opacity: 0.3, scale: 1 },
  hover: { opacity: 1, scale: 1.02 },
};

export const SpotlightOverlay = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      className="spotlight"
      animate={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(0.65 0.32 264 / 0.15), transparent 40%)`,
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
    />
  );
};

const BentoCard = ({ children, className, spotlight = true, gradient = true }) => (
  <motion.div className={cn("bento-card", className)} whileHover="hover" initial="rest">
    {gradient && <motion.div className="bento-card__border" variants={borderVariants} />}
    {spotlight && <SpotlightOverlay />}
    <div className="bento-card__content">{children}</div>
  </motion.div>
);

export default BentoCard;