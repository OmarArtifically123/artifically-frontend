"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

interface ComparisonItem {
  label: string;
  before: string | string[];
  after: string | string[];
}

interface ProcessComparisonProps {
  items: ComparisonItem[];
  isActive: boolean;
}

/**
 * Side-by-side process comparison with satisfying animations
 */
export default function ProcessComparison({ items, isActive }: ProcessComparisonProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {/* Label */}
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white">{item.label}</h4>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before */}
            <motion.div
              className="relative p-4 rounded-lg border border-red-900/50 bg-gradient-to-br from-red-950/20 to-slate-950/40"
              initial={{ x: -20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <X className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold text-red-400">Before</span>
              </div>

              {Array.isArray(item.before) ? (
                <ul className="space-y-2">
                  {item.before.map((point, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-300">{item.before}</p>
              )}
            </motion.div>

            {/* After */}
            <motion.div
              className="relative p-4 rounded-lg border border-green-900/50 bg-gradient-to-br from-green-950/20 to-slate-950/40"
              initial={{ x: 20, opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400">After</span>
              </div>

              {Array.isArray(item.after) ? (
                <ul className="space-y-2">
                  {item.after.map((point, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-300">{item.after}</p>
              )}
            </motion.div>
          </div>

          {/* Arrow indicator */}
          <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              className="w-10 h-10 rounded-full bg-slate-900 border-2 border-green-500 flex items-center justify-center text-green-400 text-xl font-bold shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
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


