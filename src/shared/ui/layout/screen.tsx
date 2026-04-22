import type { PropsWithChildren } from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type ScreenProps = PropsWithChildren<{
  headerMode?: "auto" | "main" | "sub" | "none";
}>;

const MAIN_ROUTES = new Set(["/", "/hub", "/bills", "/visitor", "/support", "/files"]);

export function Screen({ children, headerMode = "auto" }: ScreenProps) {
  const { theme } = useAppTheme();
  const pathname = usePathname();
  const resolvedHeaderMode =
    headerMode === "auto" ? (MAIN_ROUTES.has(pathname) ? "main" : "sub") : headerMode;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.semantic.background.surface }}>
      {resolvedHeaderMode !== "none" ? <AppHeader mode={resolvedHeaderMode} /> : null}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.semantic.background.app,
          paddingHorizontal: theme.spacing[6],
          paddingTop: theme.spacing[6],
          paddingBottom: theme.spacing[6]
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

function AppHeader({ mode }: { mode: "main" | "sub" }) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.semantic.background.surface,
        paddingHorizontal: theme.spacing[5],
        paddingVertical: theme.spacing[4],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[4] }}>
        {mode === "main" ? (
          <Pressable hitSlop={12}>
            <Ionicons name="menu" size={22} color={theme.semantic.foreground.brand} />
          </Pressable>
        ) : (
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={20} color={theme.semantic.foreground.brand} />
          </Pressable>
        )}

        <ThemedText variant="heading" size="md" color="brand">
          TheSanctuary
        </ThemedText>
      </View>

      {mode === "main" ? (
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.semantic.background.emphasis,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Ionicons name="person" size={18} color={theme.semantic.foreground.inverse} />
        </View>
      ) : (
        <Pressable onPress={() => router.push("/(tabs)/support")} hitSlop={12}>
          <Ionicons name="help-circle-outline" size={22} color={theme.semantic.foreground.brand} />
        </Pressable>
      )}
    </View>
  );
}
