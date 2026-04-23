import { ScrollView, View } from "react-native";

import { getUserIdentity } from "@/features/auth/lib/user-identity";
import { useAuth } from "@/features/auth/providers/auth-provider";
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
  const { colorScheme, theme } = useAppTheme();
  const dashboardQuery = useDashboardQuery();
  const { user } = useAuth();

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

  const { header, balanceCard, contacts, quickActions, announcements } =
    dashboardQuery.data;
  const identity = getUserIdentity(user);
  const titleLines =
    header.titleLines.length >= 2
      ? [header.titleLines[0], identity.firstName]
      : [`Welcome, ${identity.firstName}`];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[3] }}>
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor:
                  colorScheme === "dark" ? theme.semantic.background.accent : "#EAF2FF",
                borderRadius: theme.radius.pill,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[2]
              }}
            >
              <ThemedText variant="label" size="sm" color="brand">
                {header.pillLabel}
              </ThemedText>
            </View>
            <View>
              {titleLines.map((line) => (
                <ThemedText key={line} variant="heading" size="xl" color="brand">
                  {line}
                </ThemedText>
              ))}
            </View>
            <ThemedText color="secondary">{header.description}</ThemedText>
          </View>

          <DashboardBalanceCard card={balanceCard} />
          <DashboardInfoPanels contacts={contacts} />
          <DashboardQuickActions section={quickActions} />
          <DashboardAnnouncements section={announcements} />
        </View>
      </ScrollView>
    </Screen>
  );
}
