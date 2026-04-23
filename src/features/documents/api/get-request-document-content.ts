import requestDocumentJson from "@/features/documents/data/request-document.json";
import type { RequestDocumentContent } from "@/features/documents/types/documents";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getRequestDocumentContent(): Promise<RequestDocumentContent> {
  return mockApiResponse(requestDocumentJson as RequestDocumentContent, 180);
}
