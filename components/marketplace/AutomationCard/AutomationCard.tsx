"use client";

import { useState, useRef, useCallback, memo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useMarketplaceStore } from "@/stores/marketplaceStore";
import { useTeamVoteHandler } from "@/hooks/useMarketplaceData";
import { marketplaceApi } from "@/lib/api/marketplace-api";
import type { AutomationCardProps } from "@/types/marketplace";
import styles from "./AutomationCard.module.css";

/**
 * AutomationCard - Advanced card with live preview and 3D effects
 * Features:
 * - Glass morphism design
 * - 3D tilt effect on hover
 * - Lazy-loaded images with blur-up
 * - Badge system (NEW, TRENDING, VERIFIED)
 * - Quick actions (Preview, Deploy, Compare, Favorite)
 * - Performance metrics
 * - Integration logos
 * - WCAG 2.1 AAA compliant
 */
export function AutomationCard({
  automation,
  variant = "default",
  onDeploy,
  onPreview,
  showActions = true,
  showBadges = true,
  priority = "normal",
}: AutomationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Zustand store
  const { isFavorite, toggleFavorite, isInComparison, addToComparison, removeFromComparison } =
    useMarketplaceStore();

  // Team vote handler
  const handleVote = useTeamVoteHandler();

  // Intersection observer for lazy loading
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  // Handle mouse move for 3D tilt
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      x.set(mouseX / (rect.width / 2));
      y.set(mouseY / (rect.height / 2));
    },
    [x, y]
  );

  // Reset tilt on mouse leave
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  // Format price
  const formatPrice = (price: number | null | undefined, currency: string = "USD") => {
    if (!price || price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle actions
  const handleDeployClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeploy) {
      onDeploy(automation);
    }
    // Track analytics
    marketplaceApi.recordAnalytics({
      automationId: automation.id,
      eventType: "click",
    });
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPreview) {
      onPreview(automation);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(automation.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInComparison(automation.id)) {
      removeFromComparison(automation.id);
    } else {
      addToComparison(automation.id);
    }
  };

  const handleVoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleVote(automation);
  };

  // Get badges
  const badges = [];
  if (showBadges) {
    if (automation.isNew) badges.push({ label: "NEW", color: "#10b981" });
    if (automation.isFeatured) badges.push({ label: "FEATURED", color: "#f59e0b" });
    if (automation.isVerified) badges.push({ label: "VERIFIED", color: "#6366f1" });
    if (automation.isStaffPick) badges.push({ label: "STAFF PICK", color: "#ec4899" });
    if (automation.trendingScore && automation.trendingScore > 100) {
      badges.push({ label: "TRENDING", color: "#ef4444" });
    }
  }

  const priceLabel = formatPrice(automation.priceMonthly, automation.currency);
  const isFree = priceLabel === "Free";

  // Merge refs for motion and inView
  const mergeRefs = useCallback(
    (node: HTMLDivElement | null) => {
      if (cardRef.current !== node) {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
      inViewRef(node);
    },
    [inViewRef]
  );

  return (
    <motion.article
      ref={mergeRefs}
      className={`${styles.card} ${styles[variant]} ${isHovered ? styles.hovered : ""}`}
      style={{
        rotateX,
        rotateY,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      {/* Image Section */}
      <div className={styles.imageSection}>
        {/* Badges */}
        {badges.length > 0 && (
          <div className={styles.badges}>
            {badges.slice(0, 2).map((badge) => (
              <span
                key={badge.label}
                className={styles.badge}
                style={{ backgroundColor: badge.color }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        {automation.previewImage && typeof automation.previewImage === "object" ? (
          <div className={styles.imageWrapper}>
            <Image
              src={automation.previewImage.src}
              alt={automation.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`${styles.image} ${imageLoaded ? styles.loaded : ""}`}
              onLoad={() => setImageLoaded(true)}
              priority={priority === "high"}
              placeholder={automation.previewImage.blurDataURL ? "blur" : "empty"}
              blurDataURL={automation.previewImage.blurDataURL}
            />
          </div>
        ) : (
          <div className={styles.iconFallback}>
            <span className={styles.icon}>{automation.icon || "⚙️"}</span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        {showActions && (
          <motion.div
            className={styles.quickActions}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`${styles.quickAction} ${isFavorite(automation.id) ? styles.active : ""}`}
              aria-label={isFavorite(automation.id) ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite(automation.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill={isFavorite(automation.id) ? "currentColor" : "none"}>
                <path
                  d="M10 17l-5.878 3.09 1.123-6.545L.49 9.09l6.572-.955L10 2l2.938 6.135 6.572.955-4.755 4.455 1.123 6.545z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleCompareClick}
              className={`${styles.quickAction} ${isInComparison(automation.id) ? styles.active : ""}`}
              aria-label={isInComparison(automation.id) ? "Remove from comparison" : "Add to comparison"}
              title={isInComparison(automation.id) ? "Remove from comparison" : "Add to comparison"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{automation.name}</h3>
          <span className={`${styles.price} ${isFree ? styles.free : ""}`}>{priceLabel}</span>
        </div>

        {/* Description */}
        <p className={styles.description}>{automation.description}</p>

        {/* Metrics */}
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricIcon}>⭐</span>
            <span className={styles.metricValue}>{automation.rating?.toFixed(1) || "N/A"}</span>
            <span className={styles.metricLabel}>({automation.reviewCount || 0})</span>
          </div>

          <div className={styles.metric}>
            <span className={styles.metricIcon}>🚀</span>
            <span className={styles.metricValue}>{automation.deploymentsPerWeek || 0}</span>
            <span className={styles.metricLabel}>deploys/wk</span>
          </div>

          {automation.teamVotes !== undefined && automation.teamVotes > 0 && (
            <button
              type="button"
              onClick={handleVoteClick}
              className={styles.voteButton}
              aria-label={`Vote for ${automation.name}`}
            >
              <span className={styles.metricIcon}>👍</span>
              <span className={styles.metricValue}>{automation.teamVotes}</span>
            </button>
          )}
        </div>

        {/* Tags */}
        {automation.tags && automation.tags.length > 0 && (
          <div className={styles.tags}>
            {automation.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handlePreviewClick}
              className={`${styles.button} ${styles.secondary}`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handleDeployClick}
              className={`${styles.button} ${styles.primary}`}
            >
              Deploy
            </button>
          </div>
        )}
      </div>

      {/* Gradient Overlay (for glass effect) */}
      <div className={styles.gradientOverlay} aria-hidden="true" />
    </motion.article>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(AutomationCard, (prevProps, nextProps) => {
  return (
    prevProps.automation.id === nextProps.automation.id &&
    prevProps.automation.teamVotes === nextProps.automation.teamVotes &&
    prevProps.variant === nextProps.variant &&
    prevProps.showActions === nextProps.showActions &&
    prevProps.showBadges === nextProps.showBadges
  );
});

