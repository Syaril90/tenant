import dashboardJson from "@/features/dashboard/data/dashboard.json";
import { getAnnouncementItemsFromAPI, mapAnnouncementCards } from "@/features/dashboard/api/announcements-api";
import type { DashboardModel } from "@/features/dashboard/types/dashboard";

export async function getDashboard(): Promise<DashboardModel> {
  const baseDashboard = dashboardJson as DashboardModel;
  const announcementItems = await getAnnouncementItemsFromAPI();

  return {
    ...baseDashboard,
    announcements: {
      ...baseDashboard.announcements,
      items: mapAnnouncementCards(announcementItems)
    }
  };
}
