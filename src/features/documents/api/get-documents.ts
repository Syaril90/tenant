import documentsJson from "@/features/documents/data/documents.json";
import type { DocumentsModel } from "@/features/documents/types/documents";
import { getAPIBaseURL } from "@/shared/lib/api-config";

type DocumentsAPIResponse = Pick<DocumentsModel, "categories"> & {
  items: DocumentsModel["documents"];
};

export async function getDocuments(unitCode: string): Promise<DocumentsModel> {
  const response = await fetch(
    `${getAPIBaseURL()}/api/v1/documents?unitCode=${encodeURIComponent(unitCode)}`
  );

  if (!response.ok) {
    throw new Error(`Documents request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as DocumentsAPIResponse;
  const chrome = documentsJson as DocumentsModel;

  return {
    ...chrome,
    categories: payload.categories,
    documents: payload.items
  };
}
