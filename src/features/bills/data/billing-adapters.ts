import {
  getSharedBillingAccount,
  sharedPaymentMethods,
  type SharedBillingAccount,
} from "./property-domain";
import type {
  BillingInvoice,
  BillingModel,
  PaymentHistoryContent,
  PaymentHistoryItem,
} from "@/features/bills/types/billing";

const defaultUnitCode = "A-12-08";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
}

function successfulPayments(account: SharedBillingAccount) {
  return account.payments.filter((payment) => payment.status === "successful");
}

function paidChargeIds(account: SharedBillingAccount) {
  return new Set(successfulPayments(account).flatMap((payment) => payment.chargeIds));
}

function invoiceStatusTone(isPaid: boolean) {
  return isPaid ? "neutral" : "danger";
}

function invoiceStatusLabel(account: SharedBillingAccount, chargeId: string, isPaid: boolean) {
  if (isPaid) {
    return "PAID";
  }

  const charge = account.charges.find((item) => item.id === chargeId);
  if (charge && new Date(`${charge.dueDate}T23:59:59`).getTime() < Date.now()) {
    return "OVERDUE";
  }

  return "UNPAID";
}

function buildInvoices(account: SharedBillingAccount): BillingInvoice[] {
  const paidIds = paidChargeIds(account);

  return account.charges.map((charge) => {
    const isPaid = paidIds.has(charge.id);

    return {
      id: charge.id,
      accountId: account.accountId,
      unitCode: account.unitCode,
      buildingName: account.buildingName,
      billingType: charge.billingType,
      title: charge.billingType,
      periodLabel: charge.periodLabel,
      invoiceLabel: charge.reference,
      dueLabel: `Due ${new Date(charge.dueDate).toLocaleDateString("en-MY", { day: "2-digit", month: "short" })}`,
      amount: charge.amount,
      displayAmount: formatCurrency(charge.amount),
      statusLabel: invoiceStatusLabel(account, charge.id, isPaid),
      statusTone: invoiceStatusTone(isPaid),
      icon: charge.icon,
      selectedByDefault: !isPaid,
    };
  });
}

function buildRecentPayments(account: SharedBillingAccount) {
  return successfulPayments(account)
    .slice()
    .sort((left, right) => new Date(right.paidAt).getTime() - new Date(left.paidAt).getTime())
    .map((payment) => ({
      id: payment.id,
      title: payment.chargeIds
        .map((chargeId) => account.charges.find((charge) => charge.id === chargeId)?.billingType)
        .filter(Boolean)
        .join(" + "),
      dateLabel: payment.paidAt,
      amountDisplay: formatCurrency(payment.amount),
      statusLabel: payment.status === "successful" ? "SUCCESS" : "PENDING REVIEW",
    }));
}

