import { getSocket } from "@/store/socket";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import { TypeAnimation } from "react-native-type-animation";

const bgs = ["#4b9e86", "#437eb4", "#8548a8", "#e99c8a"];

const BuildRoom = () => {
  const { room, roomName, username, theme } = useLocalSearchParams();
  const socket = getSocket(username?.toString() || "");
  const [userInput, setUserInput] = useState("");
  const route = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [members, setMembers] = useState(["Adhi", "Jahnvi", "Sushant", "Siva"]);
  const [showExitModal, setShowExitModal] = useState(false);

  let selectedTheme = { id: 1, name: "Medical Mayhem" };
  if (typeof theme === "string") {
    try {
      selectedTheme = JSON.parse(theme);
    } catch (e) {
      console.warn("Invalid theme JSON:", e);
    }
  }

  useEffect(() => {
    socket.on("game-room", (data) => {
      showToastable({
        message: data.message,
        status: "success",
      });
    });

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
      username: username?.toString() || "",
      room: room,
      message: userInput,
    });
    setUserInput("");
  };

  const exit = () => {
    socket.emit("leave", {
      username: username?.toString() || "",
      room: room,
      message: `${username?.toString() || "User"} has left the room.`,
    });
    route.replace("/home");
  };

  const handleExitPress = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    exit();
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000",
          paddingHorizontal: 10,
          paddingTop: 10,
        }}
      >
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ paddingLeft: 8, flexDirection: "row", width: "30%" }}>
            {members.map((item, idx) => (
              <Text
                style={{
                  backgroundColor: bgs[idx],
                  color: "#fff",
                  width: 28,
                  height: 28,
                  lineHeight: 28,
                  textAlign: "center",
                  borderRadius: 50,
                  alignContent: "center",
                  marginLeft: -8,
                  fontSize: 14,
                }}
                key={idx}
              >
                {item.charAt(0).toUpperCase()}
              </Text>
            ))}
          </View>

          <Text
            style={{
              flex: 1,
              textAlign: "center",
              color: "#fff",
              fontSize: 19,
              letterSpacing: 1,
            }}
          >
            {roomName?.toString() || "Room"} • {selectedTheme.name} • 01:00
          </Text>
          <View style={{ width: "30%", alignItems: "flex-end" }}>
            <TouchableOpacity onPress={handleExitPress}>
              <Text
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  textAlign: "center",
                  width: 50,
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
        </View>
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

        {/* Exit Confirmation Modal */}
        <Modal
          visible={showExitModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelExit}
        >
          <Pressable style={styles.modalOverlay} onPress={cancelExit}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Leave Room?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to leave this room? Your progress will be lost.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelExit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exitButton} onPress={confirmExit}>
                  <Text style={styles.exitButtonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>


      </SafeAreaView>
    </KeyboardAvoidingView>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 24,
    margin: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalMessage: {
    color: "#c1c1c1",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  exitButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  }
});
