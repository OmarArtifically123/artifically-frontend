import React, { StrictMode, createElement, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { warmupWasm } from "./lib/wasmMath";
import "./styles/global.css";
import { space } from "./styles/spacing";
import {
  exposePerformanceBudgets,
  initPerformanceBudgetWatchers,
} from "./utils/performanceBudgets";
import { reportWebVitals } from "./lib/webVitals";

let analyticsTrackPromise = null;

function ensureAnalyticsLoaded() {
  if (analyticsTrackPromise) {
    return analyticsTrackPromise;
  }

  const moduleId = ["@vercel", "analytics"].join("/");

  analyticsTrackPromise = import(/* @vite-ignore */ moduleId)
    .then((module) => (typeof module.track === "function" ? module.track : null))
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("Vercel analytics unavailable", error);
      }
      return null;
    });

  return analyticsTrackPromise;
}

// Enhanced fallback UI
function ErrorFallback({ error, resetErrorBoundary }) {
  if (import.meta.env.DEV) {
    console.error("App Error:", error);
  }

  const containerStyles = {
    padding: space("lg"),
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#f8fafc",
  };

  const titleStyles = { fontSize: "2rem", marginBottom: space("sm") };
  const descriptionStyles = {
    color: "#94a3b8",
    marginBottom: space("lg"),
    maxWidth: "500px",
  };
  const actionsStyles = { display: "flex", gap: space("sm") };

  const reloadButtonStyles = {
    padding: `${space("xs", 1.5)} ${space("md")}`,
    borderRadius: "0.5rem",
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  };

  const retryButtonStyles = {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    background: "transparent",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: "600",
  };

  const description = error?.message || "An unexpected error occurred. Please try refreshing the page.";

  return createElement(
    BrowserRouter,
    null,
    createElement(
      ThemeProvider,
      null,
      createElement(
        "div",
        { style: containerStyles },
        createElement("h1", { style: titleStyles }, "Something went wrong"),
        createElement("p", { style: descriptionStyles }, description),
        createElement(
          "div",
          { style: actionsStyles },
          createElement(
            "button",
            {
              onClick: () => window.location.reload(),
              style: reloadButtonStyles,
            },
            "Refresh Page",
          ),
          createElement(
            "button",
            {
              onClick: resetErrorBoundary,
              style: retryButtonStyles,
            },
            "Try Again",
          ),
        ),
      ),
    ),
  );
}

function sendToAnalytics(metric) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta,
      navigationType: metric.navigationType,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });

    if (typeof navigator !== "undefined") {
      const didSend = navigator.sendBeacon?.("/api/analytics", body);
      if (didSend) {
        return;
      }
    }

    if (typeof fetch === "function") {
      fetch("/api/analytics", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to report web-vitals metric", error);
    }
  }
}

if (typeof window !== "undefined") {
  ensureAnalyticsLoaded().catch(() => {});

  reportWebVitals((metric) => {
    ensureAnalyticsLoaded()
      .then((trackFn) => {
        if (!trackFn) {
          return;
        }
        try {
          trackFn("web-vitals", {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
            delta: metric.delta,
            navigationType: metric.navigationType,
          });
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("Failed to send analytics metric", error);
          }
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.warn("Analytics tracking unavailable", error);
        }
      });

    sendToAnalytics(metric);

    if (import.meta.env.DEV && metric.rating === "poor") {
      console.warn(`Poor ${metric.name}:`, metric.value);
    }
  });
}

if (typeof window !== "undefined") {
  exposePerformanceBudgets();
  initPerformanceBudgetWatchers();
}

if (import.meta.env.DEV) {
  import("./utils/memoryMonitor")
    .then(({ setupMemoryMonitoring }) => {
      setupMemoryMonitoring();
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("Failed to start memory monitor", error);
      }
    });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

let hydrationRoot = null;
let clientRoot = null;
let hasForcedClientRender = false;
let createRootFactory = null;

