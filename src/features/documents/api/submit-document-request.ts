import type {
  SubmitDocumentRequestInput,
  SubmitDocumentRequestResult
} from "@/features/documents/types/documents";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function submitDocumentRequest(
  _input: SubmitDocumentRequestInput
): Promise<SubmitDocumentRequestResult> {
  return mockApiResponse(
    {
      requestId: `doc-request-${Date.now()}`,
      submittedAtLabel: "Just now"
    },
    500
  );
}
