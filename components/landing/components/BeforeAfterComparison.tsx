"use client";

import { motion } from "framer-motion";

interface ComparisonMetric {
  label: string;
  before: string;
  after: string;
  improvement: string;
  color: string;
}

interface BeforeAfterComparisonProps {
  metrics: ComparisonMetric[];
  isActive: boolean;
}

/**
 * Before/after metric comparisons with satisfying animations
 */
export default function BeforeAfterComparison({ metrics, isActive }: BeforeAfterComparisonProps) {
  return (
    <div className="space-y-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {/* Label */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">
              {metric.label}
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: metric.color }}
            >
              {metric.improvement} improvement
            </span>
          </div>

          {/* Comparison bars */}
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <motion.div
              className="p-4 rounded-lg border border-red-900/50 bg-gradient-to-br from-red-950/20 to-slate-950/40"
              initial={{ x: -20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <div className="text-xs text-red-400 mb-2">Before</div>
              <div className="text-2xl font-bold text-red-300">
                {metric.before}
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              className="p-4 rounded-lg border border-green-900/50 bg-gradient-to-br from-green-950/20 to-slate-950/40"
              initial={{ x: 20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <div className="text-xs text-green-400 mb-2">After</div>
              <div className="text-2xl font-bold text-green-300">
                {metric.after}
              </div>
            </motion.div>
          </div>

          {/* Arrow indicator */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              className="w-8 h-8 rounded-full bg-slate-900 border-2 flex items-center justify-center text-green-400"
              style={{ borderColor: metric.color }}
              initial={{ scale: 0 }}
              animate={isActive ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}




