import { Pressable, View } from "react-native";

import type { FeedbackOption, FeedbackFieldSection } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type FeedbackTypeSelectorProps = {
  section: FeedbackFieldSection & { options: FeedbackOption[] };
  selectedId: string;
  onSelect: (id: string) => void;
};

export function FeedbackTypeSelector({
  section,
  selectedId,
  onSelect
}: FeedbackTypeSelectorProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="secondary">
        {section.title}
      </ThemedText>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
        {section.options.map((option) => {
          const selected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{
                minWidth: "31%",
                backgroundColor: selected
                  ? theme.semantic.background.surface
                  : "#DDE4ED",
                borderRadius: theme.radius.sm,
                borderWidth: selected ? 1 : 0,
                borderColor: selected ? theme.semantic.foreground.brand : "transparent",
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[3],
                alignItems: "center"
              }}
            >
              <ThemedText
                variant="label"
                size="sm"
                color={selected ? "brand" : "secondary"}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </SurfaceCard>
  );
}
