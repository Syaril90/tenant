import { Pressable } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false
}: PrimaryButtonProps) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: theme.semantic.foreground.brand,
        borderRadius: theme.radius.md,
        minHeight: 56,
        paddingHorizontal: theme.spacing[5],
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1
      }}
    >
      <ThemedText color="inverse">{label}</ThemedText>
    </Pressable>
  );
}
