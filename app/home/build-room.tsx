import { getSocket } from "@/store/socket";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView as ScrollViewType,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import { TypeAnimation } from "react-native-type-animation";
import ai_lottie_json from "../../assets/lottie/login.json";
import wait_lottie_json from "../../assets/lottie/wait.json";

const BuildRoom = () => {
  const { room, username, theme, isAdmin } = useLocalSearchParams();
  const socket = getSocket(username.toString());

  const [userInput, setUserInput] = useState("");
  const route = useRouter();
  const [isStarted, setIsStarted] = useState<any>(null);
  const [members, setMembers] = useState(["Adhi", "Jahnvi", "Sushant", "Siva"]);

  const [isBegin, setIsBegin] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isWaiting, setIsWaiting] = useState(false);

  const scrollViewRef = useRef<ScrollViewType | null>(null);
  const intervalRef = useRef<any>(null);

  const selectedTheme = theme ? JSON.parse(theme.toString()) : {};

  const [conversations, setConversations] = useState<({} | null)[]>([
    { txt: "Hello! 👋" },
    { txt: selectedTheme.intro_msg },
  ]);

  useEffect(() => {
    socket.on("game-room", (data) => {
      showToastable({
        message: data.message,
        status: "success",
      });
    });

    socket.on("chaos-begin", () => {
      setIsStarted(true);
      setIsWaiting(true);
      setConversations((state) => [
        ...state,
        { txt: "And we’re off... hold on, let me unfold the madness! 💥💥⚡" },
      ]);
    });

    socket.on("game-data", (data) => {
      setConversations((state) => [
        ...state,
        { txt: data.message },
        { txt: "Your time starts now! ⏱️💥" },
      ]);
      setIsWaiting(false);
      setIsBegin(true);
    });

    return () => {
      socket.off("game-room");
      socket.off("game-data");
      socket.off("chaos-begin");
    };
  }, []);

  useEffect(() => {
    if (!isBegin) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        sendMessage(false);
        return 60;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isBegin]);

  const renderMessage = (value = "") => {
    if (value.trim().length === 0) return;
    setConversations((state) => [...state, { txt: userInput, options: {} }]);
  };

  const sendMessage = (validate = true) => {
    if (validate && userInput.trim().length === 0) return;

    renderMessage(userInput);
    socket.emit("user-response", { username, room, message: userInput });
    setUserInput("");
    setIsBegin(false);
    setTimer(60);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const exit = () => {
    socket.emit("leave", {
      username: username?.toString() || "",
      room: room,
      message: `${username?.toString() || "User"} has left the room.`,
    });
    route.replace("/home");
  };
  const gameBegan = () => {
    // todo
    setIsStarted(true);
    // 1. loading animation -> starts
    setIsWaiting(true);
    // socket call -> game started socket call
    socket.emit("start-game", { room: room });
    // ai starts generating story
    // scoket returns response
    // 1. loading animation -> stops
    // Ai scenario and asigns players
    // now playerrs turn (3 sec splash)
    // 2. timer starts -> Begin -s True
    // after 1:00 begin is set to false
    // socket call with response
    // ai analyses-> points calculated -> repeat
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
          <View
            style={{
              paddingLeft: 8,
              flexDirection: "row",
              gap: 6,
            }}
          >
            {members.map((idx) => (
              <Text key={idx}>
                <FontAwesome6 name="person" size={16} color="#d0d0d0ff" />
              </Text>
            ))}
          </View>
          <View>
            <TouchableOpacity onPress={exit}>
              <Text
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  textAlign: "center",
                  width: 55,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 20,
                  fontSize: 14,
                }}
              >
                Exit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: 40,
            letterSpacing: 1,
            paddingVertical: 30,
            fontWeight: 400,
          }}
        >
          {isBegin ? timer : ""}
        </Text>

        <View style={styles.animationContainer}>
          <LottieView
            style={styles.animation}
            autoPlay
            loop
            resizeMode="contain"
            source={ai_lottie_json}
          />
        </View>

        <ScrollViewType
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {conversations.map((msg: any, index) => {
            const txt = msg["txt"];
            const options = msg["options"];

            if (options) {
              const from = options["from"];
              return (
                <View
                  key={index}
                  style={[
                    styles.userResponseContainer,
                    {
                      backgroundColor:
                        from === undefined ? "#645f5aff" : "#3d3d3dff",
                      marginLeft: from === undefined ? "auto" : 0,
                      borderRadius: 10,
                      overflow: "hidden",
                    },
                  ]}
                >
                  {from && (
                    <Text
                      style={{
                        backgroundColor: "#252525ff",
                        fontSize: 12,
                        color: "#868686ff",
                        padding: 6,
                        paddingHorizontal: 12,
                      }}
                    >
                      Manger
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      paddingHorizontal: 12,
                      paddingVertical: 20,
                    }}
                  >
                    {txt}
                  </Text>
                </View>
              );
            }

            return (
              <TypeAnimation
                key={index}
                sequence={[
                  { text: txt ?? "" },
                  {
                    action: () => {
                      return index === 1 ? setIsStarted(false) : "";
                    },
                  },
                ]}
                cursor={false}
                loop={false}
                style={{
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "left",
                  lineHeight: 34,
                  padding: 8,
                  borderRadius: 10,
                }}
                typeSpeed={20}
              />
            );
          })}
        </ScrollViewType>
        {isStarted === false && isAdmin === "1" ? (
          <View style={{ height: 100, paddingTop: 25, alignItems: "center" }}>
            <TouchableOpacity onPress={gameBegan}>
              <Text
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  textAlign: "center",
                  width: 140,
                  paddingVertical: 15,
                  borderRadius: 50,
                  fontSize: 15,
                }}
              >
                Let's Begin
              </Text>
            </TouchableOpacity>
          </View>
        ) : isStarted === false && isAdmin === "0" ? (
          <View style={{ gap: 15, paddingTop: 25, height: 100 }}>
            <ActivityIndicator size="large" />
            <Text
              style={{ color: "#999999ff", fontSize: 14, textAlign: "center" }}
            >
              Waiting for admin to launch the chaos.
            </Text>
          </View>
        ) : isWaiting ? (
          <View style={styles.loadingAnimationContainer}>
            <LottieView
              style={styles.loadingAnimation}
              autoPlay
              loop
              resizeMode="contain"
              source={wait_lottie_json}
            />
          </View>
        ) : isStarted && isBegin ? (
          <View style={styles.userInputContainer}>
            <TextInput
              style={styles.userInputText}
              selectionColor="#484848ff"
              placeholderTextColor="#484848ff"
              placeholder="Enter your input..."
              keyboardType="default"
              value={userInput}
              onChangeText={setUserInput}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={100}
            />
            <TouchableOpacity onPress={() => sendMessage(true)}>
              <MaterialCommunityIcons
                name="send-variant-outline"
                size={26}
                color="#989898ff"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ height: 100 }}></View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default BuildRoom;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
    gap: 20,
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
  animationContainer: {
    marginBottom: 30,
    height: 140,
    width: "100%",
    alignItems: "center",
  },

  animation: {
    width: "40%",
    flex: 1,
  },

  loadingAnimationContainer: {
    height: 100,
    width: "100%",
    alignItems: "center",
  },

  loadingAnimation: {
    width: "100%",
    flex: 1,
    transform: "scale(0.8)",
    opacity: 0.8,
  },

  userResponseContainer: {
    width: "78%",
  },
});
