import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { authContent } from "@/features/auth/lib/auth-content";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { appIdentity } from "@/shared/config/app-identity";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { Screen } from "@/shared/ui/layout/screen";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type Provider = "google" | "facebook" | null;

const lobbyImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80";

export function SignInScreen() {
  const { theme } = useAppTheme();
  const { signInWithFacebook, signInWithGoogle, user } = useAuth();
  const [pendingProvider, setPendingProvider] = useState<Provider>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  async function handleProviderSignIn(provider: Exclude<Provider, null>) {
    setPendingProvider(provider);
    setErrorMessage(null);

    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }

      router.replace("/(tabs)");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Sign-in failed. Please try again.";
      setErrorMessage(message);

      if (Platform.OS !== "web") {
        Alert.alert("Authentication failed", message);
      }
    } finally {
      setPendingProvider(null);
    }
  }

  return (
    <Screen headerMode="none">
      <ScrollView
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: -theme.spacing[6],
          marginVertical: -theme.spacing[6],
        }}
      >
        <ImageBackground
          source={{ uri: lobbyImage }}
          style={{ minHeight: 760, justifyContent: "flex-end" }}
        >
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(10, 17, 21, 0.34)",
            }}
          />

          <View
            style={{
              paddingHorizontal: theme.spacing[5],
              paddingTop: theme.spacing[12],
              paddingBottom: theme.spacing[8],
              gap: theme.spacing[8],
            }}
          >
            <View
              style={{
                marginTop: "auto",
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.52)",
                backgroundColor: "rgba(255,255,255,0.92)",
                paddingHorizontal: theme.spacing[6],
                paddingVertical: theme.spacing[8],
                shadowColor: "#0E161A",
                shadowOpacity: 0.18,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 18 },
                elevation: 10,
              }}
            >
              <View style={{ gap: theme.spacing[6] }}>
                <BrandLockup />

                <View style={{ gap: theme.spacing[2] }}>
                  <ThemedText
                    variant="heading"
                    size="xl"
                    style={{
                      color: "#1F272C",
                      fontSize: 32,
                      lineHeight: 38,
                    }}
                  >
                    {authContent.signIn.title}
                  </ThemedText>
                  <ThemedText
                    style={{
                      color: "#6E7A84",
                      fontSize: 15,
                      lineHeight: 22,
                    }}
                  >
                    {authContent.signIn.subtitle}
                  </ThemedText>
                </View>

                <View style={{ gap: theme.spacing[3] }}>
                  <AuthButton
                    label={authContent.signIn.googleLabel}
                    icon="logo-google"
                    isLoading={pendingProvider === "google"}
                    tone="light"
                    onPress={() => handleProviderSignIn("google")}
                  />
                  <AuthButton
                    label={authContent.signIn.facebookLabel}
                    icon="logo-facebook"
                    isLoading={pendingProvider === "facebook"}
                    tone="brand"
                    onPress={() => handleProviderSignIn("facebook")}
                  />
                </View>

                {errorMessage ? (
                  <View
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(184, 43, 72, 0.18)",
                      backgroundColor: "#FFF4F6",
                      paddingHorizontal: theme.spacing[4],
                      paddingVertical: theme.spacing[3],
                    }}
                  >
                    <ThemedText style={{ color: "#91243E", lineHeight: 20 }}>
                      {errorMessage}
                    </ThemedText>
                  </View>
                ) : null}

                <View style={{ gap: theme.spacing[4], alignItems: "center" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ThemedText style={{ color: "#6E7A84" }}>
                      {authContent.signIn.createAccountPrompt}
                    </ThemedText>
                    <Pressable hitSlop={8}>
                      <ThemedText
                        style={{
                          color: "#1F272C",
                          fontFamily: theme.typography.label.md.fontFamily,
                        }}
                      >
                        {authContent.signIn.createAccountAction}
                      </ThemedText>
                    </Pressable>
                  </View>

                  <Pressable hitSlop={8}>
                    <ThemedText
                      style={{
                        color: "#7A858E",
                        fontFamily: theme.typography.label.md.fontFamily,
                        fontSize: 12,
                        letterSpacing: 1.1,
                      }}
                    >
                      {authContent.signIn.helpAction}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={{ alignItems: "center", gap: theme.spacing[2] }}>
              <ThemedText
                variant="label"
                size="md"
                style={{
                  color: "#FFFFFF",
                  letterSpacing: 2.2,
                }}
              >
                {appIdentity.footerName}
              </ThemedText>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 14,
                }}
              >
                {authContent.signIn.legalLinks.map((label) => (
                  <FooterLink key={label} label={label} />
                ))}
              </View>

              <ThemedText
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 11,
                  lineHeight: 16,
                  textAlign: "center",
                }}
              >
                {appIdentity.copyrightLine}
              </ThemedText>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </Screen>
  );
}

function AuthButton({
  icon,
  isLoading,
  label,
  tone,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  isLoading: boolean;
  label: string;
  tone: "brand" | "light";
  onPress: () => void;
}) {
  const isBrand = tone === "brand";
  const backgroundColor = isBrand ? "#1877F2" : "#FFFFFF";
  const borderColor = isBrand ? "#1877F2" : "#E6EAF0";
  const textColor = isBrand ? "#FFFFFF" : "#20262D";
  const iconColor = isBrand ? "#FFFFFF" : "#20262D";
  const shadowColor = isBrand ? "#0C5ED7" : "#11181C";

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => ({
        minHeight: 54,
        borderRadius: 14,
        borderWidth: 1,
        borderColor,
        backgroundColor,
        paddingHorizontal: 18,
        justifyContent: "center",
        opacity: pressed || isLoading ? 0.86 : 1,
        shadowColor,
        shadowOpacity: isBrand ? 0.14 : 0.05,
        shadowRadius: isBrand ? 10 : 8,
        shadowOffset: { width: 0, height: isBrand ? 6 : 4 },
        elevation: isBrand ? 3 : 1,
      })}
    >
      <View
        style={{
          minHeight: 52,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : (
            <Ionicons name={icon} size={18} color={iconColor} />
          )}
        </View>
        <ThemedText
          style={{
            color: textColor,
            fontFamily: "System",
            fontWeight: "600",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

function BrandLockup() {
  return (
    <View style={{ alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: "#EEF4F6",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="shield-checkmark" size={24} color="#274957" />
      </View>

      <View style={{ alignItems: "center" }}>
        {appIdentity.brandLines.map((line, index) => (
          <ThemedText
            key={line}
            variant="label"
            size="md"
            style={{
              color: index === 0 ? "#5E707D" : "#274957",
              letterSpacing: index === 0 ? 3 : 3.4,
              fontSize: index === 0 ? 11 : 16,
            }}
          >
            {line}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <Pressable hitSlop={8}>
      <ThemedText
        style={{
          color: "rgba(255,255,255,0.86)",
          fontSize: 11,
          letterSpacing: 0.8,
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
