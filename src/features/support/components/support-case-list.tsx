import { Pressable, View } from "react-native";

import type { SupportCaseSection, SupportCaseTone } from "@/features/support/types/support";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type SupportCaseListProps = {
  section: SupportCaseSection;
  onSelectCase?: (caseId: string) => void;
};

const toneStyles: Record<SupportCaseTone, { backgroundColor: string; color: string }> = {
  warning: { backgroundColor: "#FFF4E8", color: "#B85E00" },
  success: { backgroundColor: "#ECF9F1", color: "#1B7A46" },
  neutral: { backgroundColor: "#EDF2F7", color: "#51606D" }
};

export function SupportCaseList({ section, onSelectCase }: SupportCaseListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="sm" color="tertiary">
        {section.title}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {section.items.map((item) => {
          const tone = toneStyles[item.statusTone];
          const content = (
            <SurfaceCard style={{ gap: theme.spacing[4] }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: theme.spacing[3]
                }}
              >
                <View style={{ flex: 1, gap: theme.spacing[1] }}>
                  <ThemedText variant="heading" size="md">
                    {item.title}
                  </ThemedText>
                  <ThemedText color="secondary">{item.category}</ThemedText>
                </View>

                <View
                  style={{
                    backgroundColor: tone.backgroundColor,
                    borderRadius: 999,
                    paddingHorizontal: theme.spacing[3],
                    paddingVertical: theme.spacing[2]
                  }}
                >
                  <ThemedText variant="label" size="sm" style={{ color: tone.color }}>
                    {item.statusLabel}
                  </ThemedText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: theme.spacing[3]
                }}
              >
                <ThemedText color="tertiary">{item.updatedAtLabel}</ThemedText>
                <ThemedText variant="label" size="sm" color="brand">
                  {item.referenceLabel}
                </ThemedText>
              </View>
            </SurfaceCard>
          );

          if (!onSelectCase) {
            return <View key={item.id}>{content}</View>;
          }

          return (
            <Pressable key={item.id} onPress={() => onSelectCase(item.id)}>
              {content}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
