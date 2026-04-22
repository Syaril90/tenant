export type VisitorPassContent = {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    qrTitle: string;
    visitorName: string;
    purpose: string;
    visitDate: string;
    vehicle: string;
    status: string;
    passCode: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
};

export type VisitorPassRouteParams = {
  visitorId?: string;
  name?: string;
  purpose?: string;
  dateLabel?: string;
  vehicleLabel?: string;
  statusLabel?: string;
};

