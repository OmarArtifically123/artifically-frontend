import {
  MARKETPLACE_ENTRIES,
  FAQ_ENTRIES,
  MARKETPLACE_CANONICAL_BASE,
} from "../data/marketplaceCatalog.js";

const DEFAULT_SITE_URL = "https://artifically.com";
const SITE_URL = (process.env.SITE_URL || process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL)
  .replace(/\/$/, "");

const CANONICAL_ROUTE_MAP = new Map(
  Object.entries({
    "/documentation": "/docs",
    "/docs/api": "/api",
    "/support": "/help",
    "/customers": "/case-studies",
    "/updates": "/changelog",
    "/products/marketplace": MARKETPLACE_CANONICAL_BASE,
  }),
);

const STATIC_ROUTES = [
  { path: "/", priority: 1, changefreq: "daily" },
  { path: "/pricing", priority: 0.9, changefreq: "weekly" },
  { path: "/marketplace", priority: 0.9, changefreq: "daily" },
  { path: "/docs", priority: 0.8, changefreq: "weekly" },
  { path: "/documentation", priority: 0.6, changefreq: "weekly" },
  { path: "/api", priority: 0.7, changefreq: "weekly" },
  { path: "/docs/api", priority: 0.6, changefreq: "weekly" },
  { path: "/blog", priority: 0.6, changefreq: "weekly" },
  { path: "/case-studies", priority: 0.6, changefreq: "monthly" },
  { path: "/customers", priority: 0.5, changefreq: "monthly" },
  { path: "/changelog", priority: 0.5, changefreq: "weekly" },
  { path: "/updates", priority: 0.4, changefreq: "weekly" },
  { path: "/help", priority: 0.5, changefreq: "monthly" },
  { path: "/support", priority: 0.4, changefreq: "monthly" },
  { path: "/status", priority: 0.3, changefreq: "daily" },
  { path: "/security", priority: 0.3, changefreq: "monthly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  { path: "/contact", priority: 0.5, changefreq: "monthly" },
  { path: "/dashboard", priority: 0.2, changefreq: "weekly" },
  { path: "/verify", priority: 0.2, changefreq: "weekly" },
];

const BREADCRUMB_LABELS = {
  pricing: "Pricing",
  marketplace: "Marketplace",
  docs: "Documentation",
  documentation: "Documentation",
  api: "API Reference",
  blog: "Blog",
  "case-studies": "Case Studies",
  customers: "Customers",
  changelog: "Changelog",
  updates: "Product Updates",
  help: "Help Center",
  support: "Support",
  status: "Status",
  security: "Security",
  privacy: "Privacy",
  terms: "Terms of Service",
  contact: "Contact",
  dashboard: "Dashboard",
  verify: "Verify Account",
};

const normalizePathname = (inputPath = "/") => {
  const pathOnly = String(inputPath).split("?")[0].split("#")[0];
  let normalised = pathOnly.trim();
  if (!normalised.startsWith("/")) {
    normalised = `/${normalised}`;
  }
  if (normalised.length > 1) {
    normalised = normalised.replace(/\/+$/, "");
  }
  return normalised || "/";
};

export const getCanonicalPath = (inputPath) => {
  const normalised = normalizePathname(inputPath);
  return CANONICAL_ROUTE_MAP.get(normalised) || normalised;
};

export const getCanonicalUrl = (requestUrl, baseUrl = SITE_URL) => {
  try {
    const url = new URL(String(requestUrl), `${baseUrl}/`);
    const canonicalPath = getCanonicalPath(url.pathname);
    return `${baseUrl}${canonicalPath}`;
  } catch (error) {
    const canonicalPath = getCanonicalPath(requestUrl);
    return `${baseUrl}${canonicalPath}`;
  }
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const buildSitemapXml = () => {
  const urlset = createSitemapRecords()
    .map(
      (item) =>
        `  <url>\n    <loc>${escapeXml(item.loc)}</loc>\n    <lastmod>${escapeXml(item.lastmod)}</lastmod>\n    <changefreq>${escapeXml(
          item.changefreq,
        )}</changefreq>\n    <priority>${escapeXml(item.priority)}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
};

export const buildRobotsTxt = () =>
  `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;

const toTitle = (segment) => {
  if (!segment) return "";
  const lower = segment.toLowerCase();
  if (BREADCRUMB_LABELS[lower]) {
    return BREADCRUMB_LABELS[lower];
  }
  return lower
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const buildBreadcrumb = (canonicalPath, canonicalUrl) => {
  const segments = canonicalPath.split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: toTitle(segment),
      item: `${SITE_URL}${currentPath}`,
    });
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: items,
  };
};

const safeJsonLd = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003C").replace(/\\u2028/g, "\\u2028").replace(/\\u2029/g, "\\u2029");

const buildProductNodes = () => {
  return MARKETPLACE_ENTRIES.slice(0, 8).map((automation) => ({
    "@type": "Product",
    name: automation.name,
    description: automation.description,
    sku: automation.id,
    category: automation.category,
    brand: {
      "@type": "Organization",
      name: "Artifically",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${MARKETPLACE_CANONICAL_BASE}?automation=${encodeURIComponent(automation.id)}`,
      priceCurrency: automation.currency || "USD",
      price: automation.priceMonthly,
      availability: "https://schema.org/InStock",
    },
    audience: automation.tags?.length
      ? {
          "@type": "Audience",
          audienceType: automation.tags.join(", "),
        }
      : undefined,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "ROI",
        value: `${automation.roi}x average return`,
      },
      {
        "@type": "PropertyValue",
        name: "Deployments per week",
        value: automation.deploymentsPerWeek,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (3.5 + Math.min(automation.roi, 5.0) / 2).toFixed(1),
      reviewCount: Math.max(automation.deploymentsPerWeek * 10, 120).toString(),
    },
  }));
};

const createSitemapRecords = () => {
  const now = new Date().toISOString();
  const urls = new Map();

  for (const route of STATIC_ROUTES) {
    const canonicalPath = getCanonicalPath(route.path);
    const loc = `${SITE_URL}${canonicalPath}`;
    urls.set(loc, {
      loc,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  for (const automation of MARKETPLACE_ENTRIES) {
    const productUrl = `${SITE_URL}${MARKETPLACE_CANONICAL_BASE}?automation=${encodeURIComponent(
      automation.id,
    )}`;
    urls.set(productUrl, {
      loc: productUrl,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.6,
    });
  }

  return Array.from(urls.values());
};

export const getSitemapEntries = () =>
  createSitemapRecords().map(({ loc, lastmod, changefreq, priority }) => ({
    url: loc,
    lastModified: lastmod,
    changeFrequency: changefreq,
    priority,
  }));
  
export const getStructuredData = (requestUrl) => {
  const canonicalUrl = getCanonicalUrl(requestUrl);
  const canonicalPath = new URL(canonicalUrl).pathname;

  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Artifically",
      url: SITE_URL,
      description: "Artifically is the enterprise platform for deploying AI-powered automations in minutes.",
      slogan: "Deploy Enterprise AI Automations in Minutes",
      foundingDate: "2021-06-01",
      logo: `${SITE_URL}/android-chrome-512x512.png`,
      sameAs: [
        "https://www.linkedin.com/company/artifically",
        "https://twitter.com/artifically",
        "https://github.com/artifically",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Abu Dhabi",
        addressRegion: "GCC",
        addressCountry: "UAE",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "hello@artifically.com",
        },
      ],
    },
    buildBreadcrumb(canonicalPath, canonicalUrl),
    ...buildProductNodes(),
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ENTRIES.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return safeJsonLd({
    "@context": "https://schema.org",
    "@graph": graph,
  });
};

export const injectSeoMeta = (template, { canonicalUrl, structuredData }) => {
  let output = template;

  output = output.replace(
    "<!--seo-canonical-->",
    canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : "",
  );

  output = output.replace(
    "<!--seo-structured-data-->",
    structuredData
      ? `<script type="application/ld+json">${structuredData}</script>`
      : "",
  );

  return output;
};

export const ssrStatusPayload = (status) => ({
  ...status,
  siteUrl: SITE_URL,
});

export { SITE_URL };