import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getDocuments } from "@/features/documents/api/get-documents";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";

export function useDocumentsQuery() {
  const { selectedTenant } = useTenant();

  return useQuery({
    queryKey: [...queryKeys.documents, selectedTenant?.unitNumber ?? ""],
    queryFn: () => getDocuments(selectedTenant?.unitNumber ?? ""),
    enabled: Boolean(selectedTenant?.unitNumber)
  });
}
