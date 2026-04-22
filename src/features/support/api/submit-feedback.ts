import type { SubmitFeedbackInput } from "@/features/support/types/support";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function submitFeedback(input: SubmitFeedbackInput) {
  return mockApiResponse({
    id: `feedback-${Date.now()}`,
    ...input,
    submittedAt: new Date().toISOString()
  }, 600);
}
