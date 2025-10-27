"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/webVitalsOptimized";

/**
 * Client-side Web Vitals reporter component
 * Initializes performance monitoring on mount
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals tracking
    initWebVitals();
  }, []);

  return null; // This component doesn't render anything
}


