import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getDocumentPreview } from "@/features/documents/api/get-document-preview";

export function useDocumentPreviewQuery(fileId: string) {
  return useQuery({
    queryKey: [...queryKeys.documentPreview, fileId],
    queryFn: () => getDocumentPreview(fileId),
    enabled: Boolean(fileId)
  });
}

