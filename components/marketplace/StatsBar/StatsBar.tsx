"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { MarketplaceStatsResponse } from "@/types/marketplace";
import styles from "./StatsBar.module.css";

interface StatsBarProps {
  stats: MarketplaceStatsResponse;
}

/**
 * StatsBar - Live animated statistics
 */
export function StatsBar({ stats }: StatsBarProps) {
  const [animatedStats, setAnimatedStats] = useState({
    totalAutomations: 0,
    totalDeployments: 0,
    avgRating: 0,
    totalReviews: 0,
  });

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalAutomations: Math.floor(stats.totalAutomations * progress),
        totalDeployments: Math.floor(stats.totalDeployments * progress),
        avgRating: parseFloat((stats.avgRating * progress).toFixed(1)),
        totalReviews: Math.floor(stats.totalReviews * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const statItems = [
    {
      label: "Automations",
      value: animatedStats.totalAutomations.toLocaleString(),
      icon: "⚡",
    },
    {
      label: "Active Deployments",
      value: animatedStats.totalDeployments.toLocaleString(),
      icon: "🚀",
    },
    {
      label: "Average Rating",
      value: `${animatedStats.avgRating}/5.0`,
      icon: "⭐",
    },
    {
      label: "Reviews",
      value: animatedStats.totalReviews.toLocaleString(),
      icon: "💬",
    },
  ];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={styles.stat}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className={styles.icon} aria-hidden="true">
            {stat.icon}
          </div>
          <div className={styles.content}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default StatsBar;

