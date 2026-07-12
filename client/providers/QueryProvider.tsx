"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,     // 5 min — don't refetch if data is fresh
            gcTime: 1000 * 60 * 30,        // 30 min — keep in cache longer
            retry: 1,                       // fail fast instead of 2 retries
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,      // no unnecessary refetch on reconnect
          },
          mutations: {
            retry: 0,                       // mutations never retry
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ReactQueryDevtools removed from production bundle */}
      {process.env.NODE_ENV === "development" && (
        <DynamicDevtools />
      )}
    </QueryClientProvider>
  );
}

// Lazy-loaded devtools — zero cost in production
function DynamicDevtools() {
  const [show, setShow] = useState(false);
  if (!show) return (
    <button
      onClick={() => setShow(true)}
      className="fixed bottom-2 left-2 z-50 text-xs bg-black/50 text-white px-2 py-1 rounded opacity-30 hover:opacity-100"
    >
      RQ
    </button>
  );
  const { ReactQueryDevtools } = require("@tanstack/react-query-devtools");
  return <ReactQueryDevtools initialIsOpen />;
}
