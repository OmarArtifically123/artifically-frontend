/**
 * Analytics Tracker - Comprehensive event tracking
 */

type AnalyticsEvent = {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
};

class AnalyticsTracker {
  private queue: AnalyticsEvent[] = [];
  private batchSize = 10;
  private batchTimeout = 5000;
  private timer: NodeJS.Timeout | null = null;

  track(event: Omit<AnalyticsEvent, "timestamp">) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      metadata: {
        ...event.metadata,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.queue.push(fullEvent);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      this.scheduleBatch();
    }
  }

  private scheduleBatch() {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.flush();
    }, this.batchTimeout);
  }

  private flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Send to analytics endpoint
    this.send(events);
  }

  private async send(events: AnalyticsEvent[]) {
    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
        keepalive: true,
      });
    } catch (error) {
      console.error("Failed to send analytics:", error);
    }
  }

  // Convenience methods
  trackPageView(path: string) {
    this.track({
      event: "page_view",
      category: "navigation",
      action: "view",
      label: path,
    });
  }

  trackClick(element: string, location: string) {
    this.track({
      event: "click",
      category: "interaction",
      action: "click",
      label: element,
      metadata: { location },
    });
  }

  trackSearch(query: string, results: number) {
    this.track({
      event: "search",
      category: "search",
      action: "query",
      label: query,
      value: results,
    });
  }

  trackAutomationView(automationId: string | number) {
    this.track({
      event: "automation_view",
      category: "marketplace",
      action: "view",
      label: String(automationId),
    });
  }

  trackAutomationDeploy(automationId: string | number) {
    this.track({
      event: "automation_deploy",
      category: "marketplace",
      action: "deploy",
      label: String(automationId),
    });
  }
}

export const analytics = new AnalyticsTracker();
export default analytics;

