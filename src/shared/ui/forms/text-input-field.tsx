import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { FieldShell } from "@/shared/ui/forms/field-shell";
import { FormField } from "@/shared/ui/forms/form-field";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type TextInputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  leadingIcon?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
};

export function TextInputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  leadingIcon,
  helperText,
  errorMessage,
  required = false,
  maxLength,
  showCharacterCount = false
}: TextInputFieldProps) {
  const { theme } = useAppTheme();
  const footer = showCharacterCount && maxLength
    ? (
      <ThemedText color="tertiary">
        {value.length} / {maxLength}
      </ThemedText>
    )
    : undefined;

  return (
    <FormField
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      required={required}
      footer={footer}
    >
      <FieldShell multiline={multiline} invalid={Boolean(errorMessage)}>
        {leadingIcon ? (
          <Ionicons
            name={leadingIcon as never}
            size={18}
            color={theme.semantic.foreground.tertiary}
            style={{ marginTop: multiline ? 2 : 0 }}
          />
        ) : null}
        <TextInput
          value={value}
          onChangeText={(nextValue) =>
            onChangeText(maxLength ? nextValue.slice(0, maxLength) : nextValue)
          }
          placeholder={placeholder}
          placeholderTextColor={theme.semantic.foreground.tertiary}
          multiline={multiline}
          maxLength={maxLength}
          textAlignVertical={multiline ? "top" : "center"}
          style={{
            flex: 1,
            minHeight: multiline ? 96 : undefined,
            color: theme.semantic.foreground.primary
          }}
        />
      </FieldShell>
    </FormField>
  );
}
