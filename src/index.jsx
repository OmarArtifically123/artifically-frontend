// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";  // ✅ external library
import App from "./App";
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
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={Fallback}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
