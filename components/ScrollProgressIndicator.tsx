"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "color-mix(in oklch, var(--brand-500) 80%, transparent)",
        transformOrigin: "0%",
        zIndex: 1200,
        scaleX: scrollYProgress,
      }}
      className="progress-bar"
    />
  );
}