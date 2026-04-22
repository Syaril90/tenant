import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getPaymentReceiptContent } from "@/features/bills/api/get-payment-receipt-content";

export function usePaymentReceiptContentQuery() {
  return useQuery({
    queryKey: queryKeys.paymentReceipt,
    queryFn: getPaymentReceiptContent
  });
}

