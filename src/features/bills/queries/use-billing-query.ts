import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getBilling } from "@/features/bills/api/get-billing";

export function useBillingQuery() {
  return useQuery({
    queryKey: queryKeys.bills,
    queryFn: getBilling
  });
}

