import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { BottomSheet } from "@/shared/ui/forms/bottom-sheet";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type SelectOption = {
  id: string;
  label: string;
  description?: string;
};

type SelectSheetProps = {
  visible: boolean;
  title: string;
  selectedId: string;
  options: SelectOption[];
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function SelectSheet({
  visible,
  title,
  selectedId,
  options,
  onClose,
  onSelect
}: SelectSheetProps) {
  const { theme } = useAppTheme();

  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing[3] }}>
        {options.map((option) => {
          const selected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{
                backgroundColor: selected
                  ? theme.semantic.background.accent
                  : theme.semantic.background.muted,
                borderRadius: theme.radius.md,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[4],
                borderWidth: selected ? 1 : 0,
                borderColor: selected ? theme.semantic.foreground.brand : "transparent",
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing[4]
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.background.surface
                }}
              >
                <Ionicons
                  name={selected ? "checkmark" : "ellipse-outline"}
                  size={18}
                  color={selected ? theme.semantic.foreground.inverse : theme.semantic.foreground.tertiary}
                />
              </View>

              <View style={{ flex: 1, gap: option.description ? theme.spacing[1] : 0 }}>
                <ThemedText variant="heading" size="md" color={selected ? "brand" : "primary"}>
                  {option.label}
                </ThemedText>
                {option.description ? (
                  <ThemedText color="secondary">{option.description}</ThemedText>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}
