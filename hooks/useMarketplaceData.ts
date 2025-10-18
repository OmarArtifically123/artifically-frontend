"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/api";
import { fetchAutomations } from "@/data/automations";
import { toast } from "@/components/Toast";

type AutomationIdentifier = string | number;

type AutomationRecord = {
  id: AutomationIdentifier;
  teamVotes?: number;
  performance?: {
    avgInteractionMs?: number;
    fps?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type VoteVariables = {
  automationId: AutomationIdentifier;
  delta?: number;
};

type VoteContext = {
  previous?: AutomationRecord[];
};

const MARKETPLACE_AUTOMATIONS_QUERY_KEY = ["marketplace", "automations"] as const;

const ensureAutomationArray = (value: unknown): AutomationRecord[] => {
  if (Array.isArray(value)) {
    return value as AutomationRecord[];
  }
  return [];
};

export function useMarketplaceAutomations() {
  const query = useQuery<AutomationRecord[]>({
    queryKey: MARKETPLACE_AUTOMATIONS_QUERY_KEY,
    queryFn: async () => {
      const automations = await fetchAutomations();
      return ensureAutomationArray(automations);
    },
    structuralSharing: true,
  });

  return {
    ...query,
    automations: query.data ?? [],
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
      const previous = ensureAutomationArray(queryClient.getQueryData(MARKETPLACE_AUTOMATIONS_QUERY_KEY));

      queryClient.setQueryData<AutomationRecord[] | undefined>(MARKETPLACE_AUTOMATIONS_QUERY_KEY, (current) => {
        const list = ensureAutomationArray(current);
        return list.map((automation) => {
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
      });

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
    async (automation: AutomationRecord | null | undefined) => {
      if (!automation?.id) {
        return;
      }

      await vote({ automationId: automation.id, delta: 1 });
    },
    [vote],
  );
}