"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink } from "./lucide-icons-fallback";
import { X } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  logo?: string;
  features: string[];
  verified?: boolean;
  popular?: boolean;
  setupTime?: string;
  documentationUrl?: string;
}

interface IntegrationDetailModalProps {
  integration: Integration | null;
  onClose: () => void;
  onAddToStack?: (integrationId: string) => void;
}

/**
 * Modal showing detailed information about an integration
 */
export default function IntegrationDetailModal({
  integration,
  onClose,
  onAddToStack,
}: IntegrationDetailModalProps) {
  if (!integration) return null;

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
          <div className="relative p-6 border-b border-slate-700 bg-slate-900/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Logo placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                  {integration.name.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-white">
                      {integration.name}
                    </h3>
                    {integration.verified && (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {integration.popular && (
                      <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{integration.category}</p>
                </div>
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
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">About</h4>
              <p className="text-slate-300 leading-relaxed">
                {integration.description}
              </p>
            </div>

            {/* Setup Time */}
            {integration.setupTime && (
              <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Setup Time</span>
                  <span className="font-semibold text-cyan-400">
                    {integration.setupTime}
                  </span>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
              <div className="space-y-2">
                {integration.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-slate-300"
                  >
                    <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Documentation link */}
            {integration.documentationUrl && (
              <a
                href={integration.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex gap-3">
            <motion.button
              onClick={() => {
                onAddToStack?.(integration.id);
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add to My Stack
            </motion.button>
            
            <motion.button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>

          {/* Decorative glow */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}





