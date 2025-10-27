"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ActiveFilters, AutomationPriceTier } from "@/types/marketplace";

/**
 * Hook for managing marketplace filters with URL synchronization
 */
export function useMarketplaceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const initialFilters = useMemo((): ActiveFilters => {
    const categoriesParam = searchParams.get("categories");
    const integrationsParam = searchParams.get("integrations");
    const tagsParam = searchParams.get("tags");
    const attributesParam = searchParams.get("attributes");

    return {
      categories: categoriesParam ? categoriesParam.split(",").map(Number).filter(Boolean) : [],
      priceTier: (searchParams.get("priceTier") as AutomationPriceTier) || "all",
      integrations: integrationsParam ? integrationsParam.split(",").filter(Boolean) : [],
      tags: tagsParam ? tagsParam.split(",").filter(Boolean) : [],
      attributes: attributesParam ? attributesParam.split(",").filter(Boolean) : [],
      rating: searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : null,
      search: searchParams.get("search") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: ActiveFilters) => {
      const params = new URLSearchParams();

      if (newFilters.categories.length > 0) {
        params.set("categories", newFilters.categories.join(","));
      }
      if (newFilters.priceTier && newFilters.priceTier !== "all") {
        params.set("priceTier", newFilters.priceTier);
      }
      if (newFilters.integrations.length > 0) {
        params.set("integrations", newFilters.integrations.join(","));
      }
      if (newFilters.tags.length > 0) {
        params.set("tags", newFilters.tags.join(","));
      }
      if (newFilters.attributes.length > 0) {
        params.set("attributes", newFilters.attributes.join(","));
      }
      if (newFilters.rating) {
        params.set("rating", String(newFilters.rating));
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(url, { scroll: false });
    },
    [pathname, router]
  );

  // Set a specific filter
  const setFilter = useCallback(
    <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        updateURL(newFilters);
        return newFilters;
      });
    },
    [updateURL]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const emptyFilters: ActiveFilters = {
      categories: [],
      priceTier: "all",
      integrations: [],
      tags: [],
      attributes: [],
      rating: null,
      search: "",
    };
    setFilters(emptyFilters);
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // Clear a specific filter
  const clearFilter = useCallback(
    (key: keyof ActiveFilters) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (key === "categories") newFilters.categories = [];
        else if (key === "priceTier") newFilters.priceTier = "all";
        else if (key === "integrations") newFilters.integrations = [];
        else if (key === "tags") newFilters.tags = [];
        else if (key === "attributes") newFilters.attributes = [];
        else if (key === "rating") newFilters.rating = null;
        else if (key === "search") newFilters.search = "";

        updateURL(newFilters);
        return newFilters;
      });
    },
    [updateURL]
  );

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      (filters.priceTier && filters.priceTier !== "all") ||
      filters.integrations.length > 0 ||
      filters.tags.length > 0 ||
      filters.attributes.length > 0 ||
      filters.rating !== null ||
      filters.search !== ""
    );
  }, [filters]);

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.priceTier && filters.priceTier !== "all") count += 1;
    if (filters.integrations.length > 0) count += filters.integrations.length;
    if (filters.tags.length > 0) count += filters.tags.length;
    if (filters.attributes.length > 0) count += filters.attributes.length;
    if (filters.rating !== null) count += 1;
    return count;
  }, [filters]);

  return {
    filters,
    setFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    activeFilterCount,
  };
}

export default useMarketplaceFilters;


