import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getBilling } from "@/features/bills/api/get-billing";

export function useBillingQuery(unitCode: string | null) {
  return useQuery({
    queryKey: [...queryKeys.bills, unitCode],
    queryFn: () => getBilling(unitCode as string),
    enabled: Boolean(unitCode)
  });
}
