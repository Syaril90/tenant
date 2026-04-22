import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { getAnnouncementDetailContent } from "@/features/dashboard/api/get-announcement-detail";

export function useAnnouncementDetailQuery() {
  return useQuery({
    queryKey: queryKeys.announcementDetail,
    queryFn: getAnnouncementDetailContent
  });
}
