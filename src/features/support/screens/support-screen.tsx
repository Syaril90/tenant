import { ScrollView, View } from "react-native";
import { router } from "expo-router";

import { SupportCommunityActions } from "@/features/support/components/support-community-actions";
import { SupportCaseList } from "@/features/support/components/support-case-list";
import { SupportShortcuts } from "@/features/support/components/support-shortcuts";
import { SupportUpdatesFeed } from "@/features/support/components/support-updates-feed";
import supportJson from "@/features/support/data/support.json";
import { useSupportQuery } from "@/features/support/queries/use-support-query";
import type { SupportModel } from "@/features/support/types/support";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

export function SupportScreen() {
  const { theme } = useAppTheme();
  const supportQuery = useSupportQuery();
  const fallbackContent = supportJson as SupportModel;

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

  const { header, actions, shortcuts, cases, updates } = supportQuery.data;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[1] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {header.title}
            </ThemedText>
            <ThemedText color="secondary">{header.description}</ThemedText>
          </View>
          <SupportCommunityActions section={actions} />
          <SupportShortcuts section={shortcuts} />
          <SupportCaseList
            section={cases}
            onViewAll={() => {
              router.push("/support-cases");
            }}
            onSelectCase={(caseId) => {
              router.push(`/support-complaints/${caseId}`);
            }}
          />
          <SupportUpdatesFeed section={updates} />
        </View>
      </ScrollView>
    </Screen>
  );
}
