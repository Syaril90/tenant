import { ScrollView, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { TokenCard } from "@/shared/ui/primitives/token-card";

const colorGroups = [
  { label: "Brand / 900", key: "brand900", color: "#003178" },
  { label: "Brand / 800", key: "brand800", color: "#0D47A1" },
  { label: "Brand / 100", key: "brand100", color: "#CFE6F2" },
  { label: "Canvas / 50", key: "canvas50", color: "#F6FAFE" },
  { label: "Surface / 100", key: "surface100", color: "#F0F4F8" },
  { label: "Ink / 900", key: "ink900", color: "#171C1F" },
  { label: "Ink / 700", key: "ink700", color: "#434652" },
  { label: "Danger / 700", key: "danger700", color: "#BA1A1A" }
] as const;

export function TokenShowcase() {
  const { theme } = useAppTheme();

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerStyle={{ paddingBottom: theme.spacing[10] }}>
      <View className="gap-6">
        <View className="gap-1">
          <ThemedText variant="label" size="sm" color="tertiary">
            DESIGN TOKENS
          </ThemedText>
          <ThemedText variant="heading" size="xl" color="brand">
            Tenant App Foundation
          </ThemedText>
          <ThemedText color="secondary">
            Figma-derived colors, spacing, radius, and typography scales for the first build pass.
          </ThemedText>
        </View>

        <TokenCard>
          <View className="gap-4">
            <ThemedText variant="heading" size="lg">
              Color Tokens
            </ThemedText>
            <View className="flex-row flex-wrap gap-3">
              {colorGroups.map((token) => (
                <View key={token.key} className="w-[47%] gap-2 rounded-md bg-surface-muted p-3">
                  <View
                    style={{
                      backgroundColor: token.color,
                      borderRadius: theme.radius.md,
                      height: 52
                    }}
                  />
                  <ThemedText variant="label" size="sm" color="tertiary">
                    {token.label}
                  </ThemedText>
                  <ThemedText>{token.color}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </TokenCard>

        <TokenCard>
          <View className="gap-4">
            <ThemedText variant="heading" size="lg">
              Typography Tokens
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              Heading XL 36 / 40
            </ThemedText>
            <ThemedText variant="heading" size="lg">
              Heading LG 20 / 28
            </ThemedText>
            <ThemedText>
              Body LG 16 / 24 reflects the tenant product's editorial yet clean mobile rhythm.
            </ThemedText>
            <ThemedText variant="label" size="md" color="tertiary">
              Label MD 12 / 16 WITH TRACKING
            </ThemedText>
          </View>
        </TokenCard>

        <TokenCard>
          <View className="gap-4">
            <ThemedText variant="heading" size="lg">
              Layout Tokens
            </ThemedText>
            <View className="flex-row items-end gap-3">
              {[8, 12, 16, 24, 32, 40].map((value) => (
                <View key={value} className="items-center gap-2">
                  <View
                    className="bg-brand"
                    style={{
                      width: value,
                      height: value,
                      borderRadius: theme.radius.sm
                    }}
                  />
                  <ThemedText variant="label" size="sm" color="tertiary">
                    {value}
                  </ThemedText>
                </View>
              ))}
            </View>
            <View className="flex-row gap-3">
              {[theme.radius.sm, theme.radius.md, theme.radius.lg].map((radius) => (
                <View
                  key={radius}
                  className="flex-1 items-center justify-center bg-surface-muted py-4"
                  style={{ borderRadius: radius }}
                >
                  <ThemedText variant="label" size="sm" color="tertiary">
                    radius {radius}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </TokenCard>
      </View>
    </ScrollView>
  );
}

