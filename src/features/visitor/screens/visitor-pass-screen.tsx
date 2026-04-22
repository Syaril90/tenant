import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { VisitorPassCard } from "@/features/visitor/components/visitor-pass-card";
import { useVisitorPassContentQuery } from "@/features/visitor/queries/use-visitor-pass-content-query";
import type { VisitorPassRouteParams } from "@/features/visitor/types/visitor-pass";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

function buildPassCode(visitorId?: string) {
  if (!visitorId) {
    return "VP-UNASSIGNED";
  }

  return `VP-${visitorId.replace("visitor-", "").slice(0, 10).toUpperCase()}`;
}

export function VisitorPassScreen() {
  const { theme } = useAppTheme();
  const contentQuery = useVisitorPassContentQuery();
  const params = useLocalSearchParams<VisitorPassRouteParams>();

  if (contentQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading visitor pass..." />
      </Screen>
    );
  }

  if (contentQuery.isError || !contentQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Visitor pass unavailable"
          description="The mocked visitor pass content could not be loaded."
        />
      </Screen>
    );
  }

  const { header, labels } = contentQuery.data;
  const passCode = buildPassCode(params.visitorId);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: theme.spacing[8],
          gap: theme.spacing[8]
        }}
      >
        <View style={{ gap: theme.spacing[6] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {header.title}
            </ThemedText>
            <ThemedText color="secondary">{header.description}</ThemedText>
          </View>

          <VisitorPassCard title={labels.qrTitle} passCode={passCode} />

          <SurfaceCard style={{ gap: theme.spacing[3] }}>
            <DetailRow label={labels.visitorName} value={params.name ?? "-"} />
            <DetailRow label={labels.purpose} value={params.purpose ?? "-"} />
            <DetailRow label={labels.visitDate} value={params.dateLabel ?? "-"} />
            <DetailRow label={labels.vehicle} value={params.vehicleLabel ?? "-"} />
            <DetailRow label={labels.status} value={params.statusLabel ?? "-"} />
            <DetailRow label={labels.passCode} value={passCode} emphasized />
          </SurfaceCard>
        </View>

        <View style={{ gap: theme.spacing[3] }}>
          <Pressable
            onPress={() => router.replace("/(tabs)/visitor")}
            style={{
              backgroundColor: theme.semantic.foreground.brand,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="inverse">{labels.primaryCtaLabel}</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: theme.semantic.background.surface,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="brand">{labels.secondaryCtaLabel}</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function DetailRow({
  label,
  value,
  emphasized = false
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[4] }}>
      <ThemedText color="tertiary">{label}</ThemedText>
      <ThemedText style={{ color: emphasized ? theme.semantic.foreground.brand : theme.semantic.foreground.primary, textAlign: "right", flexShrink: 1 }}>
        {value}
      </ThemedText>
    </View>
  );
}
