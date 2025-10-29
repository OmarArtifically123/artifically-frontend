"use client";

import { Fragment, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import type { Plan } from "@/components/pricing/types";

type Feature = {
  category: string;
  name: string;
  description?: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
  highlight?: boolean;
};

const FEATURES: Feature[] = [
  // Core Features
  {
    category: "Core Automation",
    name: "AI Receptionist (Voice & WhatsApp)",
    description: "Bilingual AI handling calls and messages in Arabic & English",
    starter: true,
    professional: true,
    enterprise: true,
    highlight: true,
  },
  {
    category: "Core Automation",
    name: "Inbound Lead Capture",
    description: "Automatic lead qualification and routing",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    category: "Core Automation",
    name: "Follow-up Sequences",
    description: "Automated nurture campaigns",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Custom",
  },
  {
    category: "Core Automation",
    name: "Monthly Event Volume",
    description: "Included inbound events per month",
    starter: "1,000",
    professional: "12,000",
    enterprise: "Unlimited",
    highlight: true,
  },
  
  // Advanced Capabilities
  {
    category: "Advanced Capabilities",
    name: "Omnichannel Automation",
    description: "Voice, WhatsApp, Web, Email integration",
    starter: "Voice + WhatsApp",
    professional: true,
    enterprise: true,
  },
  {
    category: "Advanced Capabilities",
    name: "Advanced Routing & Approvals",
    description: "Complex workflow routing with approval chains",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    category: "Advanced Capabilities",
    name: "Analytics & Reporting",
    description: "Real-time insights and custom dashboards",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Custom",
    highlight: true,
  },
  {
    category: "Advanced Capabilities",
    name: "Audit Trail",
    description: "Complete activity logging for compliance",
    starter: false,
    professional: true,
    enterprise: true,
  },

  // Enterprise & Security
  {
    category: "Enterprise & Security",
    name: "Private/VPC Deployment",
    description: "Isolated infrastructure for security",
    starter: false,
    professional: false,
    enterprise: true,
    highlight: true,
  },
  {
    category: "Enterprise & Security",
    name: "Data Isolation",
    description: "Complete data sovereignty control",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    category: "Enterprise & Security",
    name: "Security Review Support",
    description: "Dedicated team for security audits",
    starter: false,
    professional: "On request",
    enterprise: true,
  },
  {
    category: "Enterprise & Security",
    name: "Custom SLAs",
    description: "Tailored service level agreements",
    starter: false,
    professional: false,
    enterprise: true,
  },

  // Support & Deployment
  {
    category: "Support & Deployment",
    name: "Deployment Time",
    description: "Time to go live",
    starter: "< 10 minutes",
    professional: "Same week",
    enterprise: "Custom timeline",
  },
  {
    category: "Support & Deployment",
    name: "Support Level",
    description: "Support channel and response time",
    starter: "Email (same-day)",
    professional: "Priority engineer",
    enterprise: "24/7 hotline",
    highlight: true,
  },
  {
    category: "Support & Deployment",
    name: "Success Architect",
    description: "Dedicated success manager",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    category: "Support & Deployment",
    name: "Onboarding",
    description: "Initial setup and training",
    starter: "Self-serve",
    professional: "Guided",
    enterprise: "White-glove",
  },
];

type Props = {
  plans: Plan[];
};

export default function FeatureComparisonTable({ plans }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(FEATURES.map((f) => f.category));
    return ["all", ...Array.from(cats)];
  }, []);

  const filteredFeatures = useMemo(() => {
    let filtered = FEATURES;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.description?.toLowerCase().includes(query) ||
          f.category.toLowerCase().includes(query)
      );
    }

    // Show only first 8 if not expanded
    if (!isExpanded) {
      filtered = filtered.slice(0, 8);
    }

    return filtered;
  }, [searchQuery, selectedCategory, isExpanded]);

  const groupedFeatures = useMemo(() => {
    const groups: Record<string, Feature[]> = {};
    filteredFeatures.forEach((feature) => {
      if (!groups[feature.category]) {
        groups[feature.category] = [];
      }
      groups[feature.category].push(feature);
    });
    return groups;
  }, [filteredFeatures]);

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="feature-value feature-value--check">
          <Icon name="check" size={24} aria-label="Included" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="feature-value feature-value--cross">
          <Icon name="x" size={24} aria-label="Not included" />
        </div>
      );
    }
    return <div className="feature-value feature-value--text">{value}</div>;
  };

  return (
    <section className="comparison-table-section" aria-labelledby="comparison-title">
      <header className="comparison-header">
        <div className="comparison-header__content">
          <h2 id="comparison-title">Compare all features</h2>
          <p>
            Every feature, every plan. Find exactly what you need with our comprehensive
            comparison table.
          </p>
        </div>

        {/* Search and filter controls */}
        <div className="comparison-controls">
          <div className="search-wrapper">
            <Icon name="search" size={20} aria-hidden className="search-icon" />
            <input
              type="search"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search features"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="search-clear"
                aria-label="Clear search"
              >
                <Icon name="x" size={16} aria-hidden />
              </button>
            )}
          </div>

          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-btn ${selectedCategory === cat ? "category-btn--active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "All Features" : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Responsive table */}
      <div className="comparison-table-wrapper">
        <table className="comparison-table" role="grid">
          <thead>
            <tr>
              <th scope="col" className="feature-col">
                Feature
              </th>
              <th scope="col" className="plan-col plan-col--starter">
                <div className="plan-header">
                  <div className="plan-name">Starter</div>
                  <div className="plan-price">$299/mo</div>
                </div>
              </th>
              <th scope="col" className="plan-col plan-col--professional">
                <div className="plan-header">
                  <div className="plan-name">
                    Professional
                    <span className="plan-badge">Popular</span>
                  </div>
                  <div className="plan-price">$699/mo</div>
                </div>
              </th>
              <th scope="col" className="plan-col plan-col--enterprise">
                <div className="plan-header">
                  <div className="plan-name">Enterprise</div>
                  <div className="plan-price">Custom</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedFeatures).map(([category, features]) => (
              <Fragment key={category}>
                <tr className="category-row">
                  <td colSpan={4} className="category-cell">
                    <div className="category-name">{category}</div>
                  </td>
                </tr>
                {features.map((feature, idx) => (
                  <tr
                    key={`${category}-${idx}`}
                    className={`feature-row ${feature.highlight ? "feature-row--highlight" : ""}`}
                  >
                    <td className="feature-cell">
                      <div className="feature-info">
                        <div className="feature-name">{feature.name}</div>
                        {feature.description && (
                          <div className="feature-description">{feature.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="value-cell">{renderValue(feature.starter)}</td>
                    <td className="value-cell">{renderValue(feature.professional)}</td>
                    <td className="value-cell">{renderValue(feature.enterprise)}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show more/less button */}
      {FEATURES.length > 8 && (
        <div className="comparison-actions">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-btn"
          >
            <span>{isExpanded ? "Show less features" : `Show all ${FEATURES.length} features`}</span>
            <Icon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              aria-hidden
              className="expand-icon"
            />
          </button>
        </div>
      )}

      <style jsx>{`
        .comparison-table-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 3rem 0;
        }

        .comparison-header {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .comparison-header__content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comparison-header h2 {
          margin: 0;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .comparison-header p {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
        }

        .comparison-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-wrapper {
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.85rem 3rem 0.85rem 3rem;
          border: 2px solid var(--border-default);
          border-radius: 14px;
          background: var(--bg-card);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent-primary) 15%, transparent);
        }

        .search-clear {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          padding: 0.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .search-clear:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .category-filter {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 0.65rem 1.25rem;
          border: 2px solid var(--border-default);
          border-radius: 999px;
          background: var(--bg-card);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .category-btn--active {
          border-color: var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
        }

        .comparison-table-wrapper {
          overflow-x: auto;
          border: 2px solid var(--border-default);
          border-radius: 20px;
          background: var(--bg-card);
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }

        .comparison-table thead {
          position: sticky;
          top: 0;
          background: var(--bg-secondary);
          z-index: 10;
        }

        .comparison-table th {
          padding: 1.5rem 1rem;
          text-align: left;
          font-weight: 800;
          border-bottom: 2px solid var(--border-default);
        }

        .feature-col {
          width: 40%;
          min-width: 250px;
        }

        .plan-col {
          width: 20%;
          min-width: 150px;
          text-align: center;
        }

        .plan-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .plan-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .plan-badge {
          padding: 0.2rem 0.6rem;
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .plan-price {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .category-row {
          background: var(--bg-secondary);
        }

        .category-cell {
          padding: 1rem;
          border-top: 1px solid var(--border-default);
        }

        .category-name {
          font-size: 0.85rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent-primary);
        }

        .feature-row {
          border-top: 1px solid var(--border-subtle);
          transition: background 0.2s ease;
        }

        .feature-row:hover {
          background: var(--bg-secondary);
        }

        .feature-row--highlight {
          background: color-mix(in srgb, var(--accent-primary) 5%, transparent);
        }

        .feature-cell {
          padding: 1.25rem 1rem;
        }

        .feature-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .feature-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .feature-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .value-cell {
          padding: 1.25rem 1rem;
          text-align: center;
          vertical-align: middle;
        }

        .feature-value {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .feature-value--check {
          color: var(--accent-success);
        }

        .feature-value--cross {
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .feature-value--text {
          padding: 0.4rem 0.8rem;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .comparison-actions {
          display: flex;
          justify-content: center;
          padding-top: 1rem;
        }

        .expand-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: 2px solid var(--border-default);
          border-radius: 14px;
          background: var(--bg-card);
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .expand-btn:hover {
          border-color: var(--accent-primary);
          background: var(--bg-secondary);
          transform: translateY(-2px);
        }

        .expand-icon {
          transition: transform 0.3s ease;
        }

        @media (max-width: 900px) {
          .comparison-table-wrapper {
            border-radius: 14px;
          }

          .comparison-table {
            font-size: 0.85rem;
          }

          .comparison-table th,
          .feature-cell,
          .value-cell {
            padding: 1rem 0.75rem;
          }

          .plan-header {
            gap: 0.35rem;
          }

          .plan-name {
            font-size: 0.95rem;
          }

          .plan-price {
            font-size: 0.8rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-input,
          .category-btn,
          .feature-row,
          .expand-btn {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

