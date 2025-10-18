import type { IconName } from "@/components/icons";

type BaseSolution = {
  slug: string;
  title: string;
  description: string;
};

type DescribedSolution = BaseSolution & {
  icon: IconName;
  headline: string;
  summary: string;
  highlights: string[];
};

type CaseStudySolution = {
  slug: string;
  name: string;
  initials: string;
  theme: string;
  quote: string;
  metrics: string[];
  summary: string;
};

type TeamSizeSolution = BaseSolution & {
  icon: IconName;
  focus: string;
  summary: string;
  highlights: string[];
};

export const industrySolutions: DescribedSolution[] = [
  {
    slug: "ecommerce-retail",
    title: "E-commerce & Retail",
    description: "Inventory sync, order automation, customer lifecycle",
    icon: "shoppingBag",
    headline: "Automate digital storefront operations",
    summary:
      "Keep product data, orders, and customer conversations in sync across every channel without adding headcount.",
    highlights: [
      "Sync catalog updates across storefronts, ERPs, and marketplaces within minutes.",
      "Auto-triage fulfillment exceptions with SLA-aware routing to warehouses or 3PL partners.",
      "Trigger retention journeys based on live purchase, return, or browse behaviour.",
    ],
  },
  {
    slug: "financial-services",
    title: "Financial Services",
    description: "Transaction processing, compliance, fraud detection",
    icon: "dollar",
    headline: "Scale compliant finance operations",
    summary:
      "Combine AI monitoring with human approvals to reconcile payments, surface risk, and satisfy regulators.",
    highlights: [
      "Match payments to invoices nightly with explainable AI suggestions for reviewers.",
      "Escalate suspicious activity instantly with case files pre-assembled for compliance teams.",
      "Keep audit trails export-ready with immutable event logs and retention controls.",
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    description: "Patient data workflows, appointment automation, HIPAA-compliant",
    icon: "hospital",
    headline: "Streamline patient and provider coordination",
    summary:
      "Automate scheduling, referrals, and follow-ups while protecting PHI with built-in safeguards.",
    highlights: [
      "Coordinate referrals and prior auth packets across EHR, fax, and portal systems automatically.",
      "Deliver appointment reminders on patients' preferred channels with language-sensitive templates.",
      "Surface at-risk patients to care teams with continuously refreshed eligibility insights.",
    ],
  },
  {
    slug: "technology-saas",
    title: "Technology & SaaS",
    description: "User onboarding, product analytics, billing automation",
    icon: "laptop",
    headline: "Activate and retain software customers",
    summary:
      "Instrument lifecycle touchpoints so every customer receives timely onboarding, insights, and billing updates.",
    highlights: [
      "Automate workspace provisioning across your stack from the first sign up event.",
      "Alert customer teams when adoption signals trend down with recommended playbooks.",
      "Close the loop between product usage, CRM stages, and billing events automatically.",
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    description: "Supply chain, production scheduling, quality tracking",
    icon: "cog",
    headline: "Keep production moving around the clock",
    summary:
      "Connect planners, suppliers, and floor systems so issues are detected and resolved before they create downtime.",
    highlights: [
      "Predict material shortages and trigger purchase orders before schedules slip.",
      "Route quality incidents with photos and IoT telemetry to the right engineer automatically.",
      "Give teams a single view of plant performance with automated reporting packs.",
    ],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    description: "Lead nurturing, property management, document processing",
    icon: "building",
    headline: "Delight residents and prospects",
    summary:
      "Automate leasing, maintenance, and concierge experiences while keeping brokers and owners aligned.",
    highlights: [
      "Respond to leasing inquiries instantly with availability, pricing, and next steps.",
      "Generate and route digital lease packets with automated document QA and e-sign tasks.",
      "Coordinate maintenance vendors with SLAs tracked automatically across every property.",
    ],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    description: "Time tracking, client communications, invoicing",
    icon: "briefcase",
    headline: "Free teams to focus on high-value work",
    summary:
      "Automate project status, billing, and client updates so practitioners spend more time delivering outcomes.",
    highlights: [
      "Generate engagement dashboards with live budget burn and milestone commentary.",
      "Assemble invoices from approved time entries with automatic variance alerts.",
      "Send branded client updates triggered by project changes or decision deadlines.",
    ],
  },
  {
    slug: "education",
    title: "Education",
    description: "Student onboarding, course management, communication",
    icon: "book",
    headline: "Support students across every touchpoint",
    summary:
      "Use AI to personalize outreach, support staff, and keep data synchronized across SIS, LMS, and CRM systems.",
    highlights: [
      "Guide applicants through enrollment with nudges tailored to their stage and program.",
      "Keep rosters, grades, and accommodations aligned across platforms automatically.",
      "Surface learners who need attention with AI summaries for advisors and instructors.",
    ],
  },
  {
    slug: "logistics-transportation",
    title: "Logistics & Transportation",
    description: "Route optimization, tracking, documentation",
    icon: "compass",
    headline: "Coordinate shipments end-to-end",
    summary:
      "Automate dispatch, paperwork, and customer notifications with real-time location intelligence.",
    highlights: [
      "Generate compliant bills of lading and customs paperwork from orders instantly.",
      "Alert shippers and receivers when delays are predicted with recommended recovery actions.",
      "Consolidate telematics, WMS, and TMS updates into a live command center view.",
    ],
  },
  {
    slug: "hospitality",
    title: "Hospitality",
    description: "Booking automation, guest communications, inventory",
    icon: "concierge",
    headline: "Deliver memorable guest experiences",
    summary:
      "Coordinate reservations, staff, and amenities with automations that adapt to every guest's stay.",
    highlights: [
      "Confirm bookings, upgrades, and loyalty perks instantly across PMS, POS, and CRM systems.",
      "Dispatch housekeeping and maintenance with AI-prioritized queues between stays.",
      "Send personalized itineraries and upsell offers triggered by guest preferences.",
    ],
  },
  {
    slug: "media-publishing",
    title: "Media & Publishing",
    description: "Content workflows, distribution, rights management",
    icon: "clapperboard",
    headline: "Accelerate content from pitch to publish",
    summary:
      "Automate approvals, packaging, and syndication so teams focus on creativity, not busywork.",
    highlights: [
      "Route pitches and drafts to the right editors with inline AI summaries and comments.",
      "Generate channel-specific packages and metadata the moment stories are approved.",
      "Track rights expirations and automate renewals or takedowns before deadlines hit.",
    ],
  },
  {
    slug: "non-profit",
    title: "Non-Profit",
    description: "Donor management, volunteer coordination, reporting",
    icon: "handshake",
    headline: "Grow impact with lean teams",
    summary:
      "Keep donors, volunteers, and programs aligned with automations that make stewardship personal at scale.",
    highlights: [
      "Score and segment donors automatically based on giving signals and engagement.",
      "Coordinate volunteer onboarding, assignments, and reminders without spreadsheets.",
      "Assemble grant and board reports with live metrics pulled from every system.",
    ],
  },
];

export const teamSizeSolutions: TeamSizeSolution[] = [
  {
    slug: "startups",
    title: "Startups (1-20)",
    description: "Fast deployment, low overhead, free tier included",
    icon: "rocket",
    focus: "Ship automations without hiring a platform team",
    summary:
      "Launch your first AI agents with guardrails, templates, and pricing built for early teams.",
    highlights: [
      "Deploy guided onboarding journeys in under a week with prebuilt blueprints.",
      "Monitor automations with simple health dashboards instead of custom tooling.",
      "Scale usage confidently with usage-based pricing and no annual commitments.",
    ],
  },
  {
    slug: "growing",
    title: "Growing Teams (20-100)",
    description: "Scalable infrastructure, team collaboration, priority support",
    icon: "users",
    focus: "Coordinate automations across functions",
    summary:
      "Enable operations, finance, and GTM teams to co-build automations with shared governance.",
    highlights: [
      "Assign workspaces per department with granular permissions and audit trails.",
      "Publish reusable automations to an internal marketplace with version controls.",
      "Partner with solution architects who guide rollouts and change management.",
    ],
  },
  {
    slug: "enterprise",
    title: "Enterprise (100-1000)",
    description: "Dedicated success manager, custom integrations, SLA guarantees",
    icon: "building",
    focus: "Standardize automation at scale",
    summary:
      "Blend AI, APIs, and human approvals into resilient workflows trusted across global teams.",
    highlights: [
      "Integrate with identity, data warehouse, and observability platforms you already rely on.",
      "Model complex approval chains with conditional logic and fallback routing.",
      "Meet uptime and security commitments with contractual SLAs and architecture reviews.",
    ],
  },
  {
    slug: "global-enterprise",
    title: "Global Enterprise (1000+)",
    description: "Multi-region deployment, audit compliance, white-glove service",
    icon: "globe",
    focus: "Orchestrate automation globally",
    summary:
      "Support thousands of teammates and regions with data residency, localization, and 24/7 coverage.",
    highlights: [
      "Deploy regional clusters with residency controls and localized experiences.",
      "Blend AI copilots with human work queues for highly regulated processes.",
      "Receive 24/7 follow-the-sun support and executive partnership for transformation programs.",
    ],
  },
];

export const caseStudySolutions: CaseStudySolution[] = [
  {
    slug: "northwind-retail",
    name: "Northwind Retail",
    initials: "NR",
    theme:
      "linear-gradient(135deg, var(--brand-primary) 0%, color-mix(in oklch, var(--brand-primary) 60%, transparent) 100%)",
    quote: "\"Artifically automated our order ops so we reallocated 12 FTEs to customer innovation.\"",
    metrics: ["40% cost reduction", "6 weeks to ROI"],
    summary:
      "Northwind unified ecommerce, store, and warehouse systems to deliver real-time fulfillment updates and reduce operating costs.",
  },
  {
    slug: "aurora-financial",
    name: "Aurora Financial",
    initials: "AF",
    theme:
      "linear-gradient(135deg, var(--brand-secondary) 0%, color-mix(in oklch, var(--brand-secondary) 40%, transparent) 100%)",
    quote: "\"We closed our month-end five days faster with compliance-ready audit trails.\"",
    metrics: ["5 day faster close", "99.98% reconciliation accuracy"],
    summary:
      "Aurora automated reconciliation, alerting analysts only when exceptions required human judgment while maintaining robust compliance records.",
  },
  {
    slug: "atlas-logistics",
    name: "Atlas Logistics",
    initials: "AL",
    theme:
      "linear-gradient(135deg, var(--brand-tertiary, #5b7bff) 0%, color-mix(in oklch, var(--brand-tertiary, #5b7bff) 40%, transparent) 100%)",
    quote: "\"Customer updates happen in real time and we haven’t missed an SLA in three quarters.\"",
    metrics: ["99.9% on-time delivery", "35% faster response"],
    summary:
      "Atlas connected telematics, customer portals, and TMS data to proactively notify shippers and keep operations on schedule.",
  },
];

export const industrySolutionMap = new Map(industrySolutions.map((entry) => [entry.slug, entry]));
export const teamSizeSolutionMap = new Map(teamSizeSolutions.map((entry) => [entry.slug, entry]));
export const caseStudySolutionMap = new Map(caseStudySolutions.map((entry) => [entry.slug, entry]));

export const industrySolutionLinks = industrySolutions.map((entry) => ({
  href: `/solutions/industry/${entry.slug}`,
  title: entry.title,
  description: entry.description,
  icon: entry.icon,
}));

export const teamSizeSolutionLinks = teamSizeSolutions.map((entry) => ({
  href: `/solutions/team-size/${entry.slug}`,
  title: entry.title,
  description: entry.description,
  icon: entry.icon,
}));

export const caseStudyLinks = caseStudySolutions.map((entry) => ({
  href: `/case-studies/${entry.slug}`,
  name: entry.name,
  initials: entry.initials,
  theme: entry.theme,
}));