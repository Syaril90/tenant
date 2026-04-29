export type BillingHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type BillingSummary = {
  badge: string;
  title: string;
  amountDue: string;
  highlightLabel: string;
  primaryActionLabel: string;
  dueDateLabel: string;
  description: string;
};

export type BillingInvoice = {
  id: string;
  accountId: string;
  unitCode: string;
  buildingName: string;
  billingType: string;
  title: string;
  periodLabel: string;
  invoiceLabel: string;
  dueLabel: string;
  amount: number;
  displayAmount: string;
  statusLabel: string;
  statusTone: "danger" | "neutral";
  icon: string;
  selectedByDefault: boolean;
};

export type BillingPaymentMethod = {
  id: string;
  typeLabel: string;
  metaLabel: string;
  selectedByDefault: boolean;
};

export type BillingSummaryBreakdown = {
  subtotalLabel: string;
  feeLabel: string;
  feeAmount: number;
  feeDisplayAmount: string;
  totalLabel: string;
};

export type BillingLabels = {
  openCharges: string;
  paymentMethod: string;
  paymentSummary: string;
  recentPayments: string;
  activeInvoicesTitle: string;
  recentActivityTitle: string;
  outstandingTabLabel: string;
  paidTabLabel: string;
  paymentHistoryActionLabel: string;
  mockPaymentTitle: string;
  allPaidBadge: string;
  allPaidDueDateLabel: string;
  emptyChargesTitle: string;
  emptyChargesDescription: string;
};

export type BillingCta = {
  primaryLabel: string;
  secondaryLabel: string;
};

export type BillingRecentPayment = {
  id: string;
  title: string;
  dateLabel: string;
  amountDisplay: string;
  statusLabel: string;
};

export type PaymentHistoryFilter = {
  id: string;
  label: string;
};

export type PaymentHistorySummaryCard = {
  id: string;
  label: string;
  value: string;
  tone: "brand" | "success" | "neutral";
};

export type PaymentHistoryItem = {
  id: string;
  title: string;
  category: string;
  paidAtLabel: string;
  amountDisplay: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "neutral";
  methodLabel: string;
  referenceLabel: string;
};

export type PaymentHistoryContent = {
  header: BillingHeader;
  searchPlaceholder: string;
  filters: PaymentHistoryFilter[];
  summaryCards: PaymentHistorySummaryCard[];
  payments: PaymentHistoryItem[];
  emptyState: {
    title: string;
    description: string;
  };
  messages: {
    loading: string;
    errorTitle: string;
    errorDescription: string;
  };
};

export type BillingModel = {
  accountId: string;
  unitCode: string;
  buildingName: string;
  residentName: string;
  header: BillingHeader;
  summary: BillingSummary;
  invoices: BillingInvoice[];
  paymentMethods: BillingPaymentMethod[];
  summaryBreakdown: BillingSummaryBreakdown;
  labels: BillingLabels;
  cta: BillingCta;
  recentPayments: BillingRecentPayment[];
};

export type SubmitPaymentInput = {
  accountId: string;
  unitCode: string;
  chargeIds: string[];
  paymentMethodId: string;
  amount: number;
  currency: "MYR";
};

export type SubmitPaymentResult = {
  paymentId: string;
  accountId: string;
  unitCode: string;
  paidAmount: number;
  paidAmountDisplay: string;
  paidAtLabel: string;
  statusLabel: string;
  methodId: string;
};
