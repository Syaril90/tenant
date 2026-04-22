import { useMutation } from "@tanstack/react-query";

import { downloadDocumentFile } from "@/features/documents/api/download-document-file";

export function useDownloadDocumentMutation() {
  return useMutation({
    mutationFn: downloadDocumentFile
  });
}

