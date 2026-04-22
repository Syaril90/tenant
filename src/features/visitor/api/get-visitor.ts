import visitorJson from "@/features/visitor/data/visitor.json";
import type { VisitorModel } from "@/features/visitor/types/visitor";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getVisitor(): Promise<VisitorModel> {
  return mockApiResponse(visitorJson as VisitorModel, 220);
}

