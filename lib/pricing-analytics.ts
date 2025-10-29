import type { PricingAnalyticsEvents } from "@/components/pricing/types-v2";

/**
 * Type-safe analytics tracking for pricing page events
 */
export function trackPricingEvent<K extends keyof PricingAnalyticsEvents>(
  eventName: K,
  payload: PricingAnalyticsEvents[K]
): void {
  // In production, this would send to your analytics platform
  // (Google Analytics, Mixpanel, Amplitude, PostHog, etc.)
  
  if (typeof window !== "undefined") {
    // Example: Google Analytics 4
    if ("gtag" in window && typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }

    // Example: Segment
    if ("analytics" in window && typeof window.analytics === "object") {
      window.analytics?.track?.(eventName, payload);
    }

    // Development logging
    if (process.env.NODE_ENV === "development") {
      console.log("[Pricing Analytics]", eventName, payload);
    }
  }
}

/**
 * Track page view
 */
export function trackPricingPageView(): void {
  trackPricingEvent("pricing_view", {});
}

/**
 * Track checkout start with full bundle context
 */
export function trackCheckoutStart(
  bundleValue: number,
  projectedAnnualValue: number,
  automationCount: number,
  tierId: string
): void {
  trackPricingEvent("checkout_start", {
    bundle_value: bundleValue,
    projected_annual_value: projectedAnnualValue,
    automation_count: automationCount,
    tier_id: tierId,
  });
}

// Augment window type for analytics libraries
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    analytics?: {
      track?: (event: string, properties?: unknown) => void;
    };
  }
}
