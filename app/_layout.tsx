import Toast from "@/components/toast";
import { loadClashGroteskFonts } from "@/config/fonts.config";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Load Clash Grotesk fonts
    loadClashGroteskFonts().then(() => {
      setFontsLoaded(true);
    });
    
    // Set system UI background
    SystemUI.setBackgroundColorAsync("#10002b"); // Darkest purple background
  }, []);

  if (!fontsLoaded) {
    // You can add a loading screen here if needed
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: {
            backgroundColor: "#10002b", // Darkest purple background
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}
