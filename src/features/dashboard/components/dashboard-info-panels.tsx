import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { DashboardContactSection } from "@/features/dashboard/types/dashboard";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DashboardInfoPanelsProps = {
  contacts: DashboardContactSection;
};

export function DashboardInfoPanels({ contacts }: DashboardInfoPanelsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[3] }}>
      {contacts.items.map((contact) => (
        <Pressable key={contact.id}>
          <SurfaceCard
            style={{
              gap: theme.spacing[4],
              borderRadius: 26
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: theme.spacing[4]
              }}
            >
              <View style={{ flexDirection: "row", gap: theme.spacing[4], flex: 1 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: theme.radius.md,
                    backgroundColor: contact.accentColor,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Ionicons
                    name={contact.icon as IoniconName}
                    size={20}
                    color={theme.semantic.foreground.brand}
                  />
                </View>

                <View style={{ gap: theme.spacing[1], flex: 1 }}>
                  <ThemedText variant="label" size="sm" color="tertiary">
                    {contact.eyebrow}
                  </ThemedText>
                  <ThemedText variant="heading" size="lg">
                    {contact.title}
                  </ThemedText>
                  <ThemedText color="secondary">{contact.description}</ThemedText>
                </View>
              </View>

              <Ionicons name="call-outline" size={18} color={theme.semantic.foreground.brand} />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <ThemedText variant="label" size="sm" color="brand">
                {contact.actionLabel}
              </ThemedText>
              <Ionicons name="chevron-forward" size={14} color={theme.semantic.foreground.brand} />
            </View>
          </SurfaceCard>
        </Pressable>
      ))}
    </View>
  );
}
