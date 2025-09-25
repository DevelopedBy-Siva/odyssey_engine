import axios from "axios";
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

import lottie_json from "../assets/lottie/login.json";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const submit = async () => {
    if (username.trim().length === 0) return;
    setLoading(true);
    await axios
      .post("http://127.0.0.1:5000/login", { username: username })
      .then(() => {})
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
      <Text style={style.title}>
        <Text style={{ color: "#8a8a8aff" }}>Where AI crafts the story, </Text>
        but you control the adventure.
      </Text>
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
            <Text style={style.buttonText}>Start</Text>
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
    width: "90%",
    flex: 1,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 60,
    alignItems: "center",
  },

  title: {
    color: "#fff",
    marginBottom: 50,
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
  buttonText: {
    textAlign: "center",
    fontSize: 15,
  },
});
