"use client";

import { useEffect, useRef } from "react";

/**
 * useA11yAnnounce - Hook for screen reader announcements
 * Announces dynamic content changes to screen readers
 */
export function useA11yAnnounce() {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (typeof window === "undefined") return;

    let liveRegion = document.getElementById("a11y-announcer") as HTMLDivElement | null;
    
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "a11y-announcer";
      liveRegion.setAttribute("role", "status");
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.style.position = "absolute";
      liveRegion.style.left = "-10000px";
      liveRegion.style.width = "1px";
      liveRegion.style.height = "1px";
      liveRegion.style.overflow = "hidden";
      document.body.appendChild(liveRegion);
    }

    liveRegionRef.current = liveRegion;

    return () => {
      if (liveRegion && liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    };
  }, []);

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (!liveRegionRef.current) return;

    liveRegionRef.current.setAttribute("aria-live", priority);
    liveRegionRef.current.textContent = "";
    
    // Use setTimeout to ensure the screen reader picks up the change
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 100);
  };

  return { announce };
}

export default useA11yAnnounce;


