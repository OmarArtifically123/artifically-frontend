"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MetricCard {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "neutral";
  color: string;
  icon: string;
}

interface LiveMetricsDashboardProps {
  metrics: MetricCard[];
  isActive: boolean;
}

/**
 * Live metrics dashboard with count-up animations and trend indicators
 */
export default function LiveMetricsDashboard({ metrics, isActive }: LiveMetricsDashboardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <AnimatedMetricCard
          key={metric.id}
          metric={metric}
          isActive={isActive}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

interface AnimatedMetricCardProps {
  metric: MetricCard;
  isActive: boolean;
  delay: number;
}

function AnimatedMetricCard({ metric, isActive, delay }: AnimatedMetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(0);
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration;
    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;
      const now = Date.now();

      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      if (now >= endTime) {
        setDisplayValue(metric.value);
        return;
      }

      const progress = (now - startTime) / duration;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = metric.value * eased;

      setDisplayValue(current);
      requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      isMounted = false;
    };
  }, [metric.value, isActive, delay]);

  // Format the value
  const formattedValue = metric.unit === "%" || metric.unit === "K+" || metric.unit === "M+"
    ? Math.round(displayValue)
    : displayValue.toFixed(1);

  // Trend icon
  const trendIcon = metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→";
  const trendColor = metric.trend === "up" ? "#10b981" : metric.trend === "down" ? "#ef4444" : "#64748b";

  return (
    <motion.div
      className="relative p-6 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, borderColor: metric.color }}
    >
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
        style={{
          backgroundColor: `${metric.color}20`,
          color: metric.color,
        }}
      >
        <span className="text-2xl">{metric.icon}</span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <motion.span
          className="text-4xl font-bold"
          style={{ color: metric.color }}
          animate={{
            textShadow: isActive
              ? `0 0 20px ${metric.color}50`
              : "none",
          }}
        >
          {formattedValue}
        </motion.span>
        <span className="text-xl text-slate-400">{metric.unit}</span>
      </div>

      {/* Label */}
      <p className="text-sm text-slate-400 font-medium mb-4">
        {metric.label}
      </p>

      {/* Trend indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span style={{ color: trendColor }}>{trendIcon}</span>
        <span className="text-slate-500">
          {metric.trend === "up" && "Improving"}
          {metric.trend === "down" && "Decreasing"}
          {metric.trend === "neutral" && "Stable"}
        </span>
      </div>

      {/* Progress bar */}
      <motion.div
        className="mt-4 h-1 rounded-full bg-slate-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: metric.color }}
          initial={{ width: "0%" }}
          animate={{
            width: isActive ? "100%" : "0%",
          }}
          transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
        />
      </motion.div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-32 h-32 blur-2xl"
          style={{ backgroundColor: `${metric.color}30` }}
        />
      </div>

      {/* Live indicator */}
      {isActive && (
        <div className="absolute top-4 right-4">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: metric.color }}
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}





