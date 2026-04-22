import { View } from "react-native";

import type { VisitorActivity } from "@/features/visitor/types/visitor";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type VisitorActivityListProps = {
  label: string;
  activity: VisitorActivity[];
};

export function VisitorActivityList({ label, activity }: VisitorActivityListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {activity.map((item) => (
          <SurfaceCard key={item.id} muted elevated={false} style={{ gap: theme.spacing[2], paddingVertical: theme.spacing[4] }}>
            <ThemedText variant="heading" size="md">
              {item.title}
            </ThemedText>
            <ThemedText color="secondary">{item.description}</ThemedText>
            <ThemedText color="tertiary">{item.timestampLabel}</ThemedText>
          </SurfaceCard>
        ))}
      </View>
    </View>
  );
}

