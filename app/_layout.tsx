import Toast from "@/components/toast";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#000000");
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
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
