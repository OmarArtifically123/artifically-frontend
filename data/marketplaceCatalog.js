const createBlurDataURL = (start, end) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='16'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop stop-color='${start}' offset='0%'/><stop stop-color='${end}' offset='100%'/></linearGradient></defs><rect width='24' height='16' fill='url(#g)' rx='4' ry='4'/></svg>`,
  )}`;

const MARKETPLACE_PREVIEW_MEDIA = {
  "ops-guardian": {
    src: "/images/automation-previews/ops-guardian.svg",
    blurDataURL: createBlurDataURL("#312e81", "#0ea5e9"),
  },
  "revenue-loop": {
    src: "/images/automation-previews/revenue-loop.svg",
    blurDataURL: createBlurDataURL("#7c3aed", "#fb7185"),
  },
  "support-coach": {
    src: "/images/automation-previews/support-coach.svg",
    blurDataURL: createBlurDataURL("#0f172a", "#22d3ee"),
  },
  "finance-sentinel": {
    src: "/images/automation-previews/finance-sentinel.svg",
    blurDataURL: createBlurDataURL("#1d4ed8", "#10b981"),
  },
};

export const MARKETPLACE_ENTRIES = [
  {
    id: "ops-guardian",
    name: "Ops Guardian",
    description:
      "AI-assisted incident routing keeps tickets flowing to the right squad automatically.",
    icon: "🛡️",
    priceMonthly: 249,
    currency: "USD",
    roi: 4.6,
    deploymentsPerWeek: 22,
    hoursSavedWeekly: 280,
    category: "Operations",
    tags: ["incident response", "it ops", "ticket triage"],
    previewImage: MARKETPLACE_PREVIEW_MEDIA["ops-guardian"],
    highlights: [
      "Real-time incident clustering",
      "Predictive SLA breach alerts",
      "Automated post-mortem summaries",
    ],
    integrations: {
      sources: ["PagerDuty", "Zendesk", "Jira Service Management"],
      destinations: ["Slack", "ServiceNow"],
    },
  },
  {
    id: "revenue-loop",
    name: "Revenue Loop",
    description:
      "Sync pipeline signals with personalised outreach loops that recover stalled deals.",
    icon: "💼",
    priceMonthly: 329,
    currency: "USD",
    roi: 5.2,
    deploymentsPerWeek: 18,
    hoursSavedWeekly: 310,
    category: "Revenue",
    tags: ["sales automation", "pipeline", "revops"],
    previewImage: MARKETPLACE_PREVIEW_MEDIA["revenue-loop"],
    highlights: [
      "Predictive deal scoring",
      "Rep nudges based on buyer activity",
      "Closed-won playbooks triggered live",
    ],
    integrations: {
      sources: ["Salesforce", "HubSpot", "Outreach"],
      destinations: ["Slack", "Teams", "Notion"],
    },
  },
  {
    id: "support-coach",
    name: "Support Coach",
    description:
      "Guides agents with AI macros and empathetic tone adjustments in every conversation.",
    icon: "🤝",
    priceMonthly: 189,
    currency: "USD",
    roi: 3.8,
    deploymentsPerWeek: 27,
    hoursSavedWeekly: 265,
    category: "Customer Experience",
    tags: ["support", "customer success", "cx"],
    previewImage: MARKETPLACE_PREVIEW_MEDIA["support-coach"],
    highlights: [
      "Context-aware response drafting",
      "Live retention risk alerts",
      "Customer journey insights",
    ],
    integrations: {
      sources: ["Zendesk", "Intercom", "Gong"],
      destinations: ["Slack", "Notion", "Salesforce"],
    },
  },
  {
    id: "finance-sentinel",
    name: "Finance Sentinel",
    description: "Detect anomalies across billing, ERP, and spend in minutes instead of days.",
    icon: "📊",
    priceMonthly: 299,
    currency: "USD",
    roi: 6.1,
    deploymentsPerWeek: 15,
    hoursSavedWeekly: 340,
    category: "Finance",
    tags: ["finops", "compliance", "audit"],
    previewImage: MARKETPLACE_PREVIEW_MEDIA["finance-sentinel"],
    highlights: [
      "Adaptive variance thresholds",
      "Continuous GL reconciliation",
      "Autonomous escalation routing",
    ],
    integrations: {
      sources: ["NetSuite", "Workday", "Stripe"],
      destinations: ["Snowflake", "Slack", "Teams"],
    },
  },
];

export const FAQ_ENTRIES = [
  {
    question: "How quickly can Artifically deploy production-ready automations?",
    answer:
      "Most teams launch their first automation in under 30 days using our curated playbooks and guided onboarding wizard.",
  },
  {
    question: "What ROI can teams expect from the automation marketplace?",
    answer:
      "Customers typically see between 3x and 6x ROI within the first quarter thanks to prebuilt integrations and optimisation insights.",
  },
  {
    question: "Do the automations integrate with our existing tooling?",
    answer:
      "Yes. Each marketplace automation ships with connectors for popular CRMs, service desks, finance suites, and collaboration platforms so rollout fits existing workflows.",
  },
];

export const MARKETPLACE_CANONICAL_BASE = "/marketplace";

export default MARKETPLACE_ENTRIES;