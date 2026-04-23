import "../global.css";

import { Stack } from "expo-router";

import { AppProviders } from "@/core/providers/app-providers";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

function RootNavigator() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Screen headerMode="none">
        <ScreenState kind="loading" message="Restoring session..." />
      </Screen>
    );
  }

  return user ? (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="announcements" />
      <Stack.Screen name="announcements/[announcementId]" />
      <Stack.Screen name="document-preview/[fileId]" />
      <Stack.Screen name="visitor-pass/[visitorId]" />
      <Stack.Screen name="payment-history" />
      <Stack.Screen name="payment-success" />
      <Stack.Screen name="payment-receipt" />
      <Stack.Screen name="request-document" />
      <Stack.Screen name="support-feedback" />
      <Stack.Screen name="support-complaint" />
    </Stack>
  ) : (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
