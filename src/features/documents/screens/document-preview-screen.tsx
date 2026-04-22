import { Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useDownloadDocumentMutation } from "@/features/documents/queries/use-download-document-mutation";
import { useDocumentPreviewQuery } from "@/features/documents/queries/use-document-preview-query";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type DocumentPreviewParams = {
  fileId?: string;
};

export function DocumentPreviewScreen() {
  const { theme } = useAppTheme();
  const params = useLocalSearchParams<DocumentPreviewParams>();
  const fileId = params.fileId ?? "";
  const previewQuery = useDocumentPreviewQuery(fileId);
  const downloadMutation = useDownloadDocumentMutation();

  if (previewQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading preview..." />
      </Screen>
    );
  }

  if (previewQuery.isError || !previewQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Preview unavailable"
          description="The selected file could not be opened."
        />
      </Screen>
    );
  }

  const { content, file } = previewQuery.data;

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "space-between", gap: theme.spacing[8] }}>
        <View style={{ gap: theme.spacing[6] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {content.header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {content.header.title}
            </ThemedText>
            <ThemedText color="secondary">{content.header.description}</ThemedText>
          </View>

          <SurfaceCard style={{ gap: theme.spacing[4] }}>
            <ThemedText variant="heading" size="lg">
              {file.previewTitle}
            </ThemedText>
            <DetailRow label={content.labels.fileType} value={file.fileTypeLabel} />
            <DetailRow label={content.labels.fileSize} value={file.sizeLabel} />
            <DetailRow label={content.labels.fileCategory} value={file.categoryLabel} />
            <DetailRow label={content.labels.fileUpdatedAt} value={file.updatedAtLabel} />
            <DetailRow label={content.labels.fileSummary} value={file.previewBody} multiline />
          </SurfaceCard>
        </View>

        <View style={{ gap: theme.spacing[3] }}>
          <Pressable
            onPress={() => downloadMutation.mutate({ fileId: file.id })}
            style={{
              backgroundColor: theme.semantic.foreground.brand,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="inverse">
              {downloadMutation.isPending
                ? "Downloading..."
                : content.labels.primaryCtaLabel}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: theme.semantic.background.surface,
              borderRadius: theme.radius.sm,
              paddingVertical: theme.spacing[4],
              alignItems: "center"
            }}
          >
            <ThemedText color="brand">{content.labels.secondaryCtaLabel}</ThemedText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

function DetailRow({
  label,
  value,
  multiline = false
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: multiline ? "column" : "row",
        justifyContent: "space-between",
        gap: theme.spacing[2]
      }}
    >
      <ThemedText color="tertiary">{label}</ThemedText>
      <ThemedText
        style={{
          flexShrink: 1,
          textAlign: multiline ? "left" : "right"
        }}
      >
        {value}
      </ThemedText>
    </View>
  );
}
