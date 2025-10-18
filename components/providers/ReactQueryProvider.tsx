"use client";

import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const DEFAULT_QUERY_OPTIONS = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount: number, error: unknown) => {
      if (error instanceof Error && /404/.test(error.message)) {
        return false;
      }
      return failureCount < 2;
    },
  },
  mutations: {
    retry: false,
  },
} as const;

export default function ReactQueryProvider({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: DEFAULT_QUERY_OPTIONS,
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}