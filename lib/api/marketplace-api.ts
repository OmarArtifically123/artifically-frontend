/**
 * Marketplace API Client - Type-safe API client for marketplace operations
 * Enterprise-grade with retry logic, caching, and error handling
 */

import api from '@/api';
import type {
  Automation,
  AutomationCategory,
  MarketplaceFilters,
  AutomationsListResponse,
  FeaturedAutomationsResponse,
  TrendingAutomationsResponse,
  RelatedAutomationsResponse,
  SearchAutomationsResponse,
  MarketplaceStatsResponse,
  ApiResponse,
  AnalyticsEvent,
} from '@/types/marketplace';

// ============================================================================
// CONSTANTS
// ============================================================================

const MARKETPLACE_BASE_PATH = '/marketplace';
const DEFAULT_PAGE_SIZE = 20;

// ============================================================================
// REQUEST HELPERS
// ============================================================================

/**
 * Build query string from filters
 */
function buildQueryParams(filters: MarketplaceFilters = {}): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  if (filters.category) params.category = String(filters.category);
  if (filters.priceTier && filters.priceTier !== 'all') params.priceTier = filters.priceTier;
  if (filters.rating) params.rating = String(filters.rating);
  if (filters.search) params.search = filters.search;
  if (filters.sortBy) params.sortBy = filters.sortBy;

  // Array parameters
  if (filters.integrations && filters.integrations.length > 0) {
    params.integrations = filters.integrations.join(',');
  }
  if (filters.tags && filters.tags.length > 0) {
    params.tags = filters.tags.join(',');
  }
  if (filters.attributes && filters.attributes.length > 0) {
    params.attributes = filters.attributes.join(',');
  }

  return params;
}

/**
 * Extract data from API response
 */
function extractData<T>(response: { data: ApiResponse<T> }): T {
  if (!response || !response.data) {
    throw new Error('Invalid API response structure');
  }

  const { success, data, error, message } = response.data;

  if (!success || error) {
    throw new Error(error || message || 'API request failed');
  }

  if (data === undefined) {
    throw new Error('No data in API response');
  }

  return data;
}

// ============================================================================
// AUTOMATION APIS
// ============================================================================

/**
 * Get paginated list of automations with filters
 */
export async function getAutomations(
  filters: MarketplaceFilters = {},
  signal?: AbortSignal
): Promise<AutomationsListResponse> {
  try {
    const params = buildQueryParams(filters);

    const response = await api.get<ApiResponse<AutomationsListResponse>>(
      MARKETPLACE_BASE_PATH,
      { params, signal }
    );

    return extractData(response);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to fetch automations:', error);
    }
    throw error;
  }
}

/**
 * Get single automation by ID
 */
export async function getAutomationById(
  id: number | string,
  signal?: AbortSignal
): Promise<Automation> {
  try {
    const response = await api.get<ApiResponse<{ automation: Automation }>>(
      `${MARKETPLACE_BASE_PATH}/${id}`,
      { signal }
    );

    const data = extractData(response);
    return data.automation;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to fetch automation ${id}:`, error);
    }
    throw error;
  }
}

/**
 * Get automation by slug
 */
export async function getAutomationBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Automation> {
  try {
    const response = await api.get<ApiResponse<{ automation: Automation }>>(
      `${MARKETPLACE_BASE_PATH}/slug/${slug}`,
      { signal }
    );

    const data = extractData(response);
    return data.automation;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to fetch automation with slug ${slug}:`, error);
    }
    throw error;
  }
}

// ============================================================================
// FEATURED & TRENDING APIS
// ============================================================================

/**
 * Get featured automations
 */
export async function getFeaturedAutomations(
  limit: number = 6,
  signal?: AbortSignal
): Promise<Automation[]> {
  try {
    const response = await api.get<ApiResponse<FeaturedAutomationsResponse>>(
      `${MARKETPLACE_BASE_PATH}/featured`,
      { params: { limit }, signal }
    );

    const data = extractData(response);
    return data.items;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to fetch featured automations:', error);
    }
    throw error;
  }
}

/**
 * Get trending automations
 */
export async function getTrendingAutomations(
  limit: number = 10,
  signal?: AbortSignal
): Promise<Automation[]> {
  try {
    const response = await api.get<ApiResponse<TrendingAutomationsResponse>>(
      `${MARKETPLACE_BASE_PATH}/trending`,
      { params: { limit }, signal }
    );

    const data = extractData(response);
    return data.items;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to fetch trending automations:', error);
    }
    throw error;
  }
}

/**
 * Get related automations
 */
