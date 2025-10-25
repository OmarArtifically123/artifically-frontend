export type BillingCadence = "monthly" | "annual";

export type PlanCapability = {
  label: string;
  description?: string;
};

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  whoFor: string;
  priceMonthly?: number; // per month billed monthly
  priceAnnual?: number; // total per year billed annually
  mostPopular?: boolean;
  deployment: string; // deployment speed text
  support: string; // support model text
  capabilities: PlanCapability[];
  limits?: string; // human-scale usage description
  ctaLabel: string;
  ctaTo?: string;
};

export type Persona = {
  id: string;
  title: string;
  description: string;
  recommendedPlanId: Plan["id"];
};

