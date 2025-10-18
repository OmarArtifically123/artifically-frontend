export type MarketplaceListing = {
  slug: string;
  badge: string;
  title: string;
  description: string;
  rating: string;
  price: string;
  summary: string;
  outcomes: string[];
  integrations: string[];
};

export const marketplaceListings: MarketplaceListing[] = [
  {
    slug: "ai-sales-email-generator",
    badge: "MOST POPULAR",
    title: "AI Sales Email Generator",
    description: "Draft personalized outbound emails at scale using your CRM data and AI.",
    rating: "⭐ 4.9 (234)",
    price: "Free",
    summary:
      "Automatically craft multi-step outbound sequences that blend product insights with a prospect's live context.",
    outcomes: [
      "Enrich every contact with CRM, product usage, and news data before copy is generated.",
      "Send sequences across email and chat with AI adjusting tone to each persona.",
      "Hand off qualified replies to sellers with AI summaries and suggested next steps.",
    ],
    integrations: ["Salesforce", "HubSpot", "Gmail", "Outreach"],
  },
  {
    slug: "realtime-support-triage",
    badge: "NEW",
    title: "Realtime Support Triage",
    description: "Route tickets to the right agent instantly with intent and sentiment detection.",
    rating: "⭐ 5.0 (89)",
    price: "Free",
    summary:
      "Detect ticket urgency, language, and topic within seconds so customers hear back faster.",
    outcomes: [
      "Auto-tag and prioritize inbound support tickets using intent, sentiment, and customer value.",
      "Deflect repetitive questions with AI responses while queuing escalations for humans.",
      "Stream metrics to your helpdesk with zero manual triage required.",
    ],
    integrations: ["Zendesk", "Intercom", "Slack", "ServiceNow"],
  },
  {
    slug: "marketing-asset-repurposer",
    badge: "TRENDING",
    title: "Marketing Asset Repurposer",
    description: "Turn webinars into blogs, social posts, and nurture sequences automatically.",
    rating: "⭐ 4.8 (142)",
    price: "Free",
    summary:
      "Give teams a consistent content engine by transforming long-form assets into channel-ready deliverables.",
    outcomes: [
      "Ingest webinars, podcasts, or PDFs and extract the moments that matter most.",
      "Generate on-brand blog drafts, emails, and social copy tailored to each persona.",
      "Publish to CMS, marketing automation, and scheduling tools with approvals built in.",
    ],
    integrations: ["WordPress", "Marketo", "LinkedIn", "HubSpot"],
  },
  {
    slug: "finance-reconciliation-copilot",
    badge: "MOST POPULAR",
    title: "Finance Reconciliation Copilot",
    description: "Match invoices and payments nightly with exception routing and alerts.",
    rating: "⭐ 4.7 (167)",
    price: "Free",
    summary:
      "Keep your books accurate by letting AI surface only the transactions that require human review.",
    outcomes: [
      "Reconcile bank, ERP, and billing data with explainable matching recommendations.",
      "Escalate discrepancies with context, suggested owners, and remediation playbooks.",
      "Export clean journals to your GL automatically once checks pass.",
    ],
    integrations: ["NetSuite", "QuickBooks", "Stripe", "Snowflake"],
  },
];

export const marketplaceListingMap = new Map(marketplaceListings.map((listing) => [listing.slug, listing]));

export const featuredMarketplaceListings = marketplaceListings.map((listing) => ({
  badge: listing.badge,
  title: listing.title,
  description: listing.description,
  rating: listing.rating,
  price: listing.price,
  href: `/marketplace/${listing.slug}`,
}));