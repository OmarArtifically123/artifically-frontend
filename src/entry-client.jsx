import React, { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { createApolloClient } from "./lib/graphqlClient";
import { warmupWasm } from "./lib/wasmMath";
import "./styles/global.css";

// Fallback UI when an error is caught
function Fallback({ error }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Something went wrong</h1>
      <p style={{ color: "var(--gray-600)" }}>
        {error?.message || "An unexpected error occurred."}
      </p>
    </div>
  );
}

const rootElement = document.getElementById("root");

const apolloState = window.__APOLLO_STATE__ || null;
const apolloClient = createApolloClient(apolloState);

const appTree = (
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <ThemeProvider>
          <ErrorBoundary FallbackComponent={Fallback}>
            <App />
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);

startTransition(() => {
  hydrateRoot(rootElement, appTree);
});

const requestIdle =
  window.requestIdleCallback ||
  ((cb) =>
    window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));

const cancelIdle = window.cancelIdleCallback || window.clearTimeout;

const warmupHandle = requestIdle(() => warmupWasm());

if ("serviceWorker" in navigator) {
  const registerServiceWorker = () => {
    const idleId = requestIdle(async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        console.error("Service worker registration failed", error);
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