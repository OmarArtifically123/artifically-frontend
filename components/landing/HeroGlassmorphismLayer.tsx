"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./HeroGlassmorphismLayer.module.css";

interface HeroGlassmorphismLayerProps {
  children: ReactNode;
  className?: string;
  variant?: "surface" | "elevated" | "overlay";
  blur?: "light" | "medium" | "heavy";
  animated?: boolean;
}

/**
 * HeroGlassmorphismLayer - Premium frosted-glass UI component
 *
 * Features:
 * - backdrop-filter: blur for frosted glass effect
 * - Semi-transparent backgrounds (5-15% opacity)
 * - Subtle gradient borders with transparency
 * - Soft shadows for depth and elevation
 * - WCAG AA compliant contrast ratios
 * - Enterprise-grade premium feel
 *
 * Variants:
 * - surface: Base layer (5% opacity)
 * - elevated: Mid-layer (10% opacity)
 * - overlay: Top layer (15% opacity)
 */
export default function HeroGlassmorphismLayer({
  children,
  className = "",
  variant = "surface",
  blur = "medium",
  animated = true,
}: HeroGlassmorphismLayerProps) {
  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      }
    : {};

  return (
    <Wrapper
      className={`${styles.glassmorphism} ${styles[`variant-${variant}`]} ${styles[`blur-${blur}`]} ${className}`}
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  );
}

/**
 * HeroGlassmorphismCard - Individual card component with glassmorphism
 */
export function HeroGlassmorphismCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`${styles.card} ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * HeroGlassmorphismButton - Premium button with glasmorphism styling
 */
export function HeroGlassmorphismButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      className={`${styles.button} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.button>
  );
}
