import type {
  SubmitPaymentInput,
  SubmitPaymentResult
} from "@/features/bills/types/billing";
import { mockApiResponse } from "@/shared/lib/mock-api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export async function submitPayment(
  input: SubmitPaymentInput
): Promise<SubmitPaymentResult> {
  return mockApiResponse(
    {
      paymentId: `payment-${Date.now()}`,
      paidAmount: input.amount,
      paidAmountDisplay: formatCurrency(input.amount),
      paidAtLabel: "Today",
      statusLabel: "Successful",
      methodId: input.paymentMethodId
    },
    600
  );
}

