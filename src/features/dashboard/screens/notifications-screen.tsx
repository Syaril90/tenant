import { ScrollView, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard-query";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function NotificationsScreen() {
  const { theme } = useAppTheme();
  const dashboardQuery = useDashboardQuery();

  if (dashboardQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading notifications..." />
      </Screen>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Notifications unavailable"
          description="The notification feed could not be loaded."
        />
      </Screen>
    );
  }

  const notifications = dashboardQuery.data.announcements.items;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120, gap: theme.spacing[6] }}
      >
        <View style={{ gap: theme.spacing[2] }}>
          <ThemedText variant="label" size="sm" color="tertiary">
            RESIDENT ALERTS
          </ThemedText>
          <ThemedText variant="heading" size="xl">
            Notifications
          </ThemedText>
          <ThemedText color="secondary">
            All updates, notices, and important building alerts in one place.
          </ThemedText>
        </View>

        <View style={{ gap: theme.spacing[3] }}>
          {notifications.map((item) => {
            const badgeColor =
              item.badgeTone === "danger"
                ? theme.semantic.status.danger
                : theme.semantic.foreground.brand;

            return (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: "/announcements/[announcementId]",
                    params: { announcementId: item.id }
                  })
                }
              >
                <SurfaceCard style={{ gap: theme.spacing[4], borderRadius: 24, paddingVertical: theme.spacing[5] }}>
                  <View style={{ flexDirection: "row", gap: theme.spacing[4] }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor:
                          item.badgeTone === "danger"
                            ? theme.semantic.background.surface
                            : theme.semantic.background.accent,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Ionicons
                        name={item.badgeTone === "danger" ? "alert-circle-outline" : "notifications-outline"}
                        size={20}
                        color={badgeColor}
                      />
                    </View>

                    <View style={{ flex: 1, gap: theme.spacing[2] }}>
                      <ThemedText variant="heading" size="md">
                        {item.title}
                      </ThemedText>

                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor:
                            item.badgeTone === "danger"
                              ? theme.semantic.background.surface
                              : theme.semantic.background.accent,
                          borderRadius: theme.radius.pill,
                          paddingHorizontal: theme.spacing[2],
                          paddingVertical: 2
                        }}
                      >
                        <ThemedText
                          variant="label"
                          size="sm"
                          style={{ color: badgeColor }}
                        >
                          {item.badge}
                        </ThemedText>
                      </View>

                      <ThemedText color="tertiary">{item.publishedAt}</ThemedText>
                      <ThemedText color="secondary">{item.description}</ThemedText>
                    </View>
                  </View>
                </SurfaceCard>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
