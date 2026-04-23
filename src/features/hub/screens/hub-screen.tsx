import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { getUserIdentity } from "@/features/auth/lib/user-identity";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { HubComposerCard } from "@/features/hub/components/hub-composer-card";
import { HubFeedCard } from "@/features/hub/components/hub-feed-card";
import hubJson from "@/features/hub/data/hub.json";
import { useHubQuery } from "@/features/hub/queries/use-hub-query";
import type { HubFeedItem, HubModel, HubPostItem } from "@/features/hub/types/hub";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";

export function HubScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const hubQuery = useHubQuery();
  const fallbackContent = hubJson as HubModel;
  const [feedItems, setFeedItems] = useState<HubFeedItem[]>([]);
  const identity = getUserIdentity(user);

  useEffect(() => {
    if (hubQuery.data?.feed) {
      setFeedItems(hubQuery.data.feed);
    }
  }, [hubQuery.data?.feed]);

  if (hubQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackContent.messages.loading} />
      </Screen>
    );
  }

  if (hubQuery.isError || !hubQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={fallbackContent.messages.errorTitle}
          description={fallbackContent.messages.errorDescription}
        />
      </Screen>
    );
  }

  const data = hubQuery.data;

  function handlePost(content: string) {
    const nextPost: HubPostItem = {
      id: `local-post-${Date.now()}`,
      type: "post",
      author: {
        name: identity.displayName,
        avatarUrl: identity.avatarUrl ?? "",
        meta: "Just now • Tower Residence"
      },
      content,
      likeCount: 0,
      commentCount: 0
    };

    setFeedItems((current) => [nextPost, ...current]);
  }

  function handleReply(postId: string, content: string) {
    setFeedItems((current) =>
      current.map((post) =>
        post.type === "post" && post.id === postId
          ? {
              ...post,
              commentCount: post.commentCount + 1,
              replies: [
                ...(post.replies ?? []),
                {
                  id: `reply-${Date.now()}`,
                  authorName: identity.displayName,
                  content
                }
              ]
            }
          : post
      )
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ gap: theme.spacing[6] }}>
          <HubComposerCard composer={data.composer} onPost={handlePost} />

          <View style={{ gap: theme.spacing[4] }}>
            {feedItems.map((item) => (
              <HubFeedCard key={item.id} item={item} onReply={handleReply} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
