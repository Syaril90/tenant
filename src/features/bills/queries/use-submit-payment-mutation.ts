import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { submitPayment } from "@/features/bills/api/submit-payment";
import type { SubmitPaymentInput } from "@/features/bills/types/billing";

export function useSubmitPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPayment,
    onSuccess: (result, variables: SubmitPaymentInput) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.bills, variables.unitCode] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.paymentHistory, variables.unitCode] });
    }
  });
}
