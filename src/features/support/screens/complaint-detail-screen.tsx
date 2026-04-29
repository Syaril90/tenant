import type { ComponentProps } from "react";
import { Image, Linking, Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useComplaintDetailQuery } from "@/features/support/queries/use-complaint-detail-query";
import type {
  ComplaintDetailAttachment,
  ComplaintDetailStatusTone
} from "@/features/support/types/support";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type ComplaintDetailRouteParams = {
  complaintId?: string;
};

const attachmentIcons: Record<ComplaintDetailAttachment["type"], IoniconName> = {
  image: "image-outline",
  video: "videocam-outline",
  document: "document-text-outline"
};

export function ComplaintDetailScreen() {
  const { colorScheme, theme } = useAppTheme();
  const params = useLocalSearchParams<ComplaintDetailRouteParams>();
  const detailQuery = useComplaintDetailQuery(params.complaintId);

  if (detailQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading complaint details..." />
      </Screen>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Complaint details unavailable"
          description="The complaint detail mock request could not be loaded."
        />
      </Screen>
    );
  }

  const { items, labels } = detailQuery.data;
  const complaint = items[0];

  if (!complaint) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={labels.notFoundTitle}
          description={labels.notFoundDescription}
        />
      </Screen>
    );
  }

  const statusStyle =
    colorScheme === "dark"
      ? {
          warning: { backgroundColor: "#4A2E21", color: "#F0C674" },
          success: { backgroundColor: "#173528", color: "#7ED8A7" },
          neutral: { backgroundColor: "#1A2A3D", color: "#C9D4E0" }
        }[complaint.statusTone]
      : {
          warning: { backgroundColor: "#FFE4DE", color: "#C94E2F" },
          success: { backgroundColor: "#ECF9F1", color: "#1B7A46" },
          neutral: { backgroundColor: "#EDF2F7", color: "#51606D" }
        }[complaint.statusTone];

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }}
      >
        <View style={{ gap: theme.spacing[6] }}>
          <View
            style={{
              marginHorizontal: -theme.spacing[6],
              marginTop: -theme.spacing[6],
              paddingHorizontal: theme.spacing[6],
              paddingTop: theme.spacing[5],
              paddingBottom: theme.spacing[6],
              backgroundColor:
                colorScheme === "dark" ? theme.semantic.background.app : "#F3F7FB",
              borderBottomWidth: colorScheme === "dark" ? 1 : 0,
              borderColor: colorScheme === "dark" ? theme.semantic.border.soft : "transparent",
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28,
              gap: theme.spacing[5]
            }}
          >
            <View style={{ gap: theme.spacing[2] }}>
              <ThemedText
                variant="label"
                size="sm"
                color="tertiary"
                style={{ letterSpacing: 1.4 }}
              >
                {complaint.eyebrow}
              </ThemedText>
              <ThemedText
                variant="heading"
                size="xl"
                color="brand"
                style={{ maxWidth: 240, lineHeight: 38 }}
              >
                {complaint.title}
              </ThemedText>
              <View style={{ flexDirection: "row", gap: theme.spacing[2], flexWrap: "wrap" }}>
                <TagChip
                  label={complaint.category}
                  backgroundColor={
                    colorScheme === "dark" ? theme.semantic.background.muted : "#EEF2F6"
                  }
                  color={theme.semantic.foreground.tertiary}
                />
                <TagChip
                  label={complaint.priorityLabel}
                  backgroundColor={statusStyle.backgroundColor}
                  color={statusStyle.color}
                />
              </View>
              <ThemedText color="secondary">{complaint.reportDateLabel}</ThemedText>
            </View>

            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              <Pressable
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: theme.radius.md,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.semantic.background.surface
                }}
              >
                <ThemedText color="brand">
                  {complaint.secondaryActionLabel}
                </ThemedText>
              </Pressable>

              <Pressable
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: theme.radius.md,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.semantic.foreground.brand,
                  shadowColor: theme.shadow.floating.shadowColor,
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 4
                }}
              >
                <ThemedText color="inverse">{complaint.primaryActionLabel}</ThemedText>
              </Pressable>
            </View>
          </View>

          <SurfaceCard
            elevated={false}
            style={{
              gap: theme.spacing[5],
              borderRadius: 28,
              paddingVertical: theme.spacing[6]
            }}
          >
            <ThemedText variant="heading" size="lg" color="brand">
              {complaint.summaryTitle}
            </ThemedText>
            <ThemedText color="secondary" size="lg" style={{ lineHeight: 30 }}>
              {complaint.summaryBody}
            </ThemedText>

            <View style={{ flexDirection: "row", gap: theme.spacing[3] }}>
              {complaint.previews.map((preview) => (
                <Image
                  key={preview.id}
                  source={{ uri: preview.imageUrl }}
                  resizeMode="cover"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: theme.radius.md,
                    backgroundColor: theme.semantic.background.muted
                  }}
                />
              ))}
            </View>

            <Pressable
              style={{
                width: 102,
                height: 40,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: theme.semantic.border.subtle,
                alignItems: "center",
                justifyContent: "center",
                gap: 2
              }}
            >
              <Ionicons name="camera-outline" size={15} color={theme.semantic.foreground.tertiary} />
              <ThemedText variant="label" size="sm" color="tertiary">
                {complaint.addMoreLabel}
              </ThemedText>
            </Pressable>
          </SurfaceCard>

          <SurfaceCard
            muted
            elevated={false}
            style={{
              gap: theme.spacing[5],
              borderRadius: 28,
              backgroundColor:
                colorScheme === "dark" ? theme.semantic.background.app : "#F0F5FB",
              borderWidth: colorScheme === "dark" ? 1 : 0,
              borderColor: colorScheme === "dark" ? theme.semantic.border.soft : "transparent"
            }}
          >
            <ThemedText variant="heading" size="lg" color="brand">
              {complaint.timelineTitle}
            </ThemedText>
            <View style={{ gap: theme.spacing[4] }}>
              {complaint.timeline.map((item) => (
                <TimelineRow
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  timestamp={item.timestamp}
                  isCurrent={item.isCurrent}
                />
              ))}
            </View>
          </SurfaceCard>

          <SurfaceCard
            muted
            elevated={false}
            style={{
              gap: theme.spacing[4],
              borderRadius: 28,
              backgroundColor:
                colorScheme === "dark" ? theme.semantic.background.app : "#EAF0F7",
              borderWidth: colorScheme === "dark" ? 1 : 0,
              borderColor: colorScheme === "dark" ? theme.semantic.border.soft : "transparent"
            }}
          >
            <ThemedText variant="label" size="md" color="brand">
              {complaint.attachmentsTitle}
            </ThemedText>
            <View style={{ gap: theme.spacing[3] }}>
              {complaint.attachments.map((attachment) => (
                <AttachmentRow
                  key={attachment.id}
                  attachment={attachment}
                />
              ))}
            </View>
          </SurfaceCard>

          <View
            style={{
              backgroundColor: theme.semantic.foreground.brand,
              borderRadius: 28,
              paddingHorizontal: theme.spacing[6],
              paddingVertical: theme.spacing[6],
              gap: theme.spacing[4]
            }}
          >
            <ThemedText
              variant="label"
              size="md"
              style={{
                color:
                  colorScheme === "dark"
                    ? "rgba(247,250,253,0.72)"
                    : "rgba(255,255,255,0.72)"
              }}
            >
              {complaint.conciergeTitle}
            </ThemedText>
            <ThemedText
              style={{
                color: theme.semantic.foreground.inverse,
                fontStyle: "italic",
                lineHeight: 24
              }}
            >
              "{complaint.conciergeMessage}"
            </ThemedText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(247,250,253,0.14)"
                      : "rgba(255,255,255,0.18)"
                }}
              >
                <ThemedText variant="label" size="sm" color="inverse">
                  SM
                </ThemedText>
              </View>
              <View style={{ gap: 2 }}>
                <ThemedText color="inverse">{complaint.conciergeManagerName}</ThemedText>
                <ThemedText
                  style={{
                    color:
                      colorScheme === "dark"
                        ? "rgba(247,250,253,0.68)"
                        : "rgba(255,255,255,0.68)"
                  }}
                >
                  {complaint.conciergeManagerRole}
                </ThemedText>
              </View>
            </View>
          </View>

          <SurfaceCard
            elevated={false}
            style={{
              gap: theme.spacing[4],
              borderRadius: 24,
              paddingVertical: theme.spacing[6]
            }}
          >
            <ThemedText variant="label" size="md" color="tertiary">
              {complaint.helpTitle}
            </ThemedText>
            <ThemedText color="secondary">{complaint.helpBody}</ThemedText>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <ThemedText color="brand">{complaint.helpActionLabel}</ThemedText>
              <Ionicons name="arrow-forward" size={18} color={theme.semantic.foreground.brand} />
            </Pressable>
          </SurfaceCard>

          <Pressable
            onPress={() => router.replace("/(tabs)/support")}
            style={{ alignItems: "center", paddingVertical: theme.spacing[2] }}
          >
            <ThemedText color="brand">{labels.backToSupportLabel}</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function TagChip({
  label,
  backgroundColor,
  color
}: {
  label: string;
  backgroundColor: string;
  color: string;
}) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 999,
        paddingHorizontal: theme.spacing[3],
        paddingVertical: 6
      }}
    >
      <ThemedText variant="label" size="sm" style={{ color }}>
        {label}
      </ThemedText>
    </View>
  );
}

