import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";

import { AnnouncementCard } from "@/features/dashboard/components/dashboard-announcements";
import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard-query";
import { SupportSegmentedTabs } from "@/features/support/components/support-segmented-tabs";
import { DocumentSearchInput } from "@/features/documents/components/document-search-input";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

const announcementTabs = [
  { id: "all", label: "All" },
  { id: "danger", label: "Urgent" },
  { id: "brand", label: "Community" }
] as const;

export function AnnouncementsScreen() {
  const { theme } = useAppTheme();
  const dashboardQuery = useDashboardQuery();
  const [query, setQuery] = useState("");
  const [activeTabId, setActiveTabId] =
    useState<(typeof announcementTabs)[number]["id"]>("all");

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
  const filteredAnnouncements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return announcements.items.filter((item) => {
      const matchesTab = activeTabId === "all" ? true : item.badgeTone === activeTabId;
      const matchesQuery = normalizedQuery
        ? [item.title, item.description, item.badge, item.publishedAt]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesTab && matchesQuery;
    });
  }, [activeTabId, announcements.items, query]);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: theme.spacing[8], gap: theme.spacing[6] }}
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
          <DocumentSearchInput
            value={query}
            placeholder="Search announcements, updates, or keywords"
            onChangeText={setQuery}
          />

          <SupportSegmentedTabs
            tabs={announcementTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
            activeTabId={activeTabId}
            onChange={(tabId) =>
              setActiveTabId(tabId as (typeof announcementTabs)[number]["id"])
            }
          />
        </View>

        <View style={{ gap: theme.spacing[4], paddingHorizontal: theme.spacing[4] }}>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
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
            ))
          ) : (
            <SurfaceCard>
              <View style={{ gap: theme.spacing[2] }}>
                <ThemedText variant="heading" size="md">
                  No matching updates
                </ThemedText>
                <ThemedText color="secondary">
                  Change the search term or filter to see more announcement results.
                </ThemedText>
              </View>
            </SurfaceCard>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
