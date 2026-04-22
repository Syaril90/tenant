import { useQuery } from "@tanstack/react-query";

import { getVisitorPassContent } from "@/features/visitor/api/get-visitor-pass-content";

export function useVisitorPassContentQuery() {
  return useQuery({
    queryKey: ["visitor-pass-content"],
    queryFn: getVisitorPassContent
  });
}

