import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type FormFieldProps = PropsWithChildren<{
  label: string;
}>;

export function FormField({ label, children }: FormFieldProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[2] }}>
      <ThemedText variant="label" size="md" color="secondary">
        {label}
      </ThemedText>
      {children}
    </View>
  );
}
