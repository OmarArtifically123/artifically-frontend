import React, { StrictMode, startTransition } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { createApolloClient } from "./lib/graphqlClient";
import { warmupWasm } from "./lib/wasmMath";
import "./styles/global.css";

// Enhanced fallback UI with proper Router context
function ErrorFallback({ error, resetErrorBoundary }) {
  console.error("App Error:", error);
  
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
          background: "var(--bg-primary, #0f172a)",
          color: "var(--text-primary, #f8fafc)"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ 
            color: "var(--gray-400, #94a3b8)", 
            marginBottom: "2rem",
            maxWidth: "500px"
          }}>
            {error?.message || "An unexpected error occurred. Please try refreshing the page."}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={resetErrorBoundary}
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
              Try again
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #374151",
                background: "transparent",
                color: "var(--text-primary, #f8fafc)",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Refresh page
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

const apolloState = typeof window !== "undefined" ? window.__APOLLO_STATE__ : null;
const apolloClient = createApolloClient(apolloState);

// Clear any existing Apollo state from window to prevent memory leaks
if (typeof window !== "undefined" && window.__APOLLO_STATE__) {
  delete window.__APOLLO_STATE__;
}

const AppWrapper = () => (
  <StrictMode>
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("React Error Boundary caught an error:", error, errorInfo);
      }}
      onReset={() => {
        // Clear any cached modules that might be causing issues
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }}
    >
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ApolloProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Check if we're in a hydration context or need to create a new root
const isHydrating = rootElement.hasChildNodes();

if (isHydrating) {
  console.log("Attempting to hydrate existing content...");
  
  try {
    startTransition(() => {
      hydrateRoot(rootElement, <AppWrapper />);
    });
    console.log("Hydration successful");
  } catch (error) {
    console.error("Hydration failed, falling back to client render:", error);
    
    // Clear the root and start fresh
    rootElement.innerHTML = '';
    
    const root = createRoot(rootElement);
    startTransition(() => {
      root.render(<AppWrapper />);
    });
  }
} else {
  console.log("No existing content found, creating new root...");
  
  const root = createRoot(rootElement);
  startTransition(() => {
    root.render(<AppWrapper />);
  });
}

// Utility functions for performance
const requestIdle =
  (typeof window !== "undefined" && window.requestIdleCallback) ||
  ((cb) =>
    window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));

const cancelIdle = 
  (typeof window !== "undefined" && window.cancelIdleCallback) || 
  window.clearTimeout;

// Warmup WASM in idle time
const warmupHandle = requestIdle(() => {
  if (warmupWasm && typeof warmupWasm === 'function') {
    warmupWasm().catch?.(console.warn) || Promise.resolve();
  }
});

// Service Worker registration
if ("serviceWorker" in navigator && typeof window !== "undefined") {
  const registerServiceWorker = () => {
    const idleId = requestIdle(async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.log("Service worker registered successfully");
      } catch (error) {
        console.warn("Service worker registration failed:", error);
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

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (warmupHandle) {
    cancelIdle(warmupHandle);
  }
});