import * as DocumentPicker from "expo-document-picker";

export type SharedAttachment = {
  id: string;
  uri?: string;
  name: string;
  sizeLabel: string;
  mimeType: string;
};

export async function pickAttachments() {
  const result = await DocumentPicker.getDocumentAsync({
    multiple: true,
    copyToCacheDirectory: true
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map((asset) => ({
    id: asset.uri,
    uri: asset.uri,
    name: asset.name,
    sizeLabel: formatFileSize(asset.size),
    mimeType: asset.mimeType ?? "file"
  }));
}

function formatFileSize(size?: number) {
  if (!size) {
    return "Unknown size";
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
