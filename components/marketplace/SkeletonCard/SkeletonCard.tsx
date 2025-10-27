"use client";

import styles from "./SkeletonCard.module.css";

/**
 * SkeletonCard - Loading placeholder for AutomationCard
 */
export function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title} />
          <div className={styles.price} />
        </div>
        <div className={styles.description}>
          <div className={styles.line} />
          <div className={styles.line} />
        </div>
        <div className={styles.metrics}>
          <div className={styles.metric} />
          <div className={styles.metric} />
          <div className={styles.metric} />
        </div>
        <div className={styles.tags}>
          <div className={styles.tag} />
          <div className={styles.tag} />
          <div className={styles.tag} />
        </div>
        <div className={styles.actions}>
          <div className={styles.button} />
          <div className={styles.button} />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;

