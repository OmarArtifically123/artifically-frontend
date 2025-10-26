"use client";

import { motion } from "framer-motion";
import type { UserRole } from "@/types/landing";

interface InteractiveRoleSelectorProps {
  roles: UserRole[];
  activeRole: string;
  onRoleChange: (roleId: string) => void;
}

/**
 * Interactive role selector with particle background effects
 */
export default function InteractiveRoleSelector({
  roles,
  activeRole,
  onRoleChange,
}: InteractiveRoleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {roles.map((role) => {
        const isActive = activeRole === role.id;

        return (
          <motion.button
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className={`
              relative px-6 py-3 rounded-lg font-medium text-sm
              transition-all duration-300 overflow-hidden
              ${isActive
                ? "text-white shadow-lg"
                : "text-slate-400 hover:text-white bg-slate-800/30 border border-slate-700 hover:border-slate-600"
              }
            `}
            style={{
              backgroundColor: isActive ? `${role.color}20` : undefined,
              borderColor: isActive ? `${role.color}60` : undefined,
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            aria-pressed={isActive}
            aria-label={`Select ${role.label} role`}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeRoleIndicator"
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: `${role.color}15`,
                  boxShadow: `0 0 20px ${role.color}40, inset 0 0 20px ${role.color}20`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}

            {/* Icon and label */}
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">{role.icon}</span>
              <span>{role.label}</span>
            </span>

            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${role.color}30, transparent 70%)`,
              }}
            />

            {/* Particle effect for active role */}
            {isActive && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: role.color,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
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
          </motion.button>
        );
      })}
    </div>
  );
}




