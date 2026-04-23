import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme, type AppTheme } from "@/shared/theme/tokens";

type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  colorScheme: "light" | "dark";
  themePreference: ThemePreference;
  theme: AppTheme;
  setThemePreference: (preference: ThemePreference) => void;
  toggleNightMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_PREFERENCE_KEY = "app-theme-preference";

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then((storedValue) => {
        if (!active) {
          return;
        }

        if (storedValue === "light" || storedValue === "dark" || storedValue === "system") {
          setThemePreferenceState(storedValue);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const colorScheme = themePreference === "system" ? systemColorScheme : themePreference;

  function setThemePreference(preference: ThemePreference) {
    setThemePreferenceState(preference);
    AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference).catch(() => {});
  }

  function toggleNightMode() {
    setThemePreference(colorScheme === "dark" ? "light" : "dark");
  }

  const value = useMemo<ThemeContextValue>(() => {
    return {
      colorScheme,
      themePreference,
      theme: colorScheme === "dark" ? darkTheme : lightTheme,
      setThemePreference,
      toggleNightMode
    };
  }, [colorScheme, themePreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}
