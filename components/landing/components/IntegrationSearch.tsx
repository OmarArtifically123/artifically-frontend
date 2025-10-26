"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description?: string;
  popular?: boolean;
}

interface IntegrationSearchProps {
  integrations: Integration[];
  onSelect: (integrationId: string) => void;
}

/**
 * Fuzzy search for integrations with live results
 */
export default function IntegrationSearch({ integrations, onSelect }: IntegrationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Fuzzy search implementation
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return integrations.slice(0, 8); // Show first 8 by default
    }

    const term = searchTerm.toLowerCase();
    return integrations
      .filter((integration) => {
        const nameMatch = integration.name.toLowerCase().includes(term);
        const categoryMatch = integration.category.toLowerCase().includes(term);
        const descMatch = integration.description?.toLowerCase().includes(term);
        return nameMatch || categoryMatch || descMatch;
      })
      .slice(0, 12);
  }, [searchTerm, integrations]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl
          bg-slate-900/50 border transition-all duration-300
          ${isFocused
            ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20"
            : "border-slate-700"
          }
        `}
      >
        <Search className={`w-5 h-5 ${isFocused ? "text-cyan-400" : "text-slate-400"}`} />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search 500+ integrations..."
          className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
        />

        {searchTerm && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleClear}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-slate-400" />
          </motion.button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {(isFocused || searchTerm) && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar"
          >
            {filteredResults.map((integration, index) => (
              <motion.button
                key={integration.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => {
                  onSelect(integration.id);
                  setSearchTerm("");
                }}
                className="w-full p-3 rounded-lg hover:bg-slate-800 transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {integration.name}
                      </span>
                      {integration.popular && (
                        <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{integration.category}</span>
                      {integration.description && (
                        <>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-xs text-slate-500 truncate">
                            {integration.description}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            ))}

            {/* No results */}
            {filteredResults.length === 0 && searchTerm && (
              <div className="p-6 text-center text-slate-400">
                No integrations found for "{searchTerm}"
              </div>
            )}

            {/* Browse all link */}
            <div className="mt-2 pt-2 border-t border-slate-700">
              <button className="w-full p-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors text-center">
                Browse All {integrations.length} Integrations →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




