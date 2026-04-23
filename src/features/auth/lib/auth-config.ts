import Constants from "expo-constants";

type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

type AuthProviderConfig = {
  googleWebClientId?: string;
  googleIosClientId?: string;
  googleAndroidClientId?: string;
  facebookAppId?: string;
};

type AuthExtraConfig = {
  firebase?: Partial<FirebaseConfig>;
  auth?: AuthProviderConfig;
};

function readRuntimeEnv(name: string) {
  const publicName = name.replace(/^EXPO_/, "EXPO_PUBLIC_");

  return process.env[name] ?? process.env[publicName] ?? "";
}

function readExpoExtra() {
  const expoConfigExtra = Constants.expoConfig?.extra;
  const manifestExtra = (Constants.manifest as { extra?: AuthExtraConfig } | null)?.extra;
  const manifest2Extra = (
    Constants.manifest2 as
      | {
          extra?: {
            expoClient?: {
              extra?: AuthExtraConfig;
            };
          };
        }
      | null
  )?.extra?.expoClient?.extra;

  return ((expoConfigExtra ?? manifest2Extra ?? manifestExtra ?? {}) as AuthExtraConfig);
}

export function getFirebaseConfig(): FirebaseConfig {
  const config = readExpoExtra().firebase;
  const apiKey = config?.apiKey || readRuntimeEnv("EXPO_FIREBASE_API_KEY");
  const projectId = config?.projectId || readRuntimeEnv("EXPO_FIREBASE_PROJECT_ID");
  const appId = config?.appId || readRuntimeEnv("EXPO_FIREBASE_APP_ID");

  if (!apiKey || !projectId || !appId) {
    throw new Error(
      "Firebase config is incomplete. Set EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_PROJECT_ID, and EXPO_PUBLIC_FIREBASE_APP_ID in .env.local, then restart Expo with cache cleared."
    );
  }

  return {
    apiKey,
    authDomain: config?.authDomain || readRuntimeEnv("EXPO_FIREBASE_AUTH_DOMAIN"),
    projectId,
    storageBucket: config?.storageBucket || readRuntimeEnv("EXPO_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId:
      config?.messagingSenderId || readRuntimeEnv("EXPO_FIREBASE_MESSAGING_SENDER_ID"),
    appId
  };
}

export function getAuthProviderConfig(): AuthProviderConfig {
  const config = readExpoExtra().auth ?? {};

  return {
    googleWebClientId:
      config.googleWebClientId || readRuntimeEnv("EXPO_AUTH_GOOGLE_WEB_CLIENT_ID"),
    googleIosClientId:
      config.googleIosClientId || readRuntimeEnv("EXPO_AUTH_GOOGLE_IOS_CLIENT_ID"),
    googleAndroidClientId:
      config.googleAndroidClientId || readRuntimeEnv("EXPO_AUTH_GOOGLE_ANDROID_CLIENT_ID"),
    facebookAppId: config.facebookAppId || readRuntimeEnv("EXPO_AUTH_FACEBOOK_APP_ID")
  };
}
