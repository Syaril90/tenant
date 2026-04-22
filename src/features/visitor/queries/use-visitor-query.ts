import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getVisitor } from "@/features/visitor/api/get-visitor";

export function useVisitorQuery() {
  return useQuery({
    queryKey: queryKeys.visitor,
    queryFn: getVisitor
  });
}
