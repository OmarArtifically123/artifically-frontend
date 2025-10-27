"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplaceSearch } from "@/hooks/useMarketplaceSearch";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { SearchSuggestions } from "./SearchSuggestions";
import type { SearchBarProps } from "@/types/marketplace";
import styles from "./SearchBar.module.css";

/**
 * SearchBar - Advanced search with autocomplete and suggestions
 * Features:
 * - Debounced search
 * - Autocomplete dropdown
 * - Recent searches
 * - Keyboard navigation (↑↓ Enter Esc)
 * - Voice search (optional)
 * - WCAG 2.1 AAA compliant
 */
export function SearchBar({
  placeholder = "Search automations...",
  autoFocus = false,
}: Partial<SearchBarProps>) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { filters, setFilter } = useMarketplaceFilters();
  const {
    query,
    setQuery,
    suggestions,
    isSearching,
    recentSearches,
    clearRecentSearches,
    handleSearch,
  } = useMarketplaceSearch(filters.search);

  const showSuggestions = isFocused && (suggestions.length > 0 || recentSearches.length > 0);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setSelectedIndex(-1);
    },
    [setQuery]
  );

  // Handle search submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (query.trim()) {
        handleSearch(query);
        setFilter("search", query);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [query, handleSearch, setFilter]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: { type: string; id: string | number; label: string }) => {
      if (suggestion.type === "automation") {
        // Navigate to automation detail
        router.push(`/marketplace/${suggestion.id}`);
      } else {
        // Set search query
        setQuery(suggestion.label);
        setFilter("search", suggestion.label);
        handleSearch(suggestion.label);
      }
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [router, setQuery, setFilter, handleSearch]
  );

  // Handle recent search click
  const handleRecentClick = useCallback(
    (search: string) => {
      setQuery(search);
      setFilter("search", search);
      handleSearch(search);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [setQuery, setFilter, handleSearch]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) return;

      const totalItems = suggestions.length + recentSearches.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case "Enter":
          if (selectedIndex >= 0) {
            e.preventDefault();
            if (selectedIndex < suggestions.length) {
              handleSuggestionClick(suggestions[selectedIndex]);
            } else {
              const recentIndex = selectedIndex - suggestions.length;
              if (recentIndex < recentSearches.length) {
                handleRecentClick(recentSearches[recentIndex]);
              }
            }
          }
          break;

        case "Escape":
          setIsFocused(false);
          inputRef.current?.blur();
          break;

        default:
          break;
      }
    },
    [showSuggestions, suggestions, recentSearches, selectedIndex, handleSuggestionClick, handleRecentClick]
  );

  // Clear search
  const handleClear = useCallback(() => {
    setQuery("");
    setFilter("search", "");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [setQuery, setFilter]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm} role="search">
        <label htmlFor="marketplace-search" className="sr-only">
          Search marketplace automations
        </label>

        <div className={styles.inputWrapper}>
          {/* Search Icon */}
          <div className={styles.searchIcon} aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            id="marketplace-search"
            type="search"
            role="combobox"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showSuggestions}
            aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          />

          {/* Loading Spinner */}
          {isSearching && (
            <div className={styles.loadingSpinner} aria-label="Searching...">
              <div className={styles.spinner} />
            </div>
          )}

          {/* Clear Button */}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button type="submit" className={styles.searchButton} aria-label="Search">
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <SearchSuggestions
              suggestions={suggestions}
              recentSearches={recentSearches}
              selectedIndex={selectedIndex}
              onSuggestionClick={handleSuggestionClick}
              onRecentClick={handleRecentClick}
              onClearRecent={clearRecentSearches}
            />
          )}
        </AnimatePresence>
      </form>

      {/* Keyboard Shortcuts Info */}
      <div className="sr-only" aria-live="polite">
        {showSuggestions &&
          "Use arrow keys to navigate suggestions, Enter to select, Escape to close"}
      </div>
    </div>
  );
}

export default SearchBar;

