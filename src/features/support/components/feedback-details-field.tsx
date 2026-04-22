import { TextInput, View } from "react-native";

import type { FeedbackFieldSection } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type FeedbackDetailsFieldProps = {
  section: FeedbackFieldSection & { placeholder: string; characterLimit: number };
  value: string;
  onChangeText: (value: string) => void;
};

export function FeedbackDetailsField({
  section,
  value,
  onChangeText
}: FeedbackDetailsFieldProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="secondary">
        {section.title}
      </ThemedText>

      <SurfaceCard elevated={false} style={{ gap: theme.spacing[3] }}>
        <TextInput
          multiline
          value={value}
          onChangeText={(next) => onChangeText(next.slice(0, section.characterLimit))}
          placeholder={section.placeholder}
          placeholderTextColor={theme.semantic.foreground.tertiary}
          textAlignVertical="top"
          style={{
            minHeight: 140,
            color: theme.semantic.foreground.primary
          }}
        />
        <ThemedText color="tertiary" style={{ textAlign: "right" }}>
          {value.length} / {section.characterLimit}
        </ThemedText>
      </SurfaceCard>
    </SurfaceCard>
  );
}
