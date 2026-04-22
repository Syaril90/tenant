import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { PaymentDetailRow } from "@/features/bills/components/payment-detail-row";
import { usePaymentSuccessContentQuery } from "@/features/bills/queries/use-payment-success-content-query";
import type { PaymentRouteParams } from "@/features/bills/types/payment-success";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function PaymentSuccessScreen() {
  const { theme } = useAppTheme();
  const contentQuery = usePaymentSuccessContentQuery();
  const params = useLocalSearchParams<PaymentRouteParams>();

  if (contentQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading payment receipt..." />
      </Screen>
    );
  }

  if (contentQuery.isError || !contentQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Receipt unavailable"
          description="The payment success content could not be loaded."
        />
      </Screen>
    );
  }

  const { header, labels } = contentQuery.data;

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "space-between", gap: theme.spacing[8] }}>
        <View style={{ gap: theme.spacing[6] }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: theme.radius.pill,
              backgroundColor: theme.semantic.background.accent,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <Ionicons
              name="checkmark"
              size={36}
              color={theme.semantic.foreground.brand}
            />
          </View>

          <View style={{ alignItems: "center", gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand" style={{ textAlign: "center" }}>
              {header.title}
            </ThemedText>
            <ThemedText color="secondary" style={{ textAlign: "center" }}>
              {header.description}
            </ThemedText>
          </View>

          <SurfaceCard style={{ gap: theme.spacing[4] }}>
            <ThemedText variant="heading" size="lg">
              {labels.summaryTitle}
            </ThemedText>
            <PaymentDetailRow label={labels.status} value={params.status ?? "-"} />
            <PaymentDetailRow label={labels.transactionId} value={params.paymentId ?? "-"} />
            <PaymentDetailRow label={labels.paidAt} value={params.paidAt ?? "-"} />
            <PaymentDetailRow label={labels.paymentMethod} value={params.methodLabel ?? "-"} />
            <PaymentDetailRow label={labels.amount} value={params.amount ?? "-"} emphasized />
          </SurfaceCard>
        </View>

        <View style={{ gap: theme.spacing[3] }}>
          <Pressable
            onPress={() => router.replace("/(tabs)/bills")}
            style={{
              backgroundColor: theme.semantic.foreground.brand,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="inverse">{labels.primaryCtaLabel}</ThemedText>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/payment-receipt",
                params
              })
            }
            style={{
              backgroundColor: theme.semantic.background.surface,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="brand">{labels.receiptCtaLabel}</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={{
              backgroundColor: theme.semantic.background.muted,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="brand">{labels.secondaryCtaLabel}</ThemedText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
