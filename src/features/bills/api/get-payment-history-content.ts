import paymentHistoryJson from "@/features/bills/data/payment-history.json";
import type { PaymentHistoryContent } from "@/features/bills/types/billing";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getPaymentHistoryContent(): Promise<PaymentHistoryContent> {
  return mockApiResponse(paymentHistoryJson as PaymentHistoryContent, 180);
}
