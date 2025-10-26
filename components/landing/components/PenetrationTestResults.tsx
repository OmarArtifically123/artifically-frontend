"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "./lucide-icons-fallback";
import { Shield, AlertTriangle } from "lucide-react";

interface TestResult {
  category: string;
  tested: number;
  passed: number;
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const TEST_RESULTS: TestResult[] = [
  {
    category: "Network Security",
    tested: 142,
    passed: 142,
    severity: { critical: 0, high: 0, medium: 0, low: 0 },
  },
  {
    category: "Application Security",
    tested: 238,
    passed: 238,
    severity: { critical: 0, high: 0, medium: 0, low: 0 },
  },
  {
    category: "API Security",
    tested: 156,
    passed: 156,
    severity: { critical: 0, high: 0, medium: 0, low: 0 },
  },
  {
    category: "Authentication",
    tested: 89,
    passed: 89,
    severity: { critical: 0, high: 0, medium: 0, low: 0 },
  },
];

interface PenetrationTestResultsProps {
  isActive: boolean;
}

/**
 * Penetration test results showcase
 */
export default function PenetrationTestResults({ isActive }: PenetrationTestResultsProps) {
  const totalTested = TEST_RESULTS.reduce((sum, r) => sum + r.tested, 0);
  const totalPassed = TEST_RESULTS.reduce((sum, r) => sum + r.passed, 0);
  const passRate = ((totalPassed / totalTested) * 100).toFixed(1);

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Quarterly Penetration Testing
        </h3>
        <p className="text-slate-400">
          Independent security assessments by leading cybersecurity firms
        </p>
      </div>

      {/* Overall Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 rounded-xl border border-green-900/50 bg-gradient-to-br from-green-950/20 to-slate-950/40 text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">
            {totalTested}
          </div>
          <div className="text-sm text-slate-400">Tests Performed</div>
        </div>

        <div className="p-6 rounded-xl border border-green-900/50 bg-gradient-to-br from-green-950/20 to-slate-950/40 text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">
            {passRate}%
          </div>
          <div className="text-sm text-slate-400">Pass Rate</div>
        </div>

        <div className="p-6 rounded-xl border border-green-900/50 bg-gradient-to-br from-green-950/20 to-slate-950/40 text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">
            0
          </div>
          <div className="text-sm text-slate-400">Critical Issues</div>
        </div>
      </motion.div>

      {/* Test Categories */}
      <div className="space-y-4">
        {TEST_RESULTS.map((result, index) => (
          <motion.div
            key={result.category}
            className="p-4 rounded-lg border border-slate-700 bg-slate-900/50"
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-semibold text-white text-sm">
                    {result.category}
                  </div>
                  <div className="text-xs text-slate-400">
                    {result.tested} tests performed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-green-400">
                  {result.passed}/{result.tested} passed
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: "0%" }}
                animate={isActive ? { width: `${(result.passed / result.tested) * 100}%` } : { width: "0%" }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Last test info */}
      <motion.div
        className="mt-8 p-4 rounded-lg border border-slate-700 bg-slate-900/30 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-sm text-slate-400">
          Last penetration test: <span className="text-white">October 2024</span>
        </div>
        <div className="text-sm text-slate-400">
          Next scheduled: <span className="text-white">January 2025</span>
        </div>
      </motion.div>

      {/* View full report */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          View Full Security Assessment Report →
        </button>
      </motion.div>
    </div>
  );
}


