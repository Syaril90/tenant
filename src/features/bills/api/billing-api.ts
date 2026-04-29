import { getAPIBaseURL } from "@/shared/lib/api-config";
import { unwrapItem } from "@/shared/lib/api-response";
import type {
  BillingInvoice,
  BillingModel,
  BillingRecentPayment,
  PaymentHistoryContent,
  PaymentHistoryItem
} from "@/features/bills/types/billing";

type ResidentBillingAPICharge = {
  id: number;
  reference: string;
  billingType: string;
  category: string;
  periodLabel: string;
  amount: number;
  dueDate: string;
  status: string;
  description: string;
};

type ResidentBillingAPIPayment = {
  id: number;
  reference: string;
  amount: number;
  paidAt: string;
  methodLabel: string;
  status: string;
  description: string;
};

type ResidentBillingAPIResponse = {
  accountCode: string;
  unitCode: string;
  buildingName: string;
  residentCode: string;
  residentName: string;
  outstanding: number;
  charges: ResidentBillingAPICharge[];
  recentPayments: ResidentBillingAPIPayment[];
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR"
  }).format(amount);
}

function formatDueLabel(dueDate: string) {
  return `Due ${new Date(dueDate).toLocaleDateString("en-MY", { day: "2-digit", month: "short" })}`;
}

function invoiceTone(status: string): "danger" | "neutral" {
  return status === "paid" ? "neutral" : "danger";
}

function invoiceLabel(status: string) {
  return status.toUpperCase();
}

function paymentStatusLabel(status: string) {
  return status === "successful" ? "SUCCESS" : status.replace(/_/g, " ").toUpperCase();
}

function paymentHistoryStatus(
  status: string
): { label: string; tone: "success" | "warning" | "neutral" } {
  if (status === "successful") {
    return { label: "Successful", tone: "success" };
  }

  if (status === "pending_review") {
    return { label: "Pending Review", tone: "warning" };
  }

  return { label: status.replace(/_/g, " "), tone: "neutral" };
}

function buildInvoices(payload: ResidentBillingAPIResponse): BillingInvoice[] {
  return payload.charges.map((charge) => ({
    id: String(charge.id),
    accountId: payload.accountCode,
    unitCode: payload.unitCode,
    buildingName: payload.buildingName,
    billingType: charge.billingType,
    title: charge.billingType,
    periodLabel: charge.periodLabel,
    invoiceLabel: charge.reference,
    dueLabel: formatDueLabel(charge.dueDate),
    amount: charge.amount,
    displayAmount: formatCurrency(charge.amount),
    statusLabel: invoiceLabel(charge.status),
    statusTone: invoiceTone(charge.status),
    icon: charge.category === "Utility" ? "water-outline" : "wallet-outline",
    selectedByDefault: charge.status !== "paid"
  }));
}

function buildRecentPayments(payments: ResidentBillingAPIPayment[]): BillingRecentPayment[] {
  return payments.map((payment) => ({
    id: String(payment.id),
    title: payment.description,
    dateLabel: payment.paidAt,
    amountDisplay: formatCurrency(payment.amount),
    statusLabel: paymentStatusLabel(payment.status)
  }));
}

function buildPaymentHistoryItems(
  payload: ResidentBillingAPIResponse
): PaymentHistoryItem[] {
  return payload.recentPayments.map((payment) => {
    const status = paymentHistoryStatus(payment.status);

    return {
      id: String(payment.id),
      title: payment.description,
      category: payload.buildingName,
      paidAtLabel: payment.paidAt,
      amountDisplay: formatCurrency(payment.amount),
      statusLabel: status.label,
      statusTone: status.tone,
      methodLabel: payment.methodLabel,
      referenceLabel: payment.reference
    };
  });
}

export async function fetchResidentBilling(unitCode: string): Promise<ResidentBillingAPIResponse> {
  const baseURL = getAPIBaseURL();
  const response = await fetch(`${baseURL}/api/v1/billing/resident/${encodeURIComponent(unitCode)}`);

  if (!response.ok) {
    throw new Error(`Billing request failed with status ${response.status}`);
  }

  return unwrapItem((await response.json()) as ResidentBillingAPIResponse | { item: ResidentBillingAPIResponse });
}

