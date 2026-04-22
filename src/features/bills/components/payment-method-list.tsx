import { Pressable, View } from "react-native";

import type { BillingPaymentMethod } from "@/features/bills/types/billing";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type PaymentMethodListProps = {
  label: string;
  methods: BillingPaymentMethod[];
  selectedMethodId: string;
  onSelectMethod: (methodId: string) => void;
};

export function PaymentMethodList({
  label,
  methods,
  selectedMethodId,
  onSelectMethod
}: PaymentMethodListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {methods.map((method) => {
          const selected = method.id === selectedMethodId;

          return (
            <Pressable key={method.id} onPress={() => onSelectMethod(method.id)}>
              <SurfaceCard
                muted={!selected}
                elevated={selected}
                style={{
                  borderWidth: 1,
                  borderColor: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.border.soft
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ gap: 2 }}>
                    <ThemedText variant="heading" size="md">
                      {method.typeLabel}
                    </ThemedText>
                    <ThemedText color="tertiary">{method.metaLabel}</ThemedText>
                  </View>

                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: selected
                        ? theme.semantic.foreground.brand
                        : theme.semantic.border.subtle
                    }}
                  />
                </View>
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
