import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

import { tabs } from "@/shared/constants/routes";
import { useAppTheme } from "@/shared/theme/theme-provider";

export default function TabsLayout() {
  const { colorScheme, theme } = useAppTheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.semantic.foreground.brand,
        tabBarInactiveTintColor: theme.semantic.foreground.tertiary,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 88,
          paddingBottom: 12,
          paddingTop: 10,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0
        },
        tabBarItemStyle: {
          borderRadius: theme.radius.md,
          marginHorizontal: 2,
          paddingVertical: 0
        },
        tabBarIconStyle: {
          marginTop: 0
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              backgroundColor:
                colorScheme === "dark" ? "rgba(16,27,43,0.97)" : "rgba(255,255,255,0.96)",
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor:
                colorScheme === "dark" ? "rgba(34,53,78,0.95)" : "rgba(215,222,231,0.95)",
              shadowColor: theme.shadow.floating.shadowColor,
              shadowOpacity: 0.12,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: -4 },
              elevation: 12
            }}
          />
        ),
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
            tabBarLabel: ({ color, focused }) => (
              <Text
                style={{
                  color,
                  fontSize: focused ? 10 : 9,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: focused ? 0.9 : 0.6,
                  marginTop: 2
                }}
              >
                {tab.title}
              </Text>
            ),
            tabBarIcon: ({ color, focused, size }) => (
              <View
                style={{
                  minWidth: focused ? 46 : 40,
                height: focused ? 32 : 28,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  focused
                    ? colorScheme === "dark"
                      ? "rgba(156,195,255,0.18)"
                      : "rgba(13,71,161,0.12)"
                    : "transparent",
                borderWidth: focused ? 1 : 0,
                borderColor:
                  focused
                    ? colorScheme === "dark"
                      ? "rgba(156,195,255,0.12)"
                      : "rgba(13,71,161,0.08)"
                    : "transparent"
              }}
            >
                <Ionicons name={tab.icon} color={color} size={Math.min(size, focused ? 19 : 18)} />
              </View>
            )
          }}
        />
      ))}
      <Tabs.Screen
        name="files"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