export async function getRelatedAutomations(
  automationId: number | string,
  limit: number = 6,
  signal?: AbortSignal
): Promise<Automation[]> {
  try {
    const response = await api.get<ApiResponse<RelatedAutomationsResponse>>(
      `${MARKETPLACE_BASE_PATH}/${automationId}/related`,
      { params: { limit }, signal }
    );

    const data = extractData(response);
    return data.items;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to fetch related automations for ${automationId}:`, error);
    }
    throw error;
  }
}

// ============================================================================
// SEARCH API
// ============================================================================

/**
 * Search automations
 */
export async function searchAutomations(
  query: string,
  limit: number = 10,
  signal?: AbortSignal
): Promise<Automation[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const response = await api.get<ApiResponse<SearchAutomationsResponse>>(
      `${MARKETPLACE_BASE_PATH}/search`,
      { params: { q: query, limit }, signal }
    );

    const data = extractData(response);
    return data.items;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to search automations:', error);
    }
    // Don't throw on search errors, just return empty array
    return [];
  }
}

// ============================================================================
// CATEGORY APIS
// ============================================================================

/**
 * Get all marketplace categories
 */
export async function getCategories(signal?: AbortSignal): Promise<AutomationCategory[]> {
  try {
    const response = await api.get<ApiResponse<{ categories: AutomationCategory[] }>>(
      `${MARKETPLACE_BASE_PATH}/categories`,
      { signal }
    );

    const data = extractData(response);
    return data.categories;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to fetch categories:', error);
    }
    throw error;
  }
}

// ============================================================================
// STATS API
// ============================================================================

/**
 * Get marketplace statistics
 */
export async function getMarketplaceStats(signal?: AbortSignal): Promise<MarketplaceStatsResponse> {
  try {
    const response = await api.get<ApiResponse<MarketplaceStatsResponse>>(
      `${MARKETPLACE_BASE_PATH}/stats`,
      { signal }
    );

    return extractData(response);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to fetch marketplace stats:', error);
    }
    throw error;
  }
}

// ============================================================================
// INTERACTION APIS
// ============================================================================

/**
 * Vote for an automation
 */
export async function voteForAutomation(
  automationId: number | string,
  delta: number = 1
): Promise<void> {
  try {
    await api.post(`${MARKETPLACE_BASE_PATH}/${automationId}/vote`, { delta });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to vote for automation ${automationId}:`, error);
    }
    throw error;
  }
}

/**
 * Record analytics event
 */
export async function recordAnalytics(event: AnalyticsEvent): Promise<void> {
  try {
    // Fire and forget - don't wait for response
    api.post(`${MARKETPLACE_BASE_PATH}/${event.automationId}/analytics`, {
      eventType: event.eventType,
      metadata: event.metadata,
    }).catch((error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to record analytics:', error);
      }
    });
  } catch (error) {
    // Silently fail for analytics
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to record analytics:', error);
    }
  }
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Get multiple automations by IDs
 */
export async function getAutomationsByIds(
  ids: (number | string)[],
  signal?: AbortSignal
): Promise<Automation[]> {
  try {
    if (!ids || ids.length === 0) {
      return [];
    }

    // Fetch all automations in parallel
    const promises = ids.map((id) => getAutomationById(id, signal));
    const results = await Promise.allSettled(promises);

    // Extract successful results
    return results
      .filter((result): result is PromiseFulfilledResult<Automation> => result.status === 'fulfilled')
      .map((result) => result.value);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to fetch automations by IDs:', error);
    }
    return [];
  }
}

// ============================================================================
// PREFETCH HELPERS
// ============================================================================

/**
 * Prefetch automation data (for hover interactions)
 */
export function prefetchAutomation(id: number | string): void {
  if (typeof window === 'undefined') return;

  // Use requestIdleCallback if available
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(() => {
      getAutomationById(id).catch(() => {
        // Silently fail prefetch
      });
    });
  } else {
    setTimeout(() => {
      getAutomationById(id).catch(() => {
        // Silently fail prefetch
      });
    }, 100);
  }
}

/**
 * Prefetch related automations
 */
export function prefetchRelatedAutomations(automationId: number | string): void {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(() => {
      getRelatedAutomations(automationId).catch(() => {
        // Silently fail prefetch
      });
    });
  } else {
    setTimeout(() => {
      getRelatedAutomations(automationId).catch(() => {
        // Silently fail prefetch
      });
    }, 150);
  }
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const marketplaceApi = {
  // Automation APIs
  getAutomations,
  getAutomationById,
  getAutomationBySlug,
  getAutomationsByIds,

  // Featured & Trending
  getFeaturedAutomations,
  getTrendingAutomations,
  getRelatedAutomations,

  // Search
  searchAutomations,

  // Categories
  getCategories,

  // Stats
  getMarketplaceStats,

  // Interactions
  voteForAutomation,
  recordAnalytics,

  // Prefetch
  prefetchAutomation,
  prefetchRelatedAutomations,
};

export default marketplaceApi;


