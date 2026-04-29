import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getVisitor } from "@/features/visitor/api/get-visitor";

export function useVisitorQuery(unitCode: string | null) {
  return useQuery({
    queryKey: [...queryKeys.visitor, unitCode ?? "none"],
    queryFn: () => getVisitor(unitCode as string),
    enabled: Boolean(unitCode)
  });
}
