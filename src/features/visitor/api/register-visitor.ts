import type {
  RegisterVisitorInput,
  RegisterVisitorResult
} from "@/features/visitor/types/visitor";
import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";

export async function registerVisitor(
  input: RegisterVisitorInput
): Promise<RegisterVisitorResult> {
  const response = await fetch(`${getAPIBaseURL()}/api/v1/visitor-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accountCode: input.accountCode,
      unitCode: input.unitCode,
      visitorName: input.name,
      purpose: input.purpose,
      visitDate: input.dateLabel,
      arrivalWindow: "All Day",
      vehiclePlate: input.vehicleLabel,
      parkingSlotsRequested: 1
    })
  });

  if (!response.ok) {
    throw new Error(`Visitor registration failed with status ${response.status}`);
  }

  const payload = unwrapItem((await response.json()) as {
    id: string;
    visitorName: string;
    purpose: string;
    visitDate: string;
    arrivalWindow: string;
    vehiclePlate: string;
    status: string;
  } | {
    item: {
      id: string;
      visitorName: string;
      purpose: string;
      visitDate: string;
      arrivalWindow: string;
      vehiclePlate: string;
      status: string;
    };
  });

  return {
    id: payload.id,
    name: payload.visitorName,
    purpose: payload.purpose,
    dateLabel: `${formatVisitDate(payload.visitDate)} • ${payload.arrivalWindow}`,
    vehicleLabel: payload.vehiclePlate || "No vehicle",
    statusLabel: payload.status === "approved" ? "Approved" : "Pending approval"
  };
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
