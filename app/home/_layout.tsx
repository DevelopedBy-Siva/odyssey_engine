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
      <Stack.Screen name="join-room" options={{ headerShown: false }} />
      <Stack.Screen name="set-theme" options={{ headerShown: false }} />
      <Stack.Screen name="world-arena" options={{ headerShown: false }} />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false
        }} 
      />
    </Stack>
  );
}
