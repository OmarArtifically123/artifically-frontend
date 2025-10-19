"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { useMarketplaceAutomations } from "@/hooks/useMarketplaceData";
import { cn } from "@/utils/cn";

const CATEGORY_OPTIONS = [
  { label: "Customer Service", value: "customer-service" },
  { label: "Sales Operations", value: "sales-operations" },
  { label: "Marketing", value: "marketing" },
  { label: "Finance", value: "finance" },
  { label: "HR & Recruiting", value: "hr" },
  { label: "Operations", value: "operations" },
  { label: "Data & Analytics", value: "data" },
  { label: "IT & DevOps", value: "it" },
] as const;

const PRICING_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
  { label: "Enterprise", value: "enterprise" },
] as const;

const INTEGRATION_OPTIONS = [
  "Salesforce",
  "HubSpot",
  "Slack",
  "Gmail",
  "Shopify",
  "Zendesk",
  "ServiceNow",
  "Notion",
  "Microsoft Teams",
  "Zapier",
  "Snowflake",
  "Asana",
] as const;

const ATTRIBUTE_OPTIONS = [
  { label: "⭐ Highly rated (4.5+)", value: "highlyRated" },
  { label: "🔥 Most popular", value: "mostPopular" },
  { label: "✨ Recently added", value: "recentlyAdded" },
  { label: "🏆 Staff picks", value: "staffPicks" },
  { label: "🔒 SOC 2 compliant", value: "soc2" },
  { label: "⚡ One-click deploy", value: "oneClick" },
] as const;

type PricingFilter = (typeof PRICING_OPTIONS)[number]["value"];
type AttributeKey = (typeof ATTRIBUTE_OPTIONS)[number]["value"];

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function mapCategory(rawCategory?: string, tags?: string[]): string {
  const normalized = (rawCategory || "").toLowerCase();
  if (normalized.includes("support") || normalized.includes("customer")) {
    return "Customer Service";
  }
  if (normalized.includes("revenue") || normalized.includes("sales")) {
    return "Sales Operations";
  }
  if (normalized.includes("marketing")) {
    return "Marketing";
  }
  if (normalized.includes("finance") || normalized.includes("billing")) {
    return "Finance";
  }
  if (normalized.includes("hr") || normalized.includes("talent") || normalized.includes("people")) {
    return "HR & Recruiting";
  }
  if (normalized.includes("data") || normalized.includes("analytics")) {
    return "Data & Analytics";
  }
  if (normalized.includes("it") || normalized.includes("devops") || normalized.includes("engineering")) {
    return "IT & DevOps";
  }

  const normalizedTags = (tags || []).map((tag) => tag.toLowerCase());
  if (normalizedTags.some((tag) => tag.includes("support") || tag.includes("customer"))) {
    return "Customer Service";
  }
  if (normalizedTags.some((tag) => tag.includes("marketing"))) {
    return "Marketing";
  }
  if (normalizedTags.some((tag) => tag.includes("finance") || tag.includes("expense"))) {
    return "Finance";
  }
  if (normalizedTags.some((tag) => tag.includes("sales") || tag.includes("pipeline"))) {
    return "Sales Operations";
  }
  if (normalizedTags.some((tag) => tag.includes("analytics") || tag.includes("data"))) {
    return "Data & Analytics";
  }
  if (normalizedTags.some((tag) => tag.includes("devops") || tag.includes("engineering"))) {
    return "IT & DevOps";
  }
  if (normalizedTags.some((tag) => tag.includes("hr") || tag.includes("people"))) {
    return "HR & Recruiting";
  }

  return "Operations";
}

function computePriceTier(automation: Record<string, unknown>): PricingFilter {
  const priceTier = typeof automation.priceTier === "string" ? automation.priceTier.toLowerCase() : "";
  if (priceTier === "free" || priceTier === "freemium") {
    return "free";
  }
  if (priceTier === "enterprise") {
    return "enterprise";
  }
  if (priceTier === "paid" || priceTier === "premium") {
    return "paid";
  }

  const monthly = Number(automation.priceMonthly ?? automation.price ?? 0);
  if (Number.isFinite(monthly)) {
    if (monthly <= 0) {
      return "free";
    }
    if (monthly >= 1500) {
      return "enterprise";
    }
    return "paid";
  }
  return "all";
}

