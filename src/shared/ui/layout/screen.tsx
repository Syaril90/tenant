import type { PropsWithChildren } from "react";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { authContent } from "@/features/auth/lib/auth-content";
import { getUserIdentity } from "@/features/auth/lib/user-identity";
import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard-query";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { appIdentity } from "@/shared/config/app-identity";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type ScreenProps = PropsWithChildren<{
  headerMode?: "auto" | "main" | "sub" | "none";
}>;

const MAIN_ROUTES = new Set(["/", "/hub", "/bills", "/visitor", "/support", "/files"]);

export function Screen({
  children,
  headerMode = "auto"
}: ScreenProps) {
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
          paddingTop: resolvedHeaderMode === "none" ? theme.spacing[6] : 0,
          paddingBottom: theme.spacing[6]
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

function AppHeader({ mode }: { mode: "main" | "sub" }) {
  const { colorScheme, theme, toggleNightMode } = useAppTheme();
  const { signOut, user } = useAuth();
  const { selectedTenant, tenants } = useTenant();
  const dashboardQuery = useDashboardQuery();
  const pathname = usePathname();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const notificationCount = dashboardQuery.data?.announcements.items.length ?? 0;

  function openAccountMenu() {
    setIsMenuVisible(true);
  }

  function closeAccountMenu() {
    if (!isSigningOut) {
      setIsMenuVisible(false);
    }
  }

  function handleSupportPress() {
    closeAccountMenu();
    router.push("/(tabs)/support");
  }

  function handleSwitchTenantPress() {
    closeAccountMenu();
    router.push("/select-tenant");
  }

  function handleLogoutPress() {
    Alert.alert(authContent.accountMenu.logoutTitle, authContent.accountMenu.logoutMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: authContent.accountMenu.logoutAction,
        style: "destructive",
        onPress: async () => {
          try {
            setIsSigningOut(true);
            await signOut();
            setIsMenuVisible(false);
            router.replace("/sign-in");
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Logout failed. Please try again.";

            Alert.alert(authContent.accountMenu.logoutErrorTitle, message);
          } finally {
            setIsSigningOut(false);
          }
        }
      }
    ]);
  }

  const identity = getUserIdentity(user);

  return (
    <>
      <View
        style={{
          backgroundColor: theme.semantic.background.app
        }}
      >
        <View
          style={{
            minHeight: 68,
            borderBottomLeftRadius: 26,
            borderBottomRightRadius: 26,
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[3],
            backgroundColor: theme.semantic.background.surface,
            borderWidth: 1,
            borderColor: theme.semantic.border.subtle,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.spacing[4],
            borderTopWidth: 0,
            marginTop: 0
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3], flex: 1 }}>
            {mode === "sub" ? (
              <Pressable
                onPress={() => router.back()}
                hitSlop={12}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.semantic.background.muted,
                  borderWidth: 1,
                  borderColor: theme.semantic.border.subtle,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Ionicons name="arrow-back" size={18} color={theme.semantic.foreground.brand} />
              </Pressable>
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.semantic.background.accent,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Ionicons name="home-outline" size={18} color={theme.semantic.foreground.brand} />
              </View>
            )}

            <View style={{ gap: 2, flex: 1 }}>
              <ThemedText variant="heading" size="md" color="brand">
                {appIdentity.headerName}
              </ThemedText>
              {selectedTenant ? (
                <ThemedText color="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
                  {selectedTenant.propertyName} · {selectedTenant.unitNumber}
                </ThemedText>
              ) : null}
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}>
            <Pressable
              onPress={() => {
                if (pathname !== "/notifications") {
                  router.push("/notifications");
                }
              }}
              hitSlop={12}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.semantic.background.muted,
                borderWidth: 1,
                borderColor: theme.semantic.border.subtle,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicons
                name={pathname === "/notifications" ? "notifications" : "notifications-outline"}
                size={18}
                color={theme.semantic.foreground.brand}
              />
              {notificationCount > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    paddingHorizontal: 4,
                    backgroundColor: theme.semantic.status.danger,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ThemedText
                    variant="label"
                    size="sm"
                    color="inverse"
                    style={{ fontSize: 9, lineHeight: 12, letterSpacing: 0.4 }}
                  >
                    {notificationCount > 9 ? "9+" : String(notificationCount)}
                  </ThemedText>
                </View>
              ) : null}
            </Pressable>

            <Pressable
              onPress={openAccountMenu}
              hitSlop={12}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: theme.semantic.background.muted,
                borderWidth: 1,
                borderColor: theme.semantic.border.subtle,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Avatar
                imageUrl={identity.avatarUrl}
                fallbackLabel={identity.initials}
                size={40}
                inverse={false}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAccountMenu}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(23, 28, 31, 0.35)",
            justifyContent: "flex-start",
            paddingHorizontal: theme.spacing[5],
            paddingTop: theme.spacing[16]
          }}
        >
          <Pressable
            onPress={closeAccountMenu}
            style={{
              position: "absolute",
              inset: 0
            }}
          />

          <View
            style={{
              alignSelf: "flex-end",
              width: 280,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.semantic.background.surface,
              padding: theme.spacing[5],
              shadowColor: theme.shadow.floating.shadowColor,
              shadowOpacity: theme.shadow.floating.shadowOpacity,
              shadowRadius: theme.shadow.floating.shadowRadius,
              shadowOffset: theme.shadow.floating.shadowOffset,
              elevation: theme.shadow.floating.elevation,
              gap: theme.spacing[4]
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[4] }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: theme.radius.pill,
                  backgroundColor: theme.semantic.background.emphasis,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Avatar
                  imageUrl={identity.avatarUrl}
                  fallbackLabel={identity.initials}
                  size={44}
                  inverse
                />
              </View>

              <View style={{ flex: 1, gap: theme.spacing[1] }}>
                <ThemedText variant="heading" size="md">
                  {identity.displayName}
                </ThemedText>
                <ThemedText color="secondary">{identity.secondaryLabel}</ThemedText>
              </View>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: theme.semantic.border.soft
              }}
            />

            <Pressable
              onPress={handleSupportPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing[3],
                paddingVertical: theme.spacing[2]
              }}
            >
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={theme.semantic.foreground.brand}
              />
              <ThemedText>{authContent.accountMenu.supportLabel}</ThemedText>
            </Pressable>

            <Pressable
              onPress={toggleNightMode}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: theme.spacing[3],
                paddingVertical: theme.spacing[2]
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}>
                <Ionicons
                  name={colorScheme === "dark" ? "moon-outline" : "sunny-outline"}
                  size={18}
                  color={theme.semantic.foreground.brand}
                />
                <ThemedText>{authContent.accountMenu.nightModeLabel}</ThemedText>
              </View>

              <View
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor:
                    colorScheme === "dark"
                      ? theme.semantic.foreground.brand
                      : theme.semantic.background.muted,
                  padding: 3,
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor:
                      colorScheme === "dark"
                        ? theme.semantic.foreground.inverse
                        : theme.semantic.background.surface,
                    alignSelf: colorScheme === "dark" ? "flex-end" : "flex-start"
                  }}
                />
              </View>
            </Pressable>

            {tenants.length > 0 ? (
              <Pressable
                onPress={handleSwitchTenantPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: theme.spacing[3],
                  paddingVertical: theme.spacing[2]
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}>
                  <Ionicons
                    name="business-outline"
                    size={18}
                    color={theme.semantic.foreground.brand}
                  />
                  <ThemedText>{authContent.accountMenu.switchTenantLabel}</ThemedText>
                </View>

                {selectedTenant ? (
                  <ThemedText color="secondary" style={{ fontSize: 12 }}>
                    {selectedTenant.unitNumber}
                  </ThemedText>
                ) : null}
              </Pressable>
            ) : null}

            <Pressable
              onPress={handleLogoutPress}
              disabled={isSigningOut}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing[3],
                paddingVertical: theme.spacing[2],
                opacity: isSigningOut ? 0.7 : 1
              }}
            >
              {isSigningOut ? (
                <ActivityIndicator size="small" color={theme.semantic.status.danger} />
              ) : (
                <Ionicons name="log-out-outline" size={18} color={theme.semantic.status.danger} />
              )}
              <ThemedText style={{ color: theme.semantic.status.danger }}>
                {authContent.accountMenu.logoutAction}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

function Avatar({
  fallbackLabel,
  imageUrl,
  inverse = false,
  size
}: {
  fallbackLabel: string;
  imageUrl: string | null;
  inverse?: boolean;
  size: number;
}) {
  const { theme } = useAppTheme();

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2
        }}
      />
    );
  }

  if (fallbackLabel) {
    return (
      <ThemedText
        style={{
          color: inverse ? theme.semantic.foreground.inverse : theme.semantic.foreground.brand,
          fontFamily: theme.typography.label.md.fontFamily,
          fontSize: size >= 44 ? 16 : 14
        }}
      >
        {fallbackLabel}
      </ThemedText>
    );
  }

  return (
    <Ionicons
      name="person"
      size={size >= 44 ? 20 : 18}
      color={inverse ? theme.semantic.foreground.inverse : theme.semantic.foreground.brand}
    />
  );
}
