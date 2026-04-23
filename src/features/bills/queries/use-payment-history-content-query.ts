import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getPaymentHistoryContent } from "@/features/bills/api/get-payment-history-content";

export function usePaymentHistoryContentQuery() {
  return useQuery({
    queryKey: queryKeys.paymentHistory,
    queryFn: getPaymentHistoryContent
  });
}
