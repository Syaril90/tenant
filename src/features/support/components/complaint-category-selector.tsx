import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { ComplaintCategoryOption } from "@/features/support/types/support";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type ComplaintCategorySelectorProps = {
  label: string;
  options: ComplaintCategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  maintenance: "construct-outline",
  cleanliness: "brush-outline",
  security: "shield-checkmark-outline",
  billing: "card-outline",
  facilities: "snow-outline",
  noise: "volume-high-outline",
  other: "ellipsis-horizontal"
};

export function ComplaintCategorySelector({
  label,
  options,
  selectedId,
  onSelect
}: ComplaintCategorySelectorProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[2] }}>
      <ThemedText variant="label" size="md" color="secondary">
        {label}
      </ThemedText>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
        {options.map((option) => {
          const selected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{
                width: "48%",
                minHeight: 84,
                borderRadius: theme.radius.md,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? theme.semantic.foreground.brand : theme.semantic.border.soft,
                backgroundColor: selected
                  ? theme.semantic.background.surface
                  : theme.semantic.background.muted,
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing[2]
              }}
            >
              <Ionicons
                name={categoryIcons[option.id] ?? "grid-outline"}
                size={18}
                color={
                  selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.foreground.secondary
                }
              />
              <ThemedText
                style={{
                  color: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.foreground.secondary,
                  textAlign: "center"
                }}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
