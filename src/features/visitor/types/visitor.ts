export type VisitorHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type VisitorSummary = {
  badge: string;
  title: string;
  description: string;
};

export type VisitorFormContent = {
  title: string;
  fields: {
    nameLabel: string;
    purposeLabel: string;
    dateLabel: string;
    vehicleLabel: string;
    namePlaceholder: string;
    purposePlaceholder: string;
    datePlaceholder: string;
    vehiclePlaceholder: string;
    datePickerTitle: string;
    datePickerCancelLabel: string;
  };
  submitLabel: string;
};

export type VisitorSections = {
  upcomingLabel: string;
  historyLabel: string;
  generatePassLabel: string;
};

export type UpcomingVisitor = {
  id: string;
  name: string;
  purpose: string;
  dateLabel: string;
  vehicleLabel: string;
  statusLabel: string;
};

export type VisitorActivity = {
  id: string;
  title: string;
  description: string;
  timestampLabel: string;
};

export type VisitorMessages = {
  loading: string;
  errorTitle: string;
  errorDescription: string;
  successPrefix: string;
  successSuffix: string;
};

export type VisitorModel = {
  header: VisitorHeader;
  summary: VisitorSummary;
  form: VisitorFormContent;
  sections: VisitorSections;
  upcomingVisitors: UpcomingVisitor[];
  recentActivity: VisitorActivity[];
  messages: VisitorMessages;
};

export type RegisterVisitorInput = {
  accountCode: string;
  unitCode: string;
  name: string;
  purpose: string;
  dateLabel: string;
  vehicleLabel: string;
};

export type RegisterVisitorResult = UpcomingVisitor;
