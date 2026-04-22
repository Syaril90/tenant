import { View } from "react-native";

import type { BillingSummary } from "@/features/bills/types/billing";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type BillingSummaryCardProps = {
  summary: BillingSummary;
};

export function BillingSummaryCard({ summary }: BillingSummaryCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.background.emphasis,
        borderRadius: theme.radius.lg,
        padding: theme.spacing[6],
        gap: theme.spacing[3],
        shadowColor: theme.shadow.card.shadowColor,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3
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

      <ThemedText variant="display" size="large" color="inverse">
        {summary.amountDue}
      </ThemedText>
      <ThemedText color="inverse">{summary.dueDateLabel}</ThemedText>
      <ThemedText color="inverse">{summary.description}</ThemedText>
    </View>
  );
}

