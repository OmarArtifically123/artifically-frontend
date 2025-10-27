/**
 * Prefetching utilities for performance optimization
 * Predictive prefetching based on user behavior
 */

/**
 * Prefetch a URL
 */
export function prefetchURL(url: string, priority: "high" | "low" = "low") {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  link.as = "document";

  if (priority === "high") {
    link.setAttribute("importance", "high");
  }

  document.head.appendChild(link);
}

/**
 * Preconnect to an origin
 */
export function preconnect(origin: string, crossorigin: boolean = false) {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = origin;

  if (crossorigin) {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
}

/**
 * DNS prefetch for faster DNS lookups
 */
export function dnsPrefetch(origin: string) {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = origin;
  document.head.appendChild(link);
}

/**
 * Prefetch automation detail on hover
 */
export function prefetchAutomationOnHover(automationId: number | string) {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(() => {
      prefetchURL(`/marketplace/${automationId}`, "low");
    });
  } else {
    setTimeout(() => {
      prefetchURL(`/marketplace/${automationId}`, "low");
    }, 100);
  }
}

/**
 * Predictive prefetch based on viewport intersection
 */
export function setupPredictivePrefetch() {
  if (typeof window === "undefined") return;
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute("href");
          if (href && href.startsWith("/marketplace/")) {
            prefetchURL(href, "low");
          }
        }
      });
    },
    {
      rootMargin: "200px",
    }
  );

  // Observe all marketplace links
  document.querySelectorAll('a[href^="/marketplace/"]').forEach((link) => {
    observer.observe(link);
  });

  return () => observer.disconnect();
}

const prefetchUtils = { 
  prefetchURL, 
  preconnect, 
  dnsPrefetch, 
  prefetchAutomationOnHover, 
  setupPredictivePrefetch 
};

export default prefetchUtils;

