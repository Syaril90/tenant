import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { FormField } from "@/shared/ui/forms/form-field";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type PickerFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  iconName?: string;
};

export function PickerField({
  label,
  value,
  placeholder,
  onPress,
  iconName = "chevron-down"
}: PickerFieldProps) {
  const { theme } = useAppTheme();

  return (
    <FormField label={label}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: theme.semantic.background.muted,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[4],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <ThemedText color={value ? "primary" : "tertiary"}>
          {value || placeholder}
        </ThemedText>
        <Ionicons
          name={iconName as never}
          size={18}
          color={theme.semantic.foreground.tertiary}
        />
      </Pressable>
    </FormField>
  );
}
