"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * Root margin for IntersectionObserver (e.g., "200px" to load 200px before visible)
   */
  rootMargin?: string;
  /**
   * Minimum height to reserve space and prevent CLS
   */
  minHeight?: string | number;
  /**
   * CSS class for the wrapper
   */
  className?: string;
  /**
   * Loading strategy: "lazy" (default), "eager", "idle"
   */
  strategy?: "lazy" | "eager" | "idle";
  /**
   * Priority level for loading (higher = loads sooner)
   */
  priority?: number;
}

/**
 * Ultra-optimized lazy loading section component that:
 * 1. Uses IntersectionObserver for viewport-based loading
 * 2. Reserves space to prevent CLS
 * 3. Supports idle callback strategy for non-critical content
 * 4. Implements priority-based loading queue
 */
export default function LazySection({
  children,
  fallback,
  rootMargin = "400px",
  minHeight,
  className = "",
  strategy = "lazy",
  priority = 0,
}: LazySectionProps) {
  const [shouldRender, setShouldRender] = useState(strategy === "eager");
  const ref = useRef<HTMLDivElement>(null);
  const hasIntersectedRef = useRef(false);

  useEffect(() => {
    // Eager loading - render immediately
    if (strategy === "eager") {
      setShouldRender(true);
      return;
    }

    // Idle loading - wait for browser idle time
    if (strategy === "idle") {
      if ("requestIdleCallback" in window) {
        const idleCallback = requestIdleCallback(
          () => {
            setShouldRender(true);
          },
          { timeout: 2000 }
        );
        return () => cancelIdleCallback(idleCallback);
      } else {
        // Fallback for browsers without requestIdleCallback
        const timeout = setTimeout(() => setShouldRender(true), 2000);
        return () => clearTimeout(timeout);
      }
    }

    // Lazy loading with IntersectionObserver
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasIntersectedRef.current) {
            hasIntersectedRef.current = true;
            
            // Use priority to delay loading for lower priority sections
            const delay = Math.max(0, 100 - priority * 10);
            
            setTimeout(() => {
              setShouldRender(true);
              // Disconnect after loading to free up resources
              observer.disconnect();
            }, delay);
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01, // Trigger when even 1% is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [strategy, rootMargin, priority]);

  const style: React.CSSProperties = minHeight
    ? {
        minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      }
    : {};

  return (
    <div ref={ref} className={className} style={style}>
      {shouldRender ? children : fallback || null}
    </div>
  );
}


