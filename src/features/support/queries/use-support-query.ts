import { useQuery } from "@tanstack/react-query";

import { getSupport } from "@/features/support/api/get-support";

export function useSupportQuery(unitCode?: string | null) {
  return useQuery({
    queryKey: ["support", unitCode ?? "none"],
    queryFn: () => getSupport(unitCode)
  });
}
