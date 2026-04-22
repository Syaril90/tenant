import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/shared/theme/theme-provider";
import { queryClient } from "@/shared/lib/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
