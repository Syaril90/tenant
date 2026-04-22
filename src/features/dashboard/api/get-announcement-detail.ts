import announcementDetailsJson from "@/features/dashboard/data/announcement-details.json";
import type { AnnouncementDetailContent } from "@/features/dashboard/types/dashboard";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getAnnouncementDetailContent(): Promise<AnnouncementDetailContent> {
  return mockApiResponse(announcementDetailsJson as AnnouncementDetailContent, 180);
}
