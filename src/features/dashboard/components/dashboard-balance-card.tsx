import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        borderRadius: theme.radius.lg,
        padding: theme.spacing[6],
        shadowColor: theme.shadow.floating.shadowColor,
        shadowOpacity: theme.shadow.floating.shadowOpacity,
        shadowRadius: theme.shadow.floating.shadowRadius,
        shadowOffset: theme.shadow.floating.shadowOffset,
        elevation: theme.shadow.floating.elevation,
        gap: theme.spacing[6]
      }}
    >
      <View style={{ gap: theme.spacing[2] }}>
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: "rgba(255,255,255,0.14)",
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: 6
          }}
        >
          <ThemedText variant="label" size="sm" color="inverse">
            {card.badge}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ gap: theme.spacing[2], flex: 1 }}>
            <ThemedText variant="heading" size="md" color="inverse">
              {card.title}
            </ThemedText>
            <ThemedText variant="display" size="large" color="inverse">
              {card.amount}
            </ThemedText>
          </View>

          <Ionicons
            name={card.icon as IoniconName}
            size={22}
            color={theme.semantic.foreground.inverse}
          />
        </View>
      </View>

      <View style={{ gap: theme.spacing[3] }}>
        <Pressable
          style={{
            backgroundColor: theme.semantic.background.surface,
            borderRadius: theme.radius.sm,
            paddingVertical: theme.spacing[3],
            paddingHorizontal: theme.spacing[6],
            alignItems: "center"
          }}
        >
          <ThemedText color="brand">{card.primaryActionLabel}</ThemedText>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: theme.radius.sm,
            paddingVertical: theme.spacing[3],
            paddingHorizontal: theme.spacing[6],
            alignItems: "center"
          }}
        >
          <ThemedText color="inverse">{card.secondaryActionLabel}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

