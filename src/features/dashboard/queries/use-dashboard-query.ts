import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getDashboard } from "@/features/dashboard/api/get-dashboard";

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboard
  });
}

