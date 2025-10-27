import { MetadataRoute } from "next";

/**
 * Generate dynamic sitemap for marketplace automations
 * SEO optimization for search engines
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://artifically.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Fetch all published automations
  const automations = await fetchAllAutomations();

  const automationPages: MetadataRoute.Sitemap = automations.map((automation) => ({
    url: `${baseUrl}/marketplace/${automation.slug}`,
    lastModified: automation.updatedAt ? new Date(automation.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: automation.isFeatured ? 0.8 : 0.6,
  }));

  return [...staticPages, ...automationPages];
}

async function fetchAllAutomations(): Promise<Array<{
  slug: string;
  updatedAt?: string;
  isFeatured?: boolean;
}>> {
  // Implement actual API call to fetch all published automations
  // For now, return empty array
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace?status=published&limit=1000`);
    // return response.json();
    return [];
  } catch (error) {
    console.error('Error fetching automations for sitemap:', error);
    return [];
  }
}
