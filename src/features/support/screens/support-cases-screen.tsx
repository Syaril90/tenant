import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";

import supportJson from "@/features/support/data/support.json";
import { SupportCaseList } from "@/features/support/components/support-case-list";
import { SupportSegmentedTabs } from "@/features/support/components/support-segmented-tabs";
import { useSupportQuery } from "@/features/support/queries/use-support-query";
import type { SupportCase, SupportModel } from "@/features/support/types/support";
import { DocumentSearchInput } from "@/features/documents/components/document-search-input";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

const caseTabs = [
  { id: "all", label: "All" },
  { id: "warning", label: "Open" },
  { id: "success", label: "Resolved" }
] as const;

export function SupportCasesScreen() {
  const { theme } = useAppTheme();
  const supportQuery = useSupportQuery();
  const [query, setQuery] = useState("");
  const [activeTabId, setActiveTabId] = useState<(typeof caseTabs)[number]["id"]>("all");
  const fallbackContent = supportJson as SupportModel;

  const filteredCases = useMemo(() => {
    const cases = supportQuery.data?.cases.items ?? [];
    const normalizedQuery = query.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesStatus = activeTabId === "all" ? true : item.statusTone === activeTabId;
      const matchesQuery = normalizedQuery
        ? [item.title, item.category, item.referenceLabel, item.statusLabel]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesStatus && matchesQuery;
    });
  }, [activeTabId, query, supportQuery.data?.cases.items]);

  if (supportQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackContent.messages.loading} />
      </Screen>
    );
  }

  if (supportQuery.isError || !supportQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={fallbackContent.messages.errorTitle}
          description={fallbackContent.messages.errorDescription}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              SUPPORT CENTRE
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              Review every support case.
            </ThemedText>
            <ThemedText color="secondary">
              Search your submissions, filter by case status, and open any complaint for full progress details.
            </ThemedText>
          </View>

          <DocumentSearchInput
            value={query}
            placeholder="Search by title, category, status, or reference"
            onChangeText={setQuery}
          />

          <SupportSegmentedTabs
            tabs={caseTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
            activeTabId={activeTabId}
            onChange={(tabId) => setActiveTabId(tabId as (typeof caseTabs)[number]["id"])}
          />

          {filteredCases.length > 0 ? (
            <SupportCaseList
              section={{
                ...supportQuery.data.cases,
                items: filteredCases as SupportCase[]
              }}
              onSelectCase={(caseId) => {
                router.push(`/support-complaints/${caseId}`);
              }}
            />
          ) : (
            <SurfaceCard>
              <View style={{ gap: theme.spacing[2] }}>
                <ThemedText variant="heading" size="md">
                  No matching cases
                </ThemedText>
                <ThemedText color="secondary">
                  Adjust the search term or switch the status filter to broaden the results.
                </ThemedText>
              </View>
            </SurfaceCard>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
