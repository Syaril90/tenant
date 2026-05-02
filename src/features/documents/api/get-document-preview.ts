import previewJson from "@/features/documents/data/document-preview.json";
import type {
  DocumentFile,
  DocumentPreviewContent,
} from "@/features/documents/types/documents";
import { getAPIBaseURL } from "@/shared/lib/api-config";

export async function getDocumentPreview(fileId: string): Promise<{
  content: DocumentPreviewContent;
  file: DocumentFile;
}> {
  const response = await fetch(`${getAPIBaseURL()}/api/v1/documents/${encodeURIComponent(fileId)}`);

  if (!response.ok) {
    throw new Error(`Document preview request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { item: DocumentFile };

  return {
    content: previewJson as DocumentPreviewContent,
    file: payload.item
  };
}
