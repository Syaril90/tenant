import type { PropsWithChildren } from "react";
import { View, type ViewStyle } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";

type FieldShellProps = PropsWithChildren<{
  multiline?: boolean;
  invalid?: boolean;
  style?: ViewStyle;
}>;

export function FieldShell({
  children,
  multiline = false,
  invalid = false,
  style
}: FieldShellProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.semantic.background.muted,
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          borderColor: invalid ? theme.semantic.status.danger : theme.semantic.border.subtle,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
          minHeight: multiline ? 120 : 56,
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          gap: theme.spacing[3]
        },
        style
      ]}
    >
      {children}
    </View>
  );
}
