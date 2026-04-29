import { getPaymentHistoryFromAPI } from "@/features/bills/api/billing-api";
import type { PaymentHistoryContent } from "@/features/bills/types/billing";

export async function getPaymentHistoryContent(unitCode: string): Promise<PaymentHistoryContent> {
  return getPaymentHistoryFromAPI(unitCode);
}
