import type { SubmitComplaintInput } from "@/features/support/types/support";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function submitComplaint(input: SubmitComplaintInput) {
  return mockApiResponse({
    id: `complaint-${Date.now()}`,
    reference: `CMP-${String(Date.now()).slice(-6)}`,
    ...input,
    submittedAt: new Date().toISOString()
  }, 700);
}
