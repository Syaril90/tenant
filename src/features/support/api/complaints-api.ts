import supportJson from "@/features/support/data/support.json";
import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";
import type {
  ComplaintDetailAttachment,
  ComplaintDetailContent,
  ComplaintDetailItem,
  SubmitComplaintResult,
  SupportCase,
  SupportModel,
  SubmitComplaintInput
} from "@/features/support/types/support";

type ComplaintAPIItem = {
  id: string;
  reference: string;
  residentName: string;
  residentCode: string;
  buildingName: string;
  unitCode: string;
  category: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: "received" | "in_progress" | "done";
  submittedAt: string;
  updatedAt: string;
  latestUpdate: string;
  assignedTeam: string;
  attachments: Array<{
    id: string;
    title: string;
    meta: string;
    type: "image" | "video" | "document";
    fileUrl?: string;
  }>;
  previews: Array<{
    id: string;
    imageUrl: string;
  }>;
  timeline: ComplaintDetailItem["timeline"];
};

type ComplaintAPIListResponse = {
  items: ComplaintAPIItem[];
};

function statusLabel(status: ComplaintAPIItem["status"]) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return "Received";
  }
}

function statusTone(status: ComplaintAPIItem["status"]): SupportCase["statusTone"] {
  return status === "done" ? "success" : "warning";
}

function updatedAtLabel(item: ComplaintAPIItem) {
  return item.status === "done" ? `Completed ${item.updatedAt}` : `Updated ${item.updatedAt}`;
}

function mapAttachment(
  attachment: ComplaintAPIItem["attachments"][number]
): ComplaintDetailAttachment {
  return {
    id: attachment.id,
    title: attachment.title,
    meta: attachment.meta,
    type: attachment.type,
    fileUrl: attachment.fileUrl
  };
}

function mapDetailItem(item: ComplaintAPIItem): ComplaintDetailItem {
  return {
    id: item.id,
    eyebrow: `${item.buildingName.toUpperCase()} • ${item.unitCode}`,
    title: item.title,
    category: item.category,
    statusLabel: statusLabel(item.status),
    statusTone: statusTone(item.status),
    reference: item.reference,
    location: item.location,
    submittedAt: item.submittedAt,
    updatedAt: item.updatedAt,
    priorityLabel: `${item.priority} Priority`,
    assignedTeam: item.assignedTeam,
    reportDateLabel: `Submitted ${item.submittedAt}`,
    primaryActionLabel: "Track Status",
    secondaryActionLabel: "Back to Cases",
    summaryTitle: "Complaint Summary",
    summaryBody: item.description,
    previews: item.previews,
    addMoreLabel: "Resident uploads",
    timelineTitle: "STATUS TIMELINE",
    timeline: item.timeline,
    attachmentsTitle: "ATTACHMENTS",
    attachments: item.attachments.map(mapAttachment),
    conciergeTitle: "MANAGEMENT NOTES",
    conciergeMessage: item.latestUpdate,
    conciergeManagerName: "Management Office",
    conciergeManagerRole: "Building Support Team",
    helpTitle: "NEED HELP?",
    helpBody: "Contact the management office if you need to add more details or follow up on this complaint.",
    helpActionLabel: "Contact Management"
  };
}

export async function fetchComplaints(unitCode?: string | null): Promise<ComplaintAPIItem[]> {
  const baseURL = getAPIBaseURL();
  const url = new URL(`${baseURL}/api/v1/resident-complaints`);
  if (unitCode) {
    url.searchParams.set("unitCode", unitCode);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Complaint request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ComplaintAPIListResponse;
  return payload.items;
}

export async function getSupportFromAPI(unitCode?: string | null): Promise<SupportModel> {
  const fallback = supportJson as SupportModel;
  if (!unitCode) {
    return {
      ...fallback,
      cases: {
        ...fallback.cases,
        items: []
      }
    };
  }

  const items = await fetchComplaints(unitCode);

  return {
    ...fallback,
    cases: {
      ...fallback.cases,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        statusLabel: statusLabel(item.status),
        statusTone: statusTone(item.status),
        updatedAtLabel: updatedAtLabel(item),
        referenceLabel: item.reference
      }))
    }
  };
}

export async function getComplaintDetailFromAPI(
  complaintId: string
): Promise<ComplaintDetailContent> {
  const baseURL = getAPIBaseURL();
  const response = await fetch(`${baseURL}/api/v1/resident-complaints/${encodeURIComponent(complaintId)}`);
  if (!response.ok) {
    throw new Error(`Complaint detail request failed with status ${response.status}`);
  }

  const payload = unwrapItem((await response.json()) as ComplaintAPIItem | { item: ComplaintAPIItem });

  return {
    labels: {
      loading: "Loading complaint details...",
      errorTitle: "Complaint details unavailable",
      errorDescription: "The complaint detail request could not be loaded.",
      notFoundTitle: "Complaint not found",
      notFoundDescription: "The selected complaint could not be found.",
      backToSupportLabel: "Back to support"
    },
    items: [mapDetailItem(payload)]
  };
}

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

export async function submitComplaintToAPI(input: SubmitComplaintInput): Promise<SubmitComplaintResult> {
  const baseURL = getAPIBaseURL();
  const formData = new FormData();

  formData.append("accountCode", input.accountId);
  formData.append("unitCode", input.unitCode);
  formData.append("category", input.categoryId);
  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("location", input.location);
  formData.append("priority", input.priorityId);

  for (const attachment of input.attachments) {
    if (!attachment.uri) {
      continue;
    }

    const file: ReactNativeFile = {
      uri: attachment.uri,
      name: attachment.name,
      type: attachment.mimeType || "application/octet-stream"
    };
    formData.append("attachments", file as never);
  }

  const response = await fetch(`${baseURL}/api/v1/resident-complaints`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error(`Complaint submit failed with status ${response.status}`);
  }

  return unwrapItem((await response.json()) as ComplaintAPIItem | { item: ComplaintAPIItem });
}
