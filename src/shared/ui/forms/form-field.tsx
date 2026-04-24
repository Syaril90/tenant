import type { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type FormFieldProps = PropsWithChildren<{
  label: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  footer?: ReactNode;
}>;

export function FormField({
  label,
  helperText,
  errorMessage,
  required = false,
  footer,
  children
}: FormFieldProps) {
  const { theme } = useAppTheme();
  const footerColor = errorMessage ? theme.semantic.status.danger : undefined;

  return (
    <View style={{ gap: theme.spacing[2] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[1] }}>
        <ThemedText variant="label" size="md" color="secondary">
          {label}
        </ThemedText>
        {required ? (
          <ThemedText
            variant="label"
            size="md"
            style={{ color: theme.semantic.status.danger }}
          >
            *
          </ThemedText>
        ) : null}
      </View>
      {children}
      {helperText || errorMessage || footer ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: theme.spacing[3]
          }}
        >
          <View style={{ flex: 1 }}>
            {errorMessage ? (
              <ThemedText color="secondary" style={{ color: footerColor }}>
                {errorMessage}
              </ThemedText>
            ) : helperText ? (
              <ThemedText color="tertiary">{helperText}</ThemedText>
            ) : null}
          </View>
          {footer ? <View>{footer}</View> : null}
        </View>
      ) : null}
    </View>
  );
}
