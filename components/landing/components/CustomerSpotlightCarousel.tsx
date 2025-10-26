"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Customer {
  id: string;
  company: string;
  industry: string;
  size: string;
  logo?: string;
  summary: string;
  roi: number;
  timeToRoi: string;
  metrics: Array<{ label: string; value: string; color: string }>;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

interface CustomerSpotlightCarouselProps {
  customers: Customer[];
  isActive: boolean;
}

/**
 * 3D card stack carousel for customer spotlights
 */
export default function CustomerSpotlightCarousel({ customers, isActive }: CustomerSpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + customers.length) % customers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % customers.length);
  };

  const currentCustomer = customers[currentIndex];

  return (
    <div className="relative">
      {/* Main card */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 20 }}
            transition={{ duration: 0.5, type: "spring", damping: 25 }}
            className="relative p-8 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentCustomer.company}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{currentCustomer.industry}</span>
                  <span>•</span>
                  <span>{currentCustomer.size}</span>
                </div>
              </div>

              {/* ROI Badge */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-lg rounded-lg" />
                <div className="relative px-4 py-2 bg-slate-900 border border-green-500/50 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">
                    {currentCustomer.roi}x
                  </div>
                  <div className="text-xs text-green-300 font-semibold">
                    ROI in {currentCustomer.timeToRoi}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <p className="text-slate-300 mb-6 leading-relaxed">
              {currentCustomer.summary}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentCustomer.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="text-xs text-slate-400">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            {currentCustomer.testimonial && (
              <motion.div
                className="pt-6 border-t border-slate-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <blockquote className="text-slate-300 italic mb-4">
                  "{currentCustomer.testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {currentCustomer.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {currentCustomer.testimonial.author}
                    </div>
                    <div className="text-xs text-slate-400">
                      {currentCustomer.testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Decorative glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          onClick={handlePrevious}
          className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous customer"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2">
          {customers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === currentIndex ? "#06b6d4" : "#475569",
                width: index === currentIndex ? "1.5rem" : "0.5rem",
              }}
              aria-label={`Go to customer ${index + 1}`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next customer"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}





