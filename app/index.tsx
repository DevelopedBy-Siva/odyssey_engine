import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import lottie_json from "../assets/lottie/login.json";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        setTimeout(() => {
          if (username) router.replace("/(tabs)/home");
          else router.replace("/login");
        }, 4000);
      } catch (e) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, []);

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
    backgroundColor: "#000",
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
