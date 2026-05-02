import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import type { PaymentRouteParams } from "@/features/bills/types/payment-success";
import { Screen } from "@/shared/ui/layout/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function PaymentFailedScreen() {
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<PaymentRouteParams>();

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "space-between", gap: theme.spacing[8] }}>
        <View style={{ gap: theme.spacing[6] }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: theme.radius.pill,
              backgroundColor: "#FFF1F0",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center"
            }}
          >
            <Ionicons name="close" size={36} color="#C62828" />
          </View>

          <View style={{ alignItems: "center", gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              PAYMENT STATUS
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand" style={{ textAlign: "center" }}>
              Payment Not Completed
            </ThemedText>
            <ThemedText color="secondary" style={{ textAlign: "center" }}>
              The payment was cancelled or not confirmed. Your billing status has been refreshed from the backend.
            </ThemedText>
          </View>

          <SurfaceCard style={{ gap: theme.spacing[4] }}>
            <ThemedText variant="heading" size="lg">
              Transaction Summary
            </ThemedText>
            <ThemedText color="secondary">Status: {params.status ?? "Failed"}</ThemedText>
            <ThemedText color="secondary">Reference: {params.paymentId ?? "-"}</ThemedText>
            <ThemedText color="secondary">Payment Method: {params.methodLabel ?? "-"}</ThemedText>
            <ThemedText color="secondary">Amount: {params.amount ?? "-"}</ThemedText>
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
            <ThemedText color="inverse">Back To Bills</ThemedText>
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
            <ThemedText color="brand">Go To Home</ThemedText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
