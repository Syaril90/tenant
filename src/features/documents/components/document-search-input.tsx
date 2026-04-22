import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/theme/theme-provider";

type DocumentSearchInputProps = {
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
};

export function DocumentSearchInput({
  value,
  placeholder,
  onChangeText
}: DocumentSearchInputProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.background.muted,
        borderRadius: theme.radius.sm,
        paddingLeft: 48,
        paddingRight: theme.spacing[4],
        paddingVertical: theme.spacing[4],
        position: "relative"
      }}
    >
      <Ionicons
        name="search-outline"
        size={18}
        color={theme.semantic.foreground.tertiary}
        style={{ position: "absolute", left: 16, top: 17 }}
      />
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.semantic.foreground.tertiary}
        onChangeText={onChangeText}
        style={{
          color: theme.semantic.foreground.primary,
          fontSize: theme.typography.body.lg.fontSize
        }}
      />
    </View>
  );
}

