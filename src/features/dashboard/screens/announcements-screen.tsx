import { ScrollView, View } from "react-native";
import { router } from "expo-router";

import { AnnouncementCard } from "@/features/dashboard/components/dashboard-announcements";
import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard-query";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function AnnouncementsScreen() {
  const { theme } = useAppTheme();
  const dashboardQuery = useDashboardQuery();

  if (dashboardQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading announcements..." />
      </Screen>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Announcements unavailable"
          description="The mock announcement feed could not be loaded."
        />
      </Screen>
    );
  }

  const { announcements } = dashboardQuery.data;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing[8], gap: theme.spacing[6] }}
      >
        <View style={{ gap: theme.spacing[2], paddingHorizontal: theme.spacing[4] }}>
          <ThemedText variant="label" size="sm" color="tertiary">
            {announcements.eyebrow}
          </ThemedText>
          <ThemedText variant="heading" size="xl">
            Resident Announcements
          </ThemedText>
          <ThemedText color="secondary" size="lg">
            Stay aligned with the latest building notices, maintenance work, and community updates.
          </ThemedText>
        </View>

        <View style={{ gap: theme.spacing[4], paddingHorizontal: theme.spacing[4] }}>
          {announcements.items.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/announcements/[announcementId]",
                  params: { announcementId: item.id }
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