const markReactLoaded = () => {
  const body = document.body;
  if (body && !body.classList.contains("react-loaded")) {
    body.classList.add("react-loaded");
  }

  const loading = document.querySelector(".initial-loading");
  if (loading?.parentNode) {
    loading.parentNode.removeChild(loading);
  }
};

async function resolveClientRoot() {
  if (!createRootFactory) {
    const mod = await import("react-dom/client");
    createRootFactory = mod.createRoot;
  }

  if (!clientRoot) {
    clientRoot = createRootFactory(rootElement);
  }

  return clientRoot;
}

function isHydrationError(error) {
  if (!error) {
    return false;
  }

  const message = error.message || String(error);
  return /hydration/i.test(message) || /\b418\b/.test(message) || /\b423\b/.test(message) || /\b425\b/.test(message);
}

// Detect if we have SSR content or need client-only rendering
function detectRenderingMode() {
  const hasSSRContent = rootElement.hasChildNodes() && 
                       !rootElement.querySelector('.initial-loading');
  const hasSSRFallback = document.querySelector('meta[name="x-ssr-fallback"]') || 
                        typeof window !== 'undefined' && window.__SSR_DISABLED__;
  
  return {
    shouldHydrate: hasSSRContent && !hasSSRFallback,
    hasExistingContent: rootElement.hasChildNodes()
  };
}

const AppWrapper = () =>
  createElement(
    StrictMode,
    null,
    createElement(
      ErrorBoundary,
      {
        FallbackComponent: ErrorFallback,
        onError: (error, errorInfo) => {
          if (import.meta.env.DEV) {
            console.error("React Error Boundary caught an error:", error, errorInfo);
          }
        },
        onReset: () => {
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("route-history");
            } catch (e) {
              if (import.meta.env.DEV) {
                console.warn("Could not clear localStorage:", e);
              }
            }
          }
        },
      },
      createElement(
        BrowserRouter,
        {
          future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          },
        },
        createElement(ThemeProvider, null, createElement(App, null)),
      ),
    ),
  );

// Hybrid rendering strategy
function initializeApp() {
  const { shouldHydrate, hasExistingContent } = detectRenderingMode();

  if (shouldHydrate) {
    if (import.meta.env.DEV) {
      console.log("🔄 Attempting SSR hydration...");
    }

    try {
      hydrationRoot = hydrateRoot(rootElement, createElement(AppWrapper), {
        onRecoverableError(error, errorInfo) {
          if (import.meta.env.DEV) {
            console.warn("⚠️ Recoverable hydration error detected:", error, errorInfo);
          }

          if (isHydrationError(error)) {
            fallbackToClientRender(error);
          }
        }
      });
      markReactLoaded();
      if (import.meta.env.DEV) {
        console.log("✅ SSR hydration initiated");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("⚠️ SSR hydration failed, falling back to client render:", error);
      }
      fallbackToClientRender(error);
    }
  } else {
    if (import.meta.env.DEV) {
      console.log("🚀 Using client-only rendering...");
    }

    if (typeof window !== "undefined") {
      window.__SSR_SUCCESS__ = false;
    }

    if (hasExistingContent) {
      // Clear any existing content before client render
      rootElement.innerHTML = '';
    }

    createClientRoot().catch((error) => {
      if (import.meta.env.DEV) {
        console.error("❌ Client rendering failed:", error);
      }
    });
  }
}

async function fallbackToClientRender(reason) {
  if (hasForcedClientRender) {
    return;
  }

  hasForcedClientRender = true;

  if (typeof window !== "undefined") {
    window.__SSR_SUCCESS__ = false;
  }

  if (hydrationRoot) {
    try {
      hydrationRoot.unmount();
    } catch (unmountError) {
      if (import.meta.env.DEV) {
        console.warn("⚠️ Failed to unmount hydration root:", unmountError);
      }
    }

    hydrationRoot = null;
  }

  if (reason && import.meta.env.DEV) {
    console.warn("🔄 Falling back to client render due to hydration issue:", reason);
  }

  if (rootElement.hasChildNodes()) {
    rootElement.innerHTML = "";
  }

  try {
    await createClientRoot();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ Client rendering failed after hydration fallback:", error);
    }
  }
}

