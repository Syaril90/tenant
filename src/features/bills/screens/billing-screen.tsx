import type { ComponentProps } from "react";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useBillingQuery } from "@/features/bills/queries/use-billing-query";
import { useSubmitPaymentMutation } from "@/features/bills/queries/use-submit-payment-mutation";
import type { BillingInvoice } from "@/features/bills/types/billing";
import { Screen } from "@/shared/ui/layout/screen";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type BillingTab = "outstanding" | "paid";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR"
  }).format(amount);
}

export function BillingScreen() {
  const { colorScheme, theme } = useAppTheme();
  const billingQuery = useBillingQuery();
  const submitPaymentMutation = useSubmitPaymentMutation();

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [activeTab, setActiveTab] = useState<BillingTab>("outstanding");

  const data = billingQuery.data;

  const initializedInvoiceIds = useMemo(
    () =>
      data?.invoices.filter((invoice) => invoice.selectedByDefault).map((invoice) => invoice.id) ?? [],
    [data?.invoices]
  );

  const initializedMethodId = useMemo(
    () =>
      data?.paymentMethods.find((method) => method.selectedByDefault)?.id ??
      data?.paymentMethods[0]?.id ??
      "",
    [data?.paymentMethods]
  );

  useEffect(() => {
    if (selectedInvoiceIds.length === 0 && initializedInvoiceIds.length > 0) {
      setSelectedInvoiceIds(initializedInvoiceIds);
    }
  }, [initializedInvoiceIds, selectedInvoiceIds.length]);

  useEffect(() => {
    if (!selectedMethodId && initializedMethodId) {
      setSelectedMethodId(initializedMethodId);
    }
  }, [initializedMethodId, selectedMethodId]);

  const subtotalAmount =
    data?.invoices
      .filter((invoice) => selectedInvoiceIds.includes(invoice.id))
      .reduce((total, invoice) => total + invoice.amount, 0) ?? 0;

  const feeAmount = data?.summaryBreakdown.feeAmount ?? 0;
  function handleSubmitPayment(invoiceIds: string[]) {
    if (!data || !invoiceIds.length || !selectedMethodId) {
      return;
    }

    const selectedMethodLabel =
      data.paymentMethods.find((method) => method.id === selectedMethodId)?.typeLabel ?? "-";
    const amount = data.invoices
      .filter((invoice) => invoiceIds.includes(invoice.id))
      .reduce((total, invoice) => total + invoice.amount, 0) + feeAmount;

    submitPaymentMutation.mutate(
      {
        accountId: data.accountId,
        unitCode: data.unitCode,
        chargeIds: invoiceIds,
        paymentMethodId: selectedMethodId,
        amount,
        currency: "MYR"
      },
      {
        onSuccess: (result) => {
          setSelectedInvoiceIds([]);
          router.push({
            pathname: "/payment-success",
            params: {
              amount: result.paidAmountDisplay,
              paymentId: result.paymentId,
              paidAt: result.paidAtLabel,
              status: result.statusLabel,
              methodLabel: selectedMethodLabel
            }
          });
        }
      }
    );
  }

  if (billingQuery.isLoading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing[4] }}>
          <ActivityIndicator size="small" color={theme.semantic.foreground.brand} />
          <ThemedText color="secondary">Loading payment flow...</ThemedText>
        </View>
      </Screen>
    );
  }

  if (billingQuery.isError || !data) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing[4] }}>
          <ThemedText variant="heading" size="lg">
            Billing unavailable
          </ThemedText>
          <ThemedText color="secondary">
            The billing mock request failed. Replace the API adapter when gateway integration starts.
          </ThemedText>
        </View>
      </Screen>
    );
  }

  const outstandingInvoices = data.invoices.filter((invoice) => invoice.statusLabel !== "PAID");
  const paidInvoices = data.invoices.filter((invoice) => invoice.statusLabel === "PAID");
  const visibleInvoices = activeTab === "outstanding" ? outstandingInvoices : paidInvoices;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120, gap: theme.spacing[6] }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View
            style={{
              backgroundColor: theme.semantic.background.emphasis,
              borderRadius: 30,
              padding: theme.spacing[6],
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              gap: theme.spacing[5],
              shadowColor: theme.shadow.floating.shadowColor,
              shadowOpacity: 0.12,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8
            }}
          >
            <View style={{ gap: theme.spacing[3] }}>
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.14)",
                  borderRadius: theme.radius.pill,
                  paddingHorizontal: theme.spacing[4],
                  paddingVertical: 6
                }}
              >
                <ThemedText variant="label" size="sm" color="inverse">
                  {data.summary.badge}
                </ThemedText>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: theme.spacing[4] }}>
                <View style={{ gap: theme.spacing[2], flex: 1 }}>
                  <ThemedText variant="heading" size="md" color="inverse">
                    {data.summary.title}
                  </ThemedText>
                  <ThemedText variant="display" size="large" color="inverse">
                    {data.summary.amountDue}
                  </ThemedText>
                  <ThemedText color="inverse" style={{ opacity: 0.8 }}>
                    {data.summary.description}
                  </ThemedText>
                </View>

                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.14)"
                  }}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={22}
                    color={theme.semantic.foreground.inverse}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.09)",
                borderRadius: 18,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[3],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: theme.spacing[4]
              }}
            >
              <View style={{ gap: 2 }}>
                <ThemedText variant="label" size="sm" color="inverse" style={{ opacity: 0.72 }}>
                  PAYMENT WINDOW
                </ThemedText>
                <ThemedText color="inverse">{data.summary.dueDateLabel}</ThemedText>
              </View>
              <Ionicons name="time-outline" size={18} color={theme.semantic.foreground.inverse} />
            </View>

            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              <Pressable
                disabled={!selectedInvoiceIds.length || submitPaymentMutation.isPending}
                onPress={() => handleSubmitPayment(selectedInvoiceIds)}
                style={{
                  flex: 1,
                  backgroundColor: theme.semantic.background.surface,
                  borderRadius: 14,
                  paddingVertical: theme.spacing[4],
                  paddingHorizontal: theme.spacing[6],
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: theme.spacing[2],
                  opacity: !selectedInvoiceIds.length || submitPaymentMutation.isPending ? 0.6 : 1
                }}
              >
                <Ionicons
                  name="card-outline"
                  size={16}
                  color={theme.semantic.foreground.brand}
                />
                <ThemedText color="brand">
                  {submitPaymentMutation.isPending ? "Processing..." : data.summary.primaryActionLabel}
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => router.push("/payment-history")}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.22)",
                  paddingVertical: theme.spacing[4],
                  paddingHorizontal: theme.spacing[6],
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: theme.spacing[2]
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.semantic.foreground.inverse}
                />
                <ThemedText color="inverse">{data.labels.paymentHistoryActionLabel}</ThemedText>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              backgroundColor: theme.semantic.background.muted,
              borderRadius: theme.radius.lg,
              padding: 6,
              flexDirection: "row",
              gap: theme.spacing[2]
            }}
          >
            <SegmentButton
              label={data.labels.outstandingTabLabel}
              active={activeTab === "outstanding"}
              onPress={() => setActiveTab("outstanding")}
            />
            <SegmentButton
              label={data.labels.paidTabLabel}
              active={activeTab === "paid"}
              onPress={() => setActiveTab("paid")}
            />
          </View>

          {activeTab === "outstanding" ? (
            <View style={{ gap: theme.spacing[4] }}>
              <ThemedText variant="heading" size="lg">
                {data.labels.activeInvoicesTitle}
              </ThemedText>

              <View style={{ gap: theme.spacing[4] }}>
                {visibleInvoices.length ? (
                  visibleInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      loading={submitPaymentMutation.isPending}
                      onPay={() => handleSubmitPayment([invoice.id])}
                    />
                  ))
                ) : (
                  <SurfaceCard muted elevated={false}>
                    <ThemedText color="secondary">{data.labels.allPaidDueDateLabel}</ThemedText>
                  </SurfaceCard>
                )}
              </View>
            </View>
          ) : (
            <PaidActivitySection />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function PaidActivitySection() {
  const { colorScheme, theme } = useAppTheme();
  const billingQuery = useBillingQuery();
  const data = billingQuery.data;

  if (!data) {
    return null;
  }

  return (
    <View style={{ gap: theme.spacing[5] }}>
      <View style={{ gap: theme.spacing[4] }}>
        <ThemedText variant="heading" size="lg">
          {data.labels.recentActivityTitle}
        </ThemedText>

        <View style={{ gap: theme.spacing[3] }}>
          {data.recentPayments.map((payment, index) => (
            <SurfaceCard
              key={payment.id}
              style={{
                gap: theme.spacing[4],
                borderRadius: 24,
                paddingVertical: theme.spacing[5]
              }}
            >
              <View style={{ flexDirection: "row", gap: theme.spacing[4] }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing[4], flex: 1 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor:
                        colorScheme === "dark" ? "#143126" : "#DDF7EC",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color={theme.semantic.status.success}
                    />
                  </View>

                  <View style={{ gap: 4, flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: theme.spacing[3]
                      }}
                    >
                      <ThemedText variant="heading" size="md" style={{ flex: 1 }}>
                        {payment.title}
                      </ThemedText>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor:
                            colorScheme === "dark" ? "#143126" : "#ECF9F1",
                          borderRadius: theme.radius.pill,
                          paddingHorizontal: theme.spacing[2],
                          paddingVertical: 2
                        }}
                      >
                        <ThemedText
                          variant="label"
                          size="sm"
                          style={{ color: theme.semantic.status.success }}
                        >
                          {payment.statusLabel}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText color="tertiary">{payment.dateLabel}</ThemedText>
                    <ThemedText
                      color="secondary"
                      style={{ fontSize: 13, lineHeight: 18 }}
                    >
                      Reference {String(index + 1).padStart(2, "0")} • Posted to resident ledger
                    </ThemedText>
                    <ThemedText variant="heading" size="md">
                      {payment.amountDisplay}
                    </ThemedText>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <ThemedText variant="label" size="sm" color="brand">
                        Receipt
                      </ThemedText>
                      <Ionicons
                        name="receipt-outline"
                        size={14}
                        color={theme.semantic.foreground.brand}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </SurfaceCard>
          ))}
        </View>
      </View>
    </View>
  );
}

