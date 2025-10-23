"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInViewState } from "@/hooks/useInViewState";

const PATTERNS = [
  {
    id: "quick-win",
    name: "Quick Win",
    popularity: 94,
    icon: "⚡",
    timeToValue: "1-2 weeks",
    complexity: "Low",
    description: "Start with high-impact, low-effort automations",
    examples: ["Report generation", "Data validation", "Alert routing"],
    color: "#f59e0b",
  },
  {
    id: "core-process",
    name: "Core Process",
    popularity: 87,
    icon: "⚙️",
    timeToValue: "4-6 weeks",
    complexity: "Medium",
    description: "Automate your most critical business processes",
    examples: ["Order fulfillment", "Expense approval", "Customer onboarding"],
    color: "#0ea5e9",
  },
  {
    id: "intelligence",
    name: "Intelligent Decision",
    popularity: 79,
    icon: "🧠",
    timeToValue: "6-8 weeks",
    complexity: "High",
    description: "Implement AI-driven decision automation",
    examples: ["Risk scoring", "Lead qualification", "Opportunity detection"],
    color: "#8b5cf6",
  },
  {
    id: "ecosystem",
    name: "Ecosystem Integration",
    popularity: 82,
    icon: "🔗",
    timeToValue: "3-5 weeks",
    complexity: "Medium",
    description: "Connect and orchestrate across all your systems",
    examples: ["Data synchronization", "Cross-system workflows", "Event routing"],
    color: "#10b981",
  },
  {
    id: "continuous",
    name: "Continuous Optimization",
    popularity: 88,
    icon: "📊",
    timeToValue: "Ongoing",
    complexity: "Low",
    description: "Continuously improve automations based on real data",
    examples: ["Performance tuning", "Cost optimization", "Quality improvement"],
    color: "#06b6d4",
  },
  {
    id: "governance",
    name: "Governance & Control",
    popularity: 91,
    icon: "🔐",
    timeToValue: "2-3 weeks",
    complexity: "Low",
    description: "Ensure compliance and maintain control across all automations",
    examples: ["Audit trails", "Approval workflows", "Exception handling"],
    color: "#ec4899",
  },
];

function PatternCard({ pattern, index, isSelected, onSelect }) {
  const cardRef = useRef(null);
  const isInView = useInViewState(cardRef);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.08, duration: 0.5 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onClick={() => onSelect(pattern.id)}
      className="cursor-pointer"
    >
      <motion.div
        className={`relative rounded-xl border p-6 transition-all h-full ${
          isSelected
            ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-500"
            : "bg-slate-900/30 border-slate-700 hover:border-slate-600"
        }`}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Popularity Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl overflow-hidden bg-slate-800">
          <motion.div
            className="h-full"
            style={{ backgroundColor: pattern.color }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${pattern.popularity}%` } : { width: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          />
        </div>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl mb-2">{pattern.icon}</div>
              <h3 className="text-lg font-bold text-white">{pattern.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: pattern.color }}>
                {pattern.popularity}%
              </div>
              <div className="text-xs text-slate-400">adoption</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300">{pattern.description}</p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
            <div>
              <div className="text-xs text-slate-400">Time to Value</div>
              <div className="text-sm font-semibold text-white">{pattern.timeToValue}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Complexity</div>
              <div className="text-sm font-semibold text-white">{pattern.complexity}</div>
            </div>
          </div>

          {/* Examples */}
          <div>
            <div className="text-xs text-slate-400 mb-2">Popular Use Cases</div>
            <div className="space-y-1">
              {pattern.examples.slice(0, 2).map((example, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: pattern.color }} />
                  {example}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="absolute top-4 right-4"
            layoutId="selectedPattern"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pattern.color, boxShadow: `0 0 12px ${pattern.color}` }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function PatternIntelligence() {
  const [selectedPattern, setSelectedPattern] = useState("quick-win");
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const activePattern = PATTERNS.find((p) => p.id === selectedPattern);

  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,20,0.3), rgba(15,15,30,0.5))",
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 bg-amber-500" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-pink-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 mb-4">
            PROVEN PATTERNS
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How Thousands
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Start Their Journey
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Our most successful customers follow proven patterns that maximize impact while
            minimizing complexity. Start with what works, then expand from there.
          </p>
        </motion.div>

        {/* Pattern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PATTERNS.map((pattern, index) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              index={index}
              isSelected={selectedPattern === pattern.id}
              onSelect={setSelectedPattern}
            />
          ))}
        </div>

        {/* Selected Pattern Details */}
        <motion.div
          key={selectedPattern}
          className="mt-12 pt-12 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-4xl">{activePattern?.icon}</span>
                {activePattern?.name} Pattern
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6">{activePattern?.description}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Typical Implementation Path</h4>
                  <ol className="space-y-2 text-sm text-slate-300">
                    {[
                      "Discover: Identify automation opportunities within your workflows",
                      "Design: Collaborate with Artifically AI on optimal solution architecture",
                      "Deploy: Automated deployment with continuous monitoring",
                      "Optimize: Continuous improvement based on real-world performance",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-bold text-slate-500 flex-shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-950/50">
                <h4 className="font-semibold text-white mb-4">Included Resources</h4>
                <ul className="space-y-3">
                  {[
                    "AI-powered discovery & assessment",
                    "Architecture & design consultation",
                    "Dedicated implementation team",
                    "24/7 monitoring & support",
                    "Continuous optimization",
                  ].map((resource, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: activePattern?.color }}
                      />
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all"
                style={{
                  backgroundColor: activePattern?.color + "22",
                  borderWidth: "1px",
                  borderColor: activePattern?.color + "66",
                  color: activePattern?.color,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore {activePattern?.name} Pattern
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
