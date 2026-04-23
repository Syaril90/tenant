import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, type Persistence } from "firebase/auth";

import { getFirebaseConfig } from "@/features/auth/lib/auth-config";

const firebaseApp = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
const nativeStorage = createAsyncStorage("app");

function getReactNativePersistence(storage: ReturnType<typeof createAsyncStorage>): Persistence {
  class ReactNativePersistence {
    static type = "LOCAL" as const;
    readonly type = "LOCAL" as const;

    async _isAvailable() {
      try {
        await storage.setItem("__firebase_auth_test__", "1");
        await storage.removeItem("__firebase_auth_test__");
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: unknown) {
      return storage.setItem(key, JSON.stringify(value));
    }

    async _get<T>(key: string): Promise<T | null> {
      const json = await storage.getItem(key);
      return json ? (JSON.parse(json) as T) : null;
    }

    _remove(key: string) {
      return storage.removeItem(key);
    }

    _addListener() {
      return;
    }

    _removeListener() {
      return;
    }
  }

  return ReactNativePersistence as unknown as Persistence;
}

function createNativeAuth() {
  const persistence = getReactNativePersistence(nativeStorage);

  try {
    return initializeAuth(firebaseApp, { persistence });
  } catch {
    return getAuth(firebaseApp);
  }
}

export const auth = Platform.OS === "web" ? getAuth(firebaseApp) : createNativeAuth();

export async function clearPersistedAuthSession() {
  if (Platform.OS === "web") {
    return;
  }

  const keys = await nativeStorage.getAllKeys();
  const firebaseKeys = keys.filter((key) => key.startsWith("firebase:"));

  if (firebaseKeys.length === 0) {
    return;
  }

  await nativeStorage.removeMany(firebaseKeys);
}
