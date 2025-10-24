/**
 * useBreakpoint Hook
 *
 * Provides JavaScript-based breakpoint detection for responsive components.
 * Matches the Tailwind breakpoints defined in tailwind.config.js
 *
 * @example
 * const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();
 * const { xs, sm, md, lg, xl } = useBreakpoint();
 *
 * if (isMobile) {
 *   // Render mobile-specific UI
 * }
 */

import { useEffect, useState, useMemo } from "react";

/**
 * Breakpoint definitions matching tailwind.config.js
 */
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
  "3xl": 1920,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export interface BreakpointState {
  /** Current window width in pixels */
  width: number;
  /** Current breakpoint key (xs, sm, md, lg, xl, 2xl, 3xl) */
  breakpoint: BreakpointKey;
  /** True if viewport is xs (< 640px) */
  xs: boolean;
  /** True if viewport is sm or larger (>= 640px) */
  sm: boolean;
  /** True if viewport is md or larger (>= 768px) */
  md: boolean;
  /** True if viewport is lg or larger (>= 1024px) */
  lg: boolean;
  /** True if viewport is xl or larger (>= 1280px) */
  xl: boolean;
  /** True if viewport is 2xl or larger (>= 1440px) */
  "2xl": boolean;
  /** True if viewport is 3xl or larger (>= 1920px) */
  "3xl": boolean;
  /** True if mobile (< 768px) */
  isMobile: boolean;
  /** True if tablet (>= 768px and < 1024px) */
  isTablet: boolean;
  /** True if desktop (>= 1024px) */
  isDesktop: boolean;
  /** True if large desktop (>= 1440px) */
  isLargeDesktop: boolean;
}

/**
 * Determines the current breakpoint based on window width
 */
function getCurrentBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS["3xl"]) return "3xl";
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

/**
 * Hook to detect and respond to viewport breakpoint changes
 *
 * @param options.defaultBreakpoint - Breakpoint to use during SSR (default: 'lg')
 * @param options.throttleMs - Throttle delay for resize events (default: 150ms)
 * @returns Current breakpoint state
 */
export function useBreakpoint(options?: {
  defaultBreakpoint?: BreakpointKey;
  throttleMs?: number;
}): BreakpointState {
  const { defaultBreakpoint = "lg", throttleMs = 150 } = options || {};

  // Initialize with SSR-safe defaults
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === "undefined") {
      return BREAKPOINTS[defaultBreakpoint];
    }
    return window.innerWidth;
  });

  useEffect(() => {
    // Skip if SSR
    if (typeof window === "undefined") {
      return undefined;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
        timeoutId = null;
      }, throttleMs);
    };

    // Set initial width
    setWidth(window.innerWidth);

    // Listen for resize events
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [throttleMs]);

  const breakpointState = useMemo<BreakpointState>(() => {
    const breakpoint = getCurrentBreakpoint(width);

    return {
      width,
      breakpoint,
      xs: width >= BREAKPOINTS.xs,
      sm: width >= BREAKPOINTS.sm,
      md: width >= BREAKPOINTS.md,
      lg: width >= BREAKPOINTS.lg,
      xl: width >= BREAKPOINTS.xl,
      "2xl": width >= BREAKPOINTS["2xl"],
      "3xl": width >= BREAKPOINTS["3xl"],
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isLargeDesktop: width >= BREAKPOINTS["2xl"],
    };
  }, [width]);

  return breakpointState;
}

/**
 * Hook to check if viewport matches a specific breakpoint condition
 *
 * @example
 * const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 *
 * @param query - CSS media query string
 * @returns True if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

/**
 * Hook to detect touch device capability
 *
 * @returns True if device supports touch
 */
export function useTouchDevice(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}

/**
 * Hook to detect user's motion preferences
 *
 * @returns True if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
