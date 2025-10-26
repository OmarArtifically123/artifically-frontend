"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Server, Key } from "./lucide-icons-fallback";
import { Shield, Lock, AlertTriangle } from "lucide-react";

interface SecurityLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  color: string;
}

const SECURITY_LAYERS: SecurityLayer[] = [
  {
    id: "network",
    name: "Network Security",
    icon: <Server className="w-6 h-6" />,
    description: "Multi-layer network protection with DDoS mitigation and WAF",
    features: [
      "DDoS protection with 10Tbps capacity",
      "Web Application Firewall (WAF)",
      "TLS 1.3 encryption in transit",
      "Private VPC isolation",
      "Geographic access controls",
    ],
    color: "#06b6d4",
  },
  {
    id: "application",
    name: "Application Security",
    icon: <Shield className="w-6 h-6" />,
    description: "Secure coding practices with automated vulnerability scanning",
    features: [
      "OWASP Top 10 compliance",
      "Automated security testing",
      "Code signing & verification",
      "Input validation & sanitization",
      "SQL injection prevention",
    ],
    color: "#8b5cf6",
  },
  {
    id: "data",
    name: "Data Protection",
    icon: <Lock className="w-6 h-6" />,
    description: "End-to-end encryption with field-level security",
    features: [
      "AES-256 encryption at rest",
      "Field-level encryption",
      "Key rotation every 90 days",
      "Hardware Security Modules (HSM)",
      "Zero-knowledge architecture",
    ],
    color: "#10b981",
  },
  {
    id: "access",
    name: "Access Control",
    icon: <Key className="w-6 h-6" />,
    description: "Multi-factor authentication with granular permissions",
    features: [
      "Multi-factor authentication (MFA)",
      "Single Sign-On (SSO)",
      "Role-based access control (RBAC)",
      "Attribute-based access (ABAC)",
      "Session management & timeout",
    ],
    color: "#f59e0b",
  },
  {
    id: "monitoring",
    name: "Threat Detection",
    icon: <Eye className="w-6 h-6" />,
    description: "24/7 security monitoring with AI-powered threat detection",
    features: [
      "Real-time anomaly detection",
      "AI-powered threat intelligence",
      "24/7 SOC monitoring",
      "Automated incident response",
      "Penetration testing quarterly",
    ],
    color: "#ec4899",
  },
  {
    id: "compliance",
    name: "Compliance & Audit",
    icon: <AlertTriangle className="w-6 h-6" />,
    description: "Comprehensive audit trails with regulatory compliance",
    features: [
      "Immutable audit logs",
      "SOC 2 Type II certified",
      "HIPAA compliant",
      "GDPR & CCPA ready",
      "Annual third-party audits",
    ],
    color: "#3b82f6",
  },
];

interface SecurityLayersExplorerProps {
  isActive: boolean;
}

/**
 * Interactive security layers explorer
 */
export default function SecurityLayersExplorer({ isActive }: SecurityLayersExplorerProps) {
  const [activeLayer, setActiveLayer] = useState("network");

  const current = SECURITY_LAYERS.find((l) => l.id === activeLayer) || SECURITY_LAYERS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Layer selector */}
      <div className="space-y-2">
        {SECURITY_LAYERS.map((layer, index) => (
          <motion.button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`
              w-full p-4 rounded-lg text-left transition-all
              ${activeLayer === layer.id
                ? "border-2 bg-gradient-to-r from-slate-900 to-slate-800"
                : "border border-slate-700 bg-slate-900/50 hover:border-slate-600"
              }
            `}
            style={{
              borderColor: activeLayer === layer.id ? layer.color : undefined,
              boxShadow: activeLayer === layer.id ? `0 0 20px ${layer.color}40` : undefined,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: `${layer.color}20`,
                  color: layer.color,
                }}
              >
                {layer.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">
                  {layer.name}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Layer details */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-800/50 h-full"
            style={{
              borderColor: `${current.color}40`,
              boxShadow: `0 0 30px ${current.color}20`,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: `${current.color}20`,
                  color: current.color,
                }}
              >
                {current.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {current.name}
                </h3>
                <p className="text-sm text-slate-400">{current.description}</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mt-6">
              <h4 className="text-sm font-semibold text-slate-400 mb-3">
                KEY FEATURES
              </h4>
              {current.features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2"
                    style={{ backgroundColor: current.color }}
                  />
                  <span className="text-sm text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Status badge */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: current.color }}
                />
                <span className="text-sm text-slate-400">
                  Active & Monitored 24/7
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


