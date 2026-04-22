import { useQuery } from "@tanstack/react-query";

import { getComplaintDetailContent } from "@/features/support/api/get-complaint-detail";

export function useComplaintDetailQuery() {
  return useQuery({
    queryKey: ["support", "complaint-detail"],
    queryFn: getComplaintDetailContent
  });
}
