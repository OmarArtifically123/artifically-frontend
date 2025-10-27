"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import apiClient from "@/api";
import { fetchAutomations } from "@/data/automations";
import { toast } from "@/components/Toast";
import { marketplaceApi } from "@/lib/api/marketplace-api";
import type {
  Automation,
  AutomationCategory,
  MarketplaceFilters,
  MarketplaceStatsResponse,
} from "@/types/marketplace";

type AutomationIdentifier = string | number;

type VoteVariables = {
  automationId: AutomationIdentifier;
  delta?: number;
};

export const MARKETPLACE_AUTOMATIONS_QUERY_KEY = ["marketplace", "automations"] as const;
export const MARKETPLACE_FEATURED_QUERY_KEY = ["marketplace", "featured"] as const;
export const MARKETPLACE_TRENDING_QUERY_KEY = ["marketplace", "trending"] as const;
export const MARKETPLACE_CATEGORIES_QUERY_KEY = ["marketplace", "categories"] as const;
export const MARKETPLACE_STATS_QUERY_KEY = ["marketplace", "stats"] as const;
export const MARKETPLACE_PAGE_SIZE = 20;

type AutomationPage = {
  items: Automation[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextPage: number | null;
};

type AutomationsInfiniteData = InfiniteData<AutomationPage>;

type VoteContext = {
  previous?: AutomationsInfiniteData;
};

const ensureAutomationArray = (value: unknown): Automation[] => {
  if (Array.isArray(value)) {
    return value as Automation[];
  }
  return [];
};

const normalizePage = (value: unknown, fallbackPage = 1): AutomationPage => {
  if (value && typeof value === "object") {
    const candidate = value as Partial<AutomationPage>;
    const items = ensureAutomationArray(candidate.items);
    const page = Number(candidate.page) || fallbackPage;
    const limit = Number(candidate.limit) || MARKETPLACE_PAGE_SIZE;
    const total = Number(candidate.total ?? items.length) || items.length;
    const hasMore = Boolean(candidate.hasMore ?? (candidate.nextPage ? true : false));
    const nextPage =
      typeof candidate.nextPage === "number"
        ? candidate.nextPage
        : hasMore
          ? page + 1
          : null;

    return {
      items,
      page,
      limit,
      total,
      hasMore,
      nextPage,
    };
  }

  return {
    items: [],
    page: fallbackPage,
    limit: MARKETPLACE_PAGE_SIZE,
    total: 0,
    hasMore: false,
    nextPage: null,
  };
};

const flattenPages = (data: AutomationsInfiniteData | undefined): Automation[] => {
  if (!data?.pages) {
    return [];
  }
  return data.pages.reduce<Automation[]>((accumulator, page) => {
    accumulator.push(...ensureAutomationArray(page.items));
    return accumulator;
  }, []);
};

export function useMarketplaceAutomations(filters?: Record<string, unknown>) {
  const queryClient = useQueryClient();
  const prefetchedPageRef = useRef<number | null>(null);

  const query = useInfiniteQuery<AutomationPage>({
    queryKey: [...MARKETPLACE_AUTOMATIONS_QUERY_KEY, filters],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    structuralSharing: true,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 15,
    refetchOnMount: true,
    queryFn: async ({ pageParam = 1, signal }) => {
      const pageNumber = Number(pageParam) || 1;
      const response = await fetchAutomations({ page: pageNumber, limit: MARKETPLACE_PAGE_SIZE, signal, ...filters });
      return normalizePage(response, pageNumber);
    },
  });

  const automations = useMemo(() => flattenPages(query.data), [query.data]);

  const total = useMemo(() => {
    if (!query.data?.pages?.length) {
      return automations.length;
    }
    const lastPage = query.data.pages[query.data.pages.length - 1];
    return Number(lastPage?.total ?? automations.length);
  }, [automations.length, query.data]);

  const prefetchNextPage = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return Promise.resolve();
    }
    const currentPages = query.data?.pages ?? [];
    const nextPage = currentPages.length > 0 ? currentPages[currentPages.length - 1]?.nextPage : 2;
    if (!nextPage || prefetchedPageRef.current === nextPage) {
      return Promise.resolve();
    }
    prefetchedPageRef.current = nextPage;
    return query.fetchNextPage({ cancelRefetch: false });
  }, [query]);

  const resetPrefetchMarker = useCallback(() => {
    prefetchedPageRef.current = null;
  }, []);

  const refetch = useCallback(
    async () => {
      resetPrefetchMarker();
      await queryClient.invalidateQueries({ queryKey: MARKETPLACE_AUTOMATIONS_QUERY_KEY });
    },
    [queryClient, resetPrefetchMarker],
  );

  return {
    ...query,
    automations,
    total,
    prefetchNextPage,
    refetch,
  };
}

