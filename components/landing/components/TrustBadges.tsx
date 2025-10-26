"use client";

import { motion } from "framer-motion";

interface Badge {
  id: string;
  name: string;
  acronym: string;
  icon: string;
  description: string;
}

interface TrustBadgesProps {
  badges: Badge[];
  isActive: boolean;
}

/**
 * Certification and trust badges showcase
 */
export default function TrustBadges({ badges, isActive }: TrustBadgesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          className="group relative p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-cyan-500/50 transition-colors cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          whileHover={{ y: -4, scale: 1.05 }}
        >
          {/* Icon */}
          <div className="text-4xl mb-2 text-center">{badge.icon}</div>

          {/* Acronym */}
          <div className="text-center font-bold text-white text-sm mb-1">
            {badge.acronym}
          </div>

          {/* Name */}
          <div className="text-center text-xs text-slate-400">
            {badge.name}
          </div>

          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 whitespace-nowrap shadow-xl">
              {badge.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                <div className="border-4 border-transparent border-t-slate-700" />
              </div>
            </div>
          </div>

          {/* Verified checkmark */}
          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            ✓
          </div>
        </motion.div>
      ))}
    </div>
  );
}





