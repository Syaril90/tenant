import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";

import { buildPaymentHistoryContent } from "@/features/bills/data/billing-adapters";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { usePaymentHistoryContentQuery } from "@/features/bills/queries/use-payment-history-content-query";
import type { PaymentHistoryContent, PaymentHistoryItem } from "@/features/bills/types/billing";
import { DocumentSearchInput } from "@/features/documents/components/document-search-input";
import { SupportSegmentedTabs } from "@/features/support/components/support-segmented-tabs";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

const toneStyles = {
  brand: {
    backgroundColor: "#E8F1FF",
    foregroundColor: "#1F5EFF"
  },
  success: {
    backgroundColor: "#ECF9F1",
    foregroundColor: "#1B7A46"
  },
  neutral: {
    backgroundColor: "#F2F5F9",
    foregroundColor: "#5E6C7B"
  }
} as const;

const statusStyles = {
  success: {
    backgroundColor: "#ECF9F1",
    foregroundColor: "#1B7A46"
  },
  warning: {
    backgroundColor: "#FFF4E8",
    foregroundColor: "#B85E00"
  },
  neutral: {
    backgroundColor: "#EDF2F7",
    foregroundColor: "#51606D"
  }
} as const;

export function PaymentHistoryScreen() {
  const { colorScheme, theme } = useAppTheme();
  const { unitCode: unitCodeParam } = useLocalSearchParams<{ unitCode?: string }>();
  const { selectedTenant } = useTenant();
  const unitCode = typeof unitCodeParam === "string" ? unitCodeParam : selectedTenant?.unitNumber ?? null;
  const paymentHistoryQuery = usePaymentHistoryContentQuery(unitCode);
  const [query, setQuery] = useState("");
  const [activeFilterId, setActiveFilterId] = useState("all");
  const fallbackContent = buildPaymentHistoryContent(selectedTenant?.unitNumber) as PaymentHistoryContent;

  const filteredPayments = useMemo(() => {
    const payments = paymentHistoryQuery.data?.payments ?? [];
    const normalizedQuery = query.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesFilter = activeFilterId === "all" ? true : payment.statusTone === activeFilterId;
      const matchesQuery = normalizedQuery
        ? [payment.title, payment.category, payment.methodLabel, payment.referenceLabel]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesFilter && matchesQuery;
    });
  }, [activeFilterId, paymentHistoryQuery.data?.payments, query]);

  useFocusEffect(() => {
    if (unitCode) {
      paymentHistoryQuery.refetch().catch(() => {});
    }
  });

  if (paymentHistoryQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackContent.messages.loading} />
      </Screen>
    );
  }

  if (paymentHistoryQuery.isError || !paymentHistoryQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={fallbackContent.messages.errorTitle}
          description={fallbackContent.messages.errorDescription}
        />
      </Screen>
    );
  }

  const { header, filters, searchPlaceholder, summaryCards, emptyState } = paymentHistoryQuery.data;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          {selectedTenant ? (
            <SurfaceCard style={{ gap: theme.spacing[3] }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: theme.spacing[3]
                }}
              >
                <View style={{ flex: 1, gap: theme.spacing[1] }}>
                  <ThemedText variant="label" size="sm" color="tertiary">
                    TENANT LEDGER
                  </ThemedText>
                  <ThemedText variant="heading" size="md">
                    {selectedTenant.propertyName} • {selectedTenant.unitNumber}
                  </ThemedText>
                </View>
                <PressableSwitchTenant onPress={() => router.push("/select-tenant")} />
              </View>
            </SurfaceCard>
          ) : null}

          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {header.title}
            </ThemedText>
            <ThemedText color="secondary">{header.description}</ThemedText>
          </View>

          <View style={{ gap: theme.spacing[3] }}>
            {summaryCards[0] ? (
              <PaymentHistorySummaryCard card={summaryCards[0]} featured />
            ) : null}

            {summaryCards.length > 1 ? (
              <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
                {summaryCards.slice(1).map((card) => (
                  <PaymentHistorySummaryCard key={card.id} card={card} />
                ))}
              </View>
            ) : null}
          </View>

          <DocumentSearchInput
            value={query}
            placeholder={searchPlaceholder}
            onChangeText={setQuery}
          />

          <SupportSegmentedTabs
            tabs={filters}
            activeTabId={activeFilterId}
            onChange={setActiveFilterId}
          />

          {filteredPayments.length ? (
            <View style={{ gap: theme.spacing[3] }}>
              {filteredPayments.map((payment) => (
                <PaymentHistoryCard key={payment.id} payment={payment} />
              ))}
            </View>
          ) : (
            <SurfaceCard>
              <View style={{ gap: theme.spacing[2] }}>
                <ThemedText variant="heading" size="md">
                  {emptyState.title}
                </ThemedText>
                <ThemedText color="secondary">{emptyState.description}</ThemedText>
              </View>
            </SurfaceCard>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function PressableSwitchTenant({ onPress }: { onPress: () => void }) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.semantic.background.muted,
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2]
      }}
    >
      <ThemedText
        variant="label"
        size="sm"
        color="brand"
        style={{
          lineHeight: 16
        }}
      >
        Switch Tenant
      </ThemedText>
    </Pressable>
  );
}

