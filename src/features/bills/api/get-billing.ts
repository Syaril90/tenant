import billingJson from "@/features/bills/data/billing.json";
import type { BillingModel } from "@/features/bills/types/billing";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getBilling(): Promise<BillingModel> {
  return mockApiResponse(billingJson as BillingModel, 250);
}

