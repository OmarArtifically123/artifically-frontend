"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { marketplaceApi } from "@/lib/api/marketplace-api";
import type { Automation, SearchSuggestion } from "@/types/marketplace";

const RECENT_SEARCHES_KEY = "marketplace_recent_searches";
const MAX_RECENT_SEARCHES = 5;

/**
 * Hook for marketplace search with suggestions and history
 */
export function useMarketplaceSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce query for API calls
  const debouncedQuery = useDebouncedValue(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (typeof window === "undefined" || !searchQuery || searchQuery.trim().length < 2) {
      return;
    }

    try {
      setRecentSearches((prev) => {
        const trimmed = searchQuery.trim();
        const filtered = prev.filter((s) => s !== trimmed);
        const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);

        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Failed to save recent search:", error);
    }
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsSearching(true);

    // Fetch suggestions
    marketplaceApi
      .searchAutomations(debouncedQuery, 10, signal)
      .then((results: Automation[]) => {
        if (signal.aborted) return;

        // Convert results to suggestions
        const automationSuggestions: SearchSuggestion[] = results.map((automation) => ({
          type: "automation" as const,
          id: automation.id,
          label: automation.name,
          description: automation.description,
          icon: automation.icon,
        }));

        setSuggestions(automationSuggestions);
        setIsSearching(false);
      })
      .catch((error) => {
        if (signal.aborted) return;
        console.error("Search failed:", error);
        setSuggestions([]);
        setIsSearching(false);
      });

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  // Handle search submission
  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        saveRecentSearch(searchQuery);
      }
    },
    [saveRecentSearch]
  );

  return {
    query,
    setQuery,
    suggestions,
    isSearching,
    recentSearches,
    clearRecentSearches,
    handleSearch,
  };
}

export default useMarketplaceSearch;

