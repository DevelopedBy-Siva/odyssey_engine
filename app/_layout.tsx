import Toast from "@/components/toast";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: {
            backgroundColor: "#000",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
