import { NativeModules, Platform, TurboModuleRegistry } from "react-native";
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth";

import { getAuthProviderConfig } from "@/features/auth/lib/auth-config";
import { auth } from "@/features/auth/lib/firebase";

type NativeGoogleSignin = {
  configure: (options: {
    webClientId?: string;
    iosClientId?: string;
    offlineAccess?: boolean;
  }) => void;
  hasPlayServices: () => Promise<boolean>;
  revokeAccess: () => Promise<null | void>;
  signOut: () => Promise<null | void>;
  signIn: () => Promise<{
    data?: {
      idToken?: string | null;
    } | null;
  }>;
};

let isConfigured = false;

function getNativeGoogleSignin(): NativeGoogleSignin | null {
  const hasLegacyModule = Boolean(NativeModules.RNGoogleSignin);
  const hasTurboModule =
    typeof TurboModuleRegistry?.get === "function"
      ? Boolean(TurboModuleRegistry.get("RNGoogleSignin"))
      : false;

  if (!hasLegacyModule && !hasTurboModule) {
    return null;
  }

  try {
    return require("@react-native-google-signin/google-signin").GoogleSignin as NativeGoogleSignin;
  } catch {
    return null;
  }
}

function configureGoogle() {
  if (isConfigured || Platform.OS === "web") {
    return;
  }

  const config = getAuthProviderConfig();

  if (!config.googleWebClientId || config.googleWebClientId === "REPLACE_ME") {
    throw new Error("Missing Google web client ID in app.json under expo.extra.auth.googleWebClientId.");
  }

  if (!config.googleIosClientId || config.googleIosClientId === "REPLACE_ME") {
    throw new Error("Missing Google iOS client ID in app.json under expo.extra.auth.googleIosClientId.");
  }

  const nativeGoogleSignin = getNativeGoogleSignin();

  if (!nativeGoogleSignin) {
    throw new Error(
      "Google native auth is unavailable in this build. Use the installed iOS development build, not Expo Go."
    );
  }

  nativeGoogleSignin.configure({
    webClientId: config.googleWebClientId,
    iosClientId: config.googleIosClientId,
    offlineAccess: false
  });

  isConfigured = true;
}

export async function signInWithGoogle() {
  if (Platform.OS === "web") {
    const config = getAuthProviderConfig();

    if (!config.googleWebClientId || config.googleWebClientId === "REPLACE_ME") {
      throw new Error("Missing Google web client ID in app.json under expo.extra.auth.googleWebClientId.");
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  }

  configureGoogle();

  const nativeGoogleSignin = getNativeGoogleSignin();

  if (!nativeGoogleSignin) {
    throw new Error(
      "Google native auth is unavailable in this build. Use the installed iOS development build, not Expo Go."
    );
  }

  await nativeGoogleSignin.hasPlayServices();
  const result = await nativeGoogleSignin.signIn();
  const idToken = result.data?.idToken;

  if (!idToken) {
    throw new Error("Google sign-in did not return an ID token.");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export async function signOutFromGoogle() {
  if (Platform.OS === "web") {
    return;
  }

  const nativeGoogleSignin = getNativeGoogleSignin();

  if (!nativeGoogleSignin) {
    return;
  }

  try {
    await nativeGoogleSignin.signOut();
    await nativeGoogleSignin.revokeAccess();
  } catch {
    // Ignore provider cleanup failures so Firebase sign-out still completes.
  }
}
