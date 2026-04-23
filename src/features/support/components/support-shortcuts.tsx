import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { router } from "expo-router";

import type { SupportShortcutSection, SupportShortcutTone } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type SupportShortcutsProps = {
  section: SupportShortcutSection;
};

const toneMap: Record<SupportShortcutTone, { background: string; icon: string }> = {
  brand: { background: "#E8F1FF", icon: "#1F5EFF" },
  highlight: { background: "#EEF8F1", icon: "#198155" },
  accent: { background: "#FFF4E7", icon: "#C7771A" }
};

export function SupportShortcuts({ section }: SupportShortcutsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="sm" color="tertiary">
        {section.title}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {section.items.map((item) => {
          const colors = toneMap[item.tone];

          return (
            <Pressable
              key={item.id}
              onPress={() => {
                if (item.id === "browse-documents") {
                  router.push("/files");
                }
              }}
            >
              <SurfaceCard
                style={{
                  gap: theme.spacing[4],
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.background
                  }}
                >
                  <Ionicons name={item.icon as never} size={20} color={colors.icon} />
                </View>

                <View style={{ flex: 1, gap: theme.spacing[1] }}>
                  <ThemedText variant="heading" size="md">
                    {item.title}
                  </ThemedText>
                  <ThemedText color="secondary">{item.description}</ThemedText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.semantic.foreground.tertiary}
                />
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
