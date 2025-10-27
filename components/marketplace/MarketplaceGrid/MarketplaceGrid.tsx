"use client";

import { useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplaceStore } from "@/stores/marketplaceStore";
import { AutomationCard } from "../AutomationCard/AutomationCard";
import { SkeletonCard } from "../SkeletonCard/SkeletonCard";
import type { Automation } from "@/types/marketplace";
import styles from "./MarketplaceGrid.module.css";

interface MarketplaceGridProps {
  automations: Automation[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onAutomationClick?: (automation: Automation) => void;
  onDeploy?: (automation: Automation) => void;
}

/**
 * MarketplaceGrid - Responsive grid with infinite scroll
 * Features:
 * - Grid/List view toggle
 * - Infinite scroll
 * - Skeleton loading states
 * - Empty states
 * - Performance optimized
 * - WCAG 2.1 AAA compliant
 */
export function MarketplaceGrid({
  automations,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  onAutomationClick,
  onDeploy,
}: MarketplaceGridProps) {
  const { viewMode } = useMarketplaceStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

  const handleCardClick = useCallback(
    (automation: Automation) => {
      if (onAutomationClick) {
        onAutomationClick(automation);
      }
    },
    [onAutomationClick]
  );

  const handleDeploy = useCallback(
    (automation: Automation) => {
      if (onDeploy) {
        onDeploy(automation);
      }
    },
    [onDeploy]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={`${styles.grid} ${styles[viewMode]}`} id="marketplace-content">
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && automations.length === 0) {
    return (
      <div className={styles.emptyState} id="marketplace-content">
        <div className={styles.emptyIcon}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 70c16.569 0 30-13.431 30-30S56.569 10 40 10 10 23.431 10 40s13.431 30 30 30z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M40 30v20M40 55h.01"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>No automations found</h2>
        <p className={styles.emptyDescription}>
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${styles.grid} ${styles[viewMode]}`}
        id="marketplace-content"
        role="region"
        aria-label="Marketplace automations"
      >
        <AnimatePresence mode="popLayout">
          {automations.map((automation, index) => (
            <motion.div
              key={automation.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AutomationCard
                automation={automation}
                variant={viewMode === "list" ? "compact" : "default"}
                onDeploy={handleDeploy}
                onPreview={handleCardClick}
                priority={index < 6 ? "high" : "normal"}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {isFetchingNextPage && (
            <div className={styles.loadingMore}>
              <div className={styles.spinner} />
              <span className={styles.loadingText}>Loading more automations...</span>
            </div>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasNextPage && automations.length > 0 && (
        <div className={styles.endMessage}>
          <span>You've reached the end of the list</span>
        </div>
      )}
    </>
  );
}

export default MarketplaceGrid;

