import { useUserStore } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import io, { Socket } from "socket.io-client";

import lottie_json from "@/assets/lottie/rob.json";
import { useEffect } from "react";

let socket: Socket;

export default function Home() {
  const username = useUserStore((state) => state.username);
  const router = useRouter();

  async function logout() {
    try {
      await AsyncStorage.removeItem("username");
      return router.replace("/login");
    } catch (ex) {
      showToastable({
        message: "Failed to logout. Try again.",
        status: "danger",
      });
    }
  }

  const options = [
    {
      name: "Build Room",
      bg: "#eb737e",
      action: () => router.push("/home/build-room"),
    },
    {
      name: "Join Room",
      bg: "#dac3fb",
      action: () => router.push("/home/join-room"),
    },
    {
      name: "World Arena",
      bg: "#ccf5b1",
      action: () => router.push("/home/world-arena"),
    },
    {
      name: "Exit",
      bg: "#f4df78",
      action: logout,
    },
  ];

  useEffect(() => {
    socket = io("http://127.0.0.1:5000", {
      query: { username: username },
    });

    socket.on("connect", () => {
      console.log("User connected!");
    });

    socket.on("notification", (data) => {
      showToastable({
        message: data.message,
        status: "danger",
      });
    });

    socket.on("game-room", (data) => {
      showToastable({
        message: data.message,
        status: "success",
      });
    });

    socket.on("entered-game", (data) => {});

    return () => {
      socket.off("connect");
      socket.off("notification");
      socket.off("game-room");
      socket.off("entered-game");
    };
  }, []);

  return (
    <SafeAreaView style={styles.view}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeTxt}>Hello 👋</Text>
        <Text style={styles.welcomeTxtName}>{username} </Text>
        <View style={styles.animationContainer}>
          <LottieView
            style={styles.animation}
            autoPlay
            loop
            resizeMode="contain"
            source={lottie_json}
          />
        </View>
        <View style={styles.optionsContainer}>
          {options.map((item, idx) => (
            <TouchableOpacity
              style={[styles.option, { backgroundColor: item.bg }]}
              onPress={item.action}
              key={idx}
            >
              <Text style={styles.optionTxt}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },

  welcomeTxt: {
    textAlign: "left",
    fontWeight: 400,
    color: "#8a8a8aff",
    fontSize: 22,
    textTransform: "capitalize",
  },
  welcomeTxtName: {
    textAlign: "left",
    fontWeight: 500,
    color: "#fff",
    fontSize: 74,
    textTransform: "capitalize",
  },

  animationContainer: {
    marginTop: 30,
    width: "100%",
    height: 300,
    alignItems: "center",
  },

  animation: {
    transform: "scale(1.5)",
    width: "100%",
    flex: 1,
  },

  optionsContainer: {
    marginTop: 50,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  option: {
    backgroundColor: "#fff",
    padding: 24,
    width: "45%",
    borderRadius: 15,
    alignItems: "center",
  },
  optionTxt: {
    color: "#000",
    fontSize: 14,
    fontWeight: 400,
  },
});
