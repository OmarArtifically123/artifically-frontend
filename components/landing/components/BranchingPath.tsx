"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PathOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

interface BranchingPathProps {
  options: PathOption[];
  onSelect: (pathId: string) => void;
  selectedPath: string;
}

/**
 * Interactive branching path selector for different company sizes
 */
export default function BranchingPath({ options, onSelect, selectedPath }: BranchingPathProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <div className="relative py-12">
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Journey</h3>
        <p className="text-slate-400">Select your company size to see your tailored path</p>
      </motion.div>

      {/* Path options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {options.map((option, index) => {
          const isSelected = selectedPath === option.id;
          const isHovered = hoveredPath === option.id;

          return (
            <motion.button
              key={option.id}
              onClick={() => onSelect(option.id)}
              onMouseEnter={() => setHoveredPath(option.id)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`
                relative p-6 rounded-xl border cursor-pointer text-left
                transition-all duration-300
                ${isSelected
                  ? "border-current bg-gradient-to-br from-slate-800 to-slate-900"
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                }
              `}
              style={{
                borderColor: isSelected || isHovered ? option.color : undefined,
                boxShadow: isSelected ? `0 10px 40px ${option.color}30` : undefined,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-4"
                style={{
                  backgroundColor: `${option.color}20`,
                  border: `2px solid ${option.color}`,
                }}
              >
                {option.icon}
              </div>

              {/* Label */}
              <h4 className="text-lg font-bold text-white mb-2">{option.label}</h4>

              {/* Description */}
              <p className="text-sm text-slate-400">{option.description}</p>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selectedPath"
                  className="absolute top-4 right-4 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: option.color,
                    boxShadow: `0 0 12px ${option.color}`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              {/* Glow effect */}
              {(isSelected || isHovered) && (
                <div
                  className="absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none"
                  style={{ backgroundColor: option.color }}
                />
              )}

              {/* Connection line (for visual branching) */}
              {index < options.length - 1 && (
                <svg
                  className="hidden md:block absolute top-1/2 -right-6 w-12 h-12 transform -translate-y-1/2"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M 0 24 Q 24 24 24 0 L 48 0"
                    fill="none"
                    stroke={isSelected ? option.color : "#475569"}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <path
                    d="M 0 24 Q 24 24 24 48 L 48 48"
                    fill="none"
                    stroke={isSelected ? option.color : "#475569"}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Animated particles connecting paths */}
      {selectedPath && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: options.find((o) => o.id === selectedPath)?.color,
                left: `${20 + i * 15}%`,
                top: "50%",
              }}
              animate={{
                x: [0, 100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}





