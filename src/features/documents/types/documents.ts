export type DocumentsHeader = {
  eyebrow: string;
  titleLines: string[];
  description: string;
};

export type DocumentCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured: boolean;
};

export type DocumentRepository = {
  title: string;
  viewAllLabel: string;
  tableHeaders: {
    fileName: string;
    actions: string;
  };
};

export type DocumentFile = {
  id: string;
  title: string;
  sizeLabel: string;
  description: string;
  categoryId: string;
  categoryLabel: string;
  fileTypeLabel: "PDF" | "DOCX" | "XLSX" | "JPG" | "PNG";
  tone: "danger" | "info" | "success" | "neutral";
  updatedAtLabel: string;
  previewTitle: string;
  previewBody: string;
  fileUrl?: string;
};

export type DocumentsHelpCard = {
  titleLines: string[];
  description: string;
  primaryActionLabel: string;
};

export type RequestDocumentOption = {
  id: string;
  label: string;
  description?: string;
};

export type RequestDocumentUploadCard = {
  title: string;
  description: string;
  buttonLabel: string;
};

export type RequestDocumentContent = {
  header: DocumentsHeader;
  typeField: {
    label: string;
    placeholder: string;
    options: RequestDocumentOption[];
  };
  purposeField: {
    label: string;
    placeholder: string;
  };
  preferredFormatField: {
    label: string;
    placeholder: string;
    options: RequestDocumentOption[];
  };
  notesField: {
    label: string;
    placeholder: string;
  };
  uploadField: {
    label: string;
  } & RequestDocumentUploadCard;
  timelineCard: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cta: {
    submitLabel: string;
    helperText: string;
  };
  messages: {
    loading: string;
    errorTitle: string;
    errorDescription: string;
    successTitle: string;
    successDescription: string;
  };
};

export type DocumentsModel = {
  header: DocumentsHeader;
  searchPlaceholder: string;
  categories: DocumentCategory[];
  repository: DocumentRepository;
  documents: DocumentFile[];
  helpCard: DocumentsHelpCard;
};

export type DocumentDownloadInput = {
  fileId: string;
  fileUrl?: string;
};

export type DocumentDownloadResult = {
  fileId: string;
  status: "started";
};

export type SubmitDocumentRequestInput = {
  typeId: string;
  purpose: string;
  preferredFormatId: string;
  notes: string;
  attachments: {
    id: string;
    name: string;
    sizeLabel: string;
    mimeType: string;
  }[];
};

export type SubmitDocumentRequestResult = {
  requestId: string;
  submittedAtLabel: string;
};

export type DocumentPreviewContent = {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    fileType: string;
    fileSize: string;
    fileCategory: string;
    fileUpdatedAt: string;
    fileSummary: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
};
