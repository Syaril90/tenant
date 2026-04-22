import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  DashboardStatusCard,
  DashboardWeatherCard
} from "@/features/dashboard/types/dashboard";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DashboardInfoPanelsProps = {
  statusCard: DashboardStatusCard;
  weatherCard: DashboardWeatherCard;
};

export function DashboardInfoPanels({
  statusCard,
  weatherCard
}: DashboardInfoPanelsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <SurfaceCard style={{ gap: theme.spacing[4] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: theme.radius.md,
              backgroundColor: theme.semantic.background.accent,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons
              name={statusCard.icon as IoniconName}
              size={20}
              color={theme.semantic.foreground.brand}
            />
          </View>

          <ThemedText variant="label" size="sm" color="tertiary">
            {statusCard.eyebrow}
          </ThemedText>
        </View>

        <View style={{ gap: theme.spacing[1] }}>
          <ThemedText variant="heading" size="lg">
            {statusCard.title}
          </ThemedText>
          <ThemedText color="secondary">{statusCard.description}</ThemedText>
        </View>
      </SurfaceCard>

      <SurfaceCard muted elevated={false} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ gap: theme.spacing[1] }}>
          <ThemedText variant="heading" size="xl">
            {weatherCard.temperature}
          </ThemedText>
          <ThemedText color="tertiary">{weatherCard.condition}</ThemedText>
        </View>

        <Ionicons
          name={weatherCard.icon as IoniconName}
          size={28}
          color="#F59E0B"
        />
      </SurfaceCard>
    </View>
  );
}

