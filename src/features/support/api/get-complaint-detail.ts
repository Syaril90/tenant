import complaintDetailsJson from "@/features/support/data/complaint-details.json";
import type { ComplaintDetailContent } from "@/features/support/types/support";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getComplaintDetailContent(): Promise<ComplaintDetailContent> {
  return mockApiResponse(complaintDetailsJson as ComplaintDetailContent, 200);
}
