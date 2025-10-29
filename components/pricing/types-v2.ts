// Extended types for revenue-optimized pricing page

export type BillingCadence = "monthly" | "annual";

export type Automation = {
  id: string;
  name: string;
  priceMonthly: number;
  includedVolume: number;
  volumeUnit: string; // "interactions", "messages", "calls", etc.
  roiStatement: string; // "Cuts missed calls by 15% in first 30 days"
  overageRate: number; // per event after included volume
  details: string[]; // Expandable details
  channels: string[]; // ["Voice", "WhatsApp", etc.]
};

export type PlatformTier = {
  id: "essentials" | "growth" | "scale" | "enterprise";
  name: string;
  positioningStatement: string;
  priceMonthly?: number; // undefined for Enterprise
  priceAnnual?: number; // undefined for Enterprise
  badge?: string; // "RECOMMENDED", "Full governance & 24/7 hotline"
  isRecommended?: boolean;
  isPriceAnchor?: boolean; // Scale shown first
  limits: {
    maxAutomations: number | "unlimited";
    includedInteractions: number;
    overageRate: number;
  };
  support: {
    sla: string; // "<1h response 24/7"
    description: string; // "Dedicated success architect"
  };
  security: string[];
  governance: string[];
  channels: string[];
  languages: string[];
  ctaLabel: string;
  ctaUrl: string;
  ctaMicrocopy?: string;
  features: {
    deployment: string[];
    volume: string[];
    governance: string[];
    support: string[];
    localization: string[];
  };
};

export type BundleSelection = {
  automations: string[]; // automation IDs
  tierId: PlatformTier["id"];
  billingCadence: BillingCadence;
  expectedMonthlyVolume?: number;
};

export type BundleSummary = {
  automations: Automation[];
  tier: PlatformTier;
  billingCadence: BillingCadence;
  automationCosts: number;
  tierCost: number;
  projectedOverage: number;
  estimatedMonthlyTotal: number;
  estimatedAnnualSavings: number; // vs manual staffing
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  title: string;
  location: string;
  metricBadge: string;
};

export type TrustBadge = {
  id: string;
  label: string;
  icon: string;
};

// Analytics event payloads
export type PricingAnalyticsEvents = {
  pricing_view: Record<string, never>;
  hero_cta_build_bundle_click: Record<string, never>;
  hero_cta_pilot_click: Record<string, never>;
  hero_configurator_see_all_click: Record<string, never>;
  bundle_add_automation: { automation_id: string };
  bundle_remove_automation: { automation_id: string };
  automation_details_expand: { automation_id: string };
  plan_selected: { tier_id: string; billing_cycle: BillingCadence };
  billing_toggle_changed: { from: BillingCadence; to: BillingCadence };
  plan_cta_click: { tier_id: string; cta_label: string };
  sticky_summary_expand: Record<string, never>;
  sticky_summary_remove_automation: { automation_id: string };
  sticky_summary_tier_change_click: Record<string, never>;
  checkout_start: {
    bundle_value: number;
    projected_annual_value: number;
    automation_count: number;
    tier_id: string;
  };
  roi_calculator_engage: Record<string, never>;
  roi_calculator_complete: {
    monthly_savings: number;
    hours_saved: number;
    automation_percent: number;
  };
  roi_calculator_cta_click: { monthly_savings: number };
  trust_badge_hover: { badge_id: string };
  compliance_pdf_download: Record<string, never>;
  faq_expand: { question_id: string };
  enterprise_cta_calendar_click: Record<string, never>;
  enterprise_cta_chat_click: Record<string, never>;
  exit_intent_offer_shown: { offer_type: string };
};
