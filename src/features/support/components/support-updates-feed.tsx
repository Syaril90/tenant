import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";
import { router } from "expo-router";

import type {
  SupportUpdate,
  SupportUpdatesSection,
  SupportUpdateTagTone
} from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type SupportUpdatesFeedProps = {
  section: SupportUpdatesSection;
};

const tagToneStyles: Record<SupportUpdateTagTone, { background: string; color: string }> = {
  urgent: { background: "#FFE8E8", color: "#D33B32" },
  neutral: { background: "#EDF2FA", color: "#56667A" }
};

export function SupportUpdatesFeed({ section }: SupportUpdatesFeedProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ThemedText variant="label" size="md" color="tertiary">
          {section.title}
        </ThemedText>
        <Pressable onPress={() => router.push("/announcements")}>
          <ThemedText variant="label" size="md" color="brand">
            {section.viewAllLabel}
          </ThemedText>
        </Pressable>
      </View>

      <View style={{ gap: theme.spacing[4] }}>
        {section.items.map((item) => (
          <SupportUpdateCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

function SupportUpdateCard({ item }: { item: SupportUpdate }) {
  const { theme } = useAppTheme();
  const tagTone = tagToneStyles[item.tagTone];

  if (item.variant === "compact") {
    return (
      <SurfaceCard elevated={false} style={{ gap: theme.spacing[3] }}>
        <View style={{ flexDirection: "row", gap: theme.spacing[4] }}>
          <View style={{ flex: 1, gap: theme.spacing[2] }}>
            <TagPill tag={item.tag} metaLabel={item.metaLabel} />
            <ThemedText variant="heading" size="md">
              {item.title}
            </ThemedText>
            <ThemedText color="secondary">{item.description}</ThemedText>
          </View>

          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: 84, height: 62, borderRadius: theme.radius.sm }}
            />
          ) : null}
        </View>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard
      elevated={false}
      style={{
        gap: theme.spacing[4],
        borderLeftWidth: item.variant === "alert" ? 3 : 0,
        borderLeftColor: item.variant === "alert" ? "#D33B32" : "transparent",
        paddingLeft: item.variant === "alert" ? theme.spacing[4] : theme.spacing[5]
      }}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: "100%",
            height: item.variant === "featured" ? 140 : 110,
            borderRadius: theme.radius.md
          }}
          resizeMode="cover"
        />
      ) : null}

      <View style={{ gap: theme.spacing[3] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
          <View
            style={{
              backgroundColor: tagTone.background,
              borderRadius: 999,
              paddingHorizontal: theme.spacing[2],
              paddingVertical: 4
            }}
          >
            <ThemedText variant="label" size="sm" style={{ color: tagTone.color }}>
              {item.tag}
            </ThemedText>
          </View>
          {item.metaLabel ? <ThemedText color="tertiary">{item.metaLabel}</ThemedText> : null}
        </View>

        <View style={{ gap: theme.spacing[2] }}>
          <ThemedText variant="heading" size="lg">
            {item.title}
          </ThemedText>
          <ThemedText color="secondary">{item.description}</ThemedText>
        </View>

        {item.footerType === "avatars" ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AvatarStack />
              <ThemedText variant="label" size="sm" color="tertiary" style={{ marginLeft: theme.spacing[2] }}>
                {item.footerLabel}
              </ThemedText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <ThemedText variant="label" size="sm" color="brand">
                {item.actionLabel}
              </ThemedText>
              <Ionicons name="chevron-forward" size={14} color={theme.semantic.foreground.brand} />
            </View>
          </View>
        ) : null}

        {item.footerType === "date" ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
              <Ionicons name="calendar-outline" size={14} color={theme.semantic.foreground.tertiary} />
              <ThemedText color="tertiary">{item.footerLabel}</ThemedText>
            </View>
            <Ionicons name="bookmark-outline" size={16} color={theme.semantic.foreground.brand} />
          </View>
        ) : null}
      </View>
    </SurfaceCard>
  );
}

function TagPill({ tag, metaLabel }: { tag: string; metaLabel?: string }) {
  const { theme } = useAppTheme();
  const tone = tagToneStyles.neutral;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
      <View
        style={{
          backgroundColor: tone.background,
          borderRadius: 999,
          paddingHorizontal: theme.spacing[2],
          paddingVertical: 4
        }}
      >
        <ThemedText variant="label" size="sm" style={{ color: tone.color }}>
          {tag}
        </ThemedText>
      </View>
      {metaLabel ? <ThemedText color="tertiary">{metaLabel}</ThemedText> : null}
    </View>
  );
}

function AvatarStack() {
  const colors = ["#F5C2A5", "#C9D8F4"];

  return (
    <View style={{ flexDirection: "row" }}>
      {colors.map((backgroundColor, index) => (
        <View
          key={backgroundColor}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor,
            marginLeft: index === 0 ? 0 : -8,
            borderWidth: 1.5,
            borderColor: "#FFFFFF"
          }}
        />
      ))}
    </View>
  );
}
