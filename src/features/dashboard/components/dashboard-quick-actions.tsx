import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import type { DashboardQuickActionsSection } from "@/features/dashboard/types/dashboard";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DashboardQuickActionsProps = {
  section: DashboardQuickActionsSection;
};

export function DashboardQuickActions({ section }: DashboardQuickActionsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {section.eyebrow}
      </ThemedText>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[4] }}>
        {section.items.map((item) => (
          <Pressable
            key={item.id}
            style={{ width: "47.5%" }}
            onPress={() => {
              if (item.id === "register-visitor") {
                router.push("/visitor");
              }

              if (item.id === "submit-complaint") {
                router.push("/support-complaint");
              }

              if (item.id === "request-document") {
                router.push("/request-document");
              }

              if (item.id === "concierge-support") {
                router.push("/support");
              }

              if (item.id === "view-announcements") {
                router.push("/announcements");
              }
            }}
          >
            <SurfaceCard
              elevated={false}
              style={{
                justifyContent: "space-between",
                gap: theme.spacing[4],
                minHeight: 176,
                paddingHorizontal: theme.spacing[4],
                borderRadius: 26
              }}
            >
              <View style={{ gap: theme.spacing[4] }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.radius.md,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: item.accentColor
                  }}
                >
                  <Ionicons
                    name={item.icon as IoniconName}
                    size={20}
                    color={theme.semantic.foreground.brand}
                  />
                </View>

                <View style={{ gap: theme.spacing[2] }}>
                  <View style={{ gap: 2 }}>
                    {item.titleLines.map((line) => (
                      <ThemedText
                        key={line}
                        variant="heading"
                        size="md"
                        color="brand"
                        style={{ lineHeight: 22 }}
                      >
                        {line}
                      </ThemedText>
                    ))}
                  </View>

                  <ThemedText color="secondary">{item.description}</ThemedText>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <ThemedText variant="label" size="sm" color="brand">
                  {item.actionLabel}
                </ThemedText>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={theme.semantic.foreground.brand}
                />
              </View>
            </SurfaceCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
