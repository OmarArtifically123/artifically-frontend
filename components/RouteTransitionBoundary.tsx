"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RouteTransitionBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const animationProps = prefersReducedMotion
    ? {
        initial: false as const,
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname ?? "/"}
        {...animationProps}
        style={{ display: "contents" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}