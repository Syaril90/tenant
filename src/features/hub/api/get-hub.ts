import hubJson from "@/features/hub/data/hub.json";
import type { HubModel } from "@/features/hub/types/hub";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getHub(): Promise<HubModel> {
  return mockApiResponse(hubJson as HubModel, 220);
}
