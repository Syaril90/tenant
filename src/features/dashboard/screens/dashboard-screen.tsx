import { ScrollView, View } from "react-native";

import { DashboardAnnouncements } from "@/features/dashboard/components/dashboard-announcements";
import { DashboardBalanceCard } from "@/features/dashboard/components/dashboard-balance-card";
import { DashboardInfoPanels } from "@/features/dashboard/components/dashboard-info-panels";
import { DashboardQuickActions } from "@/features/dashboard/components/dashboard-quick-actions";
import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard-query";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function DashboardScreen() {
  const { theme } = useAppTheme();
  const dashboardQuery = useDashboardQuery();

  if (dashboardQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading dashboard..." />
      </Screen>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Dashboard unavailable"
          description="The mock dashboard request failed. Replace the mock service when the real API is ready."
        />
      </Screen>
    );
  }

  const { header, balanceCard, statusCard, weatherCard, quickActions, announcements } =
    dashboardQuery.data;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[1] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {header.eyebrow}
            </ThemedText>
            <View>
              {header.titleLines.map((line) => (
                <ThemedText key={line} variant="heading" size="xl" color="brand">
                  {line}
                </ThemedText>
              ))}
            </View>
            <ThemedText color="secondary">{header.description}</ThemedText>
          </View>

          <DashboardBalanceCard card={balanceCard} />
          <DashboardInfoPanels statusCard={statusCard} weatherCard={weatherCard} />
          <DashboardQuickActions section={quickActions} />
          <DashboardAnnouncements section={announcements} />
        </View>
      </ScrollView>
    </Screen>
  );
}
