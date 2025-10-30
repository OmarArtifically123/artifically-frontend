// Centralized API client with error handling and retry logic
"use client";

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string | Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  referenceNumber?: string;
  leadScore?: number;
  routing?: {
    priority: string;
    responseTime: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000; // 30 seconds
  private defaultRetries: number = 3;
  private defaultRetryDelay: number = 1000; // 1 second

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  async request<T = unknown>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (headers['Content-Type']?.includes('application/json') && body) {
      requestInit.body = JSON.stringify(body);
    } else if (body && typeof body === 'string') {
      requestInit.body = body;
    }

    let lastError: Error = new Error('Request failed');

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestInit,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseData = await response.json();

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: string; message?: string; errors?: unknown[] };
          throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return {
          success: true,
          ...responseData
        };

      } catch (error: unknown) {
        const apiError = error instanceof Error ? error : new Error(String(error));
        lastError = apiError;
        
        // Don't retry for certain types of errors
        if (
          apiError.name === 'AbortError' || 
          apiError.message?.includes('400') || 
          apiError.message?.includes('401') ||
          apiError.message?.includes('403') ||
          apiError.message?.includes('404') ||
          attempt === retries
        ) {
          break;
        }

        // Wait before retrying
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    // Return error response
    return {
      success: false,
      error: lastError.message || 'Request failed'
    };
  }

  // Contact form submission
  async submitContactForm(path: string, formData: Record<string, string>) {
    return this.request(`/contact/${path}`, {
      method: 'POST',
      body: formData
    });
  }

  // Chat operations
  async startChatSession(userData: {
    name?: string;
    email?: string;
    company?: string;
    initialMessage?: string;
  }) {
    return this.request('/chat/start', {
      method: 'POST',
      body: userData
    });
  }

  async sendChatMessage(sessionId: string, content: string) {
    return this.request('/chat/message', {
      method: 'POST',
      body: { sessionId, content }
    });
  }

  async endChatSession(sessionId: string, rating?: number, feedback?: string) {
    return this.request('/chat/end', {
      method: 'POST',
      body: { sessionId, rating, feedback }
    });
  }

  async getChatSession(sessionId: string) {
    return this.request(`/chat/session/${sessionId}`);
  }

  // Calendar operations
  async bookMeeting(bookingData: {
    date: string;
    time: string;
    timezone?: string;
    duration: number;
    type: string;
    attendee: {
      name: string;
      email: string;
      company: string;
      phone?: string;
    };
    notes?: string;
  }) {
    return this.request('/calendar/book', {
      method: 'POST',
      body: bookingData
    });
  }

  async getAvailability(date: string, timezone?: string, duration?: number) {
    const params = new URLSearchParams({
      date,
      ...(timezone && { timezone }),
      ...(duration && { duration: duration.toString() })
    });

    return this.request(`/calendar/availability?${params.toString()}`);
  }

  async rescheduleBooking(
    bookingId: string, 
    action: 'cancel' | 'reschedule',
    newDate?: string,
    newTime?: string
  ) {
    return this.request(`/calendar/reschedule/${bookingId}`, {
      method: 'POST',
      body: { action, newDate, newTime }
    });
  }

  // Analytics tracking
  async trackEvent(eventData: {
    event: string;
    event_category: string;
    event_label?: string;
    value?: number;
    custom_parameters?: Record<string, string | number | boolean>;
  }) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: {
        ...eventData,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      },
      retries: 1, // Don't retry analytics calls as much
      timeout: 10000 // Shorter timeout for analytics
    });
  }

  // Health checks
  async checkHealth() {
    const endpoints = ['/contact/health', '/chat/health', '/calendar/health'];
    
    const results = await Promise.allSettled(
      endpoints.map(endpoint => this.request(endpoint, { timeout: 5000, retries: 0 }))
    );

    return {
      success: results.every(result => result.status === 'fulfilled' && result.value.success),
      services: {
        contact: results[0].status === 'fulfilled' && results[0].value.success,
        chat: results[1].status === 'fulfilled' && results[1].value.success,
        calendar: results[2].status === 'fulfilled' && results[2].value.success
      }
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isNetworkError(error: unknown): boolean {
  const e = error as { message?: string; name?: string };
  return Boolean(
    e?.message?.includes('fetch') ||
    e?.message?.includes('Network') ||
    e?.message?.includes('ERR_NETWORK') ||
    e?.name === 'AbortError'
  );
}

export function isServerError(error: unknown): boolean {
  const e = error as { message?: string };
  return Boolean(
    e?.message?.includes('500') ||
    e?.message?.includes('502') ||
    e?.message?.includes('503') ||
    e?.message?.includes('504')
  );
}

export function isClientError(error: unknown): boolean {
  const e = error as { message?: string };
  return Boolean(
    e?.message?.includes('400') ||
    e?.message?.includes('401') ||
    e?.message?.includes('403') ||
    e?.message?.includes('404') ||
    e?.message?.includes('422')
  );
}

// React hooks for API calls
import { useState, useCallback } from 'react';

export function useApiCall<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error || 'Request failed');
      }
      
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

// Specialized hooks for contact operations
export function useContactSubmission() {
  const { execute, loading, error } = useApiCall();

  const submitForm = useCallback(async (path: string, formData: Record<string, string>) => {
    return execute(() => apiClient.submitContactForm(path, formData));
  }, [execute]);

  return {
    submitForm,
    loading,
    error
  };
}

interface ChatSession {
  id: string;
  name: string;
  status: string;
  messages: unknown[];
}

export function useChatSession() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const { execute, loading, error } = useApiCall();

  const startSession = useCallback(async (userData: Record<string, string>) => {
    const response = await execute(() => apiClient.startChatSession(userData));
    if (response.success) {
      const sessionData = response.data as ChatSession;
      setSession(sessionData);
    }
    return response;
  }, [execute]);

  const sendMessage = useCallback(async (content: string) => {
    if (!session?.id) throw new Error('No active session');
    return execute(() => apiClient.sendChatMessage(session.id, content));
  }, [execute, session]);

  const endSession = useCallback(async (rating?: number, feedback?: string) => {
    if (!session?.id) throw new Error('No active session');
    const response = await execute(() => apiClient.endChatSession(session.id, rating, feedback));
    if (response.success) {
      setSession(null);
    }
    return response;
  }, [execute, session]);

  return {
    session,
    startSession,
    sendMessage,
    endSession,
    loading,
    error
  };
}

export function useCalendarBooking() {
  const { execute, loading, error } = useApiCall();

  const bookMeeting = useCallback(async (bookingData: {
    date: string;
    time: string;
    timezone?: string;
    duration: number;
    type: string;
    attendee: {
      name: string;
      email: string;
      company: string;
      phone?: string;
    };
    notes?: string;
  }) => {
    return execute(() => apiClient.bookMeeting(bookingData));
  }, [execute]);

  const getAvailability = useCallback(async (date: string, timezone?: string, duration?: number) => {
    return execute(() => apiClient.getAvailability(date, timezone, duration));
  }, [execute]);

  return {
    bookMeeting,
    getAvailability,
    loading,
    error
  };
}
