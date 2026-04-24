import type { ComponentProps } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { PaymentDetailRow } from "@/features/bills/components/payment-detail-row";
import { useAnnouncementDetailQuery } from "@/features/dashboard/queries/use-announcement-detail-query";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type AnnouncementRouteParams = {
  announcementId?: string;
};

export function AnnouncementDetailScreen() {
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<AnnouncementRouteParams>();
  const detailQuery = useAnnouncementDetailQuery();

  if (detailQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading announcement..." />
      </Screen>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Announcement unavailable"
          description="The mock announcement details could not be loaded."
        />
      </Screen>
    );
  }

  const { items, labels } = detailQuery.data;
  const announcement = items.find((item) => item.id === params.announcementId);

  if (!announcement) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Announcement not found"
          description="The selected notice does not exist in the current mock feed."
        />
      </Screen>
    );
  }

  const badgeColor =
    announcement.badgeTone === "danger"
      ? theme.semantic.status.danger
      : theme.semantic.foreground.brand;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120, gap: theme.spacing[6] }}
      >
        <View style={{ paddingHorizontal: theme.spacing[4], gap: theme.spacing[6] }}>
          <View style={{ gap: theme.spacing[3] }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing[3],
                flexWrap: "wrap"
              }}
            >
              <View
                style={{
                  backgroundColor:
                    announcement.badgeTone === "danger"
                      ? "#FCE7E4"
                      : theme.semantic.background.accent,
                  borderRadius: theme.radius.pill,
                  paddingHorizontal: theme.spacing[3],
                  paddingVertical: theme.spacing[2]
                }}
              >
                <ThemedText variant="label" size="sm" style={{ color: badgeColor }}>
                  {announcement.badge}
                </ThemedText>
              </View>
              <ThemedText color="tertiary">{announcement.publishedAt}</ThemedText>
            </View>

            <ThemedText variant="heading" size="xl">
              {announcement.title}
            </ThemedText>
            <ThemedText color="secondary" size="lg">
              {announcement.description}
            </ThemedText>
          </View>

          <View
            style={{
              height: 190,
              borderRadius: theme.radius.lg,
              overflow: "hidden",
              backgroundColor: announcement.accentColor
            }}
          >
            <Image
              source={{ uri: announcement.imageUri }}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View style={{ gap: theme.spacing[3] }}>
            <ThemedText variant="heading" size="lg" color="brand">
              {announcement.summaryTitle}
            </ThemedText>
            {announcement.summaryParagraphs.map((paragraph) => (
              <ThemedText key={paragraph} color="secondary" size="lg">
                {paragraph}
              </ThemedText>
            ))}
          </View>

          <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[3] }}>
            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              <View
                style={{
                  width: 3,
                  borderRadius: theme.radius.pill,
                  backgroundColor: theme.semantic.foreground.brand
                }}
              />
              <View style={{ gap: theme.spacing[2], flex: 1 }}>
                <ThemedText variant="heading" size="md">
                  {announcement.highlightedAreaTitle}
                </ThemedText>
                {announcement.highlightedAreaItems.map((item) => (
                  <ThemedText key={item} color="secondary">
                    • {item}
                  </ThemedText>
                ))}
              </View>
            </View>
          </SurfaceCard>

          <View style={{ gap: theme.spacing[3] }}>
            <ThemedText variant="heading" size="lg" color="brand">
              {announcement.timelineTitle}
            </ThemedText>
            {announcement.timelineParagraphs.map((paragraph) => (
              <ThemedText key={paragraph} color="secondary" size="lg">
                {paragraph}
              </ThemedText>
            ))}
          </View>

          <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[4] }}>
            <InfoRow icon="timer-outline" label={announcement.etaLabel} value={announcement.etaValue} />
            <InfoRow icon="people-outline" label={announcement.teamLabel} value={announcement.teamValue} />
          </SurfaceCard>

          <SurfaceCard style={{ gap: theme.spacing[4] }}>
            <ThemedText variant="label" size="md" color="tertiary">
              {labels.attachmentsTitle}
            </ThemedText>
            {announcement.attachments.map((attachment) => (
              <AttachmentRow
                key={attachment.id}
                title={attachment.title}
                meta={attachment.meta}
                type={attachment.type}
              />
            ))}
          </SurfaceCard>

          <SurfaceCard
            style={{
              gap: theme.spacing[3],
              backgroundColor: theme.semantic.foreground.brand,
              paddingVertical: theme.spacing[8],
              paddingHorizontal: theme.spacing[6],
              borderRadius: 28
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: theme.radius.pill,
                borderWidth: 1.5,
                borderColor: "rgba(255,255,255,0.75)",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
              }}
            >
              <Ionicons name="help" size={18} color={theme.semantic.foreground.inverse} />
            </View>
            <ThemedText
              variant="heading"
              size="lg"
              style={{ color: theme.semantic.foreground.inverse, textAlign: "center" }}
            >
              {announcement.supportTitle}
            </ThemedText>
            <ThemedText style={{ color: "rgba(255,255,255,0.82)", textAlign: "center" }}>
              {announcement.supportDescription}
            </ThemedText>

            <Pressable
              onPress={() => router.replace("/(tabs)/support")}
              style={{
                marginTop: theme.spacing[2],
                backgroundColor: theme.semantic.foreground.inverse,
                borderRadius: theme.radius.sm,
                paddingVertical: theme.spacing[4],
                alignItems: "center"
              }}
            >
              <ThemedText color="brand">{labels.primaryCtaLabel}</ThemedText>
            </Pressable>
          </SurfaceCard>

          <SurfaceCard style={{ gap: theme.spacing[4] }}>
            <PaymentDetailRow label={labels.category} value={announcement.badge} />
            <PaymentDetailRow label={labels.publishedAt} value={announcement.publishedAt} />
            <PaymentDetailRow label={labels.affectedArea} value={announcement.affectedArea} />
            <PaymentDetailRow label={labels.schedule} value={announcement.schedule} />
            <PaymentDetailRow label={labels.contact} value={announcement.contact} emphasized />
          </SurfaceCard>

          <Pressable
            onPress={() => router.replace("/")}
            style={{ alignItems: "center", paddingVertical: theme.spacing[2] }}
          >
            <ThemedText color="brand">{labels.secondaryCtaLabel}</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value
}: {
  icon: IoniconName;
  label: string;
  value: string;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}>
      <Ionicons name={icon} size={18} color={theme.semantic.foreground.brand} />
      <View style={{ flex: 1 }}>
        <ThemedText variant="label" size="sm" color="tertiary">
          {label}
        </ThemedText>
        <ThemedText variant="heading" size="md">
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

function AttachmentRow({
  title,
  meta,
  type
}: {
  title: string;
  meta: string;
  type: "pdf" | "image";
}) {
  const { theme } = useAppTheme();
  const iconName: IoniconName = type === "pdf" ? "document-text-outline" : "map-outline";
  const iconColor = type === "pdf" ? theme.semantic.status.danger : theme.semantic.foreground.brand;
  const actionIcon: IoniconName = type === "pdf" ? "download-outline" : "eye-outline";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing[3],
        backgroundColor: theme.semantic.background.app,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[4]
      }}
    >
      <View style={{ width: 34, height: 34, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText>{title}</ThemedText>
        <ThemedText color="tertiary" style={{ fontSize: 11 }}>
          {meta}
        </ThemedText>
      </View>
      <Ionicons name={actionIcon} size={18} color={theme.semantic.foreground.tertiary} />
    </View>
  );
}
