// src/api.js - CORS and SSL Issue Fix
import axios from "axios";

// Determine the correct API base URL
const getBaseURL = () => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    // Use localhost for development (adjust port as needed)
    return import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
  } else {
    // For production, use the environment variable
    const envURL = import.meta.env.VITE_API_URL;
    if (envURL) {
      return envURL.replace(/\/$/, "") + "/api/v1";
    }
    // Fallback
    return "/api/v1";
  }
};

const baseURL = getBaseURL();
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

const SESSION_COOKIE_NAME = "__Host-artifically-session";

if (import.meta.env.DEV) {
  console.log("API Base URL:", baseURL);
}

const getCrypto = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto) {
    return globalThis.crypto;
  }

  return undefined;
};

const generateRequestId = () => {
  const cryptoObj = getCrypto();

  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  if (cryptoObj?.getRandomValues) {
    const buffer = new Uint32Array(4);
    cryptoObj.getRandomValues(buffer);
    return Array.from(buffer, (value) => value.toString(16).padStart(8, "0")).join("-");
  }

  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  xsrfCookieName: "__Host-artifically-csrf",
  xsrfHeaderName: "X-CSRF-Token",
});

const hasSessionCookie = () => {
  if (!isBrowser) {
    return false;
  }

  try {
    return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Unable to inspect session cookie", error);
    }
    return false;
  }
};

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add request ID for tracking
    config.headers["X-Request-ID"] = generateRequestId();

    if (!hasSessionCookie()) {
      config.headers["X-Session-Check"] = "missing";
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject({
      message: "Failed to prepare request",
      status: 0,
      requestId: generateRequestId()
    });
  }
);

