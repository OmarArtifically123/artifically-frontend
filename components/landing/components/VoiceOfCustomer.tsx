"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CustomerQuote {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

interface VoiceOfCustomerProps {
  quotes: CustomerQuote[];
  activeRoleId: string;
  color: string;
}

/**
 * Customer testimonials that morph based on selected role
 */
export default function VoiceOfCustomer({ quotes, activeRoleId, color }: VoiceOfCustomerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset to first quote when role changes
    setCurrentIndex(0);

    // Auto-cycle through quotes
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeRoleId, quotes.length]);

  const currentQuote = quotes[currentIndex];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeRoleId}-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-hidden"
        >
          {/* Quote mark */}
          <div
            className="absolute top-4 left-4 text-6xl opacity-10 font-serif"
            style={{ color }}
          >
            "
          </div>

          {/* Content */}
          <div className="relative z-10">
            <blockquote className="text-lg text-slate-200 mb-6 leading-relaxed">
              "{currentQuote.quote}"
            </blockquote>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{
                  backgroundColor: `${color}20`,
                  border: `2px solid ${color}`,
                  color,
                }}
              >
                {currentQuote.author.charAt(0)}
              </div>

              {/* Author info */}
              <div>
                <div className="font-semibold text-white">{currentQuote.author}</div>
                <div className="text-sm text-slate-400">
                  {currentQuote.role} at {currentQuote.company}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative glow */}
          <div
            className="absolute bottom-0 right-0 w-64 h-64 opacity-10 blur-3xl pointer-events-none"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      {quotes.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === currentIndex ? color : "#475569",
                width: index === currentIndex ? "1.5rem" : "0.5rem",
              }}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}





