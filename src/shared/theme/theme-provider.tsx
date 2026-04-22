import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme, type AppTheme } from "@/shared/theme/tokens";

type ThemeContextValue = {
  colorScheme: "light" | "dark";
  theme: AppTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";

  const value = useMemo<ThemeContextValue>(() => {
    return {
      colorScheme,
      theme: colorScheme === "dark" ? darkTheme : lightTheme
    };
  }, [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}

