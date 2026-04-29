import type {
  SubmitPaymentInput,
  SubmitPaymentResult
} from "@/features/bills/types/billing";
import { mockApiResponse } from "@/shared/lib/mock-api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR"
  }).format(amount);
}

export async function submitPayment(
  input: SubmitPaymentInput
): Promise<SubmitPaymentResult> {
  return mockApiResponse(
    {
      paymentId: `payment-${Date.now()}`,
      accountId: input.accountId,
      unitCode: input.unitCode,
      paidAmount: input.amount,
      paidAmountDisplay: formatCurrency(input.amount),
      paidAtLabel: "Today",
      statusLabel: "Successful",
      methodId: input.paymentMethodId
    },
    600
  );
}
