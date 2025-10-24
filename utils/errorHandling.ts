/**
 * Comprehensive Error Handling Utilities
 * Provides robust error handling, logging, and recovery mechanisms
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network request failed") {
    super(message, "NETWORK_ERROR", 503);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
}

/**
 * Safely executes an async function with comprehensive error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    console.error("Error in safeAsync:", error);

    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Log to error tracking service if available
    if (typeof window !== "undefined" && "errorTracker" in window) {
      try {
        (window as { errorTracker?: { logError: (error: Error) => void } }).errorTracker?.logError(errorObj);
      } catch (logError) {
        console.error("Failed to log error:", logError);
      }
    }

    return {
      data: fallback ?? null,
      error: errorObj,
    };
  }
}

/**
 * Safely executes a synchronous function with error handling
 */
export function safeSync<T>(
  fn: () => T,
  fallback?: T
): { data: T | null; error: Error | null } {
  try {
    const data = fn();
    return { data, error: null };
  } catch (error) {
    console.error("Error in safeSync:", error);
    const errorObj = error instanceof Error ? error : new Error(String(error));
    return { data: fallback ?? null, error: errorObj };
  }
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error = new Error("Retry failed");

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Validates and sanitizes input data
 */
export function validateInput(
  value: unknown,
  rules: {
    required?: boolean;
    type?: "string" | "number" | "boolean" | "object" | "array";
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean;
  }
): { isValid: boolean; error?: string } {
  if (rules.required && (value === null || value === undefined || value === "")) {
    return { isValid: false, error: "This field is required" };
  }

  if (!rules.required && (value === null || value === undefined || value === "")) {
    return { isValid: true };
  }

  if (rules.type) {
    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (actualType !== rules.type) {
      return { isValid: false, error: `Expected ${rules.type}, got ${actualType}` };
    }
  }

  if (rules.type === "string" && typeof value === "string") {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return { isValid: false, error: `Minimum length is ${rules.minLength}` };
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return { isValid: false, error: `Maximum length is ${rules.maxLength}` };
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return { isValid: false, error: "Invalid format" };
    }
  }

  if (rules.type === "number" && typeof value === "number") {
    if (rules.min !== undefined && value < rules.min) {
      return { isValid: false, error: `Minimum value is ${rules.min}` };
    }
    if (rules.max !== undefined && value > rules.max) {
      return { isValid: false, error: `Maximum value is ${rules.max}` };
    }
  }

  if (rules.custom && !rules.custom(value)) {
    return { isValid: false, error: "Validation failed" };
  }

  return { isValid: true };
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Logs errors in development, sends to tracking service in production
 */
export function logError(error: Error | unknown, context?: Record<string, unknown>): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", errorObj);
    if (context) {
      console.error("Context:", context);
    }
  }

  // Send to error tracking service in production
  if (process.env.NODE_ENV === "production") {
    try {
      // Placeholder for actual error tracking service
      if (typeof window !== "undefined" && "errorTracker" in window) {
        (window as { errorTracker?: { logError: (error: Error, context?: Record<string, unknown>) => void } })
          .errorTracker?.logError(errorObj, context);
      }
    } catch (logError) {
      console.error("Failed to log error to tracking service:", logError);
    }
  }
}

/**
 * Creates a safe version of fetch with automatic retries and error handling
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3
): Promise<{ data: T | null; error: Error | null; response?: Response }> {
  try {
    const response = await retryAsync(
      () => fetch(url, options),
      maxRetries
    );

    if (!response.ok) {
      throw new NetworkError(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null, response };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logError(errorObj, { url, options });
    return { data: null, error: errorObj };
  }
}
