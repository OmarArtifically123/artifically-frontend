// Analytics tracking for contact page conversions
export interface AnalyticsEvent {
  event: string;
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean | undefined>;
}

export class ContactAnalytics {
  private static trackEvent(eventData: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventData.event, {
        event_category: eventData.event_category,
        event_label: eventData.event_label,
        value: eventData.value,
        ...eventData.custom_parameters
      });
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventData.event, eventData.custom_parameters);
    }

    // LinkedIn Insight Tag
    if (typeof window !== 'undefined' && window.lintrk) {
      window.lintrk('track', { conversion_id: eventData.event });
    }

    // Internal analytics
    if (typeof window !== 'undefined') {
      const analyticsData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: this.getSessionId(),
        ...eventData
      };

      // Send to internal analytics endpoint
      fetch('/api/v1/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData)
      }).catch(error => {
        console.warn('Analytics tracking failed:', error);
      });
    }
  }

  private static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('contact_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('contact_session_id', sessionId);
    }
    return sessionId;
  }

  // Contact page events
  static trackPageView() {
    this.trackEvent({
      event: 'contact_page_viewed',
      event_category: 'Contact',
      event_label: 'page_load'
    });
  }

  static trackPathSelected(path: string) {
    this.trackEvent({
      event: 'contact_path_selected',
      event_category: 'Contact',
      event_label: path,
      value: 1,
      custom_parameters: {
        path_type: path,
        selection_time: Date.now()
      }
    });
  }

  static trackFormStarted(path: string) {
    this.trackEvent({
      event: 'contact_form_started',
      event_category: 'Contact',
      event_label: path,
      custom_parameters: {
        path_type: path
      }
    });
  }

  static trackFieldCompleted(path: string, fieldName: string) {
    this.trackEvent({
      event: 'contact_field_completed',
      event_category: 'Contact',
      event_label: `${path}_${fieldName}`,
      custom_parameters: {
        path_type: path,
        field_name: fieldName
      }
    });
  }

  static trackFormSubmitted(path: string, referenceNumber: string, leadScore?: number, priority?: string) {
    this.trackEvent({
      event: 'contact_form_submitted',
      event_category: 'Contact',
      event_label: path,
      value: leadScore || 50,
      custom_parameters: {
        path_type: path,
        reference_number: referenceNumber,
        lead_score: leadScore,
        priority: priority
      }
    });
  }

  static trackFormError(path: string, errorType: string, fieldName?: string) {
    this.trackEvent({
      event: 'contact_form_error',
      event_category: 'Contact',
      event_label: `${path}_error`,
      custom_parameters: {
        path_type: path,
        error_type: errorType,
        field_name: fieldName
      }
    });
  }

  static trackAlternativeContactClick(method: string) {
    this.trackEvent({
      event: 'alternative_contact_clicked',
      event_category: 'Contact',
      event_label: method,
      value: 1,
      custom_parameters: {
        contact_method: method
      }
    });
  }

  static trackFAQExpanded(question: string) {
    this.trackEvent({
      event: 'faq_expanded',
      event_category: 'Contact',
      event_label: 'faq_interaction',
      custom_parameters: {
        question: question.substring(0, 50) // Truncate for privacy
      }
    });
  }

  static trackTestimonialViewed(author: string) {
    this.trackEvent({
      event: 'testimonial_viewed',
      event_category: 'Contact',
      event_label: 'social_proof',
      custom_parameters: {
        testimonial_author: author
      }
    });
  }

  // Live chat events
  static trackChatOpened() {
    this.trackEvent({
      event: 'live_chat_opened',
      event_category: 'Contact',
      event_label: 'chat_widget',
      value: 1
    });
  }

  static trackChatMessageSent() {
    this.trackEvent({
      event: 'chat_message_sent',
      event_category: 'Contact',
      event_label: 'chat_engagement',
      value: 1
    });
  }

  static trackChatEnded(rating?: number, duration?: number) {
    this.trackEvent({
      event: 'chat_session_ended',
      event_category: 'Contact',
      event_label: 'chat_completion',
      value: rating,
      custom_parameters: {
        chat_rating: rating,
        chat_duration: duration
      }
    });
  }

  // Calendar booking events
  static trackCalendarOpened(meetingType: string) {
    this.trackEvent({
      event: 'calendar_booking_opened',
      event_category: 'Contact',
      event_label: meetingType,
      custom_parameters: {
        meeting_type: meetingType
      }
    });
  }

  static trackCalendarDateSelected(date: string) {
    this.trackEvent({
      event: 'calendar_date_selected',
      event_category: 'Contact',
      event_label: 'date_selection',
      custom_parameters: {
        selected_date: date
      }
    });
  }

  static trackCalendarTimeSelected(time: string) {
    this.trackEvent({
      event: 'calendar_time_selected',
      event_category: 'Contact',
      event_label: 'time_selection',
      custom_parameters: {
        selected_time: time
      }
    });
  }

  static trackBookingCompleted(meetingType: string, bookingId: string) {
    this.trackEvent({
      event: 'booking_completed',
      event_category: 'Contact',
      event_label: meetingType,
      value: 1,
      custom_parameters: {
        meeting_type: meetingType,
        booking_id: bookingId,
        booking_success: true
      }
    });
  }

  // A/B testing support
  static trackABTestVariant(testName: string, variant: string) {
    this.trackEvent({
      event: 'ab_test_variant',
      event_category: 'Contact',
      event_label: `${testName}_${variant}`,
      custom_parameters: {
        test_name: testName,
        variant: variant
      }
    });
  }

  // Performance tracking
  static trackPagePerformance() {
    if (typeof window === 'undefined' || !window.performance) return;

    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    this.trackEvent({
      event: 'page_performance',
      event_category: 'Performance',
      event_label: 'contact_page',
      custom_parameters: {
        load_time: perfData.loadEventEnd - perfData.fetchStart,
        dom_ready: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        first_byte: perfData.responseStart - perfData.requestStart
      }
    });
  }

  // User behavior tracking
  static trackScrollDepth() {
    if (typeof window === 'undefined') return;

    let maxScroll = 0;
    let tracked25 = false;
    let tracked50 = false;
    let tracked75 = false;
    let tracked100 = false;

    const trackScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.pageYOffset;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        if (scrollPercent >= 25 && !tracked25) {
          tracked25 = true;
          this.trackEvent({
            event: 'scroll_depth',
            event_category: 'Engagement',
            event_label: '25_percent',
            value: 25
          });
        }

        if (scrollPercent >= 50 && !tracked50) {
          tracked50 = true;
          this.trackEvent({
            event: 'scroll_depth',
            event_category: 'Engagement',
            event_label: '50_percent',
            value: 50
          });
        }

        if (scrollPercent >= 75 && !tracked75) {
          tracked75 = true;
          this.trackEvent({
            event: 'scroll_depth',
            event_category: 'Engagement',
            event_label: '75_percent',
            value: 75
          });
        }

        if (scrollPercent >= 90 && !tracked100) {
          tracked100 = true;
          this.trackEvent({
            event: 'scroll_depth',
            event_category: 'Engagement',
            event_label: '100_percent',
            value: 100
          });
        }
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  // Time on page tracking
  static trackTimeOnPage() {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();
    let tracked30s = false;
    let tracked60s = false;
    let tracked120s = false;
    let tracked300s = false;

    const checkTime = () => {
      const timeSpent = Date.now() - startTime;

      if (timeSpent >= 30000 && !tracked30s) {
        tracked30s = true;
        this.trackEvent({
          event: 'time_on_page',
          event_category: 'Engagement',
          event_label: '30_seconds',
          value: 30
        });
      }

      if (timeSpent >= 60000 && !tracked60s) {
        tracked60s = true;
        this.trackEvent({
          event: 'time_on_page',
          event_category: 'Engagement',
          event_label: '60_seconds',
          value: 60
        });
      }

      if (timeSpent >= 120000 && !tracked120s) {
        tracked120s = true;
        this.trackEvent({
          event: 'time_on_page',
          event_category: 'Engagement',
          event_label: '120_seconds',
          value: 120
        });
      }

      if (timeSpent >= 300000 && !tracked300s) {
        tracked300s = true;
        this.trackEvent({
          event: 'time_on_page',
          event_category: 'Engagement',
          event_label: '300_seconds',
          value: 300
        });
      }
    };

    setInterval(checkTime, 5000); // Check every 5 seconds

    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      const finalTime = Date.now() - startTime;
      this.trackEvent({
        event: 'session_duration',
        event_category: 'Engagement',
        event_label: 'page_exit',
        value: Math.round(finalTime / 1000),
        custom_parameters: {
          duration_seconds: Math.round(finalTime / 1000)
        }
      });
    });
  }
}

// Type augmentation for window object
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
    lintrk?: (command: string, parameters?: Record<string, unknown>) => void;
  }
}
