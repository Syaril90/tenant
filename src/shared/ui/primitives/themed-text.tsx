import type { PropsWithChildren } from "react";
import { Text, type TextProps, type TextStyle } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";

type ThemedTextProps = PropsWithChildren<{
  color?: "primary" | "secondary" | "tertiary" | "inverse" | "brand";
  variant?: "display" | "heading" | "body" | "label";
  size?: "large" | "xl" | "lg" | "md" | "sm";
  style?: TextStyle;
}> &
  Pick<TextProps, "numberOfLines">;

export function ThemedText({
  children,
  color = "primary",
  variant = "body",
  size = "md",
  style,
  numberOfLines
}: ThemedTextProps) {
  const { theme } = useAppTheme();
  let textToken:
    | (typeof theme.typography.display)["large"]
    | (typeof theme.typography.heading)["xl"]
    | (typeof theme.typography.heading)["lg"]
    | (typeof theme.typography.heading)["md"]
    | (typeof theme.typography.body)["lg"]
    | (typeof theme.typography.body)["md"]
    | (typeof theme.typography.label)["md"]
    | (typeof theme.typography.label)["sm"];

  if (variant === "display") {
    textToken = theme.typography.display.large;
  } else if (variant === "heading") {
    if (size === "xl") {
      textToken = theme.typography.heading.xl;
    } else if (size === "lg") {
      textToken = theme.typography.heading.lg;
    } else {
      textToken = theme.typography.heading.md;
    }
  } else if (variant === "label") {
    textToken = size === "sm" ? theme.typography.label.sm : theme.typography.label.md;
  } else {
    textToken = size === "lg" ? theme.typography.body.lg : theme.typography.body.md;
  }

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: theme.semantic.foreground[color],
          fontFamily: textToken.fontFamily,
          fontSize: textToken.fontSize,
          lineHeight: textToken.lineHeight,
          letterSpacing: textToken.letterSpacing
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}
