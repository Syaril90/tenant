export type DashboardHeader = {
  eyebrow: string;
  titleLines: string[];
  description: string;
  pillLabel: string;
};

export type DashboardBalanceCard = {
  badge: string;
  title: string;
  amount: string;
  dueDateLabel: string;
  supportingLabel: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  icon: string;
};

export type DashboardContactCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
  accentColor: string;
};

export type DashboardContactSection = {
  items: DashboardContactCard[];
};

export type DashboardQuickAction = {
  id: string;
  titleLines: string[];
  icon: string;
};

export type DashboardQuickActionsSection = {
  eyebrow: string;
  items: DashboardQuickAction[];
};

export type DashboardAnnouncement = {
  id: string;
  badge: string;
  badgeTone: "danger" | "brand";
  title: string;
  description: string;
  publishedAt: string;
  icon: string;
  accentColor: string;
  imageUri: string;
};

export type DashboardAnnouncementsSection = {
  eyebrow: string;
  actionLabel: string;
  items: DashboardAnnouncement[];
};

export type AnnouncementDetail = DashboardAnnouncement & {
  publishedAt: string;
  affectedArea: string;
  schedule: string;
  contact: string;
  summaryTitle: string;
  summaryParagraphs: string[];
  highlightedAreaTitle: string;
  highlightedAreaItems: string[];
  timelineTitle: string;
  timelineParagraphs: string[];
  etaLabel: string;
  etaValue: string;
  teamLabel: string;
  teamValue: string;
  attachments: {
    id: string;
    title: string;
    meta: string;
    type: "pdf" | "image";
  }[];
  supportTitle: string;
  supportDescription: string;
  imageUri: string;
};

export type AnnouncementDetailContent = {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    category: string;
    publishedAt: string;
    affectedArea: string;
    schedule: string;
    contact: string;
    attachmentsTitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  items: AnnouncementDetail[];
};

export type DashboardModel = {
  header: DashboardHeader;
  balanceCard: DashboardBalanceCard;
  contacts: DashboardContactSection;
  quickActions: DashboardQuickActionsSection;
  announcements: DashboardAnnouncementsSection;
};
