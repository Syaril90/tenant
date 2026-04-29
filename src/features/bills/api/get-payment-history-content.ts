import { buildPaymentHistoryContent } from "@/features/bills/data/billing-adapters";
import type { PaymentHistoryContent } from "@/features/bills/types/billing";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getPaymentHistoryContent(): Promise<PaymentHistoryContent> {
  return mockApiResponse(buildPaymentHistoryContent(), 180);
}
