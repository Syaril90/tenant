import documentsJson from "@/features/documents/data/documents.json";
import type { DocumentsModel } from "@/features/documents/types/documents";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getDocuments(): Promise<DocumentsModel> {
  return mockApiResponse(documentsJson as DocumentsModel, 220);
}

