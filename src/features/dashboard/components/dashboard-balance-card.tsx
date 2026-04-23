import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import type { DashboardBalanceCard as DashboardBalanceCardModel } from "@/features/dashboard/types/dashboard";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type DashboardBalanceCardProps = {
  card: DashboardBalanceCardModel;
};

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export function DashboardBalanceCard({ card }: DashboardBalanceCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.background.emphasis,
        borderRadius: 30,
        padding: theme.spacing[6],
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        shadowColor: theme.shadow.floating.shadowColor,
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        gap: theme.spacing[5]
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
            {card.badge}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: theme.spacing[4] }}>
          <View style={{ gap: theme.spacing[2], flex: 1 }}>
            <ThemedText variant="heading" size="md" color="inverse">
              {card.title}
            </ThemedText>
            <ThemedText variant="display" size="large" color="inverse">
              {card.amount}
            </ThemedText>
            <ThemedText color="inverse" style={{ opacity: 0.8 }}>
              {card.supportingLabel}
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
              name={card.icon as IoniconName}
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
          <ThemedText color="inverse">{card.dueDateLabel}</ThemedText>
        </View>
        <Ionicons name="time-outline" size={18} color={theme.semantic.foreground.inverse} />
      </View>

      <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
        <Pressable
          onPress={() => router.push("/(tabs)/bills")}
          style={{
            flex: 1,
            backgroundColor: theme.semantic.background.surface,
            borderRadius: 14,
            paddingVertical: theme.spacing[4],
            paddingHorizontal: theme.spacing[6],
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
            paddingVertical: theme.spacing[4],
            paddingHorizontal: theme.spacing[6],
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
