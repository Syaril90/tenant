import { useState } from "react";
import { Image, Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HubFeedItem, HubNoticeItem, HubPostItem } from "@/features/hub/types/hub";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type HubFeedCardProps = {
  item: HubFeedItem;
  onReply?: (postId: string, content: string) => void;
};

const currentUserAvatar =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80";

export function HubFeedCard({ item, onReply }: HubFeedCardProps) {
  if (item.type === "notice") {
    return <HubNoticeCard item={item} />;
  }

  return <HubPostCard item={item} onReply={onReply} />;
}

function HubPostCard({
  item,
  onReply
}: {
  item: HubPostItem;
  onReply?: (postId: string, content: string) => void;
}) {
  const { theme } = useAppTheme();
  const [replyDraft, setReplyDraft] = useState("");
  const [replying, setReplying] = useState(false);

  function handleReplySubmit() {
    const trimmed = replyDraft.trim();
    if (!trimmed || !onReply) {
      return;
    }

    onReply(item.id, trimmed);
    setReplyDraft("");
    setReplying(false);
  }

  return (
    <SurfaceCard elevated={false} style={{ gap: theme.spacing[4] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: theme.spacing[3], flex: 1 }}>
          <Image
            source={{ uri: item.author.avatarUrl }}
            style={{ width: 34, height: 34, borderRadius: 17 }}
          />
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText variant="label" size="md" color="primary">
              {item.author.name}
            </ThemedText>
            <ThemedText color="tertiary" style={{ fontSize: 11, lineHeight: 16 }}>
              {item.author.meta}
            </ThemedText>
          </View>
        </View>

        <Ionicons name="ellipsis-horizontal" size={16} color={theme.semantic.foreground.tertiary} />
      </View>

      <ThemedText color="primary" style={{ lineHeight: 24 }}>
        {item.content}
      </ThemedText>

      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 230,
            borderRadius: theme.radius.md,
            backgroundColor: theme.semantic.background.muted
          }}
        />
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[5] }}>
          <Stat icon="heart" value={item.likeCount} />
          <Stat icon="chatbubble-outline" value={item.commentCount} />
        </View>

        <Pressable hitSlop={8}>
          <Ionicons name="share-social-outline" size={16} color={theme.semantic.foreground.tertiary} />
        </Pressable>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: theme.semantic.border.soft
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <ActionButton icon="heart-outline" label="Like" />
        <ActionButton
          icon="chatbubble-outline"
          label="Comment"
          active={replying}
          onPress={() => setReplying((current) => !current)}
        />
        <ActionButton icon="share-social-outline" label="Share" />
      </View>

      {item.replies?.length || replying ? (
        <View style={{ gap: theme.spacing[4] }}>
          {(item.replies ?? []).map((reply) => (
            <View key={reply.id} style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing[3] }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme.semantic.background.accent,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ThemedText variant="label" size="sm" color="brand">
                  {reply.authorName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </ThemedText>
              </View>

              <View style={{ flex: 1, gap: theme.spacing[1] }}>
                <View
                  style={{
                    backgroundColor: theme.semantic.background.muted,
                    borderRadius: 18,
                    paddingHorizontal: theme.spacing[4],
                    paddingVertical: theme.spacing[3],
                    gap: 4
                  }}
                >
                  <ThemedText variant="label" size="sm" color="primary">
                    {reply.authorName}
                  </ThemedText>
                  <ThemedText color="secondary">{reply.content}</ThemedText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3], paddingLeft: theme.spacing[2] }}>
                  <ThemedText color="tertiary" style={{ fontSize: 11 }}>
                    Just now
                  </ThemedText>
                  <ThemedText color="tertiary" style={{ fontSize: 11 }}>
                    Like
                  </ThemedText>
                  <ThemedText color="tertiary" style={{ fontSize: 11 }}>
                    Reply
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}

          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: theme.spacing[3] }}>
            <Image
              source={{ uri: currentUserAvatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />

            <View
              style={{
                flex: 1,
                borderRadius: 20,
                backgroundColor: theme.semantic.background.muted,
                paddingLeft: theme.spacing[4],
                paddingRight: theme.spacing[3],
                paddingVertical: theme.spacing[2],
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing[2]
              }}
            >
              <TextInput
                value={replyDraft}
                onChangeText={setReplyDraft}
                placeholder="Write a public comment..."
                placeholderTextColor={theme.semantic.foreground.tertiary}
                style={{
                  flex: 1,
                  color: theme.semantic.foreground.primary,
                  paddingVertical: 4
                }}
              />

              <Pressable onPress={handleReplySubmit} disabled={!replyDraft.trim()} hitSlop={8}>
                <Ionicons
                  name="send"
                  size={16}
                  color={
                    replyDraft.trim()
                      ? theme.semantic.foreground.brand
                      : theme.semantic.foreground.tertiary
                  }
                />
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </SurfaceCard>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  active = false
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  active?: boolean;
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 2 }}
    >
      <Ionicons
        name={icon}
        size={16}
        color={active ? theme.semantic.foreground.brand : theme.semantic.foreground.secondary}
      />
      <ThemedText
        color={active ? "brand" : "secondary"}
        style={{ fontSize: 12 }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function HubNoticeCard({ item }: { item: HubNoticeItem }) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard
      muted
      elevated={false}
      style={{
        gap: theme.spacing[4],
        borderRadius: theme.radius.lg,
        backgroundColor: "#EDF3FC"
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ gap: theme.spacing[1], flex: 1 }}>
          <ThemedText variant="label" size="sm" color="brand">
            {item.badge}
          </ThemedText>
          <ThemedText variant="heading" size="lg" color="brand">
            {item.title}
          </ThemedText>
        </View>
        <Ionicons name="megaphone-outline" size={18} color="#B8C6DA" />
      </View>

      <ThemedText color="secondary">{item.description}</ThemedText>

      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
        <Ionicons name="time-outline" size={12} color={theme.semantic.foreground.brand} />
        <ThemedText variant="label" size="sm" color="brand">
          {item.meta}
        </ThemedText>
      </View>
    </SurfaceCard>
  );
}

function Stat({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: number }) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Ionicons name={icon} size={15} color={theme.semantic.foreground.secondary} />
      <ThemedText color="secondary" style={{ fontSize: 12 }}>
        {value}
      </ThemedText>
    </View>
  );
}
