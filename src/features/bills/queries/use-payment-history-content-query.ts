import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getPaymentHistoryContent } from "@/features/bills/api/get-payment-history-content";

export function usePaymentHistoryContentQuery(unitCode: string | null) {
  return useQuery({
    queryKey: [...queryKeys.paymentHistory, unitCode],
    queryFn: () => getPaymentHistoryContent(unitCode as string),
    enabled: Boolean(unitCode)
  });
}
