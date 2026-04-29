import type { SubmitComplaintInput, SubmitComplaintResult } from "@/features/support/types/support";
import { submitComplaintToAPI } from "@/features/support/api/complaints-api";

export async function submitComplaint(input: SubmitComplaintInput): Promise<SubmitComplaintResult> {
  return submitComplaintToAPI(input);
}
