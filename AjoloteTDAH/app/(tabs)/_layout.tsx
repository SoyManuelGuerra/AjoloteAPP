import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarStyle: { display: "none" }, headerShown: false }} />
      <Tabs.Screen name="tasks" options={{ title: "Tareas" }} />
      <Tabs.Screen name="pet" options={{ title: "Ajolote" }} />
      <Tabs.Screen name="rewards" options={{ title: "Recompensas" }} />
    </Tabs>
  );
}