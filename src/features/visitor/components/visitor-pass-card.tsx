import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type VisitorPassCardProps = {
  title: string;
  passCode: string;
};

export function VisitorPassCard({ title, passCode }: VisitorPassCardProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard style={{ gap: theme.spacing[4], alignItems: "center" }}>
      <ThemedText variant="heading" size="lg">
        {title}
      </ThemedText>

      <View
        style={{
          width: 220,
          height: 220,
          borderRadius: theme.radius.md,
          backgroundColor: theme.semantic.background.muted,
          padding: 16,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {Array.from({ length: 49 }).map((_, index) => {
          const active =
            ((index * 7 + passCode.length) % 3 === 0) ||
            index % 5 === 0 ||
            index < 6 ||
            index > 41;

          return (
            <View
              key={index}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                backgroundColor: active
                  ? theme.semantic.foreground.brand
                  : theme.semantic.background.surface
              }}
            />
          );
        })}
      </View>

      <ThemedText color="tertiary">{passCode}</ThemedText>
    </SurfaceCard>
  );
}

