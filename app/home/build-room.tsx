import { getSocket } from "@/store/socket";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import { TypeAnimation } from "react-native-type-animation";

const BuildRoom = () => {
  const { room, username } = useLocalSearchParams();
  const socket = getSocket(username.toString());
  const [userInput, setUserInput] = useState("");
  const route = useRouter();

  useEffect(() => {
    socket.on("game-room", (data) => {
      showToastable({
        message: data.message,
        status: "success",
      });
    });

    socket.on("entered-game", (data) => {});

    socket.on("receive-story", (data) => {});

    return () => {
      socket.off("game-room");
      socket.off("entered-game");
      socket.off("receive-story");
    };
  }, []);

  const sendText = () => {
    if (userInput.length === 0) return;
    socket.emit("send-story", {
      username: username,
      room: room,
      message: userInput,
    });
    setUserInput("");
  };

  const exit = () => {
    socket.emit("leave", {
      username: username,
      room: room,
      message: `${username} has left the room.`,
    });
    route.replace("/home");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, letterSpacing: 1 }}>
          01:00
        </Text>
        <TouchableOpacity onPress={exit}>
          <Text
            style={{
              backgroundColor: "red",
              color: "#fff",
              textAlign: "justify",
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 5,
              paddingBottom: 5,
              borderRadius: 5,
              fontSize: 14,
            }}
          >
            Exit
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1, padding: 10 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TypeAnimation
            sequence={[{ text: "What if gravity reversed every hour?" }]}
            cursor={false}
            loop={false}
            style={{
              color: "#fff",
              fontSize: 36,
              textAlign: "center",
              lineHeight: 50,
              padding: 6,
            }}
            typeSpeed={70}
          />
        </ScrollView>

        <View style={styles.userInputContainer}>
          <TextInput
            style={styles.userInputText}
            selectionColor="#484848ff"
            placeholderTextColor="#484848ff"
            placeholder="Enter your input"
            keyboardType="default"
            value={userInput}
            onChangeText={setUserInput}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="microphone-outline"
              size={26}
              color="#989898ff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendText}>
            <MaterialCommunityIcons
              name="send-variant-outline"
              size={26}
              color="#989898ff"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BuildRoom;

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userInputContainer: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    height: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#131313ff",
  },
  userInputText: {
    color: "#c1c1c1ff",
    flex: 1,
    fontSize: 15,
    height: 75,
  },
  subject: {
    color: "#fff",
  },
});
