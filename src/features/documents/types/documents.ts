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
  fileTypeLabel: "PDF" | "DOCX" | "XLSX";
  tone: "danger" | "info" | "success" | "neutral";
  updatedAtLabel: string;
  previewTitle: string;
  previewBody: string;
};

export type DocumentsHelpCard = {
  titleLines: string[];
  description: string;
  primaryActionLabel: string;
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
};

export type DocumentDownloadResult = {
  fileId: string;
  status: "started";
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
