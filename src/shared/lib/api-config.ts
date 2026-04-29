import Constants from "expo-constants";
import { Platform } from "react-native";

type ApiExtraConfig = {
  api?: {
    baseUrl?: string;
  };
};

function readRuntimeEnv(name: string) {
  const publicName = name.replace(/^EXPO_/, "EXPO_PUBLIC_");

  return process.env[name] ?? process.env[publicName] ?? "";
}

function readExpoExtra() {
  const expoConfigExtra = Constants.expoConfig?.extra;
  const manifestExtra = (Constants.manifest as { extra?: ApiExtraConfig } | null)?.extra;
  const manifest2Extra = (
    Constants.manifest2 as
      | {
          extra?: {
            expoClient?: {
              extra?: ApiExtraConfig;
            };
          };
        }
      | null
  )?.extra?.expoClient?.extra;

  return (expoConfigExtra ?? manifest2Extra ?? manifestExtra ?? {}) as ApiExtraConfig;
}

function defaultBaseURL() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  return "http://localhost:8080";
}

export function getAPIBaseURL() {
  return readExpoExtra().api?.baseUrl || readRuntimeEnv("EXPO_API_BASE_URL") || defaultBaseURL();
}
