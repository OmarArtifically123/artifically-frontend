"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import useInViewState from "@/hooks/useInViewState";

const CUSTOMER_RESULTS = [
  {
    company: "Atlas Finance",
    description: "Global financial services firm, 5,000+ employees",
    roi: 5.1,
    timeToRoi: "8 weeks",
    hoursPerWeek: 38,
    automations: 127,
    primaryUseCase: "Financial Close Automation",
    metrics: [
      { label: "Cost Reduction", value: "61%", color: "#0ea5e9" },
      { label: "Cycle Time", value: "35%", color: "#10b981" },
      { label: "Accuracy Improvement", value: "99.98%", color: "#f59e0b" },
    ],
  },
  {
    company: "Nova Retail",
    description: "Multi-channel retailer with 200+ locations",
    roi: 4.4,
    timeToRoi: "6 weeks",
    hoursPerWeek: 52,
    automations: 94,
    primaryUseCase: "Supply Chain Optimization",
    metrics: [
      { label: "Inventory Accuracy", value: "94.2%", color: "#8b5cf6" },
      { label: "Order Processing Time", value: "71%", color: "#06b6d4" },
      { label: "Demand Forecasting", value: "87%", color: "#f59e0b" },
    ],
  },
  {
    company: "Helios Health",
    description: "Healthcare provider network, 50+ facilities",
    roi: 6.2,
    timeToRoi: "10 weeks",
    hoursPerWeek: 44,
    automations: 156,
    primaryUseCase: "Patient Care Coordination",
    metrics: [
      { label: "Patient Outcomes", value: "23%", color: "#10b981" },
      { label: "Admin Time Reduction", value: "68%", color: "#0ea5e9" },
      { label: "HIPAA Compliance", value: "100%", color: "#f59e0b" },
    ],
  },
];

function CustomerCard({ customer, index }) {
  const cardRef = useRef(null);
  const isInView = useInViewState(cardRef);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.12, duration: 0.6 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group relative rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-950/50"
    >
      {/* Header with ROI Highlight */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{customer.company}</h3>
            <p className="text-sm text-slate-400 mt-1">{customer.description}</p>
          </div>
          <motion.div
            className="text-right"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-lg" />
              <div className="relative px-3 py-2 rounded-lg border border-green-500/50">
                <div className="text-2xl font-bold text-green-400">{customer.roi}x</div>
                <div className="text-xs text-green-300 font-semibold">ROI</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-cyan-400">{customer.automations}</div>
            <div className="text-xs text-slate-400">Automations</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-blue-400">{customer.hoursPerWeek}</div>
            <div className="text-xs text-slate-400">Hrs Saved/Wk</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="text-2xl font-bold text-purple-400">{customer.timeToRoi}</div>
            <div className="text-xs text-slate-400">To ROI</div>
          </div>
        </div>

        {/* Primary Use Case */}
        <div className="p-3 rounded-lg border border-slate-700 bg-slate-800/30">
          <div className="text-xs text-slate-400 font-semibold mb-1">PRIMARY USE CASE</div>
          <div className="text-sm text-slate-200">{customer.primaryUseCase}</div>
        </div>

        {/* Impact Metrics */}
        <div className="space-y-3 pt-4 border-t border-slate-700">
          {customer.metrics.map((metric, i) => (
            <motion.div
              key={i}
              className="space-y-1"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{metric.label}</span>
                <span className="font-bold" style={{ color: metric.color }}>
                  {metric.value}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-slate-600/10 to-transparent rounded-2xl" />
    </motion.div>
  );
}

export default function VerifiedResults() {
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

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
        background: "linear-gradient(180deg, rgba(15,15,30,0.5), rgba(10,10,20,0.3))",
      }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-green-500" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-5 bg-cyan-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 mb-4">
            VERIFIED IMPACT
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Enterprise Customers
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Transforming Operations
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            These aren't testimonials. These are verified results from enterprise customers
            running production automations that generate measurable business impact every single day.
          </p>
        </motion.div>

        {/* Customer Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CUSTOMER_RESULTS.map((customer, index) => (
            <CustomerCard key={customer.company} customer={customer} index={index} />
          ))}
        </div>

        {/* Aggregate Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: "Companies Transforming", value: "500+", color: "#0ea5e9" },
            { label: "Avg ROI Achieved", value: "5.1x", color: "#10b981" },
            { label: "Automations Created", value: "18.7K+", color: "#f59e0b" },
            { label: "Hours Freed Weekly", value: "2.1M+", color: "#8b5cf6" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
