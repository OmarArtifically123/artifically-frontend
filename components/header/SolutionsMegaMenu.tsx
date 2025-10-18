"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../icons";
import type { IconName } from "../icons";

type MenuState = "opening" | "open" | "closing" | "closed";

type IndustrySolution = {
  href: string;
  title: string;
  description: string;
  icon: IconName;
};

type TeamSizeSolution = {
  href: string;
  title: string;
  description: string;
  icon: IconName;
};

type CaseStudy = {
  href: string;
  name: string;
  initials: string;
  theme: string;
};

const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    href: "/solutions/industry/ecommerce-retail",
    title: "E-commerce & Retail",
    description: "Inventory sync, order automation, customer lifecycle",
    icon: "shoppingBag",
  },
  {
    href: "/solutions/industry/financial-services",
    title: "Financial Services",
    description: "Transaction processing, compliance, fraud detection",
    icon: "dollar",
  },
  {
    href: "/solutions/industry/healthcare",
    title: "Healthcare",
    description: "Patient data workflows, appointment automation, HIPAA-compliant",
    icon: "hospital",
  },
  {
    href: "/solutions/industry/technology-saas",
    title: "Technology & SaaS",
    description: "User onboarding, product analytics, billing automation",
    icon: "laptop",
  },
  {
    href: "/solutions/industry/manufacturing",
    title: "Manufacturing",
    description: "Supply chain, production scheduling, quality tracking",
    icon: "cog",
  },
  {
    href: "/solutions/industry/real-estate",
    title: "Real Estate",
    description: "Lead nurturing, property management, document processing",
    icon: "building",
  },
  {
    href: "/solutions/industry/professional-services",
    title: "Professional Services",
    description: "Time tracking, client communications, invoicing",
    icon: "briefcase",
  },
  {
    href: "/solutions/industry/education",
    title: "Education",
    description: "Student onboarding, course management, communication",
    icon: "book",
  },
  {
    href: "/solutions/industry/logistics-transportation",
    title: "Logistics & Transportation",
    description: "Route optimization, tracking, documentation",
    icon: "compass",
  },
  {
    href: "/solutions/industry/hospitality",
    title: "Hospitality",
    description: "Booking automation, guest communications, inventory",
    icon: "concierge",
  },
  {
    href: "/solutions/industry/media-publishing",
    title: "Media & Publishing",
    description: "Content workflows, distribution, rights management",
    icon: "clapperboard",
  },
  {
    href: "/solutions/industry/non-profit",
    title: "Non-Profit",
    description: "Donor management, volunteer coordination, reporting",
    icon: "handshake",
  },
];

const TEAM_SIZE_SOLUTIONS: TeamSizeSolution[] = [
  {
    href: "/solutions/team-size/startups",
    title: "Startups (1-20)",
    description: "Fast deployment, low overhead, free tier included",
    icon: "rocket",
  },
  {
    href: "/solutions/team-size/growing",
    title: "Growing Teams (20-100)",
    description: "Scalable infrastructure, team collaboration, priority support",
    icon: "users",
  },
  {
    href: "/solutions/team-size/enterprise",
    title: "Enterprise (100-1000)",
    description: "Dedicated success manager, custom integrations, SLA guarantees",
    icon: "building",
  },
  {
    href: "/solutions/team-size/global-enterprise",
    title: "Global Enterprise (1000+)",
    description: "Multi-region deployment, audit compliance, white-glove service",
    icon: "globe",
  },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    href: "/case-studies/northwind-retail",
    name: "Northwind Retail",
    initials: "NR",
    theme: "linear-gradient(135deg, var(--brand-primary) 0%, color-mix(in oklch, var(--brand-primary) 60%, transparent) 100%)",
  },
  {
    href: "/case-studies/aurora-financial",
    name: "Aurora Financial",
    initials: "AF",
    theme: "linear-gradient(135deg, var(--brand-secondary) 0%, color-mix(in oklch, var(--brand-secondary) 40%, transparent) 100%)",
  },
  {
    href: "/case-studies/atlas-logistics",
    name: "Atlas Logistics",
    initials: "AL",
    theme: "linear-gradient(135deg, var(--brand-tertiary, #5b7bff) 0%, color-mix(in oklch, var(--brand-tertiary, #5b7bff) 40%, transparent) 100%)",
  },
];

type SolutionsMegaMenuProps = {
  state: MenuState;
  onRequestClose: () => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
};

export default function SolutionsMegaMenu({ state, onRequestClose, onNavigate }: SolutionsMegaMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || state === "closed") {
    return null;
  }

  return createPortal(
    <div className="solutions-mega" data-state={state}>
      <div className="solutions-mega__backdrop" role="presentation" onClick={onRequestClose} />
      <div
        className="solutions-mega__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="solutions-mega-heading"
      >
        <button
          type="button"
          className="solutions-mega__close"
          onClick={onRequestClose}
          aria-label="Close solutions menu"
        >
          <Icon name="close" size={18} strokeWidth={2} />
        </button>
        <div className="solutions-mega__content">
          <div className="solutions-mega__column solutions-mega__column--industries">
            <p id="solutions-mega-heading" className="solutions-mega__section-label">
              BY INDUSTRY
            </p>
            <div className="solutions-mega__industry-list">
              {INDUSTRY_SOLUTIONS.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="solutions-mega__industry-link"
                  data-prefetch-route={entry.href}
                  onClick={(event) => {
                    onNavigate(event, entry.href);
                  }}
                >
                  <span className="solutions-mega__industry-icon">
                    <Icon name={entry.icon} size={18} strokeWidth={1.75} />
                  </span>
                  <span className="solutions-mega__industry-copy">
                    <span className="solutions-mega__industry-title">{entry.title}</span>
                    <span className="solutions-mega__industry-description">{entry.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="solutions-mega__column solutions-mega__column--team">
            <p className="solutions-mega__section-label">BY TEAM SIZE</p>
            <div className="solutions-mega__team-list">
              {TEAM_SIZE_SOLUTIONS.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="solutions-mega__team-card"
                  data-prefetch-route={entry.href}
                  onClick={(event) => {
                    onNavigate(event, entry.href);
                  }}
                >
                  <span className="solutions-mega__team-icon">
                    <Icon name={entry.icon} size={18} strokeWidth={1.75} />
                  </span>
                  <span className="solutions-mega__team-copy">
                    <span className="solutions-mega__team-title">{entry.title}</span>
                    <span className="solutions-mega__team-description">{entry.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="solutions-mega__column solutions-mega__column--cases">
            <p className="solutions-mega__section-label">SUCCESS STORIES</p>
            <div className="solutions-mega__case-list">
              {CASE_STUDIES.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="solutions-mega__case-card"
                  data-prefetch-route={entry.href}
                  onClick={(event) => {
                    onNavigate(event, entry.href);
                  }}
                >
                  <div className="solutions-mega__case-header">
                    <span
                      className="solutions-mega__case-logo"
                      style={{ background: entry.theme }}
                      aria-hidden="true"
                    >
                      {entry.initials}
                    </span>
                    <div className="solutions-mega__case-meta">
                      <span className="solutions-mega__case-name">{entry.name}</span>
                      <span className="solutions-mega__case-quote">
                        “Reduced operational costs by 40% in first quarter”
                      </span>
                    </div>
                  </div>
                  <div className="solutions-mega__case-metrics">
                    <span className="solutions-mega__case-badge">40% cost reduction</span>
                    <span className="solutions-mega__case-badge">6 weeks to ROI</span>
                  </div>
                  <span className="solutions-mega__case-link">Read Full Story →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}