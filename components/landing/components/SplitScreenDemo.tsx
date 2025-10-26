"use client";

import { motion } from "framer-motion";

interface RoleView {
  title: string;
  features: string[];
  metrics: Array<{ label: string; value: string }>;
  color: string;
}

interface SplitScreenDemoProps {
  leftRole: RoleView;
  rightRole: RoleView;
  isActive: boolean;
}

/**
 * Split-screen comparison showing how the platform adapts to different roles
 */
export default function SplitScreenDemo({ leftRole, rightRole, isActive }: SplitScreenDemoProps) {
  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left Role */}
        <RolePane role={leftRole} isActive={isActive} delay={0} />

        {/* Divider */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

        {/* Right Role */}
        <RolePane role={rightRole} isActive={isActive} delay={0.2} />
      </div>

      {/* Center label */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-xs font-semibold text-slate-300 whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ delay: 0.4 }}
      >
        Same Platform, Personalized Experience
      </motion.div>
    </div>
  );
}

interface RolePaneProps {
  role: RoleView;
  isActive: boolean;
  delay: number;
}

function RolePane({ role, isActive, delay }: RolePaneProps) {
  return (
    <motion.div
      className="relative p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50"
      initial={{ opacity: 0, x: delay === 0 ? -20 : 20 }}
      animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: delay === 0 ? -20 : 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: role.color }}
        >
          {role.title}
        </h3>
        <div className="h-1 w-12 rounded-full" style={{ backgroundColor: role.color }} />
      </motion.div>

      {/* Features */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: delay + 0.3 }}
      >
        <h4 className="text-sm font-semibold text-slate-400 mb-3">Personalized Features</h4>
        <div className="space-y-2">
          {role.features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-2 text-sm text-slate-300"
              initial={{ opacity: 0, x: -10 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: delay + 0.4 + index * 0.05 }}
            >
              <span className="text-xs mt-1" style={{ color: role.color }}>
                ✓
              </span>
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: delay + 0.5 }}
      >
        <h4 className="text-sm font-semibold text-slate-400 mb-3">Your Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          {role.metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="p-3 rounded-lg border border-slate-700 bg-slate-900/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: delay + 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.05, borderColor: role.color }}
            >
              <div className="text-lg font-bold" style={{ color: role.color }}>
                {metric.value}
              </div>
              <div className="text-xs text-slate-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${delay === 0 ? "left" : "right"}, ${role.color}, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}





