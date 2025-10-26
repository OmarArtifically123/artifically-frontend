"use client";

import { motion } from "framer-motion";

interface FilterOption {
  id: string;
  label: string;
  icon: string;
  count: number;
}

interface IndustryFilterProps {
  options: FilterOption[];
  activeFilters: string[];
  onToggle: (filterId: string) => void;
}

/**
 * Interactive industry filter with counts
 */
export default function IndustryFilter({ options, activeFilters, onToggle }: IndustryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* All filter */}
      <motion.button
        onClick={() => onToggle("all")}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm transition-all
          ${activeFilters.length === 0 || activeFilters.includes("all")
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-white"
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        All Industries
      </motion.button>

      {/* Individual filters */}
      {options.map((option) => {
        const isActive = activeFilters.includes(option.id);

        return (
          <motion.button
            key={option.id}
            onClick={() => onToggle(option.id)}
            className={`
              relative px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${isActive
                ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/50"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-white"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              <span>{option.icon}</span>
              <span>{option.label}</span>
              <span
                className={`
                  ml-1 px-1.5 py-0.5 rounded text-xs
                  ${isActive
                    ? "bg-cyan-500/30 text-cyan-300"
                    : "bg-slate-700/50 text-slate-500"
                  }
                `}
              >
                {option.count}
              </span>
            </span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 border-2 border-cyan-500 rounded-lg pointer-events-none"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}





