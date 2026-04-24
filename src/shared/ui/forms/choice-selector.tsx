import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { FormField } from "@/shared/ui/forms/form-field";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type ChoiceOption = {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type ChoiceSelectorProps = {
  label: string;
  options: ChoiceOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  variant?: "tile" | "chip";
  columns?: 1 | 2 | 3;
};

export function ChoiceSelector({
  label,
  options,
  selectedId,
  onSelect,
  variant = "chip",
  columns = 3
}: ChoiceSelectorProps) {
  const { theme } = useAppTheme();
  const tileWidth = columns === 2 ? "48%" : columns === 3 ? "31%" : "100%";

  return (
    <FormField label={label}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
        {options.map((option) => {
          const selected = option.id === selectedId;

          if (variant === "tile") {
            return (
              <Pressable
                key={option.id}
                onPress={() => onSelect(option.id)}
                style={{
                  width: tileWidth,
                  minHeight: 88,
                  borderRadius: theme.radius.md,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.border.subtle,
                  backgroundColor: selected
                    ? theme.semantic.background.surface
                    : theme.semantic.background.muted,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing[2],
                  paddingHorizontal: theme.spacing[4],
                  paddingVertical: theme.spacing[4]
                }}
              >
                {option.icon ? (
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={
                      selected
                        ? theme.semantic.foreground.brand
                        : theme.semantic.foreground.secondary
                    }
                  />
                ) : null}
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
          }

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{
                minWidth: columns === 3 ? "31%" : "48%",
                borderRadius: theme.radius.pill,
                borderWidth: 1,
                borderColor: selected
                  ? theme.semantic.foreground.brand
                  : theme.semantic.border.subtle,
                backgroundColor: selected
                  ? theme.semantic.background.accent
                  : theme.semantic.background.muted,
                paddingHorizontal: theme.spacing[4],
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: theme.spacing[2]
              }}
            >
              {option.icon ? (
                <Ionicons
                  name={option.icon}
                  size={14}
                  color={
                    selected
                      ? theme.semantic.foreground.brand
                      : theme.semantic.foreground.tertiary
                  }
                />
              ) : null}
              <ThemedText
                variant="label"
                size="sm"
                color={selected ? "brand" : "secondary"}
                style={{ textAlign: "center" }}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}
