"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplaceStore } from "@/stores/marketplaceStore";
import { useAutomation } from "@/hooks/useMarketplaceData";
import type { Automation } from "@/types/marketplace";
import styles from "./ComparisonTable.module.css";

/**
 * ComparisonTable - Side-by-side automation comparison
 * Features:
 * - Compare up to 4 automations
 * - Feature-by-feature breakdown
 * - Pricing comparison
 * - Rating comparison
 * - WCAG 2.1 AAA compliant
 */
export function ComparisonTable() {
  const { comparisonList, removeFromComparison, clearComparison } = useMarketplaceStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={styles.trigger}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.triggerIcon}>📊</span>
            <span className={styles.triggerText}>
              Compare {comparisonList.length} automation{comparisonList.length !== 1 ? "s" : ""}
            </span>
          </motion.button>
        )}

        {isExpanded && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.modalContent}>
              {/* Header */}
              <div className={styles.header}>
                <h2 className={styles.title}>Compare Automations</h2>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    onClick={clearComparison}
                    className={styles.clearButton}
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className={styles.closeButton}
                    aria-label="Close comparison"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Comparison Grid */}
              <div className={styles.grid}>
                <div className={styles.labelColumn}>
                  <div className={styles.cell} />
                  <div className={styles.cell}>Name</div>
                  <div className={styles.cell}>Price</div>
                  <div className={styles.cell}>Rating</div>
                  <div className={styles.cell}>Deployments</div>
                  <div className={styles.cell}>ROI</div>
                  <div className={styles.cell}>Time Saved</div>
                  <div className={styles.cell}>Integrations</div>
                </div>

                {comparisonList.map((id) => (
                  <ComparisonColumn
                    key={id}
                    automationId={id}
                    onRemove={() => removeFromComparison(id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparisonColumn({ 
  automationId, 
  onRemove 
}: { 
  automationId: number | string; 
  onRemove: () => void;
}) {
  const { data: automation } = useAutomation(automationId);

  if (!automation) {
    return (
      <div className={styles.column}>
        <div className={styles.cell}>Loading...</div>
      </div>
    );
  }

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: automation.currency || "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.column}>
      <div className={`${styles.cell} ${styles.headerCell}`}>
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="Remove from comparison"
        >
          ✕
        </button>
        <div className={styles.automationIcon}>{automation.icon || "⚙️"}</div>
      </div>
      <div className={styles.cell}>{automation.name}</div>
      <div className={styles.cell}>{formatPrice(automation.priceMonthly)}</div>
      <div className={styles.cell}>⭐ {automation.rating?.toFixed(1) || "N/A"}</div>
      <div className={styles.cell}>{automation.deploymentCount?.toLocaleString() || 0}</div>
      <div className={styles.cell}>{automation.roi ? `${automation.roi}x` : "N/A"}</div>
      <div className={styles.cell}>{automation.hoursSavedWeekly || 0}h/week</div>
      <div className={styles.cell}>
        {automation.integrations?.sources?.length || 0} + {automation.integrations?.destinations?.length || 0}
      </div>
    </div>
  );
}

export default ComparisonTable;


