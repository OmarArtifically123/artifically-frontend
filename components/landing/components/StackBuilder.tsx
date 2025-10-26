"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Download, Share2 } from "lucide-react";

interface StackItem {
  id: string;
  name: string;
  category: string;
}

interface StackBuilderProps {
  availableIntegrations: StackItem[];
}

/**
 * "Build your stack" feature - drag and drop integrations
 */
export default function StackBuilder({ availableIntegrations }: StackBuilderProps) {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const addToStack = (integration: StackItem) => {
    if (!stack.find((item) => item.id === integration.id)) {
      setStack([...stack, integration]);
    }
  };

  const removeFromStack = (integrationId: string) => {
    setStack(stack.filter((item) => item.id !== integrationId));
  };

  return (
    <div className="relative">
      {/* Floating stack indicator */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 rounded-xl
          bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold
          shadow-lg shadow-cyan-500/30 transition-all
          ${isExpanded ? "rounded-b-none" : ""}
        `}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5" />
        <span>My Stack</span>
        {stack.length > 0 && (
          <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
            {stack.length}
          </span>
        )}
      </motion.button>

      {/* Expanded stack panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-40 w-96 max-h-96 bg-slate-900 border border-slate-700 rounded-t-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Your Integration Stack</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
                <motion.button
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
              </div>
            </div>

            {/* Stack items */}
            <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
              {stack.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Click on integrations to add them to your stack
                </div>
              ) : (
                <div className="space-y-2">
                  {stack.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 group hover:border-cyan-500/50 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.category}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromStack(item.id)}
                        className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-slate-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Get started CTA */}
            {stack.length > 0 && (
              <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                <motion.button
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect {stack.length} Integration{stack.length > 1 ? "s" : ""}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}





