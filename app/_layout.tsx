import "../global.css";

import { Stack } from "expo-router";

import { AppProviders } from "@/core/providers/app-providers";

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="announcements" />
        <Stack.Screen name="announcements/[announcementId]" />
        <Stack.Screen name="document-preview/[fileId]" />
        <Stack.Screen name="visitor-pass/[visitorId]" />
        <Stack.Screen name="payment-success" />
        <Stack.Screen name="payment-receipt" />
        <Stack.Screen name="support-feedback" />
        <Stack.Screen name="support-complaint" />
      </Stack>
    </AppProviders>
  );
}
