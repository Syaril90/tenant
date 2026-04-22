import { useQuery } from "@tanstack/react-query";

import { getComplaintForm } from "@/features/support/api/get-complaint-form";

export function useComplaintFormQuery() {
  return useQuery({
    queryKey: ["support", "complaint-form"],
    queryFn: getComplaintForm
  });
}
