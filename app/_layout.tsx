import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import Toast from "@/components/toast";
import { StyleSheet } from "react-native";

// function Auth({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const isAuth = false;

//   useEffect(() => {
//     if (!isAuth) {
//       router.replace("/login");
//     }
//   }, []);

//   return <>{children}</>;
// }

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
});
