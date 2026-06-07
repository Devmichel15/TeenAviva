import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C1410",
          borderTopColor: "rgba(255,255,255,0.06)",
        },
        tabBarActiveTintColor: "#A3B18A",
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Início" }} />
      <Tabs.Screen name="ofensiva" options={{ title: "Ofensiva" }} />
    </Tabs>
  );
}
