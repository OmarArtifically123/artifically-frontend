import type { Metadata } from "next";
import RevenuePricingPage from "@/app/(site)/pricing-v2/page";

export const metadata: Metadata = {
  title: "Pricing - Artifically | AI Automation Built for Scale",
  description: "Transparent pricing for AI automation. Choose the right plan for your business: Essentials, Growth, Scale, or Enterprise. Start with a 3-day pilot, no credit card required.",
};

export default function PricingRoute() {
  return <RevenuePricingPage />;
}