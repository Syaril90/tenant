import { buildBillingModel } from "@/features/bills/data/billing-adapters";
import type { BillingModel } from "@/features/bills/types/billing";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getBilling(): Promise<BillingModel> {
  return mockApiResponse(buildBillingModel(), 250);
}
