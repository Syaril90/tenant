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
              padding: theme.spacing[4],
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              gap: theme.spacing[3],
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
                <View style={{ gap: theme.spacing[2] }}>
                  <View
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "rgba(255,255,255,0.14)",
                      borderRadius: theme.radius.pill,
                      paddingHorizontal: theme.spacing[3],
                      paddingVertical: 5
                    }}
                  >
                    <ThemedText variant="label" size="sm" color="inverse">
                      {data.summary.badge}
                    </ThemedText>
                  </View>
                  <ThemedText variant="display" size="large" color="inverse">
                    {data.summary.amountDue}
                  </ThemedText>
                  <ThemedText variant="heading" size="md" color="inverse">
                    {data.summary.title}
                  </ThemedText>
                  <ThemedText color="inverse" style={{ opacity: 0.78 }}>
                    {data.summary.dueDateLabel}
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
                  size={20}
                  color={theme.semantic.foreground.inverse}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              <Pressable
                disabled={!selectedInvoiceIds.length || submitPaymentMutation.isPending}
                onPress={() => handleSubmitPayment(selectedInvoiceIds)}
                style={{
                  flex: 1,
                  backgroundColor: theme.semantic.foreground.inverse,
                  borderRadius: 14,
                  paddingHorizontal: theme.spacing[5],
                  paddingVertical: 14,
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
                  paddingHorizontal: theme.spacing[5],
                  paddingVertical: 14,
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
  const { theme } = useAppTheme();
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
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[4] }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing[4], flex: 1 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: "#DDF7EC",
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
                    <View style={{ gap: theme.spacing[2] }}>
                      <ThemedText variant="heading" size="md">
                        {payment.title}
                      </ThemedText>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor: "#ECF9F1",
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
                    <ThemedText color="secondary">
                      Reference {String(index + 1).padStart(2, "0")} • Posted to resident ledger
                    </ThemedText>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <ThemedText variant="heading" size="md">
                    {payment.amountDisplay}
                  </ThemedText>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <ThemedText variant="label" size="sm" color="brand">
                      Receipt
                    </ThemedText>
                    <Ionicons name="receipt-outline" size={14} color={theme.semantic.foreground.brand} />
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
