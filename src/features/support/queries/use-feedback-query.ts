import { useQuery } from "@tanstack/react-query";

import { getFeedback } from "@/features/support/api/get-feedback";

export function useFeedbackQuery() {
  return useQuery({
    queryKey: ["support", "feedback"],
    queryFn: getFeedback
  });
}