async function createClientRoot() {
  const root = await resolveClientRoot();

  startTransition(() => {
    root.render(createElement(AppWrapper));
  });

  markReactLoaded();

  if (import.meta.env.DEV) {
    console.log("✅ Client-only rendering successful");
  }
}

// Enhanced error handling for hydration issues
if (typeof window !== 'undefined') {
  // Catch hydration errors specifically
  window.addEventListener('error', (e) => {
    if (isHydrationError(e.error)) {
      if (import.meta.env.DEV) {
        console.warn('🔄 Hydration error detected, attempting recovery...');
      }
      e.preventDefault();
      fallbackToClientRender(e.error);
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (isHydrationError(e.reason)) {
      if (import.meta.env.DEV) {
        console.warn('🔄 Hydration promise rejection:', e.reason);
      }
      e.preventDefault();
      fallbackToClientRender(e.reason);
    }
  });
}

// Initialize the app
initializeApp();

// Utility functions for performance
const requestIdle =
  (typeof window !== "undefined" && window.requestIdleCallback) ||
  ((cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));

const cancelIdle = 
  (typeof window !== "undefined" && window.cancelIdleCallback) || 
  clearTimeout;

// Warmup WASM with better error handling
let warmupHandle;
if (typeof warmupWasm === 'function') {
  warmupHandle = requestIdle(() => {
    try {
      const result = warmupWasm();
      if (result && typeof result.then === 'function') {
        result
          .then(() => {
            if (import.meta.env.DEV) {
              console.log("⚡ WASM warmed up successfully");
            }
          })
          .catch((error) => {
            if (import.meta.env.DEV) {
              console.warn("⚠️ WASM warmup failed:", error);
            }
          });
      } else {
        if (import.meta.env.DEV) {
          console.log("⚡ WASM warmed up successfully (sync)");
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("⚠️ WASM warmup failed:", error);
      }
    }
  });
}

// Service Worker registration
if (typeof window !== "undefined" && "serviceWorker" in navigator && import.meta.env.PROD) {
  const registerServiceWorker = () => {
    const idleId = requestIdle(async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        if (import.meta.env.DEV) {
          console.log("📦 Service worker registered successfully");
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Service worker registration failed:", error);
        }
      }
    });

    return () => cancelIdle(idleId);
  };

  if (document.readyState === "complete") {
    registerServiceWorker();
  } else {
    window.addEventListener("load", registerServiceWorker, { once: true });
  }
}

// Debug information
if (typeof window !== "undefined" && import.meta.env.DEV) {
  const debugInfo = {
    renderMode: detectRenderingMode().shouldHydrate ? 'SSR' : 'Client-only',
    hasSSRContent: rootElement.hasChildNodes(),
    userAgent: navigator.userAgent,
    location: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  console.log("🔧 Debug Info:", debugInfo);
}

// Force repaint on viewport changes to fix backdrop-filter blur issues
if (typeof window !== "undefined") {
  let resizeTimeout;
  
  const forceRepaint = () => {
    // Force a repaint by temporarily modifying a CSS property
    document.body.style.transform = 'translateZ(0)';
    requestAnimationFrame(() => {
      document.body.style.transform = '';
    });
  };

  // Handle window resize (includes zoom)
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(forceRepaint, 100);
  });

  // Handle DevTools open/close
  let devToolsOpen = false;
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    const wasOpen = devToolsOpen;
    devToolsOpen = widthThreshold || heightThreshold;
    
    if (wasOpen !== devToolsOpen) {
      setTimeout(forceRepaint, 50);
    }
  };

  window.addEventListener('resize', checkDevTools);
  setInterval(checkDevTools, 500);

  // Initial check
  setTimeout(forceRepaint, 100);
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (warmupHandle) {
      cancelIdle(warmupHandle);
    }
  });
}