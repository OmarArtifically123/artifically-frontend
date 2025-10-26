"use client";

import { motion } from "framer-motion";
import { Check, ExternalLink } from "./lucide-icons-fallback";

interface Certification {
  id: string;
  name: string;
  acronym: string;
  description: string;
  icon: string;
  status: "certified" | "in-progress" | "audited";
  validUntil?: string;
  auditFrequency: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    id: "soc2",
    name: "SOC 2 Type II",
    acronym: "SOC 2",
    description: "Security, availability, processing integrity, confidentiality, and privacy",
    icon: "🔒",
    status: "certified",
    validUntil: "2025-12-31",
    auditFrequency: "Annual",
  },
  {
    id: "hipaa",
    name: "HIPAA Compliant",
    acronym: "HIPAA",
    description: "Health Insurance Portability and Accountability Act",
    icon: "🏥",
    status: "certified",
    auditFrequency: "Continuous",
  },
  {
    id: "fedramp",
    name: "FedRAMP Authorized",
    acronym: "FedRAMP",
    description: "Federal Risk and Authorization Management Program",
    icon: "🏛️",
    status: "certified",
    validUntil: "2026-03-15",
    auditFrequency: "Annual",
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001",
    acronym: "ISO 27001",
    description: "Information security management systems",
    icon: "✓",
    status: "certified",
    validUntil: "2025-08-20",
    auditFrequency: "Annual",
  },
  {
    id: "gdpr",
    name: "GDPR Compliant",
    acronym: "GDPR",
    description: "General Data Protection Regulation",
    icon: "🌍",
    status: "certified",
    auditFrequency: "Continuous",
  },
  {
    id: "ccpa",
    name: "CCPA Compliant",
    acronym: "CCPA",
    description: "California Consumer Privacy Act",
    icon: "🛡️",
    status: "certified",
    auditFrequency: "Continuous",
  },
  {
    id: "pci",
    name: "PCI DSS Level 1",
    acronym: "PCI DSS",
    description: "Payment Card Industry Data Security Standard",
    icon: "💳",
    status: "certified",
    validUntil: "2025-10-30",
    auditFrequency: "Annual",
  },
  {
    id: "iso27018",
    name: "ISO/IEC 27018",
    acronym: "ISO 27018",
    description: "Protection of personally identifiable information in cloud",
    icon: "☁️",
    status: "certified",
    validUntil: "2025-08-20",
    auditFrequency: "Annual",
  },
];

interface ComplianceCertificationsProps {
  isActive: boolean;
}

/**
 * Compliance certifications showcase
 */
export default function ComplianceCertifications({ isActive }: ComplianceCertificationsProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Enterprise-Grade Compliance
        </h3>
        <p className="text-slate-400">
          Independently audited and certified by leading security firms
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CERTIFICATIONS.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="group relative p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-green-500/50 transition-all cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            {/* Icon */}
            <div className="text-5xl mb-3 text-center">{cert.icon}</div>

            {/* Acronym */}
            <div className="text-center font-bold text-white text-sm mb-1">
              {cert.acronym}
            </div>

            {/* Name */}
            <div className="text-center text-xs text-slate-400 mb-2">
              {cert.name}
            </div>

            {/* Status badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                <Check className="w-3 h-3" />
                <span>Certified</span>
              </div>
            </div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs text-slate-300 whitespace-nowrap shadow-2xl max-w-xs">
                <div className="font-semibold text-white mb-2">{cert.name}</div>
                <div className="text-slate-400 mb-2">{cert.description}</div>
                {cert.validUntil && (
                  <div className="text-slate-500">
                    Valid until: {new Date(cert.validUntil).toLocaleDateString()}
                  </div>
                )}
                <div className="text-slate-500">
                  Audit: {cert.auditFrequency}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-slate-700" />
                </div>
              </div>
            </div>

            {/* Verified checkmark */}
            <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security report link */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View Full Security Report
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
}


