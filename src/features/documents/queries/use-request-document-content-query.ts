import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getRequestDocumentContent } from "@/features/documents/api/get-request-document-content";

export function useRequestDocumentContentQuery() {
  return useQuery({
    queryKey: queryKeys.requestDocument,
    queryFn: getRequestDocumentContent
  });
}
