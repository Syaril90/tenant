import visitorJson from "@/features/visitor/data/visitor.json";
import type { VisitorActivity, VisitorModel, UpcomingVisitor } from "@/features/visitor/types/visitor";
import { getAPIBaseURL } from "@/shared/lib/api-config";

type VisitorAPIItem = {
  id: string;
  unitCode: string;
  visitorName: string;
  purpose: string;
  visitDate: string;
  arrivalWindow: string;
  vehiclePlate: string;
  status: "pending" | "approved" | "rejected";
  updatedAt: string;
};

type VisitorAPIResponse = {
  items: VisitorAPIItem[];
};

export async function getVisitor(unitCode: string): Promise<VisitorModel> {
  const response = await fetch(`${getAPIBaseURL()}/api/v1/visitor-requests?unitCode=${encodeURIComponent(unitCode)}`);

  if (!response.ok) {
    throw new Error(`Visitor request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as VisitorAPIResponse;
  const content = visitorJson as VisitorModel;
  const items = payload.items;

  return {
    ...content,
    summary: {
      badge: `${items.filter((item) => item.status !== "rejected").length} EXPECTED`,
      title: `Visitor access is active for Unit ${unitCode}.`,
      description: "New visitor registrations are created as pending requests and become approved after management review."
    },
    upcomingVisitors: mapUpcomingVisitors(items),
    recentActivity: mapRecentActivity(items)
  };
}

function mapUpcomingVisitors(items: VisitorAPIItem[]): UpcomingVisitor[] {
  return items
    .filter((item) => item.status !== "rejected")
    .sort((left, right) => left.visitDate.localeCompare(right.visitDate))
    .map((item) => ({
      id: item.id,
      name: item.visitorName,
      purpose: item.purpose,
      dateLabel: `${formatVisitDate(item.visitDate)} • ${item.arrivalWindow}`,
      vehicleLabel: item.vehiclePlate || "No vehicle",
      statusLabel: mapStatusLabel(item.status)
    }));
}

function mapRecentActivity(items: VisitorAPIItem[]): VisitorActivity[] {
  return [...items]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 5)
    .map((item) => ({
      id: `activity-${item.id}`,
      title: mapActivityTitle(item),
      description: mapActivityDescription(item),
      timestampLabel: item.updatedAt
    }));
}

function mapStatusLabel(status: VisitorAPIItem["status"]) {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending approval";
    default:
      return "Rejected";
  }
}

function mapActivityTitle(item: VisitorAPIItem) {
  switch (item.status) {
    case "approved":
      return `${item.visitorName} was approved`;
    case "rejected":
      return `${item.visitorName} was rejected`;
    default:
      return `${item.visitorName} registration received`;
  }
}

function mapActivityDescription(item: VisitorAPIItem) {
  switch (item.status) {
    case "approved":
      return `Management approved the visitor request for ${formatVisitDate(item.visitDate)}.`;
    case "rejected":
      return `Management declined the visitor request for ${formatVisitDate(item.visitDate)}.`;
    default:
      return `The visitor request is waiting for management review and parking validation.`;
  }
}

function formatVisitDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
