// Enterprise page analytics tracking
// Instruments all events specified in the conversion architecture

export type EnterpriseEvent =
  | 'enterprise_view'
  | 'hero_primary_cta_click'
  | 'hero_secondary_cta_click'
  | 'hero_tertiary_cta_click'
  | 'roi_calculator_start'
  | 'roi_calculator_complete'
  | 'roi_calculator_download_business_case'
  | 'persona_quiz_start'
  | 'persona_quiz_complete'
  | 'integration_checker_submit'
  | 'deployment_timeline_viewed'
  | 'assurance_layer_expand_security_docs'
  | 'value_pyramid_cta_click'
  | 'case_study_view'
  | 'executive_tour_click'
  | 'pain_cta_click'
  | 'integration_objection_cta_click'
  | 'pricing_comparison_view'
  | 'finance_cta_click'
  | 'final_cta_click'
  | 'scroll_25_percent'
  | 'scroll_50_percent'
  | 'scroll_75_percent'
  | 'inline_scheduler_opened';

interface EventData {
  [key: string]: string | number | boolean | string[] | undefined;
}

export function trackEnterpriseEvent(event: EnterpriseEvent, data: EventData = {}) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', event, {
      event_category: 'enterprise',
      page_path: '/enterprise',
      ...data
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Enterprise Analytics] ${event}`, data);
  }

  // Send to backend analytics endpoint (if available)
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/enterprise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      })
    }).catch(err => console.warn('Analytics endpoint not available:', err));
  }
}

// Scroll depth tracking helper
export function initScrollTracking() {
  if (typeof window === 'undefined') return;

  const milestones = [25, 50, 75];
  const triggered = new Set<number>();

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

    milestones.forEach(milestone => {
      if (scrollPercentage >= milestone && !triggered.has(milestone)) {
        triggered.add(milestone);
        trackEnterpriseEvent(`scroll_${milestone}_percent` as EnterpriseEvent);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
}
