export const integrationCombos = [
  {
    id: "hubspot-snowflake-slack",
    name: "HubSpot → Snowflake with Slack signal routing",
    description:
      "Push qualified deals from HubSpot into Snowflake, enrich with product metrics, and route alerts into Slack once SLAs are at risk.",
    integrations: ["HubSpot", "Snowflake", "Slack"],
    tags: ["revops", "alerts", "data-warehouse"],
    industries: ["SaaS", "B2B Services"],
    companySizes: ["Mid-market", "Enterprise"],
    quickActions: [
      {
        id: "sla-watch",
        label: "Launch SLA breach watchlist",
        description: "Checks deal velocity and posts an alert if a stage is stuck beyond policy.",
        icon: "⚡",
        relatedQuery: "HubSpot SLA alerts",
      },
      {
        id: "deal-health",
        label: "Sync pipeline health to Slack",
        description: "Summarises risk by segment with next actions for AEs.",
        icon: "📈",
        relatedQuery: "pipeline health",
      },
    ],
  },
  {
    id: "zendesk-gpt-workspace",
    name: "Zendesk → AI workspace triage",
    description:
      "Auto-triage support tickets with sentiment, draft responses, and escalate incidents directly to Jira.",
    integrations: ["Zendesk", "OpenAI", "Jira"],
    tags: ["support", "nlp", "ticketing"],
    industries: ["SaaS", "Fintech"],
    companySizes: ["Startup", "Mid-market"],
    quickActions: [
      {
        id: "triage-dashboard",
        label: "Open live triage dashboard",
        description: "View backlog, sentiment trends, and incident escalations.",
        icon: "🛠️",
        relatedQuery: "Zendesk triage",
      },
      {
        id: "macro-uplift",
        label: "Improve macros with AI drafts",
        description: "Suggests macro updates based on most recent resolutions.",
        icon: "🤖",
        relatedQuery: "support macro",
      },
    ],
  },
  {
    id: "netsuite-snowflake-powerbi",
    name: "NetSuite → Snowflake → Power BI finance sync",
    description:
      "Deliver daily finance snapshots by stitching ERP, billing, and product usage into one command center.",
    integrations: ["NetSuite", "Snowflake", "Power BI"],
    tags: ["finance", "analytics", "executive"],
    industries: ["Financial Services", "Manufacturing"],
    companySizes: ["Mid-market", "Enterprise"],
    quickActions: [
      {
        id: "close-dashboard",
        label: "Kick off close management",
        description: "Tracks close calendar tasks and variance alerts in one place.",
        icon: "📅",
        relatedQuery: "close management",
      },
      {
        id: "variance-alerts",
        label: "Send variance alerts to finance",
        description: "Alerts FP&A partners when margins dip outside guardrails.",
        icon: "📊",
        relatedQuery: "finance variance",
      },
    ],
  },
  {
    id: "salesforce-marketo-datawarehouse",
    name: "Salesforce ↔ Marketo pipeline cleanliness",
    description:
      "Keep lead, campaign, and opportunity data consistent with anomaly detection across revenue tooling.",
    integrations: ["Salesforce", "Marketo", "Snowflake"],
    tags: ["marketing", "sales", "data-quality"],
    industries: ["SaaS", "B2B Services"],
    companySizes: ["Startup", "Mid-market", "Enterprise"],
    quickActions: [
      {
        id: "dedupe",
        label: "Resolve duplicate leads",
        description: "Runs automated merge suggestions with routing checks.",
        icon: "🧹",
        relatedQuery: "duplicate lead cleanup",
      },
      {
        id: "campaign-sync",
        label: "Sync campaign influence",
        description: "Aligns opportunity influence data across both systems.",
        icon: "🔁",
        relatedQuery: "campaign influence",
      },
    ],
  },
  {
    id: "jira-linear-incident",
    name: "Jira ↔ Linear engineering health",
    description:
      "Consolidate incidents, postmortems, and sprint progress with nudges for engineering managers.",
    integrations: ["Jira", "Linear", "Slack"],
    tags: ["engineering", "incident", "velocity"],
    industries: ["SaaS", "DevTools"],
    companySizes: ["Startup", "Mid-market"],
    quickActions: [
      {
        id: "incident-review",
        label: "Schedule incident review",
        description: "Creates a retro agenda with owners and follow-up automations.",
        icon: "🚨",
        relatedQuery: "incident review",
      },
      {
        id: "velocity-digest",
        label: "Share sprint velocity digest",
        description: "Posts progress summaries to Slack leadership channels.",
        icon: "📮",
        relatedQuery: "sprint velocity",
      },
    ],
  },
  {
    id: "shopify-klaviyo-retention",
    name: "Shopify → Klaviyo retention autopilot",
    description:
      "Blend commerce signals with lifecycle messaging to recover churn risk customers automatically.",
    integrations: ["Shopify", "Klaviyo", "Segment"],
    tags: ["ecommerce", "retention", "lifecycle"],
    industries: ["E-commerce"],
    companySizes: ["Startup", "Mid-market"],
    quickActions: [
      {
        id: "lifecycle-cadence",
        label: "Update lifecycle cadence",
        description: "Tweaks touchpoints for VIP versus first-time shoppers.",
        icon: "🛍️",
        relatedQuery: "retention cadence",
      },
      {
        id: "churn-play",
        label: "Deploy churn rescue play",
        description: "Activates offers once churn signals surpass the threshold.",
        icon: "🎯",
        relatedQuery: "churn rescue",
      },
    ],
  },
];

