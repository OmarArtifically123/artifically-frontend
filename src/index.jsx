// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";  // ✅ external library
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import apolloClient from "./lib/graphqlClient";
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <ThemeProvider>
          <ErrorBoundary FallbackComponent={Fallback}>
            <App />
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

const requestIdle =
  window.requestIdleCallback ||
  ((cb) =>
    window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1));

const cancelIdle = window.cancelIdleCallback || window.clearTimeout;

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