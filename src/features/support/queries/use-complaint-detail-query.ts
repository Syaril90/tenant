import { useQuery } from "@tanstack/react-query";

import { getComplaintDetailContent } from "@/features/support/api/get-complaint-detail";

export function useComplaintDetailQuery(complaintId?: string) {
  return useQuery({
    queryKey: ["support", "complaint-detail", complaintId ?? "none"],
    enabled: Boolean(complaintId),
    queryFn: () => getComplaintDetailContent(complaintId as string)
  });
}
