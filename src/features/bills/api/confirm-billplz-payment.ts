import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";

export type ConfirmBillplzPaymentInput = {
  billId: string;
  paid?: string;
  paidAt?: string;
  xSignature?: string;
  transactionId?: string;
  transactionStatus?: string;
};

export type ConfirmBillplzPaymentResponse = {
  reference: string;
  billId: string;
  unitCode: string;
  status: string;
  outcome: "success" | "failed" | "pending";
  paymentReference?: string;
  paidAt?: string;
};

export async function confirmBillplzPayment(input: ConfirmBillplzPaymentInput) {
  const response = await fetch(`${getAPIBaseURL()}/api/v1/billing/billplz/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Billplz confirmation failed with status ${response.status}`);
  }

  return unwrapItem(
    (await response.json()) as
      | ConfirmBillplzPaymentResponse
      | { item: ConfirmBillplzPaymentResponse }
  );
}
