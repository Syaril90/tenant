import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useDownloadDocumentMutation } from "@/features/documents/queries/use-download-document-mutation";
import type {
  DocumentFile,
  DocumentRepository
} from "@/features/documents/types/documents";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type DocumentTableProps = {
  repository: DocumentRepository;
  files: DocumentFile[];
  onClearFilter: () => void;
};

export function DocumentTable({
  repository,
  files,
  onClearFilter
}: DocumentTableProps) {
  const { theme } = useAppTheme();
  const downloadMutation = useDownloadDocumentMutation();
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  function handleDownload(fileId: string) {
    downloadMutation.mutate(
      { fileId },
      {
        onSuccess: (result) => {
          setDownloadedIds((current) =>
            current.includes(result.fileId) ? current : [...current, result.fileId]
          );
        }
      }
    );
  }

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ThemedText variant="heading" size="lg" color="brand">
          {repository.title}
        </ThemedText>
        <Pressable onPress={onClearFilter}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <ThemedText color="brand">{repository.viewAllLabel}</ThemedText>
            <Ionicons name="arrow-forward" size={12} color={theme.semantic.foreground.brand} />
          </View>
        </Pressable>
      </View>

      <SurfaceCard style={{ padding: 0, overflow: "hidden" }}>
        <View
          style={{
            backgroundColor: theme.semantic.background.muted,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: theme.spacing[6],
            paddingVertical: theme.spacing[4]
          }}
        >
          <ThemedText variant="label" size="sm" color="tertiary">
            {repository.tableHeaders.fileName}
          </ThemedText>
          <ThemedText variant="label" size="sm" color="tertiary">
            {repository.tableHeaders.actions}
          </ThemedText>
        </View>

        <View>
          {files.map((file, index) => {
            const isDownloading =
              downloadMutation.isPending && downloadMutation.variables?.fileId === file.id;
            const downloaded = downloadedIds.includes(file.id);
            const iconInfo = getToneVisual(file.fileTypeLabel, file.tone);

            return (
              <View
                key={file.id}
                style={{
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: theme.semantic.border.soft,
                  paddingHorizontal: theme.spacing[6],
                  paddingVertical: theme.spacing[5],
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: theme.spacing[4]
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[4], flex: 1 }}>
                  <View
                    style={{
                      width: 32,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: iconInfo.background,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Ionicons name={iconInfo.icon} size={18} color={iconInfo.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: "700" }}>{file.title}</ThemedText>
                    <ThemedText color="tertiary">{file.sizeLabel}</ThemedText>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: theme.spacing[4] }}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/document-preview/[fileId]",
                        params: { fileId: file.id }
                      })
                    }
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Ionicons name="eye-outline" size={18} color={theme.semantic.foreground.tertiary} />
                  </Pressable>

                  <Pressable
                    onPress={() => handleDownload(file.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: downloaded
                        ? theme.semantic.background.muted
                        : theme.semantic.foreground.brand
                    }}
                  >
                    <Ionicons
                      name={isDownloading ? "time-outline" : "download-outline"}
                      size={16}
                      color={downloaded ? theme.semantic.foreground.brand : theme.semantic.foreground.inverse}
                    />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </SurfaceCard>
    </View>
  );
}

function getToneVisual(fileType: DocumentFile["fileTypeLabel"], tone: DocumentFile["tone"]) {
  if (fileType === "PDF") {
    return {
      icon: "document-text-outline" as const,
      background: tone === "danger" ? "#FEF2F2" : "#EFF6FF",
      color: tone === "danger" ? "#DC2626" : "#2563EB"
    };
  }

  if (fileType === "DOCX") {
    return {
      icon: "document-outline" as const,
      background: "#EFF6FF",
      color: "#2563EB"
    };
  }

  return {
    icon: "grid-outline" as const,
    background: "#F0FDF4",
    color: "#16A34A"
  };
}

