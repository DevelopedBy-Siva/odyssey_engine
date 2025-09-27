import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#101010ff",
        },
        headerTitleStyle: {
          color: "#fff",
          fontWeight: 400,
          fontSize: 16,
        },
        headerTintColor: "#fff",
        contentStyle: {
          backgroundColor: "#000",
        },
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen name="build-room" options={{ headerShown: false }} />
      <Stack.Screen name="join-room" options={{ title: "Join Room" }} />
      <Stack.Screen name="set-theme" options={{ title: "Configure Room" }} />
      <Stack.Screen name="world-arena" options={{ title: "World Arena" }} />
    </Stack>
  );
}
