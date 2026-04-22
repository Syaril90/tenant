import complaintJson from "@/features/support/data/complaint.json";
import type { ComplaintModel } from "@/features/support/types/support";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getComplaintForm(): Promise<ComplaintModel> {
  return mockApiResponse(complaintJson as ComplaintModel, 250);
}
