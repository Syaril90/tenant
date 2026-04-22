import paymentSuccessJson from "@/features/bills/data/payment-success.json";
import type { PaymentSuccessContent } from "@/features/bills/types/payment-success";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getPaymentSuccessContent(): Promise<PaymentSuccessContent> {
  return mockApiResponse(paymentSuccessJson as PaymentSuccessContent, 150);
}

