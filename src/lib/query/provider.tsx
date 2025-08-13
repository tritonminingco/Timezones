/**
 * React Query Provider
 *
 * Configures TanStack Query with proper defaults
 * Includes error handling, retry logic, and development tools
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { ApiError } from "../api/client";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache time: 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry configuration
            retry: (failureCount, error) => {
              const apiError = error as unknown as ApiError;

              // Don't retry on 4xx errors (client errors)
              if (
                apiError.status &&
                apiError.status >= 400 &&
                apiError.status < 500
              ) {
                return false;
              }

              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for important data
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default QueryProvider;