export const onboardingPlaybooks = [
  {
    id: "startup-saas",
    companySize: "Startup",
    industries: ["SaaS", "DevTools"],
    headline: "Stand up intelligent onboarding in a week",
    description:
      "Connect your product data and revenue stack to automate handoffs without hiring ops headcount.",
    steps: [
      "Connect CRM (HubSpot or Salesforce) and grant read-only product metrics access.",
      "Enable the AI assistant to auto-create playbooks from your highest converting cohorts.",
      "Route Slack nudges to CSMs when activation health dips below target.",
    ],
    spotlightAutomations: ["AI-led onboarding notes", "Activation risk alerts", "Usage milestone tracking"],
  },
  {
    id: "midmarket-revops",
    companySize: "Mid-market",
    industries: ["SaaS", "B2B Services"],
    headline: "Operationalize revenue intelligence at scale",
    description:
      "Blend marketing, sales, and finance signals to predict outcomes and eliminate manual reconciliations.",
    steps: [
      "Sync Salesforce stages with Snowflake deal tables for live forecasting.",
      "Automate Marketo campaign responses into opportunity health dashboards.",
      "Distribute actionable win/loss insights to GTM leaders with role-based access.",
    ],
    spotlightAutomations: [
      "Executive forecast briefings",
      "Lifecycle status harmonization",
      "Slack nudges for at-risk deals",
    ],
  },
  {
    id: "enterprise-finance",
    companySize: "Enterprise",
    industries: ["Financial Services", "Manufacturing"],
    headline: "Close your books with always-on guardrails",
    description:
      "Govern sensitive data pipelines while automating the close calendar across global teams.",
    steps: [
      "Connect ERP, billing, and procurement sources with approval-based syncing.",
      "Automate reconciliations using AI explanations for variance root causes.",
      "Publish stakeholder-ready dashboards in Power BI with scheduled certifications.",
    ],
    spotlightAutomations: ["Variance explanation copilot", "Quarter-close orchestration", "SOX-ready audit trails"],
  },
  {
    id: "commerce-retention",
    companySize: "Mid-market",
    industries: ["E-commerce"],
    headline: "Orchestrate lifecycle moments that drive repeat revenue",
    description:
      "Segment customers in real time and let the platform test-and-learn the best retention offers.",
    steps: [
      "Ingest Shopify order and event data to create predictive segments.",
      "Trigger Klaviyo journeys that adapt messaging to predicted LTV.",
      "Send performance digests to merchandising and growth teams via Slack.",
    ],
    spotlightAutomations: [
      "VIP experience automation",
      "Churn risk interception",
      "Seasonal promotion testing",
    ],
  },
];