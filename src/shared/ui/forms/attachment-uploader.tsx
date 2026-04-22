import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { SharedAttachment } from "@/shared/lib/document-picker";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { FormField } from "@/shared/ui/forms/form-field";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type AttachmentUploaderProps = {
  label: string;
  title: string;
  description?: string;
  buttonLabel: string;
  iconName?: string;
  attachments: SharedAttachment[];
  onBrowse: () => void;
  onRemoveAttachment: (attachmentId: string) => void;
};

export function AttachmentUploader({
  label,
  title,
  description,
  buttonLabel,
  iconName = "document-attach-outline",
  attachments,
  onBrowse,
  onRemoveAttachment
}: AttachmentUploaderProps) {
  const { theme } = useAppTheme();

  return (
    <FormField label={label}>
      <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[4] }}>
        <View
          style={{
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: theme.semantic.border.subtle,
            borderRadius: theme.radius.md,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing[6],
            paddingVertical: theme.spacing[8],
            gap: theme.spacing[3],
            backgroundColor: theme.semantic.background.surface
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.semantic.background.accent
            }}
          >
            <Ionicons
              name={iconName as never}
              size={20}
              color={theme.semantic.foreground.brand}
            />
          </View>

          <View style={{ gap: theme.spacing[1], alignItems: "center" }}>
            <ThemedText variant="heading" size="md">
              {title}
            </ThemedText>
            {description ? (
              <ThemedText color="secondary" style={{ textAlign: "center" }}>
                {description}
              </ThemedText>
            ) : null}
          </View>

          <Pressable
            onPress={onBrowse}
            style={{
              backgroundColor: "#DDE7FF",
              borderRadius: theme.radius.pill,
              paddingHorizontal: theme.spacing[5],
              paddingVertical: theme.spacing[3]
            }}
          >
            <ThemedText variant="label" size="md" color="brand">
              {buttonLabel}
            </ThemedText>
          </Pressable>
        </View>

        {attachments.length ? (
          <View style={{ gap: theme.spacing[3] }}>
            {attachments.map((attachment) => (
              <View
                key={attachment.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing[3],
                  backgroundColor: theme.semantic.background.surface,
                  borderRadius: theme.radius.sm,
                  paddingHorizontal: theme.spacing[4],
                  paddingVertical: theme.spacing[3]
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.semantic.background.accent
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={theme.semantic.foreground.brand}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <ThemedText variant="label" size="sm" color="primary">
                    {attachment.name}
                  </ThemedText>
                  <ThemedText color="tertiary">
                    {attachment.sizeLabel} • {attachment.mimeType}
                  </ThemedText>
                </View>

                <Pressable
                  onPress={() => onRemoveAttachment(attachment.id)}
                  hitSlop={8}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Ionicons name="close" size={16} color={theme.semantic.foreground.tertiary} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}
      </SurfaceCard>
    </FormField>
  );
}
