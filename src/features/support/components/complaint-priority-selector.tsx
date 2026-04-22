import { Pressable, View } from "react-native";

import type { ComplaintPriorityOption } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type ComplaintPrioritySelectorProps = {
  label: string;
  options: ComplaintPriorityOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ComplaintPrioritySelector({
  label,
  options,
  selectedId,
  onSelect
}: ComplaintPrioritySelectorProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[2] }}>
      <ThemedText variant="label" size="md" color="secondary">
        {label}
      </ThemedText>
      <SurfaceCard elevated={false} style={{ flexDirection: "row", gap: theme.spacing[3] }}>
        {options.map((option) => {
          const selected = option.id === selectedId;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={{
                flex: 1,
                backgroundColor: selected
                  ? theme.semantic.foreground.brand
                  : theme.semantic.background.muted,
                borderRadius: theme.radius.pill,
                paddingVertical: theme.spacing[3],
                alignItems: "center"
              }}
            >
              <ThemedText
                variant="label"
                size="md"
                color={selected ? "inverse" : "secondary"}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </SurfaceCard>
    </View>
  );
}
