"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface XRayModeProps {
  enabled: boolean;
  onToggle: () => void;
}

/**
 * Toggle button for X-Ray mode visualization
 */
export default function XRayMode({ enabled, onToggle }: XRayModeProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-300
        ${enabled
          ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400"
          : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-pressed={enabled}
      aria-label={enabled ? "Disable X-Ray mode" : "Enable X-Ray mode"}
    >
      {enabled ? (
        <>
          <Eye className="w-4 h-4" />
          <span>X-Ray Mode On</span>
        </>
      ) : (
        <>
          <EyeOff className="w-4 h-4" />
          <span>X-Ray Mode Off</span>
        </>
      )}

      {/* Glow effect when active */}
      {enabled && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}




