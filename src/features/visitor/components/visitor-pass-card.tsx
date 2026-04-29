import { Image, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type VisitorPassCardProps = {
  title: string;
  passCode: string;
  qrValue: string;
};

function buildQRCodeURL(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(value)}`;
}

export function VisitorPassCard({ title, passCode, qrValue }: VisitorPassCardProps) {
  const { theme } = useAppTheme();

  return (
    <SurfaceCard style={{ gap: theme.spacing[4], alignItems: "center" }}>
      <ThemedText variant="heading" size="lg">
        {title}
      </ThemedText>

      <View
        style={{
          width: 220,
          height: 220,
          borderRadius: theme.radius.md,
          backgroundColor: theme.semantic.background.surface,
          padding: 12,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={{ uri: buildQRCodeURL(qrValue) }}
          style={{
            width: 196,
            height: 196,
            borderRadius: theme.radius.sm,
            backgroundColor: "#FFFFFF"
          }}
          resizeMode="contain"
        />
      </View>

      <ThemedText color="tertiary">{passCode}</ThemedText>
    </SurfaceCard>
  );
}
