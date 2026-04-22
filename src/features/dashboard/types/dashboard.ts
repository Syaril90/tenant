export type DashboardHeader = {
  eyebrow: string;
  titleLines: string[];
  description: string;
};

export type DashboardBalanceCard = {
  badge: string;
  title: string;
  amount: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  icon: string;
};

export type DashboardStatusCard = {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
};

export type DashboardWeatherCard = {
  temperature: string;
  condition: string;
  icon: string;
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
  statusCard: DashboardStatusCard;
  weatherCard: DashboardWeatherCard;
  quickActions: DashboardQuickActionsSection;
  announcements: DashboardAnnouncementsSection;
};
