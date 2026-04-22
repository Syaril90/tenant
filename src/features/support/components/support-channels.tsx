import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { SupportChannelSection } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type SupportChannelsProps = {
  section: SupportChannelSection;
};

export function SupportChannels({ section }: SupportChannelsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="sm" color="tertiary">
        {section.title}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {section.items.map((item) => (
          <SurfaceCard
            key={item.id}
            style={{
              gap: theme.spacing[4],
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.semantic.background.muted
              }}
            >
              <Ionicons
                name={item.icon as never}
                size={20}
                color={theme.semantic.foreground.brand}
              />
            </View>

            <View style={{ flex: 1, gap: theme.spacing[1] }}>
              <ThemedText variant="heading" size="md">
                {item.title}
              </ThemedText>
              <ThemedText color="secondary">{item.description}</ThemedText>
            </View>

            <Pressable
              style={{
                borderWidth: 1,
                borderColor: theme.semantic.border.subtle,
                borderRadius: theme.radius.sm,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[3]
              }}
            >
              <ThemedText variant="label" size="sm" color="brand">
                {item.actionLabel}
              </ThemedText>
            </Pressable>
          </SurfaceCard>
        ))}
      </View>
    </View>
  );
}
