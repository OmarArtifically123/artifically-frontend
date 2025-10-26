/**
 * Enhanced Analytics Tracker for Landing Page
 * Tracks scroll depth, interactions, conversions, and custom events
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface ScrollDepthEvent {
  percentage: number;
  section: string;
  timestamp: number;
}

export interface InteractionEvent {
  type: "click" | "hover" | "focus" | "input";
  element: string;
  section: string;
  timestamp: number;
}

class AnalyticsTracker {
  private scrollDepthThresholds = [25, 50, 75, 90, 100];
  private trackedThresholds = new Set<number>();
  private sessionStartTime = Date.now();
  private interactions: InteractionEvent[] = [];
  private scrollDepths: ScrollDepthEvent[] = [];

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (typeof window === "undefined") return;

    // Send to analytics providers
    this.sendToProviders({
      ...event,
      timestamp: Date.now(),
      sessionDuration: this.getSessionDuration(),
    });

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Event]", event);
    }
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number, section: string): void {
    // Find the threshold this percentage crosses
    const threshold = this.scrollDepthThresholds.find(
      t => percentage >= t && !this.trackedThresholds.has(t)
    );

    if (threshold) {
      this.trackedThresholds.add(threshold);
      
      const scrollEvent: ScrollDepthEvent = {
        percentage: threshold,
        section,
        timestamp: Date.now(),
      };

      this.scrollDepths.push(scrollEvent);

      this.trackEvent({
        category: "Engagement",
        action: "Scroll Depth",
        label: section,
        value: threshold,
        metadata: { section },
      });
    }
  }

  /**
   * Track interaction
   */
  trackInteraction(
    type: InteractionEvent["type"],
    element: string,
    section: string,
    metadata?: Record<string, unknown>
  ): void {
    const interaction: InteractionEvent = {
      type,
      element,
      section,
      timestamp: Date.now(),
    };

    this.interactions.push(interaction);

    this.trackEvent({
      category: "Interaction",
      action: type,
      label: `${section} - ${element}`,
      metadata,
    });
  }

  /**
   * Track CTA click
   */
  trackCTAClick(ctaLabel: string, section: string, destination?: string): void {
    this.trackEvent({
      category: "Conversion",
      action: "CTA Click",
      label: ctaLabel,
      metadata: {
        section,
        destination,
        sessionDuration: this.getSessionDuration(),
      },
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string, success: boolean, data?: Record<string, unknown>): void {
    this.trackEvent({
      category: "Conversion",
      action: success ? "Form Submit Success" : "Form Submit Error",
      label: formName,
      metadata: {
        ...data,
        sessionDuration: this.getSessionDuration(),
      },
    });
  }

  /**
   * Track video play
   */
  trackVideoPlay(videoId: string, section: string): void {
    this.trackEvent({
      category: "Engagement",
      action: "Video Play",
      label: videoId,
      metadata: { section },
    });
  }

  /**
   * Track section view
   */
  trackSectionView(sectionName: string, timeInView: number): void {
    this.trackEvent({
      category: "Engagement",
      action: "Section View",
      label: sectionName,
      value: timeInView,
      metadata: {
        timeInView,
      },
    });
  }

  /**
   * Track 3D interaction
   */
  track3DInteraction(componentName: string, interactionType: string): void {
    this.trackEvent({
      category: "3D Interaction",
      action: interactionType,
      label: componentName,
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metricName: string, value: number, unit: string): void {
    this.trackEvent({
      category: "Performance",
      action: metricName,
      value,
      metadata: { unit },
    });
  }

  /**
   * Get session duration in seconds
   */
  private getSessionDuration(): number {
    return Math.round((Date.now() - this.sessionStartTime) / 1000);
  }

  /**
   * Send event to analytics providers (GA4, Mixpanel, etc.)
   */
  private sendToProviders(event: Record<string, unknown>): void {
    // Google Analytics 4
    if (typeof window !== "undefined" && (window as Record<string, unknown>).gtag) {
      ((window as Record<string, unknown>).gtag as (...args: unknown[]) => void)("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata as object,
      });
    }

    // Add other analytics providers here (Mixpanel, Amplitude, etc.)
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    return {
      sessionDuration: this.getSessionDuration(),
      interactions: this.interactions.length,
      scrollDepths: this.scrollDepths,
      maxScrollDepth: Math.max(...Array.from(this.trackedThresholds), 0),
    };
  }

  /**
   * Reset analytics data (for testing)
   */
  reset(): void {
    this.trackedThresholds.clear();
    this.interactions = [];
    this.scrollDepths = [];
    this.sessionStartTime = Date.now();
  }
}

// Singleton instance
let trackerInstance: AnalyticsTracker | null = null;

export function getAnalyticsTracker(): AnalyticsTracker {
  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker();
  }
  return trackerInstance;
}

export default AnalyticsTracker;