function SegmentButton({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: theme.radius.md,
        backgroundColor: active ? theme.semantic.background.surface : "transparent",
        paddingVertical: theme.spacing[4],
        alignItems: "center"
      }}
    >
      <ThemedText color={active ? "brand" : "secondary"}>{label}</ThemedText>
    </Pressable>
  );
}

function InvoiceCard({
  invoice,
  loading,
  onPay
}: {
  invoice: BillingInvoice;
  loading: boolean;
  onPay: () => void;
}) {
  const { colorScheme, theme } = useAppTheme();
  const statusBackground =
    invoice.statusTone === "danger"
      ? colorScheme === "dark"
        ? "#5B2624"
        : "#CC1F1A"
      : colorScheme === "dark"
        ? theme.semantic.background.muted
        : "#D8E1EA";
  const statusTextColor =
    invoice.statusTone === "danger"
      ? theme.semantic.foreground.inverse
      : colorScheme === "dark"
        ? theme.semantic.foreground.secondary
        : "#5C7385";
  const buttonBackground =
    invoice.statusTone === "danger"
      ? theme.semantic.foreground.brand
      : colorScheme === "dark"
        ? theme.semantic.background.muted
        : "#D8E1EA";
  const buttonTextColor =
    invoice.statusTone === "danger" ? theme.semantic.foreground.inverse : theme.semantic.foreground.primary;
  const canPay = invoice.statusLabel !== "PAID";

  return (
    <SurfaceCard style={{ gap: theme.spacing[5], borderRadius: 26, paddingVertical: theme.spacing[5] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing[4] }}>
        <View style={{ flexDirection: "row", gap: theme.spacing[4], flex: 1 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: theme.radius.md,
              backgroundColor:
                invoice.statusTone === "danger"
                  ? colorScheme === "dark"
                    ? "#3A2323"
                    : "#F9EDEC"
                  : theme.semantic.background.accent,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons
              name={invoice.icon as IoniconName}
              size={20}
              color={
                invoice.statusTone === "danger"
                  ? colorScheme === "dark"
                    ? theme.semantic.status.danger
                    : "#D7261E"
                  : theme.semantic.foreground.brand
              }
            />
          </View>

          <View style={{ gap: 2, flex: 1 }}>
            <ThemedText variant="heading" size="md">
              {invoice.title}
            </ThemedText>
            <ThemedText color="tertiary">
              {invoice.periodLabel} • {invoice.invoiceLabel}
            </ThemedText>
          </View>
        </View>

        <View
          style={{
            borderRadius: theme.radius.pill,
            backgroundColor: statusBackground,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[2]
          }}
        >
          <ThemedText variant="label" size="sm" style={{ color: statusTextColor }}>
            {invoice.statusLabel}
          </ThemedText>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: theme.spacing[4] }}>
        <View style={{ gap: theme.spacing[1], flex: 1 }}>
          <ThemedText variant="label" size="sm" color="tertiary">
            {invoice.dueLabel.toUpperCase()}
          </ThemedText>
          <ThemedText variant="heading" size="lg">
            {invoice.displayAmount}
          </ThemedText>
        </View>

        <Pressable
          disabled={loading || !canPay}
          onPress={onPay}
          style={{
            backgroundColor: buttonBackground,
            borderRadius: theme.radius.sm,
            paddingHorizontal: theme.spacing[6],
            paddingVertical: theme.spacing[4],
            minWidth: 92,
            alignItems: "center",
            opacity: loading || !canPay ? 0.7 : 1
          }}
        >
          <ThemedText style={{ color: buttonTextColor }}>
            {loading ? "..." : canPay ? "Pay Now" : "Paid"}
          </ThemedText>
        </Pressable>
      </View>
    </SurfaceCard>
  );
}
