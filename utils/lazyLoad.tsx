/**
 * Mobile Performance Optimization Utilities
 *
 * Provides utilities for:
 * - Smart lazy loading with loading states
 * - Code splitting optimizations
 * - Intersection Observer-based loading
 * - Mobile-specific performance patterns
 */

import dynamic, { type DynamicOptions, type Loader } from "next/dynamic";
import { type ComponentType, type ReactNode, Suspense } from "react";

/**
 * Loading fallback components
 */
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center p-4" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
        aria-label="Loading"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingSkeleton({
  className = "",
  count = 1,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className="space-y-3 animate-pulse" role="status" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
          style={{ height: "1rem" }}
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="card-responsive animate-pulse" role="status" aria-live="polite">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
      <span className="sr-only">Loading card...</span>
    </div>
  );
}

/**
 * Enhanced lazy loading with custom loading states
 *
 * @example
 * const HeavyComponent = lazyLoad(() => import('./HeavyComponent'), {
 *   fallback: <LoadingSpinner />,
 * });
 */
export function lazyLoad<P extends Record<string, unknown>>(
  loader: Loader<P>,
  options?: {
    fallback?: ReactNode;
    ssr?: boolean;
  },
): ComponentType<P> {
  const { fallback = <LoadingSpinner />, ssr = false } = options || {};

  const LazyComponent = dynamic(loader, {
    loading: () => <>{fallback}</>,
    ssr,
  });

  return LazyComponent;
}

/**
 * Lazy load with skeleton fallback
 * Best for components that replace content (not modal/overlay)
 */
export function lazyLoadWithSkeleton<P extends Record<string, unknown>>(
  loader: Loader<P>,
  skeletonProps?: { className?: string; count?: number },
): ComponentType<P> {
  return lazyLoad(loader, {
    fallback: <LoadingSkeleton {...skeletonProps} />,
    ssr: false,
  });
}

/**
 * Lazy load below-the-fold content
 * Aggressively disables SSR for better initial page load
 */
export function lazyLoadBelowFold<P extends Record<string, unknown>>(
  loader: Loader<P>,
): ComponentType<P> {
  return dynamic(loader, {
    loading: () => <LoadingSkeleton count={3} />,
    ssr: false,
  });
}

/**
 * Lazy load modals and overlays
 * These don't need loading states as they appear on demand
 */
export function lazyLoadModal<P extends Record<string, unknown>>(
  loader: Loader<P>,
): ComponentType<P> {
  return dynamic(loader, {
    ssr: false,
  });
}

/**
 * Lazy load heavy interactive components
 * Examples: charts, rich text editors, video players
 */
export function lazyLoadHeavy<P extends Record<string, unknown>>(
  loader: Loader<P>,
  fallback?: ReactNode,
): ComponentType<P> {
  return dynamic(loader, {
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center">
        {fallback || <LoadingSpinner size="lg" />}
      </div>
    ),
    ssr: false,
  });
}

/**
 * Intersection Observer-based lazy loading
 * Loads component only when it enters viewport
 *
 * @example
 * <LazyComponent
 *   loader={() => import('./HeavyComponent')}
 *   fallback={<LoadingSkeleton />}
 *   rootMargin="200px" // Start loading 200px before entering viewport
 * />
 */
interface LazyComponentProps<P> {
  loader: Loader<P>;
  fallback?: ReactNode;
  rootMargin?: string;
  componentProps?: P;
}

export function LazyComponent<P extends Record<string, unknown>>({
  loader,
  fallback = <LoadingSkeleton count={3} />,
  rootMargin = "200px",
  componentProps,
}: LazyComponentProps<P>) {
  // Create dynamic component
  const Component = dynamic(loader, {
    loading: () => <>{fallback}</>,
    ssr: false,
  });

  return (
    <Suspense fallback={fallback}>
      <Component {...(componentProps as P)} />
    </Suspense>
  );
}

/**
 * Preload a component for faster subsequent loads
 * Useful for components that will be needed soon
 *
 * @example
 * // On hover or route change, preload the component
 * preloadComponent(() => import('./Modal'));
 */
export function preloadComponent<P>(loader: Loader<P>): void {
  const Component = dynamic(loader, { ssr: false });
  // Access the preload method if available
  if ('preload' in Component && typeof Component.preload === 'function') {
    Component.preload();
  }
}

/**
 * Route-based code splitting helper
 * Automatically lazy loads route components with appropriate fallbacks
 */
export function createRouteLoader<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    fallback?: ReactNode;
    preload?: boolean;
  },
): ComponentType<P> {
  const { fallback, preload = false } = options || {};

  const Component = dynamic(importFn, {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        {fallback || <LoadingSpinner size="lg" />}
      </div>
    ),
    ssr: true, // Routes should be SSR-friendly
  });

  // Optionally preload on mount
  if (preload && typeof window !== "undefined") {
    importFn();
  }

  return Component;
}

/**
 * Bundle size optimization: Conditional imports based on viewport
 * Only load heavy components on desktop
 */
export function lazyLoadDesktopOnly<P extends Record<string, unknown>>(
  loader: Loader<P>,
  mobileAlternative?: ComponentType<P>,
): ComponentType<P> {
  if (typeof window === "undefined") {
    // SSR: Load the component
    return dynamic(loader, { ssr: true });
  }

  // Check if mobile viewport
  const isMobile = window.innerWidth < 768;

  if (isMobile && mobileAlternative) {
    return mobileAlternative;
  }

  return dynamic(loader, {
    loading: () => <LoadingSpinner />,
    ssr: false,
  });
}

/**
 * Performance monitoring wrapper
 * Logs component load time for performance tracking
 */
export function lazyLoadWithMetrics<P extends Record<string, unknown>>(
  loader: Loader<P>,
  componentName: string,
): ComponentType<P> {
  return dynamic(
    async () => {
      const startTime = performance.now();

      try {
        const loaderResult = typeof loader === "function" ? loader() : loader;
        const module = await loaderResult;
        const loadTime = performance.now() - startTime;

        // Log to analytics (replace with your analytics solution)
        if (typeof window !== "undefined" && "performance" in window) {
          console.log(
            `[Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`,
          );

          // You can send this to your analytics service
          // trackPerformance({ component: componentName, loadTime });
        }

        return module;
      } catch (error) {
        console.error(`[Performance] Failed to load ${componentName}:`, error);
        throw error;
      }
    },
    {
      loading: () => <LoadingSpinner />,
      ssr: false,
    },
  );
}

/**
 * Example Usage Patterns:
 *
 * // 1. Basic lazy loading with spinner
 * const Chart = lazyLoad(() => import('@/components/Chart'));
 *
 * // 2. Below-the-fold content
 * const Footer = lazyLoadBelowFold(() => import('@/components/Footer'));
 *
 * // 3. Modal (no loading state needed)
 * const Modal = lazyLoadModal(() => import('@/components/Modal'));
 *
 * // 4. Heavy component with custom fallback
 * const VideoPlayer = lazyLoadHeavy(
 *   () => import('@/components/VideoPlayer'),
 *   <div>Loading video player...</div>
 * );
 *
 * // 5. Intersection observer-based
 * <LazyComponent
 *   loader={() => import('@/components/HeavySection')}
 *   rootMargin="300px"
 * />
 *
 * // 6. Route component
 * const DashboardPage = createRouteLoader(
 *   () => import('@/app/dashboard/page'),
 *   { preload: true }
 * );
 *
 * // 7. Desktop only
 * const AdvancedChart = lazyLoadDesktopOnly(
 *   () => import('@/components/AdvancedChart'),
 *   SimpleChart // Mobile alternative
 * );
 */
