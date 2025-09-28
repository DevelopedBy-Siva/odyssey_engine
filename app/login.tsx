import { BorderRadius, Colors, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import ApiService from "@/services/apiService";
import { useUserStore } from "@/store/userStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";
import lottie_json from "../assets/lottie/login.json";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const storeUsername = useUserStore((state) => state.setUsername);

  const submit = async () => {
    const name = username.trim().toLowerCase();
    if (name.length === 0) {
      showToastable({
        message: "Please enter a username",
        status: "warning",
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await ApiService.login(name);
      
      if (response.success) {
        // Clear any existing cached data and set new username
        await AsyncStorage.clear();
        await AsyncStorage.setItem("username", name);
        storeUsername(name);
        
        // Show different message for offline mode
        if (response.offline) {
          showToastable({
            message: `Welcome ${name}! (Offline Mode)`,
            status: "warning",
          });
        } else {
          showToastable({
            message: `Welcome back, ${name}!`,
            status: "success",
          });
        }
        
        router.replace("/home");
      } else {
        showToastable({
          message: response.error || "Login failed",
          status: "danger",
        });
        setLoading(false);
      }
    } catch (error: any) {
      
      let errorMessage = "Failed to connect to server. Please check your connection and try again.";
      
      if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid username. Please try a different name.";
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        errorMessage = "Cannot connect to server. Please check your network connection.";
      }
      
      showToastable({
        message: errorMessage,
        status: "danger",
      });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: Colors.textPrimary }]}>Welcome to Game Hub</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Animation Card */}
        <View style={[styles.animationCard, { backgroundColor: Colors.cardBackground }]}>
          <View style={styles.animationContainer}>
            <LottieView
              style={styles.animation}
              autoPlay
              loop
              resizeMode="contain"
              source={lottie_json}
            />
          </View>
          <View style={styles.welcomeInfo}>
            <Text style={[styles.welcomeTitle, { color: Colors.activeText }]}>Chaos Simulation</Text>
            <Text style={[styles.welcomeSubtitle, { color: Colors.activeText }]}>Where AI builds failure, you forge the future</Text>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={[styles.formTitle, { color: Colors.textPrimary }]}>Enter Game</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: Colors.surface,
              borderColor: Colors.border,
              color: Colors.textPrimary 
            }]}
            placeholder="Enter username"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="default"
            editable={!loading}
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.activeText} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={[styles.buttonText, { color: Colors.activeText }]}>Step Inside</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.activeText} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily.bold,
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  animationCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  animationContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  animation: {
    width: '100%',
    flex: 1,
  },
  welcomeInfo: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.regular,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.xl,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    fontFamily: Typography.fontFamily.semibold,
  },
});
