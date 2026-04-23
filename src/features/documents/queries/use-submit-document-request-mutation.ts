import { useMutation } from "@tanstack/react-query";

import { submitDocumentRequest } from "@/features/documents/api/submit-document-request";

export function useSubmitDocumentRequestMutation() {
  return useMutation({
    mutationFn: submitDocumentRequest
  });
}
