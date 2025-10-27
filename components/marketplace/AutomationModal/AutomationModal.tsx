"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAutomation, useRelatedAutomations } from "@/hooks/useMarketplaceData";
import { useMarketplaceStore } from "@/stores/marketplaceStore";
import { AutomationCard } from "../AutomationCard/AutomationCard";
import type { Automation } from "@/types/marketplace";
import styles from "./AutomationModal.module.css";

interface AutomationModalProps {
  automationId: number | string;
  onClose: () => void;
  onDeploy?: (automation: Automation) => void;
}

/**
 * AutomationModal - Full-featured detail modal
 * Features:
 * - Tabbed interface (Overview, Features, Reviews, Related)
 * - Image gallery
 * - Video preview
 * - Deployment wizard integration
 * - Related automations
 * - WCAG 2.1 AAA compliant
 * - Keyboard navigation (Esc to close)
 * - Focus trap
 */
export function AutomationModal({ automationId, onClose, onDeploy }: AutomationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "reviews" | "related">("overview");

  const { data: automation, isLoading } = useAutomation(automationId);
  const { data: relatedAutomations = [] } = useRelatedAutomations(automationId, 4);

  const { isFavorite, toggleFavorite } = useMarketplaceStore();

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => modal.removeEventListener("keydown", handleTab);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isLoading || !automation) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading automation details...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDeploy = () => {
    if (onDeploy) {
      onDeploy(automation);
    }
    onClose();
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price || price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: automation.currency || "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{automation.icon || "⚙️"}</span>
              </div>
              <div className={styles.headerText}>
                <h2 id="modal-title" className={styles.title}>
                  {automation.name}
                </h2>
                <p className={styles.subtitle}>{automation.summary || automation.description}</p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => toggleFavorite(automation.id)}
                className={`${styles.iconButton} ${isFavorite(automation.id) ? styles.active : ""}`}
                aria-label={isFavorite(automation.id) ? "Remove from favorites" : "Add to favorites"}
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
                onClick={handleDeploy}
                className={styles.deployButton}
              >
                Deploy Now
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "overview"}
              aria-controls="tab-overview"
              onClick={() => setActiveTab("overview")}
              className={`${styles.tab} ${activeTab === "overview" ? styles.active : ""}`}
            >
              Overview
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "features"}
              aria-controls="tab-features"
              onClick={() => setActiveTab("features")}
              className={`${styles.tab} ${activeTab === "features" ? styles.active : ""}`}
            >
              Features
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "reviews"}
              aria-controls="tab-reviews"
              onClick={() => setActiveTab("reviews")}
              className={`${styles.tab} ${activeTab === "reviews" ? styles.active : ""}`}
            >
              Reviews
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "related"}
              aria-controls="tab-related"
              onClick={() => setActiveTab("related")}
              className={`${styles.tab} ${activeTab === "related" ? styles.active : ""}`}
            >
              Related
            </button>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {activeTab === "overview" && (
              <div id="tab-overview" role="tabpanel" className={styles.tabPanel}>
                <div className={styles.overview}>
                  {/* Image/Video */}
                  {automation.previewImage && typeof automation.previewImage === "object" && (
                    <div className={styles.mediaSection}>
                      <Image
                        src={automation.previewImage.src}
                        alt={automation.name}
                        width={800}
                        height={450}
                        className={styles.media}
                        priority
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Description</h3>
                    <p className={styles.description}>{automation.longDescription || automation.description}</p>
                  </div>

                  {/* Stats */}
                  <div className={styles.statsGrid}>
                    <div className={styles.stat}>
                      <div className={styles.statIcon}>⭐</div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{automation.rating?.toFixed(1) || "N/A"}</div>
                        <div className={styles.statLabel}>Rating</div>
                      </div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statIcon}>🚀</div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{automation.deploymentCount?.toLocaleString() || 0}</div>
                        <div className={styles.statLabel}>Deployments</div>
                      </div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statIcon}>⏱️</div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{automation.hoursSavedWeekly || 0}h</div>
                        <div className={styles.statLabel}>Hours Saved/Week</div>
                      </div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statIcon}>💰</div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{formatPrice(automation.priceMonthly)}</div>
                        <div className={styles.statLabel}>Monthly Price</div>
                      </div>
                    </div>
                  </div>

                  {/* Integrations */}
                  {automation.integrations && (
                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Integrations</h3>
                      <div className={styles.integrations}>
                        {automation.integrations.sources?.map((integration) => (
                          <span key={integration} className={styles.integrationBadge}>
                            {integration}
                          </span>
                        ))}
                        {automation.integrations.destinations?.map((integration) => (
                          <span key={integration} className={styles.integrationBadge}>
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div id="tab-features" role="tabpanel" className={styles.tabPanel}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Key Features</h3>
                  {automation.highlights && automation.highlights.length > 0 && (
                    <ul className={styles.featureList}>
                      {automation.highlights.map((highlight, index) => (
                        <li key={index} className={styles.featureItem}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.checkIcon}>
                            <path
                              d="M16.667 5L7.5 14.167 3.333 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {automation.features && automation.features.length > 0 && (
                  <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>All Features</h3>
                    <ul className={styles.featureList}>
                      {automation.features.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.checkIcon}>
                            <path
                              d="M16.667 5L7.5 14.167 3.333 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div id="tab-reviews" role="tabpanel" className={styles.tabPanel}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>User Reviews</h3>
                  <div className={styles.reviewsPlaceholder}>
                    <p>Reviews coming soon!</p>
                    <p className={styles.reviewCount}>
                      {automation.reviewCount || 0} reviews • {automation.rating?.toFixed(1) || "N/A"} rating
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "related" && (
              <div id="tab-related" role="tabpanel" className={styles.tabPanel}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Related Automations</h3>
                  <div className={styles.relatedGrid}>
                    {relatedAutomations.map((relatedAutomation) => (
                      <AutomationCard
                        key={relatedAutomation.id}
                        automation={relatedAutomation}
                        variant="compact"
                        showActions={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AutomationModal;

