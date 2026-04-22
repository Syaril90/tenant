export type PaymentSuccessContent = {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    status: string;
    transactionId: string;
    paidAt: string;
    paymentMethod: string;
    amount: string;
    summaryTitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    receiptCtaLabel: string;
  };
};

export type PaymentRouteParams = {
  amount?: string;
  paymentId?: string;
  paidAt?: string;
  status?: string;
  methodLabel?: string;
};

export type PaymentReceiptContent = {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    receiptNumber: string;
    transactionId: string;
    paidAt: string;
    paymentMethod: string;
    amount: string;
    receiptTitle: string;
    noteTitle: string;
    noteDescription: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
};
