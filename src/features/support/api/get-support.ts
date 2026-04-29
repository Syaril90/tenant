import { getSupportFromAPI } from "@/features/support/api/complaints-api";
import type { SupportModel } from "@/features/support/types/support";

export async function getSupport(unitCode?: string | null): Promise<SupportModel> {
  return getSupportFromAPI(unitCode);
}
