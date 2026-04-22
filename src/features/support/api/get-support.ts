import supportJson from "@/features/support/data/support.json";
import type { SupportModel } from "@/features/support/types/support";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getSupport(): Promise<SupportModel> {
  return mockApiResponse(supportJson as SupportModel, 250);
}
