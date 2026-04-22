import { Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { PaymentDetailRow } from "@/features/bills/components/payment-detail-row";
import { usePaymentReceiptContentQuery } from "@/features/bills/queries/use-payment-receipt-content-query";
import type { PaymentRouteParams } from "@/features/bills/types/payment-success";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

function buildReceiptNumber(paymentId?: string) {
  if (!paymentId) {
    return "-";
  }

  const suffix = paymentId.replace("payment-", "").slice(-8);

  return `RCT-${suffix || paymentId}`;
}

export function PaymentReceiptScreen() {
  const { theme } = useAppTheme();
  const contentQuery = usePaymentReceiptContentQuery();
  const params = useLocalSearchParams<PaymentRouteParams>();

  if (contentQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading receipt..." />
      </Screen>
    );
  }

  if (contentQuery.isError || !contentQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Receipt unavailable"
          description="The mocked receipt content could not be loaded."
        />
      </Screen>
    );
  }

  const { header, labels } = contentQuery.data;

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "space-between", gap: theme.spacing[8] }}>
        <View style={{ gap: theme.spacing[6] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {header.title}
            </ThemedText>
            <ThemedText color="secondary">{header.description}</ThemedText>
          </View>

          <SurfaceCard style={{ gap: theme.spacing[4] }}>
            <ThemedText variant="heading" size="lg">
              {labels.receiptTitle}
            </ThemedText>
            <PaymentDetailRow label={labels.receiptNumber} value={buildReceiptNumber(params.paymentId)} />
            <PaymentDetailRow label={labels.transactionId} value={params.paymentId ?? "-"} />
            <PaymentDetailRow label={labels.paidAt} value={params.paidAt ?? "-"} />
            <PaymentDetailRow label={labels.paymentMethod} value={params.methodLabel ?? "-"} />
            <PaymentDetailRow label={labels.amount} value={params.amount ?? "-"} emphasized />
          </SurfaceCard>

          <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="heading" size="md">
              {labels.noteTitle}
            </ThemedText>
            <ThemedText color="secondary">{labels.noteDescription}</ThemedText>
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
              router.replace({
                pathname: "/payment-success",
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
            <ThemedText color="brand">{labels.secondaryCtaLabel}</ThemedText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
