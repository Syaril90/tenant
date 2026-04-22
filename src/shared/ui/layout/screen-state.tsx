import { ActivityIndicator, View } from "react-native";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type ScreenStateProps =
  | {
      kind: "loading";
      message: string;
    }
  | {
      kind: "error";
      title: string;
      description: string;
    };

export function ScreenState(props: ScreenStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing[4] }}>
      {props.kind === "loading" ? (
        <>
          <ActivityIndicator size="small" color={theme.semantic.foreground.brand} />
          <ThemedText color="secondary">{props.message}</ThemedText>
        </>
      ) : (
        <>
          <ThemedText variant="heading" size="lg">
            {props.title}
          </ThemedText>
          <ThemedText color="secondary">{props.description}</ThemedText>
        </>
      )}
    </View>
  );
}
