import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

function ErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Something went wrong</h1>
        <p style={{ color: "var(--gray-600)" }}>
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <React.ErrorBoundary
      fallbackRender={({ error }) => {
        setError(error);
        return null;
      }}
    >
      {children}
    </React.ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
