import { useQuery } from "@tanstack/react-query";

import { getSupport } from "@/features/support/api/get-support";

export function useSupportQuery() {
  return useQuery({
    queryKey: ["support"],
    queryFn: getSupport
  });
}
