import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { tabs } from "@/shared/constants/routes";
import { useAppTheme } from "@/shared/theme/theme-provider";

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.semantic.foreground.brand,
        tabBarInactiveTintColor: theme.semantic.foreground.tertiary,
        tabBarStyle: {
          backgroundColor: "rgba(246,250,254,0.95)",
          borderTopWidth: 0,
          height: 66,
          paddingBottom: 6,
          paddingTop: 6,
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 18,
          borderRadius: 18,
          shadowColor: "#003178",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: -1
        },
        tabBarItemStyle: {
          borderRadius: theme.radius.md,
          marginHorizontal: 2,
          paddingVertical: 2
        },
        tabBarIconStyle: {
          marginTop: 1
        },
        tabBarBackground: () => null,
        sceneStyle: {
          backgroundColor: theme.semantic.background.app
        }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarActiveBackgroundColor: "transparent",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} color={color} size={Math.min(size, 18)} />
            )
          }}
        />
      ))}
    </Tabs>
  );
}
