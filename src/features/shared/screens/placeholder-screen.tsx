import { View } from "react-native";

import { Screen } from "@/shared/ui/layout/screen";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { TokenCard } from "@/shared/ui/primitives/token-card";

type PlaceholderScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderScreen({ eyebrow, title, description }: PlaceholderScreenProps) {
  return (
    <Screen>
      <View className="gap-6">
        <View className="gap-1">
          <ThemedText variant="label" size="sm" color="tertiary">
            {eyebrow}
          </ThemedText>
          <ThemedText variant="heading" size="xl" color="brand">
            {title}
          </ThemedText>
          <ThemedText color="secondary">{description}</ThemedText>
        </View>

        <TokenCard>
          <View className="gap-3">
            <ThemedText variant="heading" size="lg">
              Placeholder Route
            </ThemedText>
            <ThemedText>
              This screen exists to lock the app shell, bottom navigation, and route structure before feature implementation.
            </ThemedText>
          </View>
        </TokenCard>
      </View>
    </Screen>
  );
}

