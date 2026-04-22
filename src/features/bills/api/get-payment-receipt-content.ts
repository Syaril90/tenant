import paymentReceiptJson from "@/features/bills/data/payment-receipt.json";
import type { PaymentReceiptContent } from "@/features/bills/types/payment-success";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getPaymentReceiptContent(): Promise<PaymentReceiptContent> {
  return mockApiResponse(paymentReceiptJson as PaymentReceiptContent, 150);
}

