import documentsJson from "@/features/documents/data/documents.json";
import previewJson from "@/features/documents/data/document-preview.json";
import type {
  DocumentFile,
  DocumentPreviewContent,
  DocumentsModel
} from "@/features/documents/types/documents";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getDocumentPreview(fileId: string): Promise<{
  content: DocumentPreviewContent;
  file: DocumentFile;
}> {
  const data = documentsJson as DocumentsModel;
  const file = data.documents.find((item) => item.id === fileId);

  if (!file) {
    throw new Error(`Unknown document: ${fileId}`);
  }

  return mockApiResponse(
    {
      content: previewJson as DocumentPreviewContent,
      file
    },
    180
  );
}

