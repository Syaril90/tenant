import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getAnnouncementDetailContent } from "@/features/dashboard/api/get-announcement-detail";

export function useAnnouncementDetailQuery(announcementId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.announcementDetail, announcementId],
    queryFn: () => getAnnouncementDetailContent(announcementId as string),
    enabled: Boolean(announcementId)
  });
}
