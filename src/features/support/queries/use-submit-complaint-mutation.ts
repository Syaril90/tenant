import { useMutation } from "@tanstack/react-query";

import { submitComplaint } from "@/features/support/api/submit-complaint";

export function useSubmitComplaintMutation() {
  return useMutation({
    mutationFn: submitComplaint
  });
}
