"use client";

import { useState } from "react";

type Feature = {
  name: string;
  starter: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
};

const FEATURES: Feature[] = [
  { name: "AI Receptionist", starter: true, professional: true, enterprise: true },
  { name: "WhatsApp Automation", starter: true, professional: true, enterprise: true },
  { name: "Events per month", starter: "1,000", professional: "12,000", enterprise: "Unlimited" },
  { name: "Advanced Analytics", starter: false, professional: true, enterprise: true },
  { name: "Custom Integrations", starter: false, professional: true, enterprise: true },
  { name: "Priority Support", starter: false, professional: true, enterprise: true },
  { name: "VPC Deployment", starter: false, professional: false, enterprise: true },
  { name: "Custom SLAs", starter: false, professional: false, enterprise: true },
  { name: "24/7 Hotline", starter: false, professional: false, enterprise: true },
];

export default function InteractiveComparison() {
  const [expandedFeatures, setExpandedFeatures] = useState(false);

  const displayFeatures = expandedFeatures ? FEATURES : FEATURES.slice(0, 5);

  const renderValue = (value: string | boolean) => {
    if (value === true) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#10b981" />
          <path
            d="M8 12L11 15L16 10"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    if (value === false) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#e5e7eb" />
          <path
            d="M9 15L15 9M15 15L9 9"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    return <span className="feature-value-text">{value}</span>;
  };

  return (
    <section className="interactive-comparison">
      <div className="comparison-container">
        <h2 className="comparison-title">Compare all features</h2>
        <p className="comparison-subtitle">
          See what's included in each plan at a glance
        </p>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="header-feature">Feature</th>
                <th className="header-plan">Starter</th>
                <th className="header-plan header-plan--featured">Professional</th>
                <th className="header-plan">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {displayFeatures.map((feature, idx) => (
                <tr key={idx} className="feature-row">
                  <td className="feature-name">{feature.name}</td>
                  <td className="feature-value">{renderValue(feature.starter)}</td>
                  <td className="feature-value">{renderValue(feature.professional)}</td>
                  <td className="feature-value">{renderValue(feature.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {FEATURES.length > 5 && (
          <button
            onClick={() => setExpandedFeatures(!expandedFeatures)}
            className="expand-btn"
          >
            {expandedFeatures ? "Show less" : `Show all ${FEATURES.length} features`}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d={expandedFeatures ? "M5 12L10 7L15 12" : "M5 7L10 12L15 7"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .interactive-comparison {
          padding: 4rem 2rem;
          background: white;
        }

        .comparison-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .comparison-title {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .comparison-subtitle {
          text-align: center;
          font-size: 1.125rem;
          color: #6b7280;
          margin: -1rem 0 0;
          font-weight: 500;
        }

        .comparison-table-wrapper {
          overflow-x: auto;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          background: white;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
        }

        .comparison-table thead {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .comparison-table th {
          padding: 1.5rem 1.25rem;
          font-weight: 700;
          font-size: 1.0625rem;
          color: #111827;
        }

        .header-feature {
          text-align: left;
          width: 40%;
        }

        .header-plan {
          text-align: center;
          width: 20%;
        }

        .header-plan--featured {
          background: #ede9fe;
          color: #6366f1;
        }

        .feature-row {
          border-bottom: 1px solid #f3f4f6;
        }

        .feature-row:last-child {
          border-bottom: none;
        }

        .feature-row:hover {
          background: #fafafa;
        }

        .feature-name {
          padding: 1.25rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.9375rem;
        }

        .feature-value {
          padding: 1.25rem;
          text-align: center;
        }

        .feature-value-text {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: #f3f4f6;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
          color: #374151;
        }

        .expand-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-weight: 700;
          color: #374151;
          font-size: 0.9375rem;
          align-self: center;
          transition: all 0.2s ease;
        }

        .expand-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        @media (max-width: 1024px) {
          .comparison-table {
            font-size: 0.875rem;
          }

          .comparison-table th,
          .feature-name,
          .feature-value {
            padding: 1rem 0.875rem;
          }
        }
      `}</style>
    </section>
  );
}

