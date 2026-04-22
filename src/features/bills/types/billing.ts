export type BillingHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type BillingSummary = {
  badge: string;
  amountDue: string;
  highlightLabel: string;
  primaryActionLabel: string;
  dueDateLabel: string;
  description: string;
};

export type BillingInvoice = {
  id: string;
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

export type BillingModel = {
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
  invoiceIds: string[];
  paymentMethodId: string;
  amount: number;
};

export type SubmitPaymentResult = {
  paymentId: string;
  paidAmount: number;
  paidAmountDisplay: string;
  paidAtLabel: string;
  statusLabel: string;
  methodId: string;
};