function TimelineRow({
  title,
  description,
  timestamp,
  isCurrent = false
}: {
  title: string;
  description: string;
  timestamp: string;
  isCurrent?: boolean;
}) {
  const { colorScheme, theme } = useAppTheme();

  if (isCurrent) {
    return (
      <View style={{ flexDirection: "row", gap: theme.spacing[4], alignItems: "flex-start" }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.semantic.foreground.brand,
            marginTop: theme.spacing[1]
          }}
        >
          <Ionicons name="search-outline" size={15} color={theme.semantic.foreground.inverse} />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: theme.semantic.background.surface,
            borderRadius: 18,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[4],
            gap: theme.spacing[2]
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: theme.spacing[2], flexWrap: "wrap" }}>
            <ThemedText variant="label" size="md" color="brand">
              {title}
            </ThemedText>
            <ThemedText variant="label" size="sm" color="tertiary">
              {timestamp}
            </ThemedText>
          </View>
          <ThemedText color="secondary">{description}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing[4],
        alignItems: "flex-start",
        opacity: colorScheme === "dark" ? 0.78 : 0.56
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            colorScheme === "dark" ? theme.semantic.background.surface : "#F8FBFF",
          borderWidth: 1,
          borderColor: theme.semantic.border.soft,
          marginTop: 4
        }}
      >
        <Ionicons
          name={title.toLowerCase() === "submitted" ? "paper-plane-outline" : "checkmark-outline"}
          size={13}
          color={theme.semantic.foreground.tertiary}
        />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="label" size="sm" color="tertiary">
          {title}
        </ThemedText>
        <ThemedText color="secondary">{description}</ThemedText>
        {timestamp ? <ThemedText color="tertiary">{timestamp}</ThemedText> : null}
      </View>
    </View>
  );
}

function AttachmentRow({ attachment }: { attachment: ComplaintDetailAttachment }) {
  const { colorScheme, theme } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        if (attachment.fileUrl) {
          Linking.openURL(attachment.fileUrl).catch(() => {});
        }
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing[3],
        backgroundColor: theme.semantic.background.surface,
        borderRadius: 14,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[4]
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            colorScheme === "dark" ? theme.semantic.background.accent : "#EEF5FB"
        }}
      >
        <Ionicons
          name={attachmentIcons[attachment.type]}
          size={16}
          color={theme.semantic.foreground.brand}
        />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText style={{ fontSize: 12 }}>{attachment.title}</ThemedText>
        <ThemedText color="tertiary" style={{ fontSize: 10, lineHeight: 14 }}>
          {attachment.meta}
        </ThemedText>
      </View>
      <Ionicons name="download-outline" size={14} color={theme.semantic.foreground.tertiary} />
    </Pressable>
  );
}
