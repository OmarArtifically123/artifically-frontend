"use client";

import { motion } from "framer-motion";
import type { SearchSuggestion } from "@/types/marketplace";
import styles from "./SearchSuggestions.module.css";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  selectedIndex: number;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onRecentClick: (search: string) => void;
  onClearRecent: () => void;
}

/**
 * SearchSuggestions - Dropdown with autocomplete suggestions
 */
export function SearchSuggestions({
  suggestions,
  recentSearches,
  selectedIndex,
  onSuggestionClick,
  onRecentClick,
  onClearRecent,
}: SearchSuggestionsProps) {
  const hasSuggestions = suggestions.length > 0;
  const hasRecent = recentSearches.length > 0;

  return (
    <motion.div
      id="search-suggestions"
      className={styles.dropdown}
      role="listbox"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Suggestions */}
      {hasSuggestions && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Automations</span>
          </div>
          <ul className={styles.list}>
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.type}-${suggestion.id}`}
                id={`suggestion-${index}`}
                className={`${styles.listItem} ${selectedIndex === index ? styles.selected : ""}`}
                role="option"
                aria-selected={selectedIndex === index}
                onClick={() => onSuggestionClick(suggestion)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSuggestionClick(suggestion);
                  }
                }}
                tabIndex={-1}
              >
                <div className={styles.suggestionIcon}>
                  {suggestion.icon || (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className={styles.suggestionContent}>
                  <div className={styles.suggestionLabel}>{suggestion.label}</div>
                  {suggestion.description && (
                    <div className={styles.suggestionDescription}>{suggestion.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Searches */}
      {hasRecent && !hasSuggestions && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Recent Searches</span>
            <button
              type="button"
              onClick={onClearRecent}
              className={styles.clearButton}
              aria-label="Clear recent searches"
            >
              Clear
            </button>
          </div>
          <ul className={styles.list}>
            {recentSearches.map((search, index) => {
              const adjustedIndex = suggestions.length + index;
              return (
                <li
                  key={`recent-${index}`}
                  id={`suggestion-${adjustedIndex}`}
                  className={`${styles.listItem} ${selectedIndex === adjustedIndex ? styles.selected : ""}`}
                  role="option"
                  aria-selected={selectedIndex === adjustedIndex}
                  onClick={() => onRecentClick(search)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRecentClick(search);
                    }
                  }}
                  tabIndex={-1}
                >
                  <div className={styles.suggestionIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-13v5l3 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.suggestionContent}>
                    <div className={styles.suggestionLabel}>{search}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* No Results */}
      {!hasSuggestions && !hasRecent && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 26a12 12 0 1 0 0-24 12 12 0 0 0 0 24zM30 30l-6.35-6.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.noResultsText}>No results found</div>
          <div className={styles.noResultsSubtext}>Try a different search term</div>
        </div>
      )}
    </motion.div>
  );
}

export default SearchSuggestions;

