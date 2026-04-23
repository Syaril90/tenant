export type SupportHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type SupportSummary = {
  badge: string;
  title: string;
  description: string;
};

export type SupportAction = {
  id: string;
  title: string;
  icon: string;
};

export type SupportShortcutTone = "brand" | "highlight" | "accent";
export type SupportShortcut = SupportAction & {
  description: string;
  tone: SupportShortcutTone;
};
export type SupportActionsSection = {
  title: string;
  items: SupportAction[];
};

export type SupportShortcutSection = {
  title: string;
  items: SupportShortcut[];
};

export type SupportUpdateVariant = "alert" | "featured" | "compact";
export type SupportUpdateTagTone = "urgent" | "neutral";
export type SupportUpdateFooterType = "avatars" | "date";

export type SupportUpdate = {
  id: string;
  variant: SupportUpdateVariant;
  tag: string;
  tagTone: SupportUpdateTagTone;
  metaLabel?: string;
  title: string;
  description: string;
  imageUrl?: string;
  footerType?: SupportUpdateFooterType;
  footerLabel?: string;
  actionLabel?: string;
};

export type SupportUpdatesSection = {
  title: string;
  viewAllLabel: string;
  items: SupportUpdate[];
};

export type SupportCaseTone = "warning" | "success" | "neutral";
export type SupportCase = {
  id: string;
  title: string;
  category: string;
  statusLabel: string;
  statusTone: SupportCaseTone;
  updatedAtLabel: string;
  referenceLabel: string;
};

export type SupportCaseSection = {
  title: string;
  viewAllLabel: string;
  items: SupportCase[];
};

export type SupportChannel = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  icon: string;
};

export type SupportChannelSection = {
  title: string;
  items: SupportChannel[];
};

export type SupportMessages = {
  loading: string;
  errorTitle: string;
  errorDescription: string;
};

export type SupportModel = {
  header: SupportHeader;
  actions: SupportActionsSection;
  shortcuts: SupportShortcutSection;
  cases: SupportCaseSection;
  updates: SupportUpdatesSection;
  messages: SupportMessages;
};

export type FeedbackHeader = {
  eyebrow: string;
  titleLines: string[];
  description: string;
};

export type FeedbackOption = {
  id: string;
  label: string;
};

export type FeedbackRatingOption = {
  id: string;
  label: string;
  icon: string;
};

export type FeedbackFieldSection = {
  title: string;
};

export type FeedbackUploadCard = {
  title: string;
  description: string;
  buttonLabel: string;
};

export type FeedbackAttachment = {
  id: string;
  name: string;
  sizeLabel: string;
  mimeType: string;
};

export type FeedbackCta = {
  submitLabel: string;
  helperText: string;
};

export type FeedbackModel = {
  header: FeedbackHeader;
  typeSection: FeedbackFieldSection & {
    options: FeedbackOption[];
  };
  ratingSection: FeedbackFieldSection & {
    options: FeedbackRatingOption[];
  };
  detailsSection: FeedbackFieldSection & {
    placeholder: string;
    characterLimit: number;
  };
  uploadSection: FeedbackUploadCard;
  cta: FeedbackCta;
  messages: {
    loading: string;
    errorTitle: string;
    errorDescription: string;
    successTitle: string;
    successDescription: string;
  };
};

export type SubmitFeedbackInput = {
  typeId: string;
  ratingId: string;
  details: string;
  attachments: FeedbackAttachment[];
};

export type ComplaintHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ComplaintCategoryOption = {
  id: string;
  label: string;
};

export type ComplaintPriorityOption = {
  id: string;
  label: string;
};

export type ComplaintFieldLabels = {
  category: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  attachments: string;
};

export type ComplaintPlaceholders = {
  category: string;
  title: string;
  description: string;
  location: string;
};

export type ComplaintUploadCard = {
  title: string;
  description: string;
  helperText: string;
  buttonLabel: string;
};

export type ComplaintCta = {
  submitLabel: string;
};

export type ComplaintModel = {
  header: ComplaintHeader;
  fieldLabels: ComplaintFieldLabels;
  placeholders: ComplaintPlaceholders;
  categories: ComplaintCategoryOption[];
  priorities: ComplaintPriorityOption[];
  uploadCard: ComplaintUploadCard;
  cta: ComplaintCta;
  messages: {
    loading: string;
    errorTitle: string;
    errorDescription: string;
    successDescription: string;
  };
};

export type SubmitComplaintInput = {
  categoryId: string;
  title: string;
  description: string;
  location: string;
  priorityId: string;
  attachments: FeedbackAttachment[];
};

export type ComplaintDetailStatusTone = "warning" | "success" | "neutral";

export type ComplaintDetailTimelineItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isCurrent?: boolean;
};

export type ComplaintDetailAttachment = {
  id: string;
  title: string;
  meta: string;
  type: "image" | "video" | "document";
};

export type ComplaintDetailPreview = {
  id: string;
  imageUrl: string;
};

export type ComplaintDetailItem = {
  id: string;
  eyebrow: string;
  title: string;
  category: string;
  statusLabel: string;
  statusTone: ComplaintDetailStatusTone;
  reference: string;
  location: string;
  submittedAt: string;
  updatedAt: string;
  priorityLabel: string;
  assignedTeam: string;
  reportDateLabel: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  summaryTitle: string;
  summaryBody: string;
  previews: ComplaintDetailPreview[];
  addMoreLabel: string;
  timelineTitle: string;
  timeline: ComplaintDetailTimelineItem[];
  attachmentsTitle: string;
  attachments: ComplaintDetailAttachment[];
  conciergeTitle: string;
  conciergeMessage: string;
  conciergeManagerName: string;
  conciergeManagerRole: string;
  helpTitle: string;
  helpBody: string;
  helpActionLabel: string;
};

export type ComplaintDetailLabels = {
  loading: string;
  errorTitle: string;
  errorDescription: string;
  notFoundTitle: string;
  notFoundDescription: string;
  backToSupportLabel: string;
};

export type ComplaintDetailContent = {
  labels: ComplaintDetailLabels;
  items: ComplaintDetailItem[];
};
