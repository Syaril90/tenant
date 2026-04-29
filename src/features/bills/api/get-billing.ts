import { getBillingFromAPI } from "@/features/bills/api/billing-api";
import type { BillingModel } from "@/features/bills/types/billing";

export async function getBilling(unitCode: string): Promise<BillingModel> {
  return getBillingFromAPI(unitCode);
}
