import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";
import type {
  AnnouncementDetail,
  DashboardAnnouncement
} from "@/features/dashboard/types/dashboard";

type AnnouncementAPIItem = AnnouncementDetail;

type AnnouncementListResponse = {
  items: AnnouncementAPIItem[];
};

export async function getAnnouncementItemsFromAPI(): Promise<AnnouncementAPIItem[]> {
  const response = await fetch(`${getAPIBaseURL()}/api/v1/announcements`);

  if (!response.ok) {
    throw new Error(`Announcement list request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AnnouncementListResponse;
  return payload.items;
}

export async function getAnnouncementDetailFromAPI(
  announcementId: string
): Promise<AnnouncementDetail> {
  const response = await fetch(
    `${getAPIBaseURL()}/api/v1/announcements/${encodeURIComponent(announcementId)}`
  );

  if (!response.ok) {
    throw new Error(`Announcement detail request failed with status ${response.status}`);
  }

  return unwrapItem((await response.json()) as AnnouncementDetail | { item: AnnouncementDetail });
}

export function mapAnnouncementCards(items: AnnouncementAPIItem[]): DashboardAnnouncement[] {
  return items.map((item) => ({
    id: item.id,
    badge: item.badge,
    badgeTone: item.badgeTone,
    title: item.title,
    description: item.description,
    publishedAt: item.publishedAt,
    icon: item.icon,
    accentColor: item.accentColor,
    imageUri: item.imageUri
  }));
}
