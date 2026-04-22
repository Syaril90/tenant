import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getHub } from "@/features/hub/api/get-hub";

export function useHubQuery() {
  return useQuery({
    queryKey: queryKeys.hub,
    queryFn: getHub
  });
}
