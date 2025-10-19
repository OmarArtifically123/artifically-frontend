
import type { IconName } from "@/components/icons/Icon";
import { MARKETPLACE_ENTRIES } from "./marketplaceCatalog.js";

type MarketplaceEntry = {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags?: string[];
};

export type CommandPaletteSection = "Automations" | "Pages" | "Documentation" | "Actions";

type QuickActionId = "start-trial" | "view-pricing" | "contact-sales";

export type CommandPaletteItem = {
  id: string;
  title: string;
  subtitle: string;
  section: CommandPaletteSection;
  icon: IconName;
  href?: string;
  keywords?: string[];
  quickActionId?: QuickActionId;
  shortcut?: string;
};

const marketplaceEntries = (MARKETPLACE_ENTRIES as MarketplaceEntry[]).filter(
  (entry): entry is MarketplaceEntry => typeof entry?.id === "string" && typeof entry?.name === "string",
);

const automationIconMap: Record<string, IconName> = {
  Operations: "shield", // Ops Guardian
  Revenue: "briefcase",
  "Customer Experience": "headphones",
  Finance: "barChart",
};

const automationItems: CommandPaletteItem[] = marketplaceEntries.map((automation) => {
  const icon = automationIconMap[automation.category] ?? "sparkles";
  const href = `/marketplace/${automation.id}`;
  const description = automation.description?.trim();
  const subtitle = `Automations • ${automation.category}${description ? ` — ${description}` : ""}`;

  return {
    id: `automation-${automation.id}`,
    title: automation.name,
    subtitle,
    section: "Automations",
    icon,
    href,
    keywords: [automation.category, ...(automation.tags ?? []), automation.description ?? ""].filter(Boolean),
  };
});

const pageItems: CommandPaletteItem[] = [
  { id: "page-home", title: "Home", subtitle: "Pages • /", section: "Pages", icon: "compass", href: "/" },
  {
    id: "page-marketplace",
    title: "Automation Marketplace",
    subtitle: "Pages • /marketplace",
    section: "Pages",
    icon: "grid",
    href: "/marketplace",
    keywords: ["automations", "catalog", "solutions"],
  },
  {
    id: "page-solutions",
    title: "Solutions",
    subtitle: "Pages • /solutions",
    section: "Pages",
    icon: "puzzle",
    href: "/solutions",
    keywords: ["enterprise", "use cases"],
  },
  {
    id: "page-products",
    title: "Platform",
    subtitle: "Pages • /products/platform",
    section: "Pages",
    icon: "rocket",
    href: "/products/platform",
    keywords: ["platform", "capabilities"],
  },
  {
    id: "page-pricing",
    title: "Pricing",
    subtitle: "Pages • /pricing",
    section: "Pages",
    icon: "dollar",
    href: "/pricing",
    keywords: ["plans", "cost", "billing"],
  },
  {
    id: "page-contact",
    title: "Contact",
    subtitle: "Pages • /contact",
    section: "Pages",
    icon: "message",
    href: "/contact",
    keywords: ["sales", "support", "reach"],
  },
  {
    id: "page-security",
    title: "Security",
    subtitle: "Pages • /security",
    section: "Pages",
    icon: "shieldOutline",
    href: "/security",
    keywords: ["soc 2", "gdpr", "trust"],
  },
  {
    id: "page-support",
    title: "Support",
    subtitle: "Pages • /support",
    section: "Pages",
    icon: "headphones",
    href: "/support",
    keywords: ["help center", "guides"],
  },
  {
    id: "page-updates",
    title: "Product Updates",
    subtitle: "Pages • /updates",
    section: "Pages",
    icon: "refresh",
    href: "/updates",
    keywords: ["changelog", "releases"],
  },
  {
    id: "page-documentation",
    title: "Documentation",
    subtitle: "Pages • /docs",
    section: "Pages",
    icon: "book",
    href: "/docs",
    keywords: ["api", "guides", "docs"],
  },
];

const documentationSections: { id: string; label: string; keywords?: string[] }[] = [
  { id: "overview", label: "Overview", keywords: ["introduction", "getting started"] },
  { id: "quickstart", label: "Quickstart", keywords: ["setup", "first automation"] },
  { id: "concepts", label: "Core Concepts", keywords: ["architecture", "workflows"] },
  { id: "api", label: "API", keywords: ["rest", "endpoints", "reference"] },
  { id: "tooling", label: "Tooling", keywords: ["sdk", "cli", "integrations"] },
  { id: "support", label: "Support", keywords: ["help", "faq", "troubleshooting"] },
];

const documentationItems: CommandPaletteItem[] = documentationSections.map((section) => ({
  id: `doc-${section.id}`,
  title: section.label,
  subtitle: `Documentation • /docs#${section.id}`,
  section: "Documentation",
  icon: "book",
  href: `/docs#${section.id}`,
  keywords: section.keywords,
}));

const quickActionItems: CommandPaletteItem[] = [
  {
    id: "action-start-trial",
    title: "Start trial",
    subtitle: "Actions • Launch onboarding wizard",
    section: "Actions",
    icon: "sparkles",
    quickActionId: "start-trial",
    keywords: ["signup", "get started", "trial"],
    shortcut: "⌘ + ⇧ + S",
  },
  {
    id: "action-view-pricing",
    title: "View pricing",
    subtitle: "Actions • Jump to plan comparison",
    section: "Actions",
    icon: "dollar",
    href: "/pricing",
    quickActionId: "view-pricing",
    keywords: ["plans", "cost", "billing"],
  },
  {
    id: "action-contact-sales",
    title: "Contact sales",
    subtitle: "Actions • Connect with our specialists",
    section: "Actions",
    icon: "handshake",
    href: "/contact?topic=sales",
    quickActionId: "contact-sales",
    keywords: ["sales", "demo", "talk to us"],
    shortcut: "⇧ + C",
  },
];

export const COMMAND_PALETTE_ITEMS: CommandPaletteItem[] = [
  ...automationItems,
  ...pageItems,
  ...documentationItems,
  ...quickActionItems,
];

export function getCommandPaletteItems(): CommandPaletteItem[] {
  return COMMAND_PALETTE_ITEMS;
}