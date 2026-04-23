import { Platform } from "react-native";
import { FacebookAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth";

import { getAuthProviderConfig } from "@/features/auth/lib/auth-config";
import { auth } from "@/features/auth/lib/firebase";

export async function signInWithFacebook() {
  const config = getAuthProviderConfig();

  if (!config.facebookAppId || config.facebookAppId === "REPLACE_ME") {
    throw new Error("Missing Facebook app ID in app.json under expo.extra.auth.facebookAppId.");
  }

  if (Platform.OS === "web") {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  }

  let nativeFacebookSdk: {
    AccessToken: {
      getCurrentAccessToken: () => Promise<{ accessToken?: string } | null>;
    };
    LoginManager: {
      logInWithPermissions: (
        permissions: string[]
      ) => Promise<{
        isCancelled: boolean;
      }>;
    };
  };

  try {
    nativeFacebookSdk = require("react-native-fbsdk-next");
  } catch {
    throw new Error(
      "Facebook native auth is unavailable. Use a development build and configure the FBSDK Expo plugin before testing Facebook sign-in."
    );
  }

  const loginResult = await nativeFacebookSdk.LoginManager.logInWithPermissions([
    "public_profile",
    "email"
  ]);

  if (loginResult.isCancelled) {
    throw new Error("Facebook sign-in was cancelled.");
  }

  const accessToken = await nativeFacebookSdk.AccessToken.getCurrentAccessToken();

  if (!accessToken?.accessToken) {
    throw new Error("Facebook sign-in did not return an access token.");
  }

  const credential = FacebookAuthProvider.credential(accessToken.accessToken);
  return signInWithCredential(auth, credential);
}