export function useAutomationVote() {
  const queryClient = useQueryClient();

  return useMutation<
    { automationId: AutomationIdentifier; delta: number },
    Error,
    VoteVariables,
    VoteContext
  >({
    mutationKey: ["marketplace", "vote"],
    mutationFn: async ({ automationId, delta = 1 }: VoteVariables) => {
      try {
        await apiClient.post(`/marketplace/${automationId}/vote`, { delta });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Vote request failed, relying on optimistic update", error);
        }
      }
      return { automationId, delta };
    },
    onMutate: async ({ automationId, delta = 1 }: VoteVariables) => {
      await queryClient.cancelQueries({ queryKey: MARKETPLACE_AUTOMATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<AutomationsInfiniteData>(MARKETPLACE_AUTOMATIONS_QUERY_KEY);

      queryClient.setQueryData<AutomationsInfiniteData | undefined>(
        MARKETPLACE_AUTOMATIONS_QUERY_KEY,
        (current) => {
          if (!current) {
            return current;
          }
          const pages = current.pages.map((page, pageIndex) => {
            const normalizedPage = normalizePage(page, pageIndex + 1);
            const items = normalizedPage.items.map((automation) => {
              if (!automation || automation.id !== automationId) {
                return automation;
              }

              const nextVotes = Math.max(0, Number(automation.teamVotes ?? 0) + delta);
              return {
                ...automation,
                teamVotes: nextVotes,
                performance: {
                  ...(automation.performance ?? {}),
                  avgInteractionMs: automation.performance?.avgInteractionMs ?? 180,
                },
                lastVotedAt: Date.now(),
              };
            });

            return {
              ...normalizedPage,
              items,
            };
          });

          return {
            ...current,
            pages,
          };
        },
      );

      return { previous };
    },
    onError: (error: Error, _variables: VoteVariables, context: VoteContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(MARKETPLACE_AUTOMATIONS_QUERY_KEY, context.previous);
      }
      const message = error?.message || "Unable to register vote. Please try again.";
      toast(message, { type: "error" });
    },
    onSuccess: () => {
      toast("Thanks! Your team vote is syncing.", { type: "success" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_AUTOMATIONS_QUERY_KEY });
    },
  });
}

export function useTeamVoteHandler() {
  const { mutateAsync: vote } = useAutomationVote();

  return useCallback(
    async (automation: Automation | null | undefined) => {
      if (!automation?.id) {
        return;
      }

      await vote({ automationId: automation.id, delta: 1 });
    },
    [vote],
  );
}

/**
 * Hook to fetch featured automations
 */
export function useFeaturedAutomations(limit = 6) {
  return useQuery<Automation[], Error>({
    queryKey: [...MARKETPLACE_FEATURED_QUERY_KEY, limit],
    queryFn: ({ signal }) => marketplaceApi.getFeaturedAutomations(limit, signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch trending automations
 */
export function useTrendingAutomations(limit = 10) {
  return useQuery<Automation[], Error>({
    queryKey: [...MARKETPLACE_TRENDING_QUERY_KEY, limit],
    queryFn: ({ signal }) => marketplaceApi.getTrendingAutomations(limit, signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
}

/**
 * Hook to fetch marketplace categories
 */
export function useMarketplaceCategories() {
  return useQuery<AutomationCategory[], Error>({
    queryKey: MARKETPLACE_CATEGORIES_QUERY_KEY,
    queryFn: ({ signal }) => marketplaceApi.getCategories(signal),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch marketplace statistics
 */
export function useMarketplaceStats() {
  return useQuery<MarketplaceStatsResponse, Error>({
    queryKey: MARKETPLACE_STATS_QUERY_KEY,
    queryFn: ({ signal }) => marketplaceApi.getMarketplaceStats(signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
}

/**
 * Hook to fetch single automation by ID
 */
export function useAutomation(id: number | string | null | undefined) {
  return useQuery<Automation, Error>({
    queryKey: ["marketplace", "automation", id],
    queryFn: ({ signal }) => {
      if (!id) throw new Error("Automation ID is required");
      return marketplaceApi.getAutomationById(id, signal);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch related automations
 */
export function useRelatedAutomations(automationId: number | string | null | undefined, limit = 6) {
  return useQuery<Automation[], Error>({
    queryKey: ["marketplace", "related", automationId, limit],
    queryFn: ({ signal }) => {
      if (!automationId) throw new Error("Automation ID is required");
      return marketplaceApi.getRelatedAutomations(automationId, limit, signal);
    },
    enabled: !!automationId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
}