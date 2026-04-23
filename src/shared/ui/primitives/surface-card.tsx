import type { PropsWithChildren } from "react";
import { View, type ViewStyle } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";

type SurfaceCardProps = PropsWithChildren<{
  style?: ViewStyle;
  muted?: boolean;
  elevated?: boolean;
}>;

export function SurfaceCard({
  children,
  style,
  muted = false,
  elevated = true
}: SurfaceCardProps) {
  const { theme } = useAppTheme();

  const shadow = elevated ? theme.shadow.card : undefined;

  return (
    <View
      style={[
        {
          backgroundColor: muted
            ? theme.semantic.background.muted
            : theme.semantic.background.surface,
          borderWidth: muted ? 0 : 1,
          borderColor: theme.semantic.border.subtle,
          borderRadius: theme.radius.lg,
          padding: theme.spacing[6],
          shadowColor: shadow?.shadowColor,
          shadowOpacity: shadow?.shadowOpacity,
          shadowRadius: shadow?.shadowRadius,
          shadowOffset: shadow?.shadowOffset,
          elevation: shadow?.elevation
        },
        style
      ]}
    >
      {children}
    </View>
  );
}
