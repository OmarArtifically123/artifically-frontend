"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Metric {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface RealTimeMetricsProps {
  metrics: Metric[];
  isActive: boolean;
}

/**
 * Real-time metrics counter with smooth count-up animations
 */
export default function RealTimeMetrics({ metrics, isActive }: RealTimeMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.label}
          metric={metric}
          isActive={isActive}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

interface MetricCardProps {
  metric: Metric;
  isActive: boolean;
  delay: number;
}

function MetricCard({ metric, isActive, delay }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(0);
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration;

    const animate = () => {
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
  }, [metric.value, isActive, delay]);

  const formattedValue = metric.unit === "%"
    ? Math.round(displayValue)
    : displayValue.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
      className="relative p-6 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm overflow-hidden group"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${metric.color}20, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
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
          <span className="text-2xl text-slate-400">{metric.unit}</span>
        </div>

        <p className="text-sm text-slate-400 font-medium">
          {metric.label}
        </p>

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
              width: isActive ? `${(displayValue / metric.value) * 100}%` : "0%",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-20 h-20 blur-2xl opacity-20"
        style={{ backgroundColor: metric.color }}
      />
    </motion.div>
  );
}




