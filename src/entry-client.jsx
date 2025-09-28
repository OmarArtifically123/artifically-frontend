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

// Create Apollo client with proper state handling
const apolloState = typeof window !== "undefined" ? window.__APOLLO_STATE__ : null;
const apolloClient = createApolloClient(apolloState);

// Clear Apollo state from window
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

// Hybrid rendering strategy
function initializeApp() {
  const { shouldHydrate, hasExistingContent } = detectRenderingMode();
  
  if (shouldHydrate) {
    console.log("🔄 Attempting SSR hydration...");
    
    try {
      startTransition(() => {
        hydrateRoot(rootElement, <AppWrapper />);
      });
      console.log("✅ SSR hydration successful");
    } catch (error) {
      console.warn("⚠️ SSR hydration failed, falling back to client render:", error);
      fallbackToClientRender();
    }
  } else {
    console.log("🚀 Using client-only rendering...");
    
    if (hasExistingContent) {
      // Clear any existing content before client render
      rootElement.innerHTML = '';
    }
    
    createClientRoot();
  }
}

function fallbackToClientRender() {
  // Clear existing content and create fresh root
  rootElement.innerHTML = '';
  createClientRoot();
}

function createClientRoot() {
  const root = createRoot(rootElement);
  startTransition(() => {
    root.render(<AppWrapper />);
  });
  console.log("✅ Client-only rendering successful");
}

// Enhanced error handling for hydration issues
if (typeof window !== 'undefined') {
  // Catch hydration errors specifically
  window.addEventListener('error', (e) => {
    if (e.error?.message?.includes('Hydration') || 
        e.error?.message?.includes('hydrateRoot')) {
      console.warn('🔄 Hydration error detected, attempting recovery...');
      e.preventDefault();
      
      // Give React a chance to recover, then fallback if needed
      setTimeout(() => {
        if (document.querySelector('.react-error') || 
            !document.querySelector('[data-reactroot]')) {
          console.warn('🔄 React recovery failed, forcing client render...');
          fallbackToClientRender();
        }
      }, 1000);
    }
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message?.includes('Hydration')) {
      console.warn('🔄 Hydration promise rejection:', e.reason);
      e.preventDefault();
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
          .then(() => console.log("⚡ WASM warmed up successfully"))
          .catch((error) => console.warn("⚠️ WASM warmup failed:", error));
      } else {
        console.log("⚡ WASM warmed up successfully (sync)");
      }
    } catch (error) {
      console.warn("⚠️ WASM warmup failed:", error);
    }
  });
}

// Service Worker registration
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  const registerServiceWorker = () => {
    const idleId = requestIdle(async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.log("📦 Service worker registered successfully");
      } catch (error) {
        console.warn("⚠️ Service worker registration failed:", error);
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
if (typeof window !== "undefined") {
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