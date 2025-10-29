"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PrefetchConfig {
  /**
   * Routes to prefetch based on current page
   */
  routeMap?: Record<string, string[]>;
  /**
   * Delay before prefetching (ms)
   */
  delay?: number;
  /**
   * Only prefetch on fast connections
   */
  onlyOnFastConnection?: boolean;
  /**
   * Prefetch on hover over links
   */
  prefetchOnHover?: boolean;
}

const DEFAULT_ROUTE_MAP: Record<string, string[]> = {
  '/': ['/marketplace', '/pricing', '/docs'],
  '/marketplace': ['/pricing', '/docs', '/integrations'],
  '/pricing': ['/marketplace', '/docs', '/contact'],
  '/docs': ['/marketplace', '/api', '/integrations'],
  '/about': ['/contact', '/press', '/demo'],
};

/**
 * Predictive Prefetching Component
 * Intelligently prefetches likely next navigation targets
 * Based on current page, user behavior, and network conditions
 */
export default function PredictivePrefetch({
  routeMap = DEFAULT_ROUTE_MAP,
  delay = 2000,
  onlyOnFastConnection = true,
  prefetchOnHover = true,
}: PrefetchConfig) {
  const pathname = usePathname();
  const prefetchedRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if we should prefetch based on network
    if (onlyOnFastConnection && !isFastConnection()) {
      console.log('[Prefetch] Skipping prefetch on slow connection');
      return;
    }

    // Get routes to prefetch for current page
    const routesToPrefetch = routeMap[pathname] || [];

    if (routesToPrefetch.length === 0) {
      return;
    }

    // Delay prefetching to not compete with initial page load
    const timer = setTimeout(() => {
      requestIdleCallback(() => {
        prefetchRoutes(routesToPrefetch);
      }, { timeout: 5000 });
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname, routeMap, delay, onlyOnFastConnection]);

  useEffect(() => {
    if (!prefetchOnHover) return;

    // Setup hover-based prefetching
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href^="/"]') as HTMLAnchorElement | null;

      if (link && !link.hasAttribute('data-no-prefetch')) {
        const href = link.getAttribute('href');
        if (href && !prefetchedRef.current.has(href)) {
          prefetchRoute(href);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [prefetchOnHover]);

  useEffect(() => {
    // Setup viewport-based prefetching for visible links
    if (!('IntersectionObserver' in window)) return;

      observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.getAttribute('href') || '';

            if (href && !prefetchedRef.current.has(href)) {
              // Prefetch after link is visible for 1 second
              setTimeout(() => {
                if (entry.isIntersecting) {
                  prefetchRoute(href);
                }
              }, 1000);
            }
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    // Observe all internal links
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      if (!link.hasAttribute('data-no-prefetch')) {
        observerRef.current?.observe(link);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [pathname]);

  return null;
}

/**
 * Prefetch a single route
 */
function prefetchRoute(route: string) {
  // Check if already prefetched
  const prefetched = ((window as Window & { __NEXT_DATA__?: { props?: { pageProps?: { prefetched?: Set<string> } } } }).__NEXT_DATA__?.props?.pageProps?.prefetched) || new Set<string>();
  
  if (prefetched.has(route)) {
    return;
  }

  console.log('[Prefetch] Prefetching route:', route);

  // Use Next.js router prefetch
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);
  }

  prefetched.add(route);
}

/**
 * Prefetch multiple routes
 */
function prefetchRoutes(routes: string[]) {
  console.log('[Prefetch] Prefetching routes:', routes);

  routes.forEach((route, index) => {
    // Stagger prefetching to avoid network congestion
    setTimeout(() => {
      prefetchRoute(route);
    }, index * 500);
  });
}

/**
 * Check if connection is fast enough for prefetching
 */
function isFastConnection(): boolean {
  if (typeof navigator === 'undefined') return true;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    mozConnection?: { saveData?: boolean; effectiveType?: string };
    webkitConnection?: { saveData?: boolean; effectiveType?: string };
  };

  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) return true;

  // Don't prefetch on slow or metered connections
  if (connection.saveData) {
    return false;
  }

  const effectiveType = connection.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return false;
  }

  return true;
}

/**
 * requestIdleCallback polyfill
 */
function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback
  return setTimeout(callback, options?.timeout || 1) as unknown as number;
}

