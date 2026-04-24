import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { VisitorActivity } from "@/features/visitor/types/visitor";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type VisitorActivityListProps = {
  label: string;
  activity: VisitorActivity[];
};

export function VisitorActivityList({ label, activity }: VisitorActivityListProps) {
  const { colorScheme, theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {activity.map((item, index) => (
          <SurfaceCard
            key={item.id}
            style={{
              gap: theme.spacing[4],
              borderRadius: 24,
              paddingVertical: theme.spacing[5]
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[4] }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: theme.spacing[4],
                  flex: 1
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: colorScheme === "dark" ? "#1A2A3D" : "#EAF2FF",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={theme.semantic.foreground.brand}
                  />
                </View>

                <View style={{ gap: 4, flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: theme.spacing[3]
                    }}
                  >
                    <ThemedText variant="heading" size="md" style={{ flex: 1 }}>
                      {item.title}
                    </ThemedText>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor:
                          colorScheme === "dark" ? "#1A2A3D" : "#EAF2FF",
                        borderRadius: theme.radius.pill,
                        paddingHorizontal: theme.spacing[2],
                        paddingVertical: 2
                      }}
                    >
                      <ThemedText variant="label" size="sm" color="brand">
                        Visitor Log
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText color="tertiary">{item.timestampLabel}</ThemedText>
                  <ThemedText color="secondary">{item.description}</ThemedText>
                </View>
              </View>
            </View>
          </SurfaceCard>
        ))}
      </View>
    </View>
  );
}