function PaymentHistorySummaryCard({
  card,
  featured = false
}: {
  card: PaymentHistoryContent["summaryCards"][number];
  featured?: boolean;
}) {
  const { colorScheme, theme } = useAppTheme();
  const tone =
    colorScheme === "dark"
      ? {
          brand: { backgroundColor: "#183252", foregroundColor: "#9CC3FF" },
          success: { backgroundColor: "#143126", foregroundColor: "#7ED8A7" },
          neutral: { backgroundColor: "#1A2A3D", foregroundColor: "#C9D4E0" }
        }[card.tone]
      : toneStyles[card.tone];

  return (
    <SurfaceCard
      style={{
        flex: featured ? undefined : 1,
        gap: featured ? theme.spacing[4] : theme.spacing[3],
        paddingVertical: featured ? theme.spacing[5] : theme.spacing[4],
        borderRadius: featured ? 28 : 22
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: theme.spacing[3]
        }}
      >
        <View style={{ gap: theme.spacing[1], flex: 1 }}>
          <ThemedText color="tertiary">{card.label}</ThemedText>
          <ThemedText
            variant="heading"
            size={featured ? "lg" : "md"}
            style={{ color: tone.foregroundColor }}
          >
            {card.value}
          </ThemedText>
        </View>

        <View
          style={{
            width: featured ? 42 : 36,
            height: featured ? 42 : 36,
            borderRadius: featured ? 21 : 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tone.backgroundColor
          }}
        >
          <Ionicons
            name={
              card.tone === "brand"
                ? "wallet-outline"
                : card.tone === "success"
                  ? "checkmark-done-outline"
                  : "time-outline"
            }
            size={featured ? 20 : 17}
            color={tone.foregroundColor}
          />
        </View>
      </View>

    </SurfaceCard>
  );
}

function PaymentHistoryCard({ payment }: { payment: PaymentHistoryItem }) {
  const { colorScheme, theme } = useAppTheme();
  const status =
    colorScheme === "dark"
      ? {
          success: { backgroundColor: "#143126", foregroundColor: "#7ED8A7" },
          warning: { backgroundColor: "#352814", foregroundColor: "#F0C674" },
          neutral: { backgroundColor: "#1A2A3D", foregroundColor: "#C9D4E0" }
        }[payment.statusTone]
      : statusStyles[payment.statusTone];

  return (
    <SurfaceCard style={{ gap: theme.spacing[4] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[4] }}>
        <View style={{ flexDirection: "row", gap: theme.spacing[4], flex: 1 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor:
                colorScheme === "dark" ? theme.semantic.background.accent : "#EDF4FF",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons name="wallet-outline" size={18} color={theme.semantic.foreground.brand} />
          </View>

          <View style={{ gap: theme.spacing[1], flex: 1 }}>
            <ThemedText variant="heading" size="md">
              {payment.title}
            </ThemedText>
            <ThemedText color="secondary">
              {payment.category} • {payment.paidAtLabel}
            </ThemedText>
            <ThemedText color="tertiary">{payment.methodLabel}</ThemedText>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", gap: theme.spacing[2] }}>
          <ThemedText variant="heading" size="md">
            {payment.amountDisplay}
          </ThemedText>
          <View
            style={{
              backgroundColor: status.backgroundColor,
              borderRadius: theme.radius.pill,
              paddingHorizontal: theme.spacing[3],
              paddingVertical: theme.spacing[2]
            }}
          >
            <ThemedText variant="label" size="sm" style={{ color: status.foregroundColor }}>
              {payment.statusLabel}
            </ThemedText>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: theme.spacing[3]
        }}
      >
        <ThemedText color="tertiary">{payment.referenceLabel}</ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ThemedText variant="label" size="sm" color="brand">
            Receipt
          </ThemedText>
          <Ionicons name="receipt-outline" size={14} color={theme.semantic.foreground.brand} />
        </View>
      </View>
    </SurfaceCard>
  );
}
