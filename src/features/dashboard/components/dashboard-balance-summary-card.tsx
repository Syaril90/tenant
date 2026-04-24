import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import type { DashboardBalanceCard as DashboardBalanceCardModel } from "@/features/dashboard/types/dashboard";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DashboardBalanceSummaryCardProps = {
  card: DashboardBalanceCardModel;
};

export function DashboardBalanceSummaryCard({
  card
}: DashboardBalanceSummaryCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.background.emphasis,
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
                {card.badge}
              </ThemedText>
            </View>
            <ThemedText variant="display" size="large" color="inverse">
              {card.amount}
            </ThemedText>
            <ThemedText variant="heading" size="md" color="inverse">
              {card.title}
            </ThemedText>
            <ThemedText color="inverse" style={{ opacity: 0.78 }}>
              {card.dueDateLabel}
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
            name={card.icon as IoniconName}
            size={20}
            color={theme.semantic.foreground.inverse}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
        <Pressable
          onPress={() => router.push("/(tabs)/bills")}
          style={{
            flex: 1,
            backgroundColor: theme.semantic.foreground.inverse,
            borderRadius: 14,
            paddingHorizontal: theme.spacing[5],
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: theme.spacing[2]
          }}
        >
          <Ionicons
            name="card-outline"
            size={16}
            color={theme.semantic.foreground.brand}
          />
          <ThemedText color="brand">{card.primaryActionLabel}</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/bills")}
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
            name="receipt-outline"
            size={16}
            color={theme.semantic.foreground.inverse}
          />
          <ThemedText color="inverse">{card.secondaryActionLabel}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
