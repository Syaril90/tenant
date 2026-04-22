import { Pressable, View } from "react-native";

import type { BillingCta, BillingSummaryBreakdown } from "@/features/bills/types/billing";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type PaymentCheckoutCardProps = {
  label: string;
  breakdown: BillingSummaryBreakdown;
  subtotalDisplayAmount: string;
  totalDisplayAmount: string;
  cta: BillingCta;
  disabled?: boolean;
  loading?: boolean;
  onSubmit: () => void;
};

export function PaymentCheckoutCard({
  label,
  breakdown,
  subtotalDisplayAmount,
  totalDisplayAmount,
  cta,
  disabled = false,
  loading = false,
  onSubmit
}: PaymentCheckoutCardProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        <Row label={breakdown.subtotalLabel} value={subtotalDisplayAmount} />
        <Row label={breakdown.feeLabel} value={breakdown.feeDisplayAmount} />
        <Row label={breakdown.totalLabel} value={totalDisplayAmount} emphasized />
      </View>

      <Pressable
        disabled={disabled || loading}
        onPress={onSubmit}
        style={{
          backgroundColor:
            disabled || loading
              ? theme.semantic.border.subtle
              : theme.semantic.foreground.brand,
          borderRadius: theme.radius.sm,
          paddingVertical: theme.spacing[4],
          alignItems: "center"
        }}
      >
        <ThemedText color="inverse">
          {loading ? "Processing..." : cta.primaryLabel}
        </ThemedText>
      </Pressable>
    </SurfaceCard>
  );
}

function Row({
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
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <ThemedText color={emphasized ? "primary" : "tertiary"}>{label}</ThemedText>
      <ThemedText
        variant={emphasized ? "heading" : "body"}
        size={emphasized ? "md" : "md"}
        style={emphasized ? { color: theme.semantic.foreground.brand } : undefined}
      >
        {value}
      </ThemedText>
    </View>
  );
}
