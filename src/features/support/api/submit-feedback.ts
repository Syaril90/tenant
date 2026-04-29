import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";
import type {
  FeedbackAttachment,
  SubmitFeedbackInput,
  SubmitFeedbackResult
} from "@/features/support/types/support";

type ReactNativeFile = {
  uri: string;
  name: string;
  type: string;
};

type FeedbackAPIResponse = {
  id: string;
  accountCode: string;
  residentCode: string;
  residentName: string;
  buildingName: string;
  unitCode: string;
  type: string;
  rating: string;
  details: string;
  status: "submitted";
  submittedAt: string;
  updatedAt: string;
  attachments: Array<{
    id: string;
    title: string;
    meta: string;
    type: string;
    fileUrl?: string;
  }>;
};

export async function submitFeedback(
  input: SubmitFeedbackInput
): Promise<SubmitFeedbackResult> {
  const baseURL = getAPIBaseURL();
  const formData = new FormData();

  if (input.accountCode) {
    formData.append("accountCode", input.accountCode);
  }
  if (input.unitCode) {
    formData.append("unitCode", input.unitCode);
  }
  formData.append("type", input.typeId);
  formData.append("rating", input.ratingId);
  formData.append("details", input.details);

  for (const attachment of input.attachments) {
    appendAttachment(formData, attachment);
  }

  const response = await fetch(`${baseURL}/api/v1/resident-feedback`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Feedback submit failed with status ${response.status}`);
  }

  const payload = unwrapItem((await response.json()) as FeedbackAPIResponse | { item: FeedbackAPIResponse });

  return {
    id: payload.id,
    accountCode: payload.accountCode,
    residentCode: payload.residentCode,
    residentName: payload.residentName,
    buildingName: payload.buildingName,
    unitCode: payload.unitCode,
    type: payload.type,
    rating: payload.rating,
    details: payload.details,
    status: payload.status,
    submittedAt: payload.submittedAt,
    updatedAt: payload.updatedAt,
    attachments: payload.attachments.map(mapAttachment)
  };
}

function appendAttachment(formData: FormData, attachment: FeedbackAttachment) {
  if (!attachment.uri) {
    return
  }

  const file: ReactNativeFile = {
    uri: attachment.uri,
    name: attachment.name,
    type: attachment.mimeType || "application/octet-stream"
  }
  formData.append("attachments", file as never)
}

function mapAttachment(attachment: FeedbackAPIResponse["attachments"][number]): FeedbackAttachment {
  return {
    id: attachment.id,
    uri: attachment.fileUrl,
    name: attachment.title,
    sizeLabel: attachment.meta,
    mimeType: attachment.type
  };
}
