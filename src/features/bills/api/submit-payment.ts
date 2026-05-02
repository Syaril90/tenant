import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { confirmBillplzPayment } from "@/features/bills/api/confirm-billplz-payment";
import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";
import type {
  SubmitPaymentInput,
  SubmitPaymentResult
} from "@/features/bills/types/billing";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR"
  }).format(amount);
}

type BillplzCheckoutResponse = {
  reference: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  unitCode: string;
};

export async function submitPayment(
  input: SubmitPaymentInput
): Promise<SubmitPaymentResult> {
  const redirectUrl = Linking.createURL("/payment-return", {
    queryParams: {
      unitCode: input.unitCode,
      methodId: input.paymentMethodId
    }
  });

  const checkoutResponse = await fetch(`${getAPIBaseURL()}/api/v1/billing/billplz/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      unitCode: input.unitCode,
      chargeReferences: input.chargeReferences,
      redirectUrl
    })
  });

  if (!checkoutResponse.ok) {
    throw new Error(`Billplz checkout create failed with status ${checkoutResponse.status}`);
  }

  const checkout = unwrapItem(
    (await checkoutResponse.json()) as BillplzCheckoutResponse | { item: BillplzCheckoutResponse }
  );

  const browserResult = await WebBrowser.openAuthSessionAsync(
    checkout.checkoutUrl,
    redirectUrl
  );

  if (browserResult.type !== "success" || !browserResult.url) {
    return {
      paymentId: checkout.reference,
      accountId: input.accountId,
      unitCode: input.unitCode,
      paidAmount: input.amount,
      paidAmountDisplay: formatCurrency(input.amount),
      paidAtLabel: "-",
      statusLabel: "Cancelled",
      methodId: input.paymentMethodId,
      outcome: "cancelled"
    };
  }

  const redirect = Linking.parse(browserResult.url);
  const paid = readQueryValue(redirect.queryParams?.["billplz[paid]"]);
  const paidAt = readQueryValue(redirect.queryParams?.["billplz[paid_at]"]);
  const billId = readQueryValue(redirect.queryParams?.["billplz[id]"]);
  const xSignature = readQueryValue(redirect.queryParams?.["billplz[x_signature]"]);
  const transactionId = readQueryValue(redirect.queryParams?.["billplz[transaction_id]"]);
  const transactionStatus = readQueryValue(redirect.queryParams?.["billplz[transaction_status]"]);

  if (!billId) {
    return {
      paymentId: checkout.reference,
      accountId: input.accountId,
      unitCode: input.unitCode,
      paidAmount: input.amount,
      paidAmountDisplay: formatCurrency(input.amount),
      paidAtLabel: "-",
      statusLabel: "Failed",
      methodId: input.paymentMethodId,
      outcome: "failed"
    };
  }

  const confirmation = await confirmBillplzPayment({
    billId,
    paid,
    paidAt,
    xSignature,
    transactionId,
    transactionStatus,
  });

  return {
    paymentId: confirmation.paymentReference || confirmation.reference || billId,
    accountId: input.accountId,
    unitCode: input.unitCode,
    paidAmount: input.amount,
    paidAmountDisplay: formatCurrency(input.amount),
    paidAtLabel: confirmation.paidAt || paidAt || "Paid",
    statusLabel: confirmation.outcome === "success" ? "Successful" : "Failed",
    methodId: input.paymentMethodId,
    outcome: confirmation.outcome === "success" ? "success" : "failed"
  };
}

function readQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