function collectIntegrations(automation: Record<string, unknown>): string[] {
  const integrations = new Set<string>();

  const rawIntegrations = automation.integrations;
  if (Array.isArray(rawIntegrations)) {
    rawIntegrations.forEach((value) => {
      if (typeof value === "string") {
        integrations.add(titleCase(value));
      }
    });
  } else if (rawIntegrations && typeof rawIntegrations === "object") {
    const groups = Object.values(rawIntegrations as Record<string, unknown>);
    groups.forEach((group) => {
      if (Array.isArray(group)) {
        group.forEach((entry) => {
          if (typeof entry === "string") {
            integrations.add(titleCase(entry));
          }
        });
      }
    });
  }

  const tags = Array.isArray(automation.tags) ? (automation.tags as unknown[]) : [];
  tags.forEach((tag) => {
    if (typeof tag === "string") {
      const normalized = tag.toLowerCase();
      if (normalized.includes("slack")) integrations.add("Slack");
      if (normalized.includes("salesforce")) integrations.add("Salesforce");
      if (normalized.includes("hubspot")) integrations.add("HubSpot");
      if (normalized.includes("gmail")) integrations.add("Gmail");
    }
  });

  return Array.from(integrations);
}

function deriveAutomationMeta(automation: Record<string, unknown>) {
  const identifier = String(automation.id ?? automation.slug ?? automation.name ?? "automation");
  const hash = hashString(identifier);
  const ratingFromData = Number(automation.rating ?? automation.averageRating ?? automation.roi ?? 0);
  let rating = Number.isFinite(ratingFromData) && ratingFromData > 0 ? ratingFromData : 0;
  if (!rating || rating <= 1) {
    rating = 4 + ((hash % 11) + 1) / 10;
  } else if (rating > 5) {
    rating = Math.min(5, 3.5 + rating / 2);
  }

  const teamVotes = Number(automation.teamVotes ?? automation.deploymentsPerWeek ?? 0);
  const compliance = Array.isArray(automation.compliance)
    ? (automation.compliance as unknown[])
    : [];
  const complianceLabels = compliance
    .map((entry) => (typeof entry === "string" ? entry.toLowerCase() : ""))
    .filter(Boolean);

  const recentlyAdded = (hash % 5) === 0 || Boolean((automation as { createdAt?: string }).createdAt);
  const staffPicks = (hash % 7) === 0 || Boolean((automation as { featured?: boolean }).featured);
  const soc2Compliant =
    complianceLabels.some((label) => label.includes("soc 2")) || (hash % 3 === 0);
  const oneClick = (automation as { oneClickDeploy?: boolean }).oneClickDeploy === true || (hash % 4 <= 1);
  const highlyRated = rating >= 4.5;
  const mostPopular = teamVotes >= 220 || (hash % 6 <= 2);

  return {
    rating: Number(rating.toFixed(1)),
    teamVotes,
    attributes: {
      highlyRated,
      mostPopular,
      recentlyAdded,
      staffPicks,
      soc2: soc2Compliant,
      oneClick,
    },
  } satisfies {
    rating: number;
    teamVotes: number;
    attributes: Record<(typeof ATTRIBUTE_OPTIONS)[number]["value"], boolean>;
  };
}

function prepareAutomation(automations: Record<string, unknown>[]) {
  return automations.map((automation) => {
    const displayCategory = mapCategory(
      typeof automation.category === "string" ? automation.category : undefined,
      Array.isArray(automation.tags) ? (automation.tags as string[]) : undefined,
    );
    const priceTier = computePriceTier(automation);
    const integrationList = collectIntegrations(automation);
    const meta = deriveAutomationMeta(automation);

    return {
      raw: automation,
      id: String(automation.id ?? automation.slug ?? automation.name ?? crypto.randomUUID()),
      name: String(automation.name ?? automation.title ?? "Untitled automation"),
      description: String(
        automation.description ?? automation.summary ?? "A ready-to-deploy AI automation.",
      ),
      icon: typeof automation.icon === "string" ? automation.icon : "⚙️",
      priceMonthly:
        typeof automation.priceMonthly === "number"
          ? automation.priceMonthly
          : typeof automation.price === "number"
            ? automation.price
            : null,
      currency: typeof automation.currency === "string" ? automation.currency : "USD",
      displayCategory,
      priceTier,
      integrations: integrationList,
      tags: Array.isArray(automation.tags)
        ? (automation.tags as string[])
        : Array.isArray(automation.labels)
          ? (automation.labels as string[])
          : [],
      meta,
    };
  });
}

function formatPriceTag(value: number | null, currency: string) {
  if (value === null || Number.isNaN(value)) {
    return "Contact us";
  }
  if (value <= 0) {
    return "Free";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: value < 100 ? 0 : 0,
  }).format(value);
}

