function getEnv(name: string, fallback = "") {
  const publicName = name.replace(/^EXPO_/, "EXPO_PUBLIC_");

  return process.env[name] ?? process.env[publicName] ?? fallback;
}

export default {
  name: getEnv("EXPO_APP_NAME", "Tenant App"),
  slug: getEnv("EXPO_APP_SLUG", "tenant-app"),
  scheme: getEnv("EXPO_APP_SCHEME", "tenant-app"),
  version: getEnv("EXPO_APP_VERSION", "1.0.0"),
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  plugins: ["expo-router", "@react-native-google-signin/google-signin"],
  experiments: {
    typedRoutes: true
  },
  ios: {
    bundleIdentifier: getEnv("EXPO_IOS_BUNDLE_IDENTIFIER", "com.tenantapp.mobile"),
    googleServicesFile: "./GoogleService-Info.plist"
  },
  android: {
    package: getEnv("EXPO_ANDROID_PACKAGE", "com.tenantapp.mobile")
  },
  extra: {
    firebase: {
      apiKey: getEnv("EXPO_FIREBASE_API_KEY"),
      authDomain: getEnv("EXPO_FIREBASE_AUTH_DOMAIN"),
      projectId: getEnv("EXPO_FIREBASE_PROJECT_ID"),
      storageBucket: getEnv("EXPO_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: getEnv("EXPO_FIREBASE_MESSAGING_SENDER_ID"),
      appId: getEnv("EXPO_FIREBASE_APP_ID")
    },
    auth: {
      googleWebClientId: getEnv("EXPO_AUTH_GOOGLE_WEB_CLIENT_ID"),
      googleIosClientId: getEnv("EXPO_AUTH_GOOGLE_IOS_CLIENT_ID"),
      googleAndroidClientId: getEnv("EXPO_AUTH_GOOGLE_ANDROID_CLIENT_ID"),
      facebookAppId: getEnv("EXPO_AUTH_FACEBOOK_APP_ID")
    }
  },
  web: {
    bundler: "metro"
  }
};
