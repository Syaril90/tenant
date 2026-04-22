import { Pressable, View } from "react-native";

import type { DocumentsHelpCard as DocumentsHelpCardModel } from "@/features/documents/types/documents";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type DocumentsHelpCardProps = {
  card: DocumentsHelpCardModel;
};

export function DocumentsHelpCard({ card }: DocumentsHelpCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.foreground.brand,
        borderRadius: 28,
        paddingHorizontal: theme.spacing[8],
        paddingVertical: theme.spacing[8],
        gap: theme.spacing[4]
      }}
    >
      <View>
        {card.titleLines.map((line) => (
          <ThemedText key={line} variant="heading" size="xl" color="inverse">
            {line}
          </ThemedText>
        ))}
      </View>

      <ThemedText color="inverse">{card.description}</ThemedText>

      <Pressable
        style={{
          alignSelf: "flex-start",
          backgroundColor: theme.semantic.background.surface,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing[8],
          paddingVertical: theme.spacing[4]
        }}
      >
        <ThemedText color="brand">{card.primaryActionLabel}</ThemedText>
      </Pressable>
    </View>
  );
}

