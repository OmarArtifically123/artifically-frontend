import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface MarketplaceAutomationPageProps {
  params: { slug: string };
}

/**
 * Dynamic metadata for automation detail pages
 * SEO optimized with Open Graph and Twitter Cards
 */
export async function generateMetadata({
  params,
}: MarketplaceAutomationPageProps): Promise<Metadata> {
  // Fetch automation data (implement actual API call)
  const automation = await fetchAutomationBySlug(params.slug);

  if (!automation) {
    return {
      title: "Automation Not Found | Artifically Marketplace",
    };
  }

  const title = `${automation.name} | AI Automation Marketplace`;
  const description = automation.description || automation.summary || "Discover this AI automation";
  const images = automation.previewImage
    ? [
        {
          url: typeof automation.previewImage === "string" 
            ? automation.previewImage 
            : automation.previewImage.src,
          width: 1200,
          height: 630,
          alt: automation.name,
        },
      ]
    : [];

  return {
    title,
    description,
    keywords: automation.tags?.join(", "),
    authors: [{ name: automation.authorName || "Artifically Team" }],
    openGraph: {
      title,
      description,
      type: "website",
      images,
      siteName: "Artifically Marketplace",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: {
      index: automation.status === "published",
      follow: automation.status === "published",
    },
  };
}

async function fetchAutomationBySlug(slug: string): Promise<{
  name: string;
  description?: string;
  summary?: string;
  previewImage?: string | { src: string };
  tags?: string[];
  authorName?: string;
  status?: string;
} | null> {
  // Implement actual API call
  // For now, return mock data or fetch from your API
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/${slug}`);
    // return response.json();
    return null;
  } catch (error) {
    console.error('Error fetching automation:', error);
    return null;
  }
}

export default function MarketplaceAutomationPage({
  params,
}: MarketplaceAutomationPageProps) {
  // Implement page component
  return (
    <div>
      <h1>Automation: {params.slug}</h1>
    </div>
  );
}
