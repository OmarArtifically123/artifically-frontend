/**
 * Marketplace Store - Global state management with Zustand
 * Manages view preferences, comparison list, favorites, and recently viewed
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ViewMode } from "@/types/marketplace";

interface MarketplaceState {
  // View preferences
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Sidebar visibility
  showFilters: boolean;
  toggleFilters: () => void;
  setShowFilters: (show: boolean) => void;

  // Comparison list
  comparisonList: (number | string)[];
  addToComparison: (id: number | string) => void;
  removeFromComparison: (id: number | string) => void;
  clearComparison: () => void;
  isInComparison: (id: number | string) => boolean;

  // Favorites
  favorites: (number | string)[];
  addToFavorites: (id: number | string) => void;
  removeFromFavorites: (id: number | string) => void;
  toggleFavorite: (id: number | string) => void;
  isFavorite: (id: number | string) => boolean;

  // Recently viewed
  recentlyViewed: (number | string)[];
  addToRecentlyViewed: (id: number | string) => void;
  clearRecentlyViewed: () => void;

  // Selected automations (for bulk actions)
  selectedAutomations: (number | string)[];
  selectAutomation: (id: number | string) => void;
  deselectAutomation: (id: number | string) => void;
  toggleSelectAutomation: (id: number | string) => void;
  selectAll: (ids: (number | string)[]) => void;
  deselectAll: () => void;
  isSelected: (id: number | string) => boolean;
}

const MAX_RECENTLY_VIEWED = 20;
const MAX_COMPARISON = 4;

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      // View preferences
      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),

      // Sidebar visibility
      showFilters: true,
      toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
      setShowFilters: (show) => set({ showFilters: show }),

      // Comparison list
      comparisonList: [],
      addToComparison: (id) =>
        set((state) => {
          if (state.comparisonList.includes(id)) {
            return state;
          }
          if (state.comparisonList.length >= MAX_COMPARISON) {
            // Remove the oldest item
            return {
              comparisonList: [...state.comparisonList.slice(1), id],
            };
          }
          return {
            comparisonList: [...state.comparisonList, id],
          };
        }),
      removeFromComparison: (id) =>
        set((state) => ({
          comparisonList: state.comparisonList.filter((item) => item !== id),
        })),
      clearComparison: () => set({ comparisonList: [] }),
      isInComparison: (id) => get().comparisonList.includes(id),

      // Favorites
      favorites: [],
      addToFavorites: (id) =>
        set((state) => {
          if (state.favorites.includes(id)) {
            return state;
          }
          return {
            favorites: [...state.favorites, id],
          };
        }),
      removeFromFavorites: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item !== id),
        })),
      toggleFavorite: (id) => {
        const { favorites } = get();
        if (favorites.includes(id)) {
          get().removeFromFavorites(id);
        } else {
          get().addToFavorites(id);
        }
      },
      isFavorite: (id) => get().favorites.includes(id),

      // Recently viewed
      recentlyViewed: [],
      addToRecentlyViewed: (id) =>
        set((state) => {
          // Remove if already exists
          const filtered = state.recentlyViewed.filter((item) => item !== id);
          // Add to front
          const updated = [id, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
          return { recentlyViewed: updated };
        }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      // Selected automations
      selectedAutomations: [],
      selectAutomation: (id) =>
        set((state) => {
          if (state.selectedAutomations.includes(id)) {
            return state;
          }
          return {
            selectedAutomations: [...state.selectedAutomations, id],
          };
        }),
      deselectAutomation: (id) =>
        set((state) => ({
          selectedAutomations: state.selectedAutomations.filter((item) => item !== id),
        })),
      toggleSelectAutomation: (id) => {
        const { selectedAutomations } = get();
        if (selectedAutomations.includes(id)) {
          get().deselectAutomation(id);
        } else {
          get().selectAutomation(id);
        }
      },
      selectAll: (ids) => set({ selectedAutomations: ids }),
      deselectAll: () => set({ selectedAutomations: [] }),
      isSelected: (id) => get().selectedAutomations.includes(id),
    }),
    {
      name: "marketplace-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        showFilters: state.showFilters,
        comparisonList: state.comparisonList,
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
        // Don't persist selectedAutomations as it's session-specific
      }),
    }
  )
);

export default useMarketplaceStore;

