"use client";

import { ReactNode, useEffect, useState } from "react";

interface DeferredRenderProps {
  children: ReactNode;
  /**
   * Delay in milliseconds before rendering
   */
  delay?: number;
  /**
   * Use requestIdleCallback for rendering (recommended for heavy 3D components)
   */
  useIdleCallback?: boolean;
  /**
   * Fallback to render while waiting
   */
  fallback?: ReactNode;
  /**
   * Timeout for requestIdleCallback (default: 2000ms)
   */
  timeout?: number;
}

/**
 * Defers rendering of heavy components until after initial page load
 * Uses requestIdleCallback to render during browser idle time
 * Critical for improving TBT (Total Blocking Time)
 */
export default function DeferredRender({
  children,
  delay = 0,
  useIdleCallback = true,
  fallback = null,
  timeout = 2000,
}: DeferredRenderProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // For components that should render after a delay
    if (delay > 0 && !useIdleCallback) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    // For heavy components - wait for browser idle time
    if (useIdleCallback && "requestIdleCallback" in window) {
      const idleCallback = requestIdleCallback(
        () => {
          // Additional delay to ensure initial paint is complete
          setTimeout(() => {
            setShouldRender(true);
          }, delay);
        },
        { timeout }
      );
      return () => cancelIdleCallback(idleCallback);
    }

    // Fallback for browsers without requestIdleCallback
    const fallbackDelay = Math.max(delay, 100);
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, fallbackDelay);
    return () => clearTimeout(timer);
  }, [delay, useIdleCallback, timeout]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}


