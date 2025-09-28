import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import lottie_json from "../assets/lottie/login.json";

const LandingPage = () => {
  const router = useRouter();
  const storeUsername = useUserStore((state) => state.setUsername);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always go to login page - don't use cached username
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (error) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router, storeUsername]);

  return (
    <View style={styles.view}>
      <LottieView
        style={styles.animation}
        autoPlay
        loop
        resizeMode="contain"
        source={lottie_json}
      />
      <Text style={styles.title}>ODYSSEY ENGINE</Text>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 20,
  },
  animation: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});
