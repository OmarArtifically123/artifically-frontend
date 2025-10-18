"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../icons";
import type { IconName } from "../icons";
type FunctionLink = {
  href: string;
  title: string;
  description: string;
  icon: IconName;
};

type FeaturedAutomation = {
  badge: string;
  title: string;
  description: string;
  rating: string;
  price: string;
  href: string;
};

type QuickAction = {
  href: string;
  icon: IconName;
  title: string;
  description: string;
  className: string;
};

const FUNCTION_LINKS: FunctionLink[] = [
  {
    href: "/marketplace?category=customer-service",
    title: "Customer Service",
    description: "Automate support tickets, live chat, and customer communications",
    icon: "headphones",
  },
  {
    href: "/marketplace?category=sales-operations",
    title: "Sales Operations",
    description: "Lead scoring, email sequences, CRM sync",
    icon: "target",
  },
  {
    href: "/marketplace?category=marketing",
    title: "Marketing Automation",
    description: "Campaign orchestration, content distribution, analytics",
    icon: "megaphone",
  },
  {
    href: "/marketplace?category=finance",
    title: "Finance & Accounting",
    description: "Invoice processing, reconciliation, expense management",
    icon: "dollar",
  },
  {
    href: "/marketplace?category=hr",
    title: "HR & Recruiting",
    description: "Applicant tracking, onboarding, employee data sync",
    icon: "users",
  },
  {
    href: "/marketplace?category=operations",
    title: "Operations & Logistics",
    description: "Inventory sync, order routing, shipment tracking",
    icon: "boxes",
  },
  {
    href: "/marketplace?category=data",
    title: "Data & Analytics",
    description: "Pipeline orchestration, report generation, dashboard updates",
    icon: "barChart",
  },
  {
    href: "/marketplace?category=it",
    title: "IT & DevOps",
    description: "Incident management, deployment automation, monitoring",
    icon: "cog",
  },
];

const FEATURED_AUTOMATIONS: FeaturedAutomation[] = [
  {
    badge: "MOST POPULAR",
    title: "AI Sales Email Generator",
    description: "Draft personalized outbound emails at scale using your CRM data and AI.",
    rating: "⭐ 4.9 (234)",
    price: "Free",
    href: "/marketplace/ai-sales-email-generator",
  },
  {
    badge: "NEW",
    title: "Realtime Support Triage",
    description: "Route tickets to the right agent instantly with intent and sentiment detection.",
    rating: "⭐ 5.0 (89)",
    price: "Free",
    href: "/marketplace/realtime-support-triage",
  },
  {
    badge: "TRENDING",
    title: "Marketing Asset Repurposer",
    description: "Turn webinars into blogs, social posts, and nurture sequences automatically.",
    rating: "⭐ 4.8 (142)",
    price: "Free",
    href: "/marketplace/marketing-asset-repurposer",
  },
  {
    badge: "MOST POPULAR",
    title: "Finance Reconciliation Copilot",
    description: "Match invoices and payments nightly with exception routing and alerts.",
    rating: "⭐ 4.7 (167)",
    price: "Free",
    href: "/marketplace/finance-reconciliation-copilot",
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: "/marketplace",
    icon: "grid",
    title: "Explore Marketplace",
    description: "Browse 200+ pre-built automations ready to deploy",
    className: "automations-mega__quick-card--marketplace",
  },
  {
    href: "/contact/custom",
    icon: "wand",
    title: "Custom Automation",
    description: "Work with our team to build exactly what you need",
    className: "automations-mega__quick-card--custom",
  },
  {
    href: "/demo",
    icon: "calendar",
    title: "Book a Demo",
    description: "See platform capabilities with our team",
    className: "automations-mega__quick-card--demo",
  },
];

type AutomationsMegaMenuProps = {
  state: "opening" | "open" | "closing" | "closed";
  onRequestClose: () => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
};

export default function AutomationsMegaMenu({ state, onRequestClose, onNavigate }: AutomationsMegaMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || state === "closed") {
    return null;
  }

  return createPortal(
    <div className="automations-mega" data-state={state}>
      <div className="automations-mega__backdrop" role="presentation" onClick={onRequestClose} />
      <div
        className="automations-mega__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="automations-mega-heading"
      >
        <button
          type="button"
          className="automations-mega__close"
          onClick={onRequestClose}
          aria-label="Close automations menu"
        >
          <Icon name="close" size={18} strokeWidth={2} />
        </button>
        <div className="automations-mega__content">
          <div className="automations-mega__column automations-mega__column--functions">
            <details className="automations-mega__functions" open>
              <summary>
                <span>By Function</span>
                <Icon name="chevronDown" size={16} aria-hidden="true" />
              </summary>
              <p id="automations-mega-heading" className="automations-mega__section-label">
                BY FUNCTION
              </p>
              <div className="automations-mega__functions-list">
                {FUNCTION_LINKS.map((entry) => (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="automations-mega__function-link"
                    data-prefetch-route={entry.href}
                    onClick={(event) => {
                      onNavigate(event, entry.href);
                    }}
                  >
                    <span className="automations-mega__function-icon">
                      <Icon name={entry.icon} size={14} strokeWidth={2} />
                    </span>
                    <span className="automations-mega__function-copy">
                      <span className="automations-mega__function-title">{entry.title}</span>
                      <span className="automations-mega__function-description">{entry.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          </div>
          <div className="automations-mega__column automations-mega__column--featured">
            <p className="automations-mega__section-label">FEATURED AUTOMATIONS</p>
            <div className="automations-mega__featured-grid">
              {FEATURED_AUTOMATIONS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="automations-mega__featured-card"
                  data-prefetch-route={card.href}
                  onClick={(event) => {
                    onNavigate(event, card.href);
                  }}
                >
                  <span className="automations-mega__badge">{card.badge}</span>
                  <span className="automations-mega__featured-title">{card.title}</span>
                  <span className="automations-mega__featured-description">{card.description}</span>
                  <span className="automations-mega__featured-meta">
                    <span>{card.rating}</span>
                    <span className="automations-mega__price-badge">{card.price}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="automations-mega__column automations-mega__column--actions">
            <p className="automations-mega__section-label">QUICK ACTIONS</p>
            <div className="automations-mega__quick-actions">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={["automations-mega__quick-card", action.className]
                    .filter(Boolean)
                    .join(" ")}
                  data-prefetch-route={action.href}
                  onClick={(event) => {
                    onNavigate(event, action.href);
                  }}
                >
                  <span className="automations-mega__quick-icon">
                    <Icon name={action.icon} size={32} strokeWidth={1.8} />
                  </span>
                  <span className="automations-mega__quick-title">{action.title}</span>
                  <span className="automations-mega__quick-description">{action.description}</span>
                  <span className="automations-mega__quick-arrow" aria-hidden="true">
                    →
                  </span>
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