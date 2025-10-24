"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Log to error reporting service if available
    if (
      typeof window !== "undefined" &&
      "errorReporter" in window &&
      typeof (window as { errorReporter?: { captureException: (error: Error, info: unknown) => void } }).errorReporter?.captureException === "function"
    ) {
      (window as { errorReporter: { captureException: (error: Error, info: unknown) => void } }).errorReporter.captureException(error, {
        errorInfo,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "2rem",
            margin: "2rem auto",
            maxWidth: "600px",
            textAlign: "center",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "var(--gray-300)", marginBottom: "1.5rem" }}>
            We apologize for the inconvenience. The error has been logged and
            we'll look into it.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details style={{ marginTop: "1.5rem", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", color: "var(--gray-400)" }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "8px",
                  overflow: "auto",
                  fontSize: "0.875rem",
                  color: "#ef4444",
                }}
              >
                {this.state.error.toString()}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
