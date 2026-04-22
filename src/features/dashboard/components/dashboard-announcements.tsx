import type { ComponentProps } from "react";
import { Image, Pressable, View } from "react-native";
import { router } from "expo-router";

import type {
  DashboardAnnouncement,
  DashboardAnnouncementsSection
} from "@/features/dashboard/types/dashboard";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type DashboardAnnouncementsProps = {
  section: DashboardAnnouncementsSection;
};

export function DashboardAnnouncements({ section }: DashboardAnnouncementsProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ThemedText variant="label" size="md" color="tertiary">
          {section.eyebrow}
        </ThemedText>
        <Pressable onPress={() => router.push("/announcements")}>
          <ThemedText color="brand">{section.actionLabel}</ThemedText>
        </Pressable>
      </View>

      <View style={{ gap: theme.spacing[4] }}>
        {section.items.map((item) => (
          <AnnouncementCard
            key={item.id}
            item={item}
            onPress={() =>
              router.push({
                pathname: "/announcements/[announcementId]",
                params: { announcementId: item.id }
              })
            }
          />
        ))}
      </View>
    </View>
  );
}

export function AnnouncementCard({
  item,
  onPress
}: {
  item: DashboardAnnouncement;
  onPress?: () => void;
}) {
  const { theme } = useAppTheme();
  const badgeColor =
    item.badgeTone === "danger"
      ? theme.semantic.status.danger
      : theme.semantic.foreground.brand;

  const content = (
    <SurfaceCard muted elevated={false} style={{ padding: 0, overflow: "hidden", gap: 0 }}>
      <View
        style={{
          height: 190,
          backgroundColor: item.accentColor
        }}
      >
        <Image
          source={{ uri: item.imageUri }}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      <View style={{ paddingHorizontal: theme.spacing[5], paddingVertical: theme.spacing[5], gap: theme.spacing[2] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: theme.radius.pill,
              backgroundColor: badgeColor
            }}
          />
          <ThemedText variant="label" size="sm" style={{ color: badgeColor }}>
            {item.badge}
          </ThemedText>
        </View>

        <ThemedText variant="heading" size="lg">
          {item.title}
        </ThemedText>
        <ThemedText color="secondary">
          {item.description}
        </ThemedText>
      </View>
    </SurfaceCard>
  );

  if (!onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}
