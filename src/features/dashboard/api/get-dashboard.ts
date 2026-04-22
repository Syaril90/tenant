import dashboardJson from "@/features/dashboard/data/dashboard.json";
import type { DashboardModel } from "@/features/dashboard/types/dashboard";
import { mockApiResponse } from "@/shared/lib/mock-api";

export async function getDashboard(): Promise<DashboardModel> {
  return mockApiResponse(dashboardJson as DashboardModel, 300);
}

