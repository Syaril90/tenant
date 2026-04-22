import feedbackJson from "@/features/support/data/feedback.json";
import type { FeedbackModel } from "@/features/support/types/support";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getFeedback(): Promise<FeedbackModel> {
  return mockApiResponse(feedbackJson as FeedbackModel, 250);
}
