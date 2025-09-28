import { getSocket } from "@/store/socket";
import { useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import { v4 as uuidv4 } from "uuid";


export const themes = [
  {
    id: 1,
    name: "Medical Mayhem",
    image: require("../../assets/themes/healthcare.jpg"),
    emoji: "🏥",
    intro_msg:
      "I'm your Corporate Chaos Consultant. I turn business strategies into bankruptcy stories. When you're ready, I'm ready to crash some companies!",
  },
  {
    id: 2,
    name: "Corporate Crisis",
    image: require("../../assets/themes/office.jpg"),
    emoji: "🚀",
    intro_msg:
      "I'm your Corporate Chaos Consultant. I turn business strategies into bankruptcy stories. When you're ready, I'm ready to crash some companies!",
  },
  {
    id: 3,
    name: "Crime Catastrophe",
    image: require("../../assets/themes/crime.jpg"),
    emoji: "🔍",
    intro_msg:
      "I'm your Heist Hijinks Handler. I turn criminal plans into comedic catastrophes. Ready to botch some burglaries when you are!",
  },
];

const CreateRoom = () => {
  const username = useUserStore((state) => state.username);
  const socket = getSocket(username);

  const [roomName, setRoomName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [maxPlayers, setMaxPlayers] = useState("4");

  const createRoom = () => {
    if (!roomName.trim()) {
      showToastable({
        message: "Please enter a room name",
        status: "warning",
      });
      return;
    }

    const parsedMax = parseInt(maxPlayers);
    if (parsedMax < 2 || parsedMax > 4) {
      showToastable({
        message: "Player count must be between 2 and 4",
        status: "warning",
      });
      return;
    }

    const roomId = uuidv4();
    socket.emit("join", {
      username: username,
      room: roomId,
      option: "create",
      roomName: roomName.trim(),
      theme: selectedTheme,
      maxPlayers: parseInt(maxPlayers),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Room Name Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Room Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a room name..."
              placeholderTextColor="#666"
              value={roomName}
              onChangeText={setRoomName}
              maxLength={30}
            />
          </View>

          {/* Theme Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Theme</Text>
            <View style={styles.themeGrid}>
              {themes.map((theme) => (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    selectedTheme.id === theme.id && styles.selectedTheme,
                  ]}
                  onPress={() => setSelectedTheme(theme)}
                >
                  <Image
                    source={theme.image}
                    style={styles.themeImage}
                    resizeMode="cover"
                  />
                  <View style={styles.themeOverlay}>
                    <Text style={styles.themeName}>{theme.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Max Players */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>No. of Players</Text>
            <View style={styles.playerOptions}>
              {["2", "3", "4"].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.playerOption,
                    maxPlayers === count && styles.selectedPlayerOption,
                  ]}
                  onPress={() => setMaxPlayers(count)}
                >
                  <Text
                    style={[
                      styles.playerOptionText,
                      maxPlayers === count && styles.selectedPlayerOptionText,
                    ]}
                  >
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={createRoom}>
          <Text style={styles.createButtonText}>Create Room</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 15,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginVertical: 5,
  },
  themeGrid: {
    flexDirection: "column",
    gap: 15,
  },
  themeCard: {
    width: "100%",
    height: 120,
    borderRadius: 15,
    position: "relative",
    overflow: "hidden",
    opacity: 0.8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  themeImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 15,
  },
  themeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  selectedTheme: {
    opacity: 1,
    borderWidth: 3,
    borderColor: "#fff",
  },
  themeEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  themeName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  playerOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  playerOption: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    minWidth: 60,
    alignItems: "center",
  },
  selectedPlayerOption: {
    backgroundColor: "#eb737e",
    borderColor: "#eb737e",
  },
  playerOptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 400,
  },
  selectedPlayerOptionText: {
    color: "#000",
  },
  createButton: {
    backgroundColor: "#eb737e",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  createButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: 400,
  },
});
