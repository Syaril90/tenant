import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type PaymentDetailRowProps = {
  label: string;
  value: string;
  emphasized?: boolean;
};

export function PaymentDetailRow({
  label,
  value,
  emphasized = false
}: PaymentDetailRowProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[4] }}>
      <ThemedText color="tertiary">{label}</ThemedText>
      <ThemedText
        style={{
          color: emphasized ? theme.semantic.foreground.brand : theme.semantic.foreground.primary,
          textAlign: "right",
          flexShrink: 1
        }}
      >
        {value}
      </ThemedText>
    </View>
  );
}

