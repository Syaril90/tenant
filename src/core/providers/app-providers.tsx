import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { ThemeProvider } from "@/shared/theme/theme-provider";
import { queryClient } from "@/shared/lib/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
