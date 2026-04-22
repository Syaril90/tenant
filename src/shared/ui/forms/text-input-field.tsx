import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { FormField } from "@/shared/ui/forms/form-field";

type TextInputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  leadingIcon?: string;
};

export function TextInputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  leadingIcon
}: TextInputFieldProps) {
  const { theme } = useAppTheme();

  return (
    <FormField label={label}>
      <View
        style={{
          backgroundColor: theme.semantic.background.muted,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
          minHeight: multiline ? 120 : undefined,
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          gap: theme.spacing[3]
        }}
      >
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
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.semantic.foreground.tertiary}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          style={{
            flex: 1,
            minHeight: multiline ? 96 : undefined,
            color: theme.semantic.foreground.primary
          }}
        />
      </View>
    </FormField>
  );
}
