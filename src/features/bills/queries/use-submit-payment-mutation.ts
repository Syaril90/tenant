import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { submitPayment } from "@/features/bills/api/submit-payment";
import type {
  BillingModel,
  SubmitPaymentInput
} from "@/features/bills/types/billing";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
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
          (invoice) => !variables.invoiceIds.includes(invoice.id)
        );

        const remainingAmount = Math.max(
          remainingInvoices.reduce((total, invoice) => total + invoice.amount, 0),
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
          invoices: remainingInvoices,
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
    }
  });
}