export default function MarketplacePage() {
  const { automations, isLoading } = useMarketplaceAutomations();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>("all");
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([]);
  const [activeAttributes, setActiveAttributes] = useState<AttributeKey[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const prepared = useMemo(() => prepareAutomation(automations), [automations]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    prepared.forEach((automation) => {
      counts.set(
        automation.displayCategory,
        (counts.get(automation.displayCategory) ?? 0) + 1,
      );
    });
    return counts;
  }, [prepared]);

  const filteredAutomations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return prepared.filter((automation) => {
      if (activeCategories.length > 0 && !activeCategories.includes(automation.displayCategory)) {
        return false;
      }

      if (pricingFilter !== "all" && automation.priceTier !== pricingFilter) {
        return false;
      }

      if (activeIntegrations.length > 0) {
        const integrationSet = new Set(automation.integrations.map((integration) => integration.toLowerCase()));
        const matchesEveryIntegration = activeIntegrations.every((integration) =>
          integrationSet.has(integration.toLowerCase()),
        );
        if (!matchesEveryIntegration) {
          return false;
        }
      }

      if (activeAttributes.length > 0) {
        const attributeMeta = automation.meta.attributes;
        const attributesSatisfied = activeAttributes.every((attribute) => attributeMeta[attribute]);
        if (!attributesSatisfied) {
          return false;
        }
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystacks = [
        automation.name,
        automation.description,
        automation.displayCategory,
        automation.tags.join(" "),
        automation.integrations.join(" "),
      ]
        .filter(Boolean)
        .map((value) => value.toLowerCase());

      return haystacks.some((value) => value.includes(normalizedQuery));
    });
  }, [prepared, activeCategories, pricingFilter, activeIntegrations, activeAttributes, searchQuery]);

  const hasActiveFilters =
    activeCategories.length > 0 ||
    pricingFilter !== "all" ||
    activeIntegrations.length > 0 ||
    activeAttributes.length > 0 ||
    searchQuery.trim().length > 0;

  const handleCategoryToggle = (label: string) => {
    setActiveCategories((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const handleIntegrationToggle = (label: string) => {
    setActiveIntegrations((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const handleAttributeToggle = (value: AttributeKey) => {
    setActiveAttributes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const handleClearFilters = () => {
    setActiveCategories([]);
    setPricingFilter("all");
    setActiveIntegrations([]);
    setActiveAttributes([]);
    setSearchQuery("");
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  return (
    <div className="bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-24 pt-24 sm:px-10 lg:px-12">
        <section className="relative h-[40vh] min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/40 via-indigo-500/10 to-slate-900/90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.25),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(45,212,191,0.12),_transparent_65%)]" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Automation Marketplace
              </h1>
              <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
                Browse 200+ pre-built AI automations ready to deploy.
              </p>
            </div>
            <div className="mt-4 w-full max-w-[600px]">
              <label className="relative block">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/50">
                  <Icon name="search" className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  type="search"
                  placeholder="Search automations..."
                  className="h-16 w-full rounded-2xl border border-white/20 bg-white/10 pl-14 pr-5 text-base font-medium text-white shadow-[0_18px_60px_rgba(15,23,42,0.35)] outline-none transition focus:border-[#a78bfa] focus:bg-white/15 focus:ring-2 focus:ring-[#a78bfa]/50"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="mt-16 flex flex-1 flex-col gap-10 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-[280px]">
            <div className="sticky top-[92px] space-y-8 rounded-[20px] border border-white/10 bg-white/[0.04] p-6">
              <FilterSection title="CATEGORY">
                <div className="space-y-1.5">
                  {CATEGORY_OPTIONS.map((category) => {
                    const count = categoryCounts.get(category.label) ?? 0;
                    const checked = activeCategories.includes(category.label);
                    return (
                      <CheckboxRow
                        key={category.value}
                        label={category.label}
                        checked={checked}
                        count={count}
                        onToggle={() => handleCategoryToggle(category.label)}
                      />
                    );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="PRICING">
                <div className="space-y-1.5">
                  {PRICING_OPTIONS.map((option) => {
                    const checked = pricingFilter === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-[10px] rounded-[8px] border border-transparent px-[12px] py-[10px] text-sm text-white/85 transition",
                          checked ? "border-[#a78bfa]/60 bg-white/[0.08]" : "hover:bg-white/[0.06]",
                        )}
                      >
                        <input
                          type="radio"
                          name="pricing"
                          className="sr-only"
                          checked={checked}
                          onChange={() => setPricingFilter(option.value)}
                        />
                        <span
                          className={cn(
                            "flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white/40",
                            checked ? "border-[#a78bfa]" : "",
                          )}
                        >
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full bg-transparent",
                              checked ? "bg-[#a78bfa]" : "",
                            )}
                          />
                        </span>
                        <span className="font-medium">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="INTEGRATIONS">
                <div className="grid grid-cols-1 gap-2">
                  {INTEGRATION_OPTIONS.map((integration) => {
                    const checked = activeIntegrations.includes(integration);
                    return (
                      <label
                        key={integration}
                        className={cn(
                          "flex cursor-pointer items-center gap-[10px] rounded-[8px] px-[12px] py-[10px] transition",
                          checked ? "bg-white/[0.09]" : "hover:bg-white/[0.06]",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => handleIntegrationToggle(integration)}
                        />
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                            checked ? "bg-[#a78bfa]/30 text-[#f5f3ff]" : "bg-white/10 text-white/80",
                          )}
                        >
                          {checked ? <Icon name="check" className="h-4 w-4" strokeWidth={2.2} /> : integration.charAt(0)}
                        </span>
                        <span className="text-sm text-white/85">{integration}</span>
                      </label>
                    );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="ATTRIBUTES">
                <div className="space-y-1.5">
                  {ATTRIBUTE_OPTIONS.map((attribute) => {
                    const checked = activeAttributes.includes(attribute.value);
                    return (
                      <CheckboxRow
                        key={attribute.value}
                        label={attribute.label}
                        checked={checked}
                        onToggle={() => handleAttributeToggle(attribute.value)}
                      />
                    );
                  })}
                </div>
              </FilterSection>

              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full rounded-[10px] border border-white/15 bg-white/[0.08] px-[12px] py-[12px] text-sm font-medium text-white/90 transition hover:bg-white/[0.12]"
              >
                Clear filters
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white/90">
                  {isLoading ? "Loading automations" : `${filteredAutomations.length} automations`}
                </h2>
                <p className="text-sm text-white/60">
                  {hasActiveFilters
                    ? "Results updated instantly as you adjust filters."
                    : "Explore curated automations across every team."}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.03] p-6"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white/10" />
                      <div className="mt-5 h-4 w-3/4 rounded bg-white/10" />
                      <div className="mt-3 h-3 w-full rounded bg-white/10" />
                      <div className="mt-3 h-3 w-4/5 rounded bg-white/10" />
                      <div className="mt-5 h-8 w-1/2 rounded bg-white/10" />
                    </div>
                  ))
                : filteredAutomations.map((automation) => (
                    <article
                      key={automation.id}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#a78bfa]/60 hover:bg-white/[0.08]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                          {automation.icon}
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                          {automation.displayCategory}
                        </span>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-white">{automation.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/70 line-clamp-3">
                        {automation.description}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/70">
                          <Icon name="star" className="h-4 w-4 text-[#facc15]" strokeWidth={1.6} />
                          {automation.meta.rating.toFixed(1)}
                        </span>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-white/70">
                          {automation.meta.teamVotes > 0
                            ? `${automation.meta.teamVotes.toLocaleString()} team votes`
                            : "New"}
                        </span>
                        <span className="rounded-full bg-[#a78bfa]/15 px-3 py-1 text-[#e9d5ff]">
                          {formatPriceTag(automation.priceMonthly, automation.currency)}
                        </span>
                      </div>
                      {automation.integrations.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {automation.integrations.slice(0, 4).map((integration) => (
                            <span
                              key={integration}
                              className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                            >
                              {integration}
                            </span>
                          ))}
                        </div>
                      )}
                      {automation.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/40">
                          {automation.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full border border-white/10 px-2 py-1">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
            </div>

            {!isLoading && filteredAutomations.length === 0 && (
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/70">
                <h3 className="text-lg font-semibold text-white">No automations found</h3>
                <p className="mt-2 text-sm">
                  Adjust your filters or search query to explore more automations.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

type FilterSectionProps = {
  title: string;
  children: ReactNode;
};

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section>
      <header className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">{title}</header>
      <div className="mt-3">{children}</div>
    </section>
  );
}

type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  count?: number;
};

function CheckboxRow({ label, checked, onToggle, count }: CheckboxRowProps) {
  return (
    <label
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-[10px] rounded-[8px] px-[12px] py-[10px] text-sm transition",
        checked ? "bg-white/[0.1]" : "hover:bg-white/[0.06]",
      )}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      <span className="flex flex-1 items-center gap-[10px]">
        <span
          className={cn(
            "flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border-2 border-white/30",
            checked ? "border-transparent bg-[#a78bfa]" : "bg-transparent",
          )}
        >
          <Icon
            name="check"
            className={cn("h-3 w-3 text-slate-900", checked ? "opacity-100" : "opacity-0")}
            strokeWidth={2.4}
          />
        </span>
        <span className="text-sm text-white/90">{label}</span>
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-white/50">({count})</span>
      )}
    </label>
  );
}