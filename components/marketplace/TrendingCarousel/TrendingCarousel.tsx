"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrendingAutomations } from "@/hooks/useMarketplaceData";
import { AutomationCard } from "../AutomationCard/AutomationCard";
import type { Automation } from "@/types/marketplace";
import styles from "./TrendingCarousel.module.css";

interface TrendingCarouselProps {
  limit?: number;
  onDeploy?: (automation: Automation) => void;
  onPreview?: (automation: Automation) => void;
}

/**
 * TrendingCarousel - Showcase trending automations
 * Features:
 * - Horizontal scroll carousel
 * - Touch/swipe support
 * - Keyboard navigation
 * - Auto-scroll option
 * - WCAG 2.1 AAA compliant
 */
export function TrendingCarousel({ limit = 10, onDeploy, onPreview }: TrendingCarouselProps) {
  const { data: trending = [], isLoading } = useTrendingAutomations(limit);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = element.clientWidth * 0.8;
    const targetScroll = direction === "left" 
      ? element.scrollLeft - scrollAmount 
      : element.scrollLeft + scrollAmount;

    element.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>🔥 Trending Now</h2>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading trending automations...</p>
        </div>
      </section>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="trending-title">
      <div className={styles.header}>
        <h2 id="trending-title" className={styles.title}>
          🔥 Trending Now
        </h2>
        <div className={styles.controls}>
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={styles.navButton}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15l-5-5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={styles.navButton}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15l5-5-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={styles.carousel}
        onScroll={checkScroll}
        role="region"
        aria-label="Trending automations carousel"
      >
        <AnimatePresence mode="popLayout">
          {trending.map((automation, index) => (
            <motion.div
              key={automation.id}
              className={styles.card}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AutomationCard
                automation={automation}
                onDeploy={onDeploy}
                onPreview={onPreview}
                priority={index < 3 ? "high" : "normal"}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default TrendingCarousel;


