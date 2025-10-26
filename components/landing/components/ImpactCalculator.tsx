"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, Zap } from "lucide-react";

interface ImpactCalculatorProps {
  isActive: boolean;
}

/**
 * Interactive calculator showing transformation impact
 */
export default function ImpactCalculator({ isActive }: ImpactCalculatorProps) {
  const [values, setValues] = useState({
    employees: 50,
    processesPerWeek: 20,
    hoursPerProcess: 2,
    hourlyRate: 50,
  });

  const [results, setResults] = useState({
    timeFreedPerWeek: 0,
    annualTimeSaved: 0,
    annualCostSaved: 0,
    roi: 0,
  });

  // Calculate results
  useEffect(() => {
    const manualHoursPerWeek = values.processesPerWeek * values.hoursPerProcess;
    const automationRate = 0.75; // 75% automation
    const timeFreedPerWeek = manualHoursPerWeek * automationRate;
    const annualTimeSaved = timeFreedPerWeek * 52;
    const annualCostSaved = annualTimeSaved * values.hourlyRate;
    const platformCost = 50000; // Example annual platform cost
    const roi = (annualCostSaved / platformCost) * 100;

    setResults({
      timeFreedPerWeek,
      annualTimeSaved,
      annualCostSaved,
      roi,
    });
  }, [values]);

  const handleChange = (field: keyof typeof values, value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">Your Inputs</h3>

        {/* Employee count */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Number of Employees</label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={values.employees}
            onChange={(e) => handleChange("employees", parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">10</span>
            <span className="text-cyan-400 font-bold">{values.employees}</span>
            <span className="text-slate-500">500</span>
          </div>
        </div>

        {/* Processes per week */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Processes Per Week</label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={values.processesPerWeek}
            onChange={(e) => handleChange("processesPerWeek", parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">5</span>
            <span className="text-cyan-400 font-bold">{values.processesPerWeek}</span>
            <span className="text-slate-500">100</span>
          </div>
        </div>

        {/* Hours per process */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Hours Per Process</label>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={values.hoursPerProcess}
            onChange={(e) => handleChange("hoursPerProcess", parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">1h</span>
            <span className="text-cyan-400 font-bold">{values.hoursPerProcess}h</span>
            <span className="text-slate-500">8h</span>
          </div>
        </div>

        {/* Hourly rate */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Hourly Rate ($)</label>
          <input
            type="range"
            min="25"
            max="150"
            step="5"
            value={values.hourlyRate}
            onChange={(e) => handleChange("hourlyRate", parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">$25</span>
            <span className="text-cyan-400 font-bold">${values.hourlyRate}</span>
            <span className="text-slate-500">$150</span>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">Your Projected Impact</h3>

        {/* Result cards */}
        <ResultCard
          icon={<Clock className="w-6 h-6" />}
          label="Time Freed Per Week"
          value={`${Math.round(results.timeFreedPerWeek)} hours`}
          color="#06b6d4"
          isActive={isActive}
          delay={0.3}
        />

        <ResultCard
          icon={<Zap className="w-6 h-6" />}
          label="Annual Time Saved"
          value={`${Math.round(results.annualTimeSaved).toLocaleString()} hours`}
          color="#f59e0b"
          isActive={isActive}
          delay={0.4}
        />

        <ResultCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Annual Cost Savings"
          value={`$${Math.round(results.annualCostSaved).toLocaleString()}`}
          color="#10b981"
          isActive={isActive}
          delay={0.5}
        />

        <ResultCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Projected ROI"
          value={`${Math.round(results.roi)}%`}
          color="#8b5cf6"
          isActive={isActive}
          delay={0.6}
        />
      </motion.div>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  isActive: boolean;
  delay: number;
}

function ResultCard({ icon, label, value, color, isActive, delay }: ResultCardProps) {
  return (
    <motion.div
      className="p-4 rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50"
      initial={{ opacity: 0, y: 10 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, borderColor: color }}
    >
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: `${color}20`,
            color,
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-400 mb-1">{label}</div>
          <div className="text-2xl font-bold" style={{ color }}>
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

