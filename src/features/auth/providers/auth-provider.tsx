import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { signInWithFacebook } from "@/features/auth/api/sign-in-with-facebook";
import { signInWithGoogle, signOutFromGoogle } from "@/features/auth/api/sign-in-with-google";
import { auth, clearPersistedAuthSession } from "@/features/auth/lib/firebase";
import { getSelectedTenantStorageKey } from "@/features/unit-registration/lib/tenant-storage";

type AuthContextValue = {
  isLoading: boolean;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user,
        signInWithGoogle: async () => {
          await signInWithGoogle();
        },
        signInWithFacebook: async () => {
          await signInWithFacebook();
        },
        signOut: async () => {
          setIsLoading(true);
          const currentUserId = auth.currentUser?.uid ?? user?.uid ?? null;

          try {
            await signOutFromGoogle();
            await firebaseSignOut(auth);
            await clearPersistedAuthSession();
            if (currentUserId) {
              await AsyncStorage.removeItem(getSelectedTenantStorageKey(currentUserId));
            }
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
