import visitorPassJson from "@/features/visitor/data/visitor-pass.json";
import type { VisitorPassContent } from "@/features/visitor/types/visitor-pass";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getVisitorPassContent(): Promise<VisitorPassContent> {
  return mockApiResponse(visitorPassJson as VisitorPassContent, 150);
}