export async function getBillingFromAPI(unitCode: string): Promise<BillingModel> {
  const payload = await fetchResidentBilling(unitCode);
  const invoices = buildInvoices(payload);
  const outstandingInvoices = invoices.filter((invoice) => invoice.statusLabel !== "PAID");
  const earliestDue = payload.charges
    .filter((charge) => charge.status !== "paid")
    .map((charge) => charge.dueDate)
    .sort()[0];
  const overdueCount = payload.charges.filter((charge) => charge.status === "overdue").length;

  return {
    accountId: payload.accountCode,
    unitCode: payload.unitCode,
    buildingName: payload.buildingName,
    residentName: payload.residentName,
    header: {
      eyebrow: "PAYMENTS",
      title: "Settle Your Balance",
      description: `Review maintenance-related charges for ${payload.unitCode}, choose a payment method, and complete payment from the resident app.`
    },
    summary: {
      badge: payload.outstanding > 0 ? "TOTAL OUTSTANDING" : "ALL PAID",
      title: "Outstanding Balance",
      amountDue: formatCurrency(payload.outstanding),
      highlightLabel: overdueCount > 0 ? `${overdueCount} Overdue Bills` : "No overdue bills",
      primaryActionLabel: "Pay Selected",
      dueDateLabel: earliestDue
        ? `Due on ${new Date(earliestDue).toLocaleDateString("en-MY", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}`
        : "No outstanding charges",
      description:
        payload.outstanding > 0
          ? `Charges for ${payload.buildingName} • ${payload.unitCode} are ready for payment.`
          : "Your account is settled. New charges will appear here when management bills the unit."
    },
    invoices,
    paymentMethods: [
      { id: "fpx-cimb", typeLabel: "FPX via CIMB", metaLabel: "Online banking", selectedByDefault: true },
      { id: "duitnow-qr", typeLabel: "DuitNow QR", metaLabel: "Instant transfer", selectedByDefault: false },
      { id: "visa-card", typeLabel: "Visa / Mastercard", metaLabel: "Debit or credit card", selectedByDefault: false }
    ],
    summaryBreakdown: {
      subtotalLabel: "Selected charges",
      feeLabel: "Processing fee",
      feeAmount: 0,
      feeDisplayAmount: formatCurrency(0),
      totalLabel: "Amount to pay"
    },
    labels: {
      openCharges: "OPEN CHARGES",
      paymentMethod: "PAYMENT METHOD",
      paymentSummary: "PAYMENT SUMMARY",
      recentPayments: "RECENT PAYMENTS",
      activeInvoicesTitle: "Active Invoices",
      recentActivityTitle: "Recent Activity",
      outstandingTabLabel: "Outstanding",
      paidTabLabel: "Paid",
      paymentHistoryActionLabel: "Payment history",
      mockPaymentTitle: "Resident Payment Completed",
      allPaidBadge: "ALL PAID",
      allPaidDueDateLabel: "No outstanding charges",
      emptyChargesTitle: "No open charges",
      emptyChargesDescription: "Your account is settled. New charges will appear here when billed."
    },
    cta: {
      primaryLabel: "Pay Now",
      secondaryLabel: "View Statement"
    },
    recentPayments: buildRecentPayments(payload.recentPayments)
  };
}

export async function getPaymentHistoryFromAPI(unitCode: string): Promise<PaymentHistoryContent> {
  const payload = await fetchResidentBilling(unitCode);
  const payments = buildPaymentHistoryItems(payload);
  const successfulCount = payments.filter((payment) => payment.statusTone === "success").length;
  const pendingCount = payments.filter((payment) => payment.statusTone === "warning").length;
  const ytdAmount = payload.recentPayments
    .filter((payment) => payment.status === "successful")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    header: {
      eyebrow: "PAYMENT LEDGER",
      title: "Review every transaction",
      description: `Track completed charges, pending payments, and payment methods for ${payload.unitCode} from one billing history timeline.`
    },
    searchPlaceholder: "Search by payment title, method, or reference",
    filters: [
      { id: "all", label: "All" },
      { id: "success", label: "Successful" },
      { id: "warning", label: "Pending" }
    ],
    summaryCards: [
      { id: "year-to-date", label: "Year to date", value: formatCurrency(ytdAmount), tone: "brand" },
      { id: "successful-payments", label: "Successful payments", value: `${successfulCount}`, tone: "success" },
      { id: "pending-review", label: "Pending review", value: `${pendingCount}`, tone: "neutral" }
    ],
    payments,
    emptyState: {
      title: "No matching payments",
      description: "Adjust the search term or switch the filter to see more payment records."
    },
    messages: {
      loading: "Loading payment history...",
      errorTitle: "Payment history unavailable",
      errorDescription: "The resident payment history feed could not be loaded."
    }
  };
}
