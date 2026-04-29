import { useMutation, useQueryClient } from "@tanstack/react-query";

import { submitComplaint } from "@/features/support/api/submit-complaint";

export function useSubmitComplaintMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitComplaint,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support", variables.unitCode]
      });
    }
  });
}