// ENHANCED RESPONSE INTERCEPTOR - Better CORS/Network error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status}`, {
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    // Create comprehensive error object
    const enhancedError = {
      message: "Request failed",
      status: 500,
      requestId: error.config?.headers?.["X-Request-ID"] || generateRequestId(),
      timestamp: new Date().toISOString(),
      details: null,
      originalError: error
    };

    // Handle different error scenarios
    if (!error.response) {
      // Network errors, CORS, SSL issues, etc.
      if (error.code === 'ERR_SSL_PROTOCOL_ERROR' || error.message.includes('SSL')) {
        enhancedError.message = "SSL certificate error. Please contact support or try again later.";
        enhancedError.status = 0;
        enhancedError.code = "SSL_ERROR";
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        enhancedError.message = "Request timeout. Please check your connection and try again.";
        enhancedError.status = 408;
        enhancedError.code = "REQUEST_TIMEOUT";
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        // Check if it might be a CORS issue
        if (isBrowser && window.location.protocol === "https:" && baseURL.startsWith("http:")) {
          enhancedError.message = "Mixed content error: Cannot make HTTP requests from HTTPS page.";
          enhancedError.code = "MIXED_CONTENT_ERROR";
        } else if (baseURL.includes("localhost") || baseURL.includes("127.0.0.1")) {
          enhancedError.message = "Cannot connect to local server. Make sure your backend is running.";
          enhancedError.code = "LOCAL_SERVER_ERROR";
        } else {
          enhancedError.message = "Network error. This might be a CORS or connectivity issue.";
          enhancedError.code = "NETWORK_ERROR";
        }
        enhancedError.status = 0;
      } else {
        enhancedError.message = "Unable to connect to server. Please try again.";
        enhancedError.status = 0;
        enhancedError.code = "CONNECTION_ERROR";
      }
    } else {
      // Server responded with error
      const { status, data } = error.response;
      enhancedError.status = status;

      // Extract error information from response
      if (data) {
        if (typeof data === 'string') {
          enhancedError.message = data;
        } else if (data.message) {
          enhancedError.message = data.message;
        } else if (data.error) {
          enhancedError.message = typeof data.error === 'string' ? data.error : "Server error occurred";
        }

        // Preserve additional error details
        enhancedError.code = data.error || data.code || `HTTP_${status}`;
        enhancedError.requestId = data.requestId || enhancedError.requestId;
        enhancedError.details = data;
        
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          enhancedError.validationErrors = data.errors;
          enhancedError.message = data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
        }
      } else {
        // No response data
        enhancedError.message = `Server error (${status})`;
        enhancedError.code = `HTTP_${status}`;
      }
    }

    // Handle specific status codes
    switch (enhancedError.status) {
      case 0:
        // Network/CORS/SSL issues - provide helpful message
        if (!enhancedError.code) {
          enhancedError.message = "Cannot connect to server. This could be a network, CORS, or SSL certificate issue.";
          enhancedError.code = "CONNECTION_FAILED";
        }
        break;
        
      case 401:
        enhancedError.message = enhancedError.details?.message || "Authentication required. Please sign in again.";
        enhancedError.code = "UNAUTHORIZED";
        
        // Auto-logout on 401
        // Redirect to home if not already there
        if (
          isBrowser &&
          window.location.pathname !== "/" &&
          !window.location.pathname.startsWith("/verify")
        ) {
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
        break;
        
      case 403:
        enhancedError.message = enhancedError.details?.message || "Access denied. You don't have permission for this action.";
        enhancedError.code = "FORBIDDEN";
        break;
        
      case 404:
        enhancedError.message = enhancedError.details?.message || "The requested resource was not found.";
        enhancedError.code = "NOT_FOUND";
        break;
        
      case 409:
        enhancedError.message = enhancedError.details?.message || "Conflict occurred. This action cannot be completed.";
        enhancedError.code = "CONFLICT";
        break;
        
      case 422:
        enhancedError.message = enhancedError.details?.message || "Invalid input provided.";
        enhancedError.code = "VALIDATION_ERROR";
        break;
        
      case 429:
        enhancedError.message = enhancedError.details?.message || "Too many requests. Please slow down.";
        enhancedError.code = "RATE_LIMITED";
        break;
        
      case 500:
        enhancedError.message = enhancedError.details?.message || "Internal server error. Please try again.";
        enhancedError.code = "SERVER_ERROR";
        break;
        
      case 502:
        enhancedError.message = "Service temporarily unavailable. Please try again in a moment.";
        enhancedError.code = "SERVICE_UNAVAILABLE";
        break;
        
      case 503:
        enhancedError.message = "Service temporarily unavailable due to maintenance.";
        enhancedError.code = "MAINTENANCE";
        break;
        
      default:
        if (enhancedError.status >= 500) {
          enhancedError.message = enhancedError.details?.message || "Server error occurred. Please try again.";
          enhancedError.code = "SERVER_ERROR";
        } else if (enhancedError.status >= 400) {
          enhancedError.message = enhancedError.details?.message || "Invalid request. Please check your input.";
          enhancedError.code = "CLIENT_ERROR";
        }
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: enhancedError.status,
        message: enhancedError.message,
        code: enhancedError.code,
        requestId: enhancedError.requestId,
        details: enhancedError.details,
        baseURL: error.config?.baseURL
      });
    }

    // Return the enhanced error
    throw enhancedError;
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', baseURL);
    
    // Test the root endpoint first (this should work based on your server.js)
    try {
      const response = await axios.get(baseURL.replace('/api/v1', ''));
      console.log('Root endpoint successful:', response.data);
      return { success: true, data: response.data, endpoint: 'root' };
    } catch (rootError) {
      console.log('Root endpoint failed:', rootError.message);
    }
    
    // Try health endpoint
    try {
      const response = await axios.get(baseURL.replace('/api/v1', '/health'));
      console.log('Health endpoint successful:', response.data);
      return { success: true, data: response.data, endpoint: '/health' };
    } catch (healthError) {
      console.log('/health failed:', healthError.message);
    }
    
    throw new Error('No working endpoint found');
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: {
        baseURL,
        code: error.code,
        status: error.status
      }
    };
  }
};

// Enhanced helper functions
export const pick = (path) => (response) => {
  if (!response?.data) return null;
  
  if (!path) return response.data;
  
  const keys = path.split('.');
  let result = response.data;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return null;
    }
  }
  
  return result;
};

// Export configured axios instance as default
export default api;