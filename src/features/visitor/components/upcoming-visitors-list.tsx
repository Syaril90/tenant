import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import type { UpcomingVisitor } from "@/features/visitor/types/visitor";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type UpcomingVisitorsListProps = {
  label: string;
  generatePassLabel: string;
  visitors: UpcomingVisitor[];
};

export function UpcomingVisitorsList({
  label,
  generatePassLabel,
  visitors
}: UpcomingVisitorsListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {visitors.map((visitor) => (
          <SurfaceCard key={visitor.id} style={{ gap: theme.spacing[2], paddingVertical: theme.spacing[4] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[4] }}>
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText variant="heading" size="md">
                  {visitor.name}
                </ThemedText>
                <ThemedText color="secondary">{visitor.purpose}</ThemedText>
                <ThemedText color="tertiary">{visitor.vehicleLabel}</ThemedText>
              </View>

              <View style={{ alignItems: "flex-end", gap: 2 }}>
                <ThemedText>{visitor.dateLabel}</ThemedText>
                <ThemedText style={{ color: "#1C7C54" }}>{visitor.statusLabel}</ThemedText>
              </View>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/visitor-pass/[visitorId]",
                  params: {
                    visitorId: visitor.id,
                    name: visitor.name,
                    purpose: visitor.purpose,
                    dateLabel: visitor.dateLabel,
                    vehicleLabel: visitor.vehicleLabel,
                    statusLabel: visitor.statusLabel
                  }
                })
              }
              style={{
                alignSelf: "flex-start",
                backgroundColor: theme.semantic.background.muted,
                borderRadius: theme.radius.sm,
                paddingHorizontal: theme.spacing[4],
                paddingVertical: theme.spacing[3],
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing[2]
              }}
            >
              <Ionicons
                name="qr-code-outline"
                size={16}
                color={theme.semantic.foreground.brand}
              />
              <ThemedText color="brand">{generatePassLabel}</ThemedText>
            </Pressable>
          </SurfaceCard>
        ))}
      </View>
    </View>
  );
}
