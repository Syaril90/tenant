import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { router } from "expo-router";

import type { SupportActionsSection } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type SupportCommunityActionsProps = {
  section: SupportActionsSection;
};

export function SupportCommunityActions({ section }: SupportCommunityActionsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {section.title}
      </ThemedText>

      <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
        {section.items.map((item) => (
          <Pressable
            key={item.id}
            style={{ flex: 1 }}
            onPress={() => {
              if (item.id === "submit-complaint") {
                router.push("/support-complaint");
              }

              if (item.id === "share-feedback") {
                router.push("/support-feedback");
              }
            }}
          >
            <SurfaceCard
              elevated={false}
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing[4],
                minHeight: 118,
                paddingHorizontal: theme.spacing[4]
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.semantic.background.accent
                }}
              >
                <Ionicons
                  name={item.icon as never}
                  size={18}
                  color={theme.semantic.foreground.brand}
                />
              </View>
              <ThemedText
                variant="label"
                size="sm"
                color="brand"
                style={{ textAlign: "center", lineHeight: 18 }}
              >
                {item.title}
              </ThemedText>
            </SurfaceCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
