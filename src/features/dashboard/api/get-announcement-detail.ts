import { getAnnouncementDetailFromAPI } from "@/features/dashboard/api/announcements-api";
import announcementDetailsJson from "@/features/dashboard/data/announcement-details.json";
import type { AnnouncementDetailContent } from "@/features/dashboard/types/dashboard";

export async function getAnnouncementDetailContent(
  announcementId: string
): Promise<AnnouncementDetailContent> {
  const baseContent = announcementDetailsJson as AnnouncementDetailContent;
  const item = await getAnnouncementDetailFromAPI(announcementId);

  return {
    ...baseContent,
    items: [item]
  };
}
