import type { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
  actionLabel?: string;
}>;

export function BottomSheet({
  visible,
  title,
  onClose,
  actionLabel = "Close",
  children
}: BottomSheetProps) {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(23,28,31,0.35)",
          justifyContent: "flex-end"
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            backgroundColor: theme.semantic.background.surface,
            borderTopLeftRadius: theme.radius.lg,
            borderTopRightRadius: theme.radius.lg,
            padding: theme.spacing[6],
            paddingBottom: theme.spacing[8],
            gap: theme.spacing[4],
            maxHeight: "78%"
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: 44,
              height: 4,
              borderRadius: 999,
              backgroundColor: theme.semantic.border.subtle
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <ThemedText variant="heading" size="lg">
              {title}
            </ThemedText>
            <Pressable onPress={onClose}>
              <ThemedText color="brand">{actionLabel}</ThemedText>
            </Pressable>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
}
