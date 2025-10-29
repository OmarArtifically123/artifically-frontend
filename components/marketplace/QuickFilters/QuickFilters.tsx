"use client";

import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import styles from "./QuickFilters.module.css";

/**
 * QuickFilters - One-click filter chips
 */
export function QuickFilters() {
  const { filters, setFilter } = useMarketplaceFilters();

  const quickFilters = [
    { label: "Most Popular", value: "popular", type: "sort" },
    { label: "Free", value: "free", type: "price" },
    { label: "New This Week", value: "recent", type: "sort" },
    { label: "Highly Rated", value: "rating", type: "sort" },
    { label: "Enterprise", value: "enterprise", type: "price" },
  ];

  const handleQuickFilter = (filter: { label: string; value: string; type: string }) => {
    if (filter.type === "price") {
      setFilter("priceTier", filter.value as "all" | "free" | "freemium" | "paid" | "premium" | "enterprise");
    } else if (filter.type === "sort" && typeof window !== "undefined") {
      // Update sort via search params (client-side only)
      const params = new URLSearchParams(window.location.search);
      params.set("sortBy", filter.value);
      window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Quick filters:</div>
      <div className={styles.chips}>
        {quickFilters.map((filter) => {
          const isActive =
            (filter.type === "price" && filters.priceTier === filter.value) ||
            (filter.type === "sort" && typeof window !== "undefined" &&
              new URLSearchParams(window.location.search).get("sortBy") === filter.value);

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => handleQuickFilter(filter)}
              className={`${styles.chip} ${isActive ? styles.active : ""}`}
              aria-pressed={isActive}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickFilters;

