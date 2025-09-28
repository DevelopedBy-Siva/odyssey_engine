import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showToastable } from "react-native-toastable";

import { useUserStore } from "@/store/userStore";
import data from "../assets/data.json";
import lottie_json from "../assets/lottie/login.json";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const storeUsername = useUserStore((state) => state.setUsername);

  const submit = async () => {
    const name = username.trim().toLowerCase();
    if (name.length === 0) return;
    setLoading(true);
    await axios
      .post(`http://${data.url}/login`, { username: name })
      .then(async () => {
        await AsyncStorage.setItem("username", name);
        storeUsername(name);
        router.replace("/home");
      })
      .catch(() => {
        showToastable({
          message: "Failed to connect. Try again later.",
          status: "danger",
        });
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={style.view}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={style.animationContainer}>
        <LottieView
          style={style.animation}
          autoPlay
          loop
          resizeMode="contain"
          source={lottie_json}
        />
      </View>
      <View style={{ marginBottom: 40 }}>
        <Text style={[style.title, { color: "#8a8a8aff" }]}>
          Where AI builds failure,
        </Text>
        <Text style={style.title}> you forge the future.</Text>
      </View>
      <View style={style.inputContainer}>
        <TextInput
          selectionColor="#484848ff"
          placeholderTextColor="#484848ff"
          style={style.input}
          placeholder="Enter username"
          keyboardType="default"
          editable={!loading}
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          style={style.button}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View style={style.buttonTextContainer}>
              <Text style={style.buttonText}>Step Inside</Text>
              <AntDesign name="arrow-right" size={13} color="black" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const style = StyleSheet.create({
  view: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },

  animationContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  animation: {
    width: "85%",
    flex: 1,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 40,
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: 400,
    lineHeight: 40,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    borderColor: "#484848ff",
    color: "#989898ff",
  },

  button: {
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#fff",
    width: "50%",
    height: 45,
    padding: 10,
    borderRadius: 50,
  },

  buttonTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: 400,
  },
});
