import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getPaymentSuccessContent } from "@/features/bills/api/get-payment-success-content";

export function usePaymentSuccessContentQuery() {
  return useQuery({
    queryKey: queryKeys.paymentSuccess,
    queryFn: getPaymentSuccessContent
  });
}

