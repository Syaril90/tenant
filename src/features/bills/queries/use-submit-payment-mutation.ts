import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { submitPayment } from "@/features/bills/api/submit-payment";
import { buildPaymentHistoryContent } from "@/features/bills/data/billing-adapters";
import type {
  BillingModel,
  PaymentHistoryContent,
  SubmitPaymentInput
} from "@/features/bills/types/billing";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR"
  }).format(amount);
}

export function useSubmitPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPayment,
    onSuccess: (result, variables: SubmitPaymentInput) => {
      queryClient.setQueryData<BillingModel>(queryKeys.bills, (current) => {
        if (!current) {
          return current;
        }

        const remainingInvoices = current.invoices.filter(
          () => true
        );

        const remainingAmount = Math.max(
          remainingInvoices
            .filter((invoice) => !variables.chargeIds.includes(invoice.id))
            .reduce((total, invoice) => total + invoice.amount, 0),
          0
        );

        return {
          ...current,
          summary: {
            ...current.summary,
            amountDue: formatCurrency(remainingAmount),
            badge:
              remainingAmount > 0 ? current.summary.badge : current.labels.allPaidBadge,
            dueDateLabel:
              remainingAmount > 0
                ? current.summary.dueDateLabel
                : current.labels.allPaidDueDateLabel,
            description:
              remainingAmount > 0
                ? current.summary.description
                : current.labels.emptyChargesDescription
          },
          invoices: current.invoices.map((invoice) =>
            variables.chargeIds.includes(invoice.id)
              ? {
                  ...invoice,
                  statusLabel: "PAID",
                  statusTone: "neutral",
                  selectedByDefault: false,
                }
              : invoice
          ),
          recentPayments: [
            {
              id: result.paymentId,
              title: current.labels.mockPaymentTitle,
              dateLabel: result.paidAtLabel,
              amountDisplay: result.paidAmountDisplay,
              statusLabel: result.statusLabel
            },
            ...current.recentPayments
          ]
        };
      });

      queryClient.setQueryData<PaymentHistoryContent>(queryKeys.paymentHistory, (current) => {
        const nextPayment = {
          id: result.paymentId,
          title: current?.payments[0]?.title ?? "Resident Payment",
          category: current?.payments[0]?.category ?? "Management",
          paidAtLabel: result.paidAtLabel,
          amountDisplay: result.paidAmountDisplay,
          statusLabel: result.statusLabel,
          statusTone: "success" as const,
          methodLabel:
            current?.payments.find((payment) => payment.methodLabel)?.methodLabel ?? "Online Payment",
          referenceLabel: result.paymentId
        };

        if (!current) {
          return {
            ...buildPaymentHistoryContent(result.unitCode),
            payments: [nextPayment, ...buildPaymentHistoryContent(result.unitCode).payments]
          };
        }

        return {
          ...current,
          summaryCards: current.summaryCards.map((card) =>
            card.id === "year-to-date"
              ? { ...card, value: formatCurrency(parseCurrencyValue(card.value) + result.paidAmount) }
              : card.id === "successful-payments"
                ? { ...card, value: `${Number(card.value) + 1}` }
                : card
          ),
          payments: [nextPayment, ...current.payments]
        };
      });
    }
  });
}

function parseCurrencyValue(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const amount = Number.parseFloat(normalized);
  return Number.isNaN(amount) ? 0 : amount;
}
