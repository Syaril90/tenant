import { getComplaintDetailFromAPI } from "@/features/support/api/complaints-api";
import type { ComplaintDetailContent } from "@/features/support/types/support";

export async function getComplaintDetailContent(
  complaintId: string
): Promise<ComplaintDetailContent> {
  return getComplaintDetailFromAPI(complaintId);
}
