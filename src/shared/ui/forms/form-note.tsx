import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type FormNoteProps = {
  message: string;
  tone?: "info" | "success";
  title?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  card?: boolean;
};

export function FormNote({
  message,
  tone = "info",
  title,
  iconName,
  card = false
}: FormNoteProps) {
  const { colorScheme, theme } = useAppTheme();
  const resolvedIcon =
    iconName ?? (tone === "success" ? "checkmark-circle-outline" : "shield-checkmark-outline");
  const iconColor =
    tone === "success" ? theme.semantic.status.success : theme.semantic.foreground.brand;
  const cardStyle =
    tone === "success" && colorScheme !== "dark"
      ? { backgroundColor: "#ECF9F1" }
      : undefined;

  const content = (
    <View style={{ flexDirection: "row", gap: theme.spacing[3], alignItems: "flex-start" }}>
      <Ionicons name={resolvedIcon} size={16} color={iconColor} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: title ? theme.spacing[1] : 0 }}>
        {title ? (
          <ThemedText
            variant="heading"
            size="md"
            style={tone === "success" ? { color: theme.semantic.status.success } : undefined}
          >
            {title}
          </ThemedText>
        ) : null}
        <ThemedText color="secondary">{message}</ThemedText>
      </View>
    </View>
  );

  if (!card) {
    return content;
  }

  return (
    <SurfaceCard muted={tone !== "success"} elevated={false} style={cardStyle}>
      {content}
    </SurfaceCard>
  );
}
