import { View } from "react-native";

import type { BillingRecentPayment } from "@/features/bills/types/billing";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type PaymentHistoryListProps = {
  label: string;
  payments: BillingRecentPayment[];
};

export function PaymentHistoryList({ label, payments }: PaymentHistoryListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {payments.map((payment) => (
          <SurfaceCard key={payment.id} muted elevated={false} style={{ paddingVertical: theme.spacing[4] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ gap: 2, flex: 1 }}>
                <ThemedText variant="heading" size="md">
                  {payment.title}
                </ThemedText>
                <ThemedText color="tertiary">{payment.dateLabel}</ThemedText>
              </View>

              <View style={{ alignItems: "flex-end", gap: 2 }}>
                <ThemedText>{payment.amountDisplay}</ThemedText>
                <ThemedText style={{ color: "#1C7C54" }}>{payment.statusLabel}</ThemedText>
              </View>
            </View>
          </SurfaceCard>
        ))}
      </View>
    </View>
  );
}
