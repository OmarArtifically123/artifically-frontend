export function getSSRDiagnostics() {
  if (typeof window === "undefined") {
    return null;
  }

  const root = document.getElementById("root");

  return {
    ssrSuccess: Boolean(window.__SSR_SUCCESS__),
    ssrDebug: window.__SSR_DEBUG__ || null,
    theme: window.__SSR_THEME__ || null,
    contrast: window.__SSR_CONTRAST__ || null,
    ssrFallback: Boolean(document.querySelector('meta[name="x-ssr-fallback"]')),
    hasPrerenderedContent: Boolean(root?.hasChildNodes?.()),
    hasReactRoot: Boolean(document.querySelector("[data-reactroot]")),
    hasInitialLoading: Boolean(document.querySelector(".initial-loading")),
    navigationTiming: getNavigationTiming(),
  };
}

function getNavigationTiming() {
  if (typeof performance === "undefined") {
    return null;
  }

  try {
    const [entry] = performance.getEntriesByType("navigation");
    if (!entry) return null;

    return {
      start: entry.startTime || 0,
      domContentLoaded: entry.domContentLoadedEventEnd || 0,
      loadEnd: entry.loadEventEnd || 0,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize,
    };
  } catch (error) {
    return null;
  }
}

export function logSSRStatus() {
  const diagnostics = getSSRDiagnostics();
  if (!diagnostics) {
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    console.group("🔍 SSR Diagnostics");
    console.log("SSR Success:", diagnostics.ssrSuccess);
    console.log("SSR Debug Payload:", diagnostics.ssrDebug);
    console.log("Resolved Theme:", diagnostics.theme);
    console.log("Resolved Contrast:", diagnostics.contrast);
    console.log("Has Prerendered Content:", diagnostics.hasPrerenderedContent);
    console.log("Has Initial Loading Skeleton:", diagnostics.hasInitialLoading);
    if (diagnostics.ssrFallback) {
      console.warn("SSR fallback meta tag detected.");
    }
    console.groupEnd();
  }

  return diagnostics;
}