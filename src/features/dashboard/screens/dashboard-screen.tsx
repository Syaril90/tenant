import { ImageBackground, ScrollView, View } from "react-native";

import { getUserIdentity } from "@/features/auth/lib/user-identity";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { DashboardAnnouncements } from "@/features/dashboard/components/dashboard-announcements";
import { DashboardBalanceSummaryCard } from "@/features/dashboard/components/dashboard-balance-summary-card";
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

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <ImageBackground
            source={{ uri: header.propertyImageUri }}
            imageStyle={{ borderRadius: 28 }}
            style={{
              minHeight: 156,
              borderRadius: 28,
              overflow: "hidden"
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 28,
                padding: theme.spacing[5],
                justifyContent: "space-between",
                backgroundColor:
                  colorScheme === "dark" ? "rgba(9,17,29,0.42)" : "rgba(10,28,54,0.38)"
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(255,255,255,0.16)",
                  borderRadius: theme.radius.pill,
                  paddingHorizontal: theme.spacing[3],
                  paddingVertical: 6
                }}
              >
                <ThemedText variant="label" size="sm" color="inverse">
                  {header.eyebrow}
                </ThemedText>
              </View>

              <View style={{ gap: theme.spacing[2] }}>
                <ThemedText variant="heading" size="xl" color="inverse">
                  {identity.firstName}
                </ThemedText>
                <ThemedText color="inverse" style={{ opacity: 0.88 }}>
                  {header.pillLabel}
                </ThemedText>
                <ThemedText color="inverse" style={{ opacity: 0.72 }}>
                  {header.description}
                </ThemedText>
              </View>
            </View>
          </ImageBackground>
          <DashboardBalanceSummaryCard card={balanceCard} />
          <DashboardInfoPanels contacts={contacts} />
          <DashboardQuickActions section={quickActions} />
          <DashboardAnnouncements section={announcements} />
        </View>
      </ScrollView>
    </Screen>
  );
}
