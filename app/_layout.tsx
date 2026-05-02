import "../global.css";

import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import { AppProviders } from "@/core/providers/app-providers";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

function RootNavigator() {
  const { isLoading, user } = useAuth();
  const { isLoading: isTenantLoading, selectedTenant, tenants } = useTenant();
  const { colorScheme } = useAppTheme();

  if (isLoading || (user && isTenantLoading)) {
    return (
      <>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Screen headerMode="none">
          <ScreenState
            kind="loading"
            message={user ? "Loading tenant workspace..." : "Restoring session..."}
          />
        </Screen>
      </>
    );
  }

  return user ? (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {selectedTenant ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="announcements" />
          <Stack.Screen name="announcements/[announcementId]" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="document-preview/[fileId]" />
          <Stack.Screen name="visitor-pass/[visitorId]" />
          <Stack.Screen name="payment-history" />
          <Stack.Screen name="payment-return" />
          <Stack.Screen name="payment-failed" />
          <Stack.Screen name="payment-success" />
          <Stack.Screen name="payment-receipt" />
          <Stack.Screen name="request-document" />
          <Stack.Screen name="support-feedback" />
          <Stack.Screen name="support-complaint" />
          <Stack.Screen name="select-tenant" />
          <Stack.Screen name="register-tenant" />
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="select-tenant" />
          <Stack.Screen name="register-tenant" />
        </Stack>
      )}
    </>
  ) : (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
      </Stack>
    </>
  );
}
