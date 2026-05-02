import * as WebBrowser from "expo-web-browser";

import type {
  DocumentDownloadInput,
  DocumentDownloadResult
} from "@/features/documents/types/documents";
import { getAPIBaseURL } from "@/shared/lib/api-config";

export async function downloadDocumentFile(
  input: DocumentDownloadInput
): Promise<DocumentDownloadResult> {
  let fileURL = input.fileUrl;

  if (!fileURL) {
    const response = await fetch(`${getAPIBaseURL()}/api/v1/documents/${encodeURIComponent(input.fileId)}`);

    if (!response.ok) {
      throw new Error(`Document download request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      item: {
        fileUrl?: string;
      };
    };

    fileURL = payload.item.fileUrl;
  }

  if (!fileURL) {
    throw new Error("Document file URL is unavailable");
  }

  await WebBrowser.openBrowserAsync(fileURL);

  return {
    fileId: input.fileId,
    status: "started"
  };
}
