import type {
  RegisterVisitorInput,
  RegisterVisitorResult
} from "@/features/visitor/types/visitor";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function registerVisitor(
  input: RegisterVisitorInput
): Promise<RegisterVisitorResult> {
  return mockApiResponse(
    {
      id: `visitor-${Date.now()}`,
      name: input.name,
      purpose: input.purpose,
      dateLabel: input.dateLabel,
      vehicleLabel: input.vehicleLabel || "No vehicle",
      statusLabel: "Approved"
    },
    400
  );
}