export function buildBillingModel(unitCode = defaultUnitCode): BillingModel {
  const account = getSharedBillingAccount(unitCode);

  if (!account) {
    throw new Error(`Missing shared billing account for unit ${unitCode}`);
  }

  const invoices = buildInvoices(account);
  const outstandingInvoices = invoices.filter((invoice) => invoice.statusLabel !== "PAID");
  const amountDue = outstandingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueCount = outstandingInvoices.filter((invoice) => invoice.statusLabel === "OVERDUE").length;
  const earliestDue = outstandingInvoices
    .map((invoice) => account.charges.find((charge) => charge.id === invoice.id)?.dueDate)
    .filter((value): value is string => Boolean(value))
    .sort()[0];

  return {
    accountId: account.accountId,
    unitCode: account.unitCode,
    buildingName: account.buildingName,
    residentName: account.residentName,
    header: {
      eyebrow: "PAYMENTS",
      title: "Settle Your Balance",
      description: `Review maintenance-related charges for ${account.unitCode}, choose a payment method, and complete payment from the resident app.`,
    },
    summary: {
      badge: amountDue > 0 ? "TOTAL OUTSTANDING" : "ALL PAID",
      title: "Outstanding Balance",
      amountDue: formatCurrency(amountDue),
      highlightLabel: overdueCount > 0 ? `${overdueCount} Overdue Bills` : "No overdue bills",
      primaryActionLabel: "Pay Selected",
      dueDateLabel: earliestDue
        ? `Due on ${new Date(earliestDue).toLocaleDateString("en-MY", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`
        : "No outstanding charges",
      description:
        amountDue > 0
          ? `Charges for ${account.buildingName} • ${account.unitCode} are ready for payment.`
          : "Your account is settled. New charges will appear here when management bills the unit.",
    },
    invoices,
    paymentMethods: sharedPaymentMethods.map((method) => ({
      id: method.id,
      typeLabel: method.typeLabel,
      metaLabel: method.metaLabel,
      selectedByDefault: Boolean(method.selectedByDefault),
    })),
    summaryBreakdown: {
      subtotalLabel: "Selected charges",
      feeLabel: "Processing fee",
      feeAmount: 0,
      feeDisplayAmount: formatCurrency(0),
      totalLabel: "Amount to pay",
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
      emptyChargesDescription: "Your account is settled. New charges will appear here when billed.",
    },
    cta: {
      primaryLabel: "Pay Now",
      secondaryLabel: "View Statement",
    },
    recentPayments: buildRecentPayments(account),
  };
}

function buildPaymentHistoryItems(account: SharedBillingAccount): PaymentHistoryItem[] {
  return account.payments
    .slice()
    .sort((left, right) => new Date(right.paidAt).getTime() - new Date(left.paidAt).getTime())
    .map((payment) => ({
      id: payment.id,
      title: payment.chargeIds
        .map((chargeId) => account.charges.find((charge) => charge.id === chargeId)?.billingType)
        .filter(Boolean)
        .join(" + "),
      category: account.buildingName,
      paidAtLabel: payment.paidAt,
      amountDisplay: formatCurrency(payment.amount),
      statusLabel: payment.status === "successful" ? "Successful" : "Pending Review",
      statusTone: payment.status === "successful" ? "success" : "warning",
      methodLabel: payment.methodLabel,
      referenceLabel: payment.reference,
    }));
}

export function buildPaymentHistoryContent(unitCode = defaultUnitCode): PaymentHistoryContent {
  const account = getSharedBillingAccount(unitCode);

  if (!account) {
    throw new Error(`Missing shared billing account for unit ${unitCode}`);
  }

  const payments = buildPaymentHistoryItems(account);
  const ytdAmount = successfulPayments(account).reduce((sum, payment) => sum + payment.amount, 0);

  return {
    header: {
      eyebrow: "PAYMENT LEDGER",
      title: "Review every transaction",
      description: `Track completed charges, pending payments, and payment methods for ${account.unitCode} from one billing history timeline.`,
    },
    searchPlaceholder: "Search by payment title, method, or reference",
    filters: [
      { id: "all", label: "All" },
      { id: "success", label: "Successful" },
      { id: "warning", label: "Pending" },
    ],
    summaryCards: [
      {
        id: "year-to-date",
        label: "Year to date",
        value: formatCurrency(ytdAmount),
        tone: "brand",
      },
      {
        id: "successful-payments",
        label: "Successful payments",
        value: `${payments.filter((payment) => payment.statusTone === "success").length}`,
        tone: "success",
      },
      {
        id: "pending-review",
        label: "Pending review",
        value: `${payments.filter((payment) => payment.statusTone === "warning").length}`,
        tone: "neutral",
      },
    ],
    payments,
    emptyState: {
      title: "No matching payments",
      description: "Adjust the search term or switch the filter to see more payment records.",
    },
    messages: {
      loading: "Loading payment history...",
      errorTitle: "Payment history unavailable",
      errorDescription: "The mocked payment history feed could not be loaded.",
    },
  };
}
