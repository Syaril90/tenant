import { View } from "react-native";

import type { SupportSummary } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type SupportSummaryCardProps = {
  summary: SupportSummary;
};

export function SupportSummaryCard({ summary }: SupportSummaryCardProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard
      style={{
        gap: theme.spacing[3],
        backgroundColor: theme.semantic.foreground.brand
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: "rgba(255,255,255,0.16)",
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2],
          borderRadius: 999
        }}
      >
        <ThemedText variant="label" size="sm" color="inverse">
          {summary.badge}
        </ThemedText>
      </View>

      <View style={{ gap: theme.spacing[1] }}>
        <ThemedText variant="heading" size="lg" color="inverse">
          {summary.title}
        </ThemedText>
        <ThemedText color="inverse">{summary.description}</ThemedText>
      </View>
    </SurfaceCard>
  );
}
