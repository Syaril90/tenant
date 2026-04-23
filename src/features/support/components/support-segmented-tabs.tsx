import { Pressable, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export type SupportSegmentedTab = {
  id: string;
  label: string;
};

type SupportSegmentedTabsProps = {
  tabs: SupportSegmentedTab[];
  activeTabId: string;
  onChange: (tabId: string) => void;
};

export function SupportSegmentedTabs({
  tabs,
  activeTabId,
  onChange
}: SupportSegmentedTabsProps) {
  const { colorScheme, theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.semantic.background.muted,
        borderRadius: theme.radius.md,
        padding: 4,
        gap: 4
      }}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTabId;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={{
              flex: 1,
              minHeight: 42,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: active ? theme.semantic.background.surface : "transparent"
            }}
          >
            <ThemedText
              style={{
                color: active
                  ? theme.semantic.foreground.brand
                  : colorScheme === "dark"
                    ? theme.semantic.foreground.tertiary
                    : "#8A98A8"
              }}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
