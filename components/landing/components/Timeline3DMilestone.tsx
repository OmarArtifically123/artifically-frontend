"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import useInViewState from "@/hooks/useInViewState";

interface Milestone {
  day: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  metrics?: Array<{ label: string; value: string }>;
}

interface Timeline3DMilestoneProps {
  milestone: Milestone;
  index: number;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * 3D milestone marker with hover effects
 */
export default function Timeline3DMilestone({
  milestone,
  index,
  isActive,
  onClick,
}: Timeline3DMilestoneProps) {
  const cardRef = useRef(null);
  const isInView = useInViewState(cardRef);

  return (
    <motion.div
      ref={cardRef}
      className="relative min-w-[300px] mx-4"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-slate-900 z-10"
        style={{
          backgroundColor: milestone.color,
          boxShadow: `0 0 20px ${milestone.color}`,
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          boxShadow: isActive
            ? [
                `0 0 20px ${milestone.color}`,
                `0 0 40px ${milestone.color}`,
                `0 0 20px ${milestone.color}`,
              ]
            : `0 0 10px ${milestone.color}`,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
        }}
      />

      {/* Milestone card */}
      <motion.div
        className={`
          relative mt-12 p-6 rounded-xl border cursor-pointer
          transition-all duration-300
          ${isActive
            ? "border-current bg-gradient-to-br from-slate-800 to-slate-900"
            : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
          }
        `}
        style={{
          borderColor: isActive ? milestone.color : undefined,
          boxShadow: isActive ? `0 10px 40px ${milestone.color}30` : undefined,
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-4"
          style={{
            backgroundColor: `${milestone.color}20`,
            border: `2px solid ${milestone.color}`,
          }}
        >
          {milestone.icon}
        </div>

        {/* Day badge */}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{
            backgroundColor: `${milestone.color}20`,
            color: milestone.color,
          }}
        >
          Day {milestone.day}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4">{milestone.description}</p>

        {/* Metrics */}
        {milestone.metrics && (
          <div className="space-y-2">
            {milestone.metrics.map((metric, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <span className="text-slate-400">{metric.label}</span>
                <span className="font-bold" style={{ color: milestone.color }}>
                  {metric.value}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Glow effect */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-xl opacity-20 blur-xl pointer-events-none"
            style={{ backgroundColor: milestone.color }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}




