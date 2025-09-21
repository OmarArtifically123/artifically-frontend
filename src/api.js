// src/api.js - ENHANCED API ERROR HANDLING (Replaces existing)
import axios from "axios";

const base = (import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "") + "/api/v1";

export const api = axios.create({
  baseURL: base || "/api/v1",
  withCredentials: false,
  timeout: 30000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Attach JWT automatically
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
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
      requestId: crypto.randomUUID()
    });
  }
);

// ENHANCED RESPONSE INTERCEPTOR - Fixes "Request Failed" bug
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
      requestId: error.config?.headers?.['X-Request-ID'] || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      details: null,
      originalError: error
    };

    // Handle different error scenarios
    if (!error.response) {
      // Network errors, timeouts, etc.
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        enhancedError.message = "Request timeout. Please check your connection and try again.";
        enhancedError.status = 408;
        enhancedError.code = "REQUEST_TIMEOUT";
      } else if (error.code === 'ERR_NETWORK') {
        enhancedError.message = "Network error. Please check your internet connection.";
        enhancedError.status = 0;
        enhancedError.code = "NETWORK_ERROR";
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
      case 401:
        enhancedError.message = enhancedError.details?.message || "Authentication required. Please sign in again.";
        enhancedError.code = "UNAUTHORIZED";
        
        // Auto-logout on 401
        localStorage.removeItem("token");
        
        // Redirect to home if not already there
        if (window.location.pathname !== "/" && !window.location.pathname.startsWith("/verify")) {
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
        details: enhancedError.details
      });
    }

    // Return the enhanced error
    throw enhancedError;
  }
);

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

// Retry mechanism for failed requests
export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors (4xx) except for 408, 429
      if (error.status >= 400 && error.status < 500 && 
          error.status !== 408 && error.status !== 429) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      console.log(`Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${waitTime}ms`);
    }
  }
  
  throw lastError;
};

// Batch request helper
export const batch = async (requests) => {
  try {
    const results = await Promise.allSettled(requests);
    
    return results.map((result, index) => ({
      index,
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  } catch (error) {
    throw {
      message: "Batch request failed",
      status: 500,
      code: "BATCH_ERROR",
      details: error
    };
  }
};

// Health check endpoint
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Export configured axios instance as default
export default api;