"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Building2, MessageCircle } from "lucide-react";

// Icon fallbacks
const RefreshCw = RefreshCcw;
const Home = Building2;
import Button from "./Button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Track error in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleContactSupport = () => {
    // Open live chat or contact form
    window.location.href = '/contact';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              We encountered an unexpected error. Don't worry - this has been reported 
              and our team will look into it. You can try refreshing the page or 
              contact our support team.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-black/20 rounded-lg p-4">
                <summary className="text-red-400 font-medium cursor-pointer mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                className="w-full"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={this.handleGoHome}
                  variant="secondary"
                  className="flex-1"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
                
                <Button
                  onClick={this.handleContactSupport}
                  variant="secondary"
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper with hooks for easier usage
export function ContactErrorBoundary({ children }: { children: ReactNode }) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Track contact page specific errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_page_error', {
        event_category: 'Contact',
        event_label: 'error_boundary',
        custom_parameters: {
          error_message: error.message,
          error_stack: error.stack?.substring(0, 500), // Truncate for analytics
        }
      });
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

// Network Error Component
export function NetworkErrorFallback({ 
  onRetry, 
  message = "Network connection failed" 
}: { 
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
        Connection Problem
      </h3>
      
      <p className="text-red-700 dark:text-red-300 mb-4">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

// Loading Error Component
export function LoadingErrorFallback({ 
  onRetry,
  error
}: { 
  onRetry?: () => void;
  error?: string;
}) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
        Failed to Load
      </h3>
      
      <p className="text-yellow-700 dark:text-yellow-300 mb-4">
        {error || "Something went wrong while loading this content."}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reload
        </Button>
      )}
    </div>
  );
}
