import { useMutation } from "@tanstack/react-query";

import { submitFeedback } from "@/features/support/api/submit-feedback";

export function useSubmitFeedbackMutation() {
  return useMutation({
    mutationFn: submitFeedback
  });
}
