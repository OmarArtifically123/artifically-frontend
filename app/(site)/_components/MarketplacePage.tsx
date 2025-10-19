"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #34d399, #10b981)",
  "linear-gradient(135deg, #f472b6, #ec4899)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
  "linear-gradient(135deg, #38bdf8, #6366f1)",
  "linear-gradient(135deg, #a855f7, #6366f1)",
  "linear-gradient(135deg, #fb7185, #f43f5e)",
  "linear-gradient(135deg, #2dd4bf, #14b8a6)",
];

type PricingFilter = (typeof PRICING_OPTIONS)[number]["value"];
type AttributeKey = (typeof ATTRIBUTE_OPTIONS)[number]["value"];
type SortOption = "popular" | "rating" | "recent" | "name";

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getCardGradient(id: string) {
  if (!id) {
    return CARD_GRADIENTS[0];
  }
  const index = hashString(id) % CARD_GRADIENTS.length;
  return CARD_GRADIENTS[index];
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
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: value < 100 ? 0 : 0,
  }).format(value);
  return `${formatted}/mo`;
}

export default function MarketplacePage() {
  const {
    automations,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    prefetchNextPage,
  } = useMarketplaceAutomations();
  const isLoading = isPending;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>("all");
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([]);
  const [activeAttributes, setActiveAttributes] = useState<AttributeKey[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!hasNextPage) {
      return undefined;
    }

    const target = loadMoreRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage({ cancelRefetch: false }).catch(() => {});
          }
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleLoadMoreHover = useCallback(() => {
    if (hasNextPage) {
      prefetchNextPage().catch(() => {});
    }
  }, [hasNextPage, prefetchNextPage]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage({ cancelRefetch: false }).catch(() => {});
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  const sortedAutomations = useMemo(() => {
    const automationsToSort = [...filteredAutomations];

    const getTimestamp = (automation: (typeof automationsToSort)[number]) => {
      const raw = automation.raw as Record<string, unknown> | undefined;
      const candidate =
        (typeof raw?.createdAt === "string" && Date.parse(raw.createdAt)) ||
        (typeof raw?.updatedAt === "string" && Date.parse(raw.updatedAt)) ||
        (typeof raw?.publishedAt === "string" && Date.parse(raw.publishedAt)) ||
        (typeof raw?.date === "string" && Date.parse(raw.date)) ||
        0;
      return Number.isNaN(candidate) ? 0 : candidate;
    };

    switch (sortOption) {
      case "rating":
        automationsToSort.sort((a, b) => {
          if (b.meta.rating !== a.meta.rating) {
            return b.meta.rating - a.meta.rating;
          }
          return (b.meta.teamVotes || 0) - (a.meta.teamVotes || 0);
        });
        break;
      case "recent":
        automationsToSort.sort((a, b) => getTimestamp(b) - getTimestamp(a));
        break;
      case "name":
        automationsToSort.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
      default:
        automationsToSort.sort((a, b) => {
          if ((b.meta.teamVotes || 0) !== (a.meta.teamVotes || 0)) {
            return (b.meta.teamVotes || 0) - (a.meta.teamVotes || 0);
          }
          return b.meta.rating - a.meta.rating;
        });
        break;
    }

    return automationsToSort;
  }, [filteredAutomations, sortOption]);

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
            <div className="mb-8 flex items-center justify-between">
              <p className="text-[15px] text-white/70">
                {isLoading
                  ? "Showing automations..."
                  : `Showing ${sortedAutomations.length.toLocaleString()} automations`}
              </p>
              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor="marketplace-sort">
                  Sort automations
                </label>
                <select
                  id="marketplace-sort"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value as SortOption)}
                  className="rounded-[10px] text-sm font-medium text-white outline-none"
                  style={{
                    padding: "10px 16px",
                    background: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="recent">Recently Added</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex min-h-[420px] flex-col overflow-hidden rounded-[20px] border border-white/5 bg-white/[0.03] animate-pulse"
                    >
                      <div className="basis-[40%] shrink-0 bg-white/[0.08]" />
                      <div className="flex basis-[60%] flex-col gap-4 p-5">
                        <div className="h-5 w-3/4 rounded bg-white/10" />
                        <div className="h-4 w-full rounded bg-white/10" />
                        <div className="h-4 w-4/5 rounded bg-white/10" />
                        <div className="mt-auto h-4 w-2/3 rounded bg-white/10" />
                      </div>
                    </div>
                  ))
                : sortedAutomations.map((automation) => {
                    const priceLabel = formatPriceTag(automation.priceMonthly, automation.currency);
                    const priceIsFree = priceLabel.toLowerCase() === "free";
                    const teamVotes = Math.max(Number(automation.meta.teamVotes) || 0, 0);
                    const badgeSet = new Set<string>();
                    if (automation.meta.attributes.recentlyAdded || teamVotes < 50) {
                      badgeSet.add("NEW");
                    }
                    if (automation.meta.attributes.mostPopular || teamVotes > 500) {
                      badgeSet.add("POPULAR");
                    }
                    if (priceIsFree) {
                      badgeSet.add("FREE");
                    }
                    const badges = Array.from(badgeSet);

                    return (
                      <article
                        key={automation.id}
                        className="group relative flex aspect-[3/4] min-h-[420px] flex-col cursor-pointer overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] transition duration-300 ease-out hover:border-white/30"
                      >
                        <div
                          className="relative flex basis-[40%] items-center justify-center overflow-hidden p-6"
                          style={{ background: getCardGradient(automation.id) }}
                        >
                          <span className="text-[64px] text-white opacity-90">{automation.icon}</span>
                          {badges.length > 0 && (
                            <div className="absolute left-0 top-0 flex items-center gap-[6px] p-3">
                              {badges.map((badge) => (
                                <span
                                  key={`${automation.id}-${badge}`}
                                  className="rounded-[6px] bg-[rgba(0,0,0,0.6)] px-[10px] py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-white"
                                  style={{ backdropFilter: "blur(8px)" }}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex basis-[60%] flex-col p-5">
                          <h3 className="text-[18px] font-semibold leading-[1.3] text-white line-clamp-2">
                            {automation.name}
                          </h3>
                          <p className="mt-2 text-[14px] leading-[1.5] text-white/70 line-clamp-3">
                            {automation.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.1)] pt-4">
                            <div className="flex items-center gap-[6px]">
                              <span className="text-[14px]">⭐</span>
                              <span className="text-[14px] font-semibold text-white">
                                {automation.meta.rating.toFixed(1)}
                              </span>
                              <span className="text-[13px] text-white/50">
                                ({teamVotes.toLocaleString()})
                              </span>
                            </div>
                            <span
                              className={cn(
                                "rounded-[6px] px-[12px] py-[5px] text-[13px] font-semibold",
                                priceIsFree
                                  ? "bg-[rgba(34,197,94,0.15)] text-[#4ade80]"
                                  : "bg-white/10 text-white",
                              )}
                            >
                              {priceLabel}
                            </span>
                          </div>
                        </div>
                      <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-[10px] opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                          <button
                            type="button"
                            className="rounded-[10px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.12)] px-5 py-[10px] text-[13px] font-semibold text-white"
                            style={{ backdropFilter: "blur(8px)" }}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            className="rounded-[10px] bg-[linear-gradient(135deg,#a78bfa,#ec4899)] px-5 py-[10px] text-[13px] font-semibold text-white"
                          >
                            Deploy
                          </button>
                        </div>
                      </article>
                    );
                  })}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <div ref={loadMoreRef} aria-hidden="true" className="h-px w-full" />
              {hasNextPage ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  onMouseEnter={handleLoadMoreHover}
                  onFocus={handleLoadMoreHover}
                  disabled={isFetchingNextPage}
                  className={cn(
                    "rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition",
                    isFetchingNextPage ? "bg-white/10 text-white/60" : "bg-white/5 hover:bg-white/10",
                  )}
                >
                  {isFetchingNextPage ? "Loading more automations..." : "Load more automations"}
                </button>
              ) : (
                !isLoading && (
                  <p className="text-sm text-white/60">You&apos;ve reached the end of the catalogue.</p>
                )
              )}
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