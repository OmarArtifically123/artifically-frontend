"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ComponentDetails {
  id: string;
  label: string;
  description: string;
  features: string[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
  connections: string[];
}

interface ComponentZoomViewProps {
  component: ComponentDetails | null;
  onClose: () => void;
}

/**
 * Deep dive view when clicking on a component in the architecture
 */
export default function ComponentZoomView({ component, onClose }: ComponentZoomViewProps) {
  if (!component) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 bg-slate-900/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {component.label}
                </h3>
                <p className="text-slate-400">{component.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                Key Features
              </h4>
              <div className="space-y-2">
                {component.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-slate-300"
                  >
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {component.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                  >
                    <div className="text-2xl font-bold text-cyan-400 mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Connections */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Connected Systems
              </h4>
              <div className="flex flex-wrap gap-2">
                {component.connections.map((connection, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-sm text-slate-300"
                  >
                    {connection}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 bg-slate-900/50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}




