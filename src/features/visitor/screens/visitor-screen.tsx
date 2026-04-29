import { ScrollView, View } from "react-native";

import { VisitorActivityList } from "@/features/visitor/components/visitor-activity-list";
import { VisitorRegistrationForm } from "@/features/visitor/components/visitor-registration-form";
import { VisitorSummaryCard } from "@/features/visitor/components/visitor-summary-card";
import { UpcomingVisitorsList } from "@/features/visitor/components/upcoming-visitors-list";
import visitorJson from "@/features/visitor/data/visitor.json";
import { useRegisterVisitorMutation } from "@/features/visitor/queries/use-register-visitor-mutation";
import { useVisitorQuery } from "@/features/visitor/queries/use-visitor-query";
import type { VisitorModel } from "@/features/visitor/types/visitor";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

export function VisitorScreen() {
  const { theme } = useAppTheme();
  const { selectedTenant } = useTenant();
  const visitorQuery = useVisitorQuery(selectedTenant?.unitNumber ?? null);
  const registerVisitorMutation = useRegisterVisitorMutation();
  const fallbackContent = visitorJson as VisitorModel;

  if (visitorQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackContent.messages.loading} />
      </Screen>
    );
  }

  if (visitorQuery.isError || !visitorQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={fallbackContent.messages.errorTitle}
          description={
            selectedTenant
              ? fallbackContent.messages.errorDescription
              : "Select a tenant profile first before registering visitors."
          }
        />
      </Screen>
    );
  }

  const { header, summary, form, sections, upcomingVisitors, recentActivity } =
    visitorQuery.data;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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

          <VisitorSummaryCard summary={summary} />
          <VisitorRegistrationForm
            form={form}
            loading={registerVisitorMutation.isPending}
            onSubmit={(values) =>
              registerVisitorMutation.mutate({
                accountCode: selectedTenant?.id ?? "",
                unitCode: selectedTenant?.unitNumber ?? "",
                ...values
              })
            }
          />
          <UpcomingVisitorsList
            label={sections.upcomingLabel}
            generatePassLabel={sections.generatePassLabel}
            visitors={upcomingVisitors}
          />
          <VisitorActivityList label={sections.historyLabel} activity={recentActivity} />
        </View>
      </ScrollView>
    </Screen>
  );
}
