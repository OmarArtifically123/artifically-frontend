/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals for performance optimization
 */

import { getCLS, getFCP, getFID, getLCP, getTTFB, type Metric } from "web-vitals";

type AnalyticsEvent = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
};

/**
 * Send vitals to analytics endpoint
 */
function sendToAnalytics(metric: AnalyticsEvent) {
  // Only send in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Web Vital:", metric);
    return;
  }

  // Send to analytics endpoint
  const body = JSON.stringify(metric);
  const url = "/api/analytics/vitals";

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch((error) => {
      console.error("Failed to send web vitals:", error);
    });
  }
}

/**
 * Report web vitals
 */
export function reportWebVitals() {
  const onPerfEntry = (metric: Metric) => {
    const analyticsEvent: AnalyticsEvent = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    };

    sendToAnalytics(analyticsEvent);
  };

  // Measure all web vitals
  getCLS(onPerfEntry);
  getFID(onPerfEntry);
  getFCP(onPerfEntry);
  getLCP(onPerfEntry);
  getTTFB(onPerfEntry);
}

/**
 * Performance observer for custom metrics
 */
export function observePerformance() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    // Observe long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn("Long task detected:", entry);
        }
      }
    });

    longTaskObserver.observe({ entryTypes: ["longtask"] });

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (resourceEntry.duration > 1000) {
          console.warn("Slow resource:", resourceEntry.name, resourceEntry.duration);
        }
      }
    });

    resourceObserver.observe({ entryTypes: ["resource"] });
  } catch (error) {
    console.error("Failed to observe performance:", error);
  }
}

export default reportWebVitals;


