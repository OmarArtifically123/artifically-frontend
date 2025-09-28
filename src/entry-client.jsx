import React, { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { createApolloClient } from "./lib/graphqlClient";
import { warmupWasm } from "./lib/wasmMath";
import "./styles/global.css";

// Enhanced fallback UI
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

// Create Apollo client (no SSR state in dev mode)
const apolloClient = createApolloClient();

// Clear any existing SSR state
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
        // Clear any problematic cached state
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("route-history");
          } catch (e) {
            console.warn("Could not clear localStorage:", e);
          }
        }
      }}
    >
      <ApolloProvider client={apolloClient}>
        <BrowserRouter future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ApolloProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Client-only rendering (no hydration)
console.log("🚀 Initializing client-only React app...");

const root = createRoot(rootElement);

startTransition(() => {
  root.render(<AppWrapper />);
});

console.log("✅ React app mounted successfully");

// Utility functions for performance
const requestIdle =
  (typeof window !== "undefined" && window.requestIdleCallback) ||
  ((cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));

const cancelIdle = 
  (typeof window !== "undefined" && window.cancelIdleCallback) || 
  clearTimeout;

// Warmup WASM in idle time with safe error handling
let warmupHandle;
if (typeof warmupWasm === 'function') {
  warmupHandle = requestIdle(() => {
    try {
      const result = warmupWasm();
      if (result && typeof result.then === 'function') {
        result
          .then(() => console.log("WASM warmed up successfully"))
          .catch((error) => console.warn("WASM warmup failed:", error));
      } else {
        console.log("WASM warmed up successfully (sync)");
      }
    } catch (error) {
      console.warn("WASM warmup failed:", error);
    }
  });
}

// Service Worker registration
if ("serviceWorker" in navigator) {
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

// Debug info
if (typeof window !== "undefined") {
  console.log("🔧 Debug Info:", {
    hasSSR: !!document.querySelector('[data-reactroot]'),
    userAgent: navigator.userAgent,
    location: window.location.href,
    timestamp: new Date().toISOString()
  });
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (warmupHandle) {
    cancelIdle(warmupHandle);
  }
});