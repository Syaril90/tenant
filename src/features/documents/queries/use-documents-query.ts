import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getDocuments } from "@/features/documents/api/get-documents";

export function useDocumentsQuery() {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: getDocuments
  });
}

