"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockPilot } from "mockpilot";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  queryClient.setDefaultOptions({
    queries: {
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  });

  return (
    <MockPilot defaultOpen={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MockPilot>
  );
}
