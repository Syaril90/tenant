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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function BillingScreen() {
  const { theme } = useAppTheme();
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
        invoiceIds,
        paymentMethodId: selectedMethodId,
        amount
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

  const outstandingInvoices = data.invoices;
  const visibleInvoices =
    activeTab === "outstanding" ? outstandingInvoices : [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120, gap: theme.spacing[6] }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View
            style={{
              backgroundColor: theme.semantic.foreground.brand,
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: theme.spacing[4]
              }}
            >
              <View style={{ flex: 1, gap: theme.spacing[3] }}>
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

                <View style={{ gap: theme.spacing[2] }}>
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
              </View>

              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
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

            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 18,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[3],
                alignItems: "flex-start",
                gap: theme.spacing[1]
              }}
            >
              <ThemedText variant="label" size="sm" color="inverse" style={{ opacity: 0.72 }}>
                PAYMENT WINDOW
              </ThemedText>
              <ThemedText color="inverse">{data.summary.dueDateLabel}</ThemedText>
            </View>

            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              <Pressable
                disabled={!selectedInvoiceIds.length || submitPaymentMutation.isPending}
                onPress={() => handleSubmitPayment(selectedInvoiceIds)}
                style={{
                  flex: 1,
                  backgroundColor: theme.semantic.foreground.inverse,
                  borderRadius: 14,
                  paddingHorizontal: theme.spacing[6],
                  paddingVertical: theme.spacing[4],
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
                  paddingHorizontal: theme.spacing[6],
                  paddingVertical: theme.spacing[4],
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

          <View style={{ gap: theme.spacing[4] }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <ThemedText variant="heading" size="lg">
                {data.labels.activeInvoicesTitle}
              </ThemedText>
              <Pressable
                onPress={() => router.push("/payment-history")}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <ThemedText color="brand">{data.labels.paymentHistoryActionLabel}</ThemedText>
                <Ionicons name="chevron-forward" size={14} color={theme.semantic.foreground.brand} />
              </Pressable>
            </View>

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

          <View style={{ gap: theme.spacing[4] }}>
            <ThemedText variant="heading" size="lg">
              {data.labels.recentActivityTitle}
            </ThemedText>
            <View style={{ gap: theme.spacing[3] }}>
              {data.recentPayments.map((payment) => (
                <SurfaceCard key={payment.id} muted style={{ paddingVertical: theme.spacing[5] }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: theme.spacing[4] }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[4], flex: 1 }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: theme.radius.pill,
                          backgroundColor: "#DDF7EC",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Ionicons name="checkmark-circle-outline" size={20} color={theme.semantic.status.success} />
                      </View>
                      <View style={{ gap: 2, flex: 1 }}>
                        <ThemedText variant="heading" size="md">
                          {payment.title}
                        </ThemedText>
                        <ThemedText color="tertiary">{payment.dateLabel}</ThemedText>
                      </View>
                    </View>

                    <View style={{ alignItems: "flex-end", gap: 2 }}>
                      <ThemedText variant="heading" size="md">
                        {payment.amountDisplay}
                      </ThemedText>
                      <ThemedText style={{ color: theme.semantic.status.success }}>
                        {payment.statusLabel}
                      </ThemedText>
                    </View>
                  </View>
                </SurfaceCard>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
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
  const { theme } = useAppTheme();
  const statusBackground =
    invoice.statusTone === "danger" ? "#CC1F1A" : "#D8E1EA";
  const statusTextColor =
    invoice.statusTone === "danger" ? theme.semantic.foreground.inverse : "#5C7385";
  const buttonBackground =
    invoice.statusTone === "danger" ? theme.semantic.foreground.brand : "#D8E1EA";
  const buttonTextColor =
    invoice.statusTone === "danger" ? theme.semantic.foreground.inverse : theme.semantic.foreground.primary;

  return (
    <SurfaceCard style={{ gap: theme.spacing[5], borderRadius: 26, paddingVertical: theme.spacing[5] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: theme.spacing[4] }}>
        <View style={{ flexDirection: "row", gap: theme.spacing[4], flex: 1 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: theme.radius.md,
              backgroundColor: "#F9EDEC",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons name={invoice.icon as IoniconName} size={20} color="#D7261E" />
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
          disabled={loading}
          onPress={onPay}
          style={{
            backgroundColor: buttonBackground,
            borderRadius: theme.radius.sm,
            paddingHorizontal: theme.spacing[6],
            paddingVertical: theme.spacing[4],
            minWidth: 92,
            alignItems: "center",
            opacity: loading ? 0.7 : 1
          }}
        >
          <ThemedText style={{ color: buttonTextColor }}>
            {loading ? "..." : "Pay Now"}
          </ThemedText>
        </Pressable>
      </View>
    </SurfaceCard>
  );
}
