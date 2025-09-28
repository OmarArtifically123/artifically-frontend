// src/utils/hydrationHelpers.js
export function suppressHydrationWarning(component) {
  if (typeof window === 'undefined') {
    return component;
  }
  
  // Add suppressHydrationWarning to components that have client-server differences
  return {
    ...component,
    props: {
      ...component.props,
      suppressHydrationWarning: true
    }
  };
}

// Check if we're in a hydration context
export function isHydrating() {
  return typeof window !== 'undefined' && window.__HYDRATING__;
}

// Safe client-only rendering wrapper
export function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return fallback;
  }
  
  return children;
}

// Updated entry-client.jsx with better error handling
import React, { StrictMode, startTransition, useState, useEffect } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { createApolloClient } from "./lib/graphqlClient";
import { warmupWasm } from "./lib/wasmMath";
import "./styles/global.css";

// Mark that we're hydrating
if (typeof window !== 'undefined') {
  window.__HYDRATING__ = true;
}

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
            The page encountered a hydration error. This usually resolves by refreshing the page.
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
                color: "var(--text-primary, #f8fafc)",
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

const apolloState = typeof window !== "undefined" ? window.__APOLLO_STATE__ : null;
const apolloClient = createApolloClient(apolloState);

// Clear any existing Apollo state from window to prevent memory leaks
if (typeof window !== "undefined" && window.__APOLLO_STATE__) {
  delete window.__APOLLO_STATE__;
}

// Enhanced App wrapper with hydration detection
function AppWrapper() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
    // Clear hydration flag after first mount
    if (typeof window !== 'undefined') {
      window.__HYDRATING__ = false;
    }
  }, []);
  
  return (
    <StrictMode>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error("React Error Boundary caught an error:", error, errorInfo);
        }}
        onReset={() => {
          // Clear any problematic cached state
          if (typeof window !== "undefined") {
            // Clear localStorage items that might cause issues
            try {
              localStorage.removeItem("route-history");
            } catch (e) {
              console.warn("Could not clear localStorage:", e);
            }
            
            // Force reload as last resort
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }}
      >
        <ApolloProvider client={apolloClient}>
          <BrowserRouter future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
          }}>
            <ThemeProvider>
              <div suppressHydrationWarning={!isHydrated}>
                <App />
              </div>
            </ThemeProvider>
          </BrowserRouter>
        </ApolloProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

// Robust hydration strategy
function performHydration() {
  const hasExistingContent = rootElement.hasChildNodes();
  
  if (hasExistingContent) {
    console.log("Attempting to hydrate existing content...");
    
    try {
      startTransition(() => {
        hydrateRoot(rootElement, <AppWrapper />);
      });
      console.log("Hydration successful");
    } catch (error) {
      console.error("Hydration failed, falling back to client render:", error);
      fallbackToClientRender();
    }
  } else {
    console.log("No existing content found, creating new root...");
    createNewRoot();
  }
}

function fallbackToClientRender() {
  // Clear the root and start fresh
  rootElement.innerHTML = '';
  createNewRoot();
}

function createNewRoot() {
  const root = createRoot(rootElement);
  startTransition(() => {
    root.render(<AppWrapper />);
  });
}

// Add error listeners for additional debugging
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.error?.message?.includes('Hydration')) {
      console.warn('Hydration error detected:', e.error);
    }
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message?.includes('Hydration')) {
      console.warn('Hydration promise rejection:', e.reason);
    }
  });
}

// Perform hydration
performHydration();

// Utility functions for performance
const requestIdle =
  (typeof window !== "undefined" && window.requestIdleCallback) ||
  ((cb) =>
    window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));

const cancelIdle = 
  (typeof window !== "undefined" && window.cancelIdleCallback) || 
  window.clearTimeout;

// Warmup WASM in idle time with better error handling
const warmupHandle = requestIdle(() => {
  if (warmupWasm && typeof warmupWasm === 'function') {
    warmupWasm().catch?.(console.warn) || Promise.resolve();
  }
});

// Service Worker registration with error handling
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