"use client";

import { motion } from "framer-motion";
import { useFeaturedAutomations } from "@/hooks/useMarketplaceData";
import type { Automation } from "@/types/marketplace";
import styles from "./FeaturedShowcase.module.css";

interface FeaturedShowcaseProps {
  limit?: number;
  onDeploy?: (automation: Automation) => void;
  onPreview?: (automation: Automation) => void;
}

/**
 * FeaturedShowcase - Highlight featured automations
 * Features:
 * - Large hero card format
 * - Gradient backgrounds
 * - Call-to-action buttons
 * - WCAG 2.1 AAA compliant
 */
export function FeaturedShowcase({ limit = 3, onDeploy, onPreview }: FeaturedShowcaseProps) {
  const { data: featured = [], isLoading } = useFeaturedAutomations(limit);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>⭐ Featured Automations</h2>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null;
  }

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  ];

  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <div className={styles.header}>
        <h2 id="featured-title" className={styles.title}>
          ⭐ Featured Automations
        </h2>
        <p className={styles.subtitle}>Hand-picked by our team for exceptional quality</p>
      </div>

      <div className={styles.grid}>
        {featured.map((automation, index) => (
          <motion.article
            key={automation.id}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ background: gradients[index % gradients.length] }}
          >
            <div className={styles.cardContent}>
              <div className={styles.badge}>FEATURED</div>
              <div className={styles.icon}>{automation.icon || "⚙️"}</div>
              <h3 className={styles.cardTitle}>{automation.name}</h3>
              <p className={styles.cardDescription}>{automation.description}</p>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>⭐ {automation.rating?.toFixed(1) || "N/A"}</span>
                  <span className={styles.statLabel}>Rating</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>🚀 {automation.deploymentCount?.toLocaleString() || 0}</span>
                  <span className={styles.statLabel}>Deployments</span>
                </div>
              </div>

              <div className={styles.actions}>
                {onPreview && (
                  <button
                    type="button"
                    onClick={() => onPreview(automation)}
                    className={styles.previewButton}
                  >
                    Learn More
                  </button>
                )}
                {onDeploy && (
                  <button
                    type="button"
                    onClick={() => onDeploy(automation)}
                    className={styles.deployButton}
                  >
                    Deploy Now →
                  </button>
                )}
              </div>
            </div>

            <div className={styles.overlay} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedShowcase;


