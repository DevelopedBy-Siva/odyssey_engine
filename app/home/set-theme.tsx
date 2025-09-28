import { AnimatedCard, MinimalisticButton } from "@/components/AnimatedComponents";
import { BorderRadius, Colors, Layout, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import { ThemeCard } from "@/components/ModernCard";
import { ModernHeader } from "@/components/ModernHeader";
import { ModernInput } from "@/components/ModernInput";
import { getSocket } from "@/store/socket";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import 'react-native-get-random-values';
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
// Removed uuid import - using 5-digit random ID instead


export const themes = [
  {
    id: 1,
    name: "Medical Mayhem",
    image: require("../../assets/themes/healthcare.jpg"),
    emoji: "🏥",
    intro_msg:
      "Hey there! 🏥 Ready to save some lives? Let's see if you can handle the medical madness!",
  },
  {
    id: 2,
    name: "Corporate Crisis",
    image: require("../../assets/themes/office.jpg"),
    emoji: "🚀",
    intro_msg:
      "Welcome to the office! 💼 Think you can handle corporate chaos? Let's find out!",
  },
  {
    id: 3,
    name: "Crime Catastrophe",
    image: require("../../assets/themes/crime.jpg"),
    emoji: "🔍",
    intro_msg:
      "Detective mode activated! 🕵️‍♂️ Time to solve some mysteries and catch the bad guys!",
  },
];

const CreateRoom = () => {
  const username = useUserStore((state) => state.username);
  const socket = getSocket(username);
  const colors = Colors;
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [maxPlayers, setMaxPlayers] = useState("4");

  // Generate a 5-digit random room ID
  const generateRoomId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

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

    const roomId = generateRoomId();
    socket.emit("join", {
      username: username,
      room: roomId,
      option: "create",
      roomName: roomName.trim(),
      roomTheme: selectedTheme,
      maxPlayers: parseInt(maxPlayers),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.background, { backgroundColor: colors.background }]}>
          <ModernHeader
            title="Create Room"
            subtitle="Set up your game environment"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <AnimatedCard
              style={[styles.firstSection, { backgroundColor: colors.surface }]}
              direction="up"
              delay={100}
            >
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Room Name</Text>
              <ModernInput
                placeholder="Enter a room name..."
                value={roomName}
                onChangeText={setRoomName}
                maxLength={30}
                leftIcon="room-service"
                containerStyle={styles.inputContainer}
              />
            </AnimatedCard>

            <AnimatedCard
              style={[styles.section, { backgroundColor: colors.surface }]}
              direction="up"
              delay={200}
            >
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Select Theme</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.themeScrollContainer}
                style={styles.themeScrollView}
              >
                {themes.map((theme, index) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedTheme.id === theme.id}
                    onSelect={() => setSelectedTheme(theme)}
                    animated={true}
                    delay={300 + (index * 100)}
                    style={styles.themeCardContainer}
                  />
                ))}
              </ScrollView>
            </AnimatedCard>

            <AnimatedCard
              style={[styles.lastSection, { backgroundColor: colors.surface }]}
              direction="up"
              delay={400}
            >
              <Text style={[styles.compactSectionTitle, { color: colors.textPrimary }]}>Number of Players</Text>
              <View style={styles.materialSliderContainer}>
                <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
                  <View style={[
                    styles.sliderTrackActive,
                    { 
                      width: `${(parseInt(maxPlayers) - 1) * 33.33}%`,
                      backgroundColor: colors.primary
                    }
                  ]} />
                </View>
                {["1", "2", "3", "4"].map((count, index) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.sliderTick,
                      { left: `${(index * 33.33)}%` },
                      parseInt(maxPlayers) === parseInt(count) && styles.sliderTickActive
                    ]}
                    onPress={() => setMaxPlayers(count)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.tickDot,
                      { backgroundColor: colors.border },
                      parseInt(maxPlayers) === parseInt(count) && styles.tickDotActive
                    ]} />
                    <Text style={[
                      styles.tickLabel,
                      { color: colors.textSecondary },
                      parseInt(maxPlayers) === parseInt(count) && styles.tickLabelActive
                    ]}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </AnimatedCard>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <MinimalisticButton
              title="Create Room"
              onPress={createRoom}
              variant="primary"
              size="lg"
              style={styles.createButton}
              textStyle={{ color: '#ffffff' }}
            />
          </View>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CreateRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.componentSpacing.contentPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['6xl'],
    flexGrow: 1,
  },
  section: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  firstSection: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  lastSection: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.lg,
  },
  compactSectionTitle: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: 0,
  },
  themeScrollView: {
    marginTop: Spacing.sm,
  },
  themeScrollContainer: {
    paddingRight: Spacing.lg,
  },
  themeCardContainer: {
    marginRight: Spacing.lg,
  },
  materialSliderContainer: {
    marginTop: Spacing.lg,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  sliderTrackActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  sliderTick: {
    position: 'absolute',
    top: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
  },
  sliderTickActive: {
    transform: [{ scale: 1.1 }],
  },
  tickDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  tickDotActive: {
    ...Shadows.sm,
  },
  tickLabel: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'center',
  },
  tickLabelActive: {
    fontFamily: Typography.fontFamily.semibold,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  createButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
  },
});