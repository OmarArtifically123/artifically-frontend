"use client";

import { motion } from "framer-motion";
import useScrollProgress from "@/hooks/useScrollProgress";
import useReducedMotion from "@/hooks/useReducedMotion";

/**
 * Visual progress indicator showing user's journey through the page
 */
export default function PageProgressIndicator() {
  const { scrollPercentage } = useScrollProgress();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(scrollPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <motion.div
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
        style={{
          transformOrigin: "left",
        }}
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: scrollPercentage / 100,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.1,
          ease: "easeOut",
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 right-0 h-1 w-20 bg-gradient-to-l from-transparent to-white/50 blur-sm"
        style={{
          left: `${scrollPercentage}%`,
        }}
        animate={{
          opacity: scrollPercentage > 5 ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
      />
    </div>
  );
}





