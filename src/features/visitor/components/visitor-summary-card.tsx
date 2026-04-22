import { Pressable, View } from "react-native";

import type { VisitorSummary } from "@/features/visitor/types/visitor";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type VisitorSummaryCardProps = {
  summary: VisitorSummary;
};

export function VisitorSummaryCard({ summary }: VisitorSummaryCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.foreground.brand,
        borderRadius: theme.radius.lg,
        padding: theme.spacing[6],
        gap: theme.spacing[4]
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: "rgba(255,255,255,0.14)",
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.spacing[3],
          paddingVertical: 6
        }}
      >
        <ThemedText variant="label" size="sm" color="inverse">
          {summary.badge}
        </ThemedText>
      </View>

      <View style={{ gap: theme.spacing[2] }}>
        <ThemedText variant="heading" size="lg" color="inverse">
          {summary.title}
        </ThemedText>
        <ThemedText color="inverse">{summary.description}</ThemedText>
      </View>
    </View>
  );
}
