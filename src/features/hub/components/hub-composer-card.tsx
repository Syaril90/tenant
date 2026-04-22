import { useState } from "react";
import { Image, Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HubComposer } from "@/features/hub/types/hub";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type HubComposerCardProps = {
  composer: HubComposer;
  onPost: (content: string) => void;
};

const currentUserAvatar =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80";

export function HubComposerCard({ composer, onPost }: HubComposerCardProps) {
  const { theme } = useAppTheme();
  const [draft, setDraft] = useState("");

  function handlePost() {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    onPost(trimmed);
    setDraft("");
  }

  return (
    <SurfaceCard elevated={false} style={{ gap: theme.spacing[4] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing[3] }}>
        <Image
          source={{ uri: currentUserAvatar }}
          style={{ width: 38, height: 38, borderRadius: 19 }}
        />
        <View
          style={{
            flex: 1,
            minHeight: 74,
            borderRadius: theme.radius.md,
            backgroundColor: theme.semantic.background.muted,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[3]
          }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={composer.prompt}
            placeholderTextColor={theme.semantic.foreground.tertiary}
            multiline
            textAlignVertical="top"
            style={{
              minHeight: 44,
              color: theme.semantic.foreground.primary
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[4] }}>
          {composer.actions.map((action) => (
            <View key={action.id} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons
                name={action.icon as never}
                size={14}
                color={theme.semantic.foreground.tertiary}
              />
              <ThemedText color="secondary" style={{ fontSize: 11 }}>
                {action.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handlePost}
          disabled={!draft.trim()}
          style={{
            backgroundColor: theme.semantic.foreground.brand,
            borderRadius: theme.radius.sm,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[3],
            opacity: draft.trim() ? 1 : 0.55
          }}
        >
          <ThemedText color="inverse">{composer.postLabel}</ThemedText>
        </Pressable>
      </View>
    </SurfaceCard>
  );
}
