import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { FeedbackFieldSection, FeedbackRatingOption } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type FeedbackRatingSelectorProps = {
  section: FeedbackFieldSection & { options: FeedbackRatingOption[] };
  selectedId: string;
  onSelect: (id: string) => void;
};

export function FeedbackRatingSelector({
  section,
  selectedId,
  onSelect
}: FeedbackRatingSelectorProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="secondary">
        {section.title}
      </ThemedText>

      <SurfaceCard elevated={false} style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {section.options.map((option) => {
          const selected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{ alignItems: "center", gap: theme.spacing[2], flex: 1 }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.background.muted,
                  borderWidth: 1,
                  borderColor: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.border.subtle
                }}
              >
                <Ionicons
                  name={option.icon as never}
                  size={16}
                  color={selected ? theme.semantic.foreground.inverse : theme.semantic.foreground.tertiary}
                />
              </View>
              <ThemedText variant="label" size="sm" color={selected ? "brand" : "tertiary"}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </SurfaceCard>
    </SurfaceCard>
  );
}
