import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { registerVisitor } from "@/features/visitor/api/register-visitor";
import type {
  RegisterVisitorInput,
  VisitorModel
} from "@/features/visitor/types/visitor";

export function useRegisterVisitorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerVisitor,
    onSuccess: (result, _variables: RegisterVisitorInput) => {
      queryClient.setQueryData<VisitorModel>(queryKeys.visitor, (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          summary: {
            ...current.summary,
            badge: `${current.upcomingVisitors.length + 1} EXPECTED`
          },
          upcomingVisitors: [result, ...current.upcomingVisitors]
        };
      });
    }
  });
}
