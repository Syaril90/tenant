import type {
  DocumentDownloadInput,
  DocumentDownloadResult
} from "@/features/documents/types/documents";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function downloadDocumentFile(
  input: DocumentDownloadInput
): Promise<DocumentDownloadResult> {
  return mockApiResponse(
    {
      fileId: input.fileId,
      status: "started"
    },
    450
  );
}

