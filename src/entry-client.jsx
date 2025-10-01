import React, { StrictMode, startTransition } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { warmupWasm } from "./lib/wasmMath";
import "./styles/global.css";

// Enhanced fallback UI
function ErrorFallback({ error, resetErrorBoundary }) {
  if (import.meta.env.DEV) {
    console.error("App Error:", error);
  }
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div style={{ 
          padding: "2rem", 
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f172a",
          color: "#f8fafc"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ 
            color: "#94a3b8", 
            marginBottom: "2rem",
            maxWidth: "500px"
          }}>
            {error?.message || "An unexpected error occurred. Please try refreshing the page."}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#6366f1",
                color: "white",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Refresh Page
            </button>
            <button 
              onClick={resetErrorBoundary}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #374151",
                background: "transparent",
                color: "#f8fafc",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

let hydrationRoot = null;
let clientRoot = null;
let hasForcedClientRender = false;

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

const AppWrapper = () => (
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        if (import.meta.env.DEV) {
          console.error("React Error Boundary caught an error:", error, errorInfo);
        }
      }}
      onReset={() => {
        // Clear any problematic cached state
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("route-history");
          } catch (e) {
            if (import.meta.env.DEV) {
              console.warn("Could not clear localStorage:", e);
            }
          }
        }
      }}
    >
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

// Hybrid rendering strategy
function initializeApp() {
  const { shouldHydrate, hasExistingContent } = detectRenderingMode();

  if (shouldHydrate) {
    if (import.meta.env.DEV) {
      console.log("🔄 Attempting SSR hydration...");
    }

    try {
      hydrationRoot = hydrateRoot(rootElement, <AppWrapper />, {
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

    createClientRoot();
  }
}

function fallbackToClientRender(reason) {
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

  // Clear existing content and create fresh root
  if (rootElement.hasChildNodes()) {
    rootElement.innerHTML = '';
  }

  createClientRoot();
}

function createClientRoot() {
  if (!clientRoot) {
    clientRoot = createRoot(rootElement);
  }

  startTransition(() => {
    clientRoot.render(<AppWrapper />);
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

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (warmupHandle) {
      cancelIdle(warmupHandle);
    }
  });
}