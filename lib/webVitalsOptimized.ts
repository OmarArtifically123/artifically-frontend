/**
 * Enhanced Web Vitals tracking with performance optimization insights
 * Measures and reports Core Web Vitals + custom performance metrics
 */

export type Metric = {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
};

export type WebVitalsCallback = (metric: Metric) => void;

// Thresholds based on web.dev recommendations
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(callback: WebVitalsCallback) {
  if (typeof window === 'undefined') return;

  // FCP - First Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          const value = fcpEntry.startTime;
          callback({
            id: `v3-${Date.now()}-FCP`,
            name: 'FCP',
            value,
            rating: getRating('FCP', value),
            delta: value,
            entries: [fcpEntry],
          });
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.error('FCP observer error:', e);
    }

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        const value = lastEntry.renderTime || lastEntry.loadTime || 0;
        
        callback({
          id: `v3-${Date.now()}-LCP`,
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: value,
          entries: [lastEntry],
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP observer error:', e);
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & {
            processingStart?: number;
          };
          const value = fidEntry.processingStart ? fidEntry.processingStart - entry.startTime : 0;
          
          callback({
            id: `v3-${Date.now()}-FID`,
            name: 'FID',
            value,
            rating: getRating('FID', value),
            delta: value,
            entries: [entry],
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID observer error:', e);
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsEntries: PerformanceEntry[] = [];
      
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          
          // Only count layout shifts without recent user input
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
            clsEntries.push(entry);
          }
        });

        callback({
          id: `v3-${Date.now()}-CLS`,
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          entries: clsEntries,
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS observer error:', e);
    }

    // TTFB - Time to First Byte
    try {
      const ttfbObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceEntry & {
            responseStart?: number;
            requestStart?: number;
          };
          
          if (navEntry.responseStart && navEntry.requestStart) {
            const value = navEntry.responseStart - navEntry.requestStart;
            
            callback({
              id: `v3-${Date.now()}-TTFB`,
              name: 'TTFB',
              value,
              rating: getRating('TTFB', value),
              delta: value,
              entries: [entry],
            });
          }
        });
      });
      ttfbObserver.observe({ type: 'navigation', buffered: true });
    } catch (e) {
      console.error('TTFB observer error:', e);
    }

    // INP - Interaction to Next Paint (newer metric replacing FID)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let maxDuration = 0;
        let inpEntry: PerformanceEntry | null = null;

        entries.forEach((entry) => {
          const eventEntry = entry as PerformanceEntry & { duration?: number };
          if (eventEntry.duration && eventEntry.duration > maxDuration) {
            maxDuration = eventEntry.duration;
            inpEntry = entry;
          }
        });

        if (inpEntry && maxDuration > 0) {
          callback({
            id: `v3-${Date.now()}-INP`,
            name: 'INP',
            value: maxDuration,
            rating: getRating('INP', maxDuration),
            delta: maxDuration,
            entries: [inpEntry],
          });
        }
      });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {
      // INP is newer and may not be supported in all browsers
      console.debug('INP not supported or error:', e);
    }
  }

  // Custom metrics using Navigation Timing API
  if ('performance' in window && 'timing' in window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        
        // DNS Lookup Time
        const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
        
        // TCP Connection Time
        const tcpTime = timing.connectEnd - timing.connectStart;
        
        // Request Time
        const requestTime = timing.responseEnd - timing.requestStart;
        
        // DOM Processing Time
        const domProcessing = timing.domComplete - timing.domLoading;

        // Send custom metrics
        console.log('Performance Timing:', {
          dnsTime,
          tcpTime,
          requestTime,
          domProcessing,
        });
      }, 0);
    });
  }
}

/**
 * Send metric to analytics endpoint
 */
export function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    url: window.location.href,
    userAgent: navigator.userAgent,
    effectiveType: (navigator as any).connection?.effectiveType || 'unknown',
    timestamp: Date.now(),
  });

  // Use sendBeacon for reliability (works even if page is closing)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/web-vitals', body);
  } else {
    fetch('/api/web-vitals', {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(console.error);
  }
}

/**
 * Log metrics to console in development
 */
export function logMetricToConsole(metric: Metric) {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
  
  console.log(
    `${emoji} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`,
    metric
  );
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  reportWebVitals((metric) => {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      logMetricToConsole(metric);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      sendToAnalytics(metric);
    }
  });
}

