import { AIProcessingAnimation, AnimatedCard, AnimatedLoadingDots, CelebrationAnimation, GameResultsPopup, LoadingSpinner, MinimalisticButton, PulsingIcon } from "@/components/AnimatedComponents";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import { ModernHeader } from "@/components/ModernHeader";
import { ModernInput } from "@/components/ModernInput";
import { getSocket } from "@/store/socket";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView as ScrollViewType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";

// Custom typing animation component
const TypingAnimation = ({ text, speed = 30, onComplete, isAI = true }: { text: string; speed?: number; onComplete?: () => void; isAI?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Dynamic speed based on message length
  const dynamicSpeed = text.length > 200 ? Math.max(speed / 3, 5) : speed;
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, dynamicSpeed);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, dynamicSpeed, onComplete]);
  
  const colors = Colors;
  
  // For non-AI messages, show instantly
  if (!isAI) {
    return (
      <Text style={[styles.messageText, { color: colors.textPrimary }]}>
        {text}
      </Text>
    );
  }
  
  return (
    <Text style={[styles.messageText, { color: colors.textPrimary }]}>
      {displayedText}
      {currentIndex < text.length && showCursor && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
};

// Typing indicator component
const TypingIndicator = () => {
  const colors = Colors;
  return (
    <View style={styles.typingIndicator}>
      <Text style={[styles.typingText, { color: colors.textPrimary }]}>AI is typing</Text>
      <View style={styles.typingDots}>
        <Text style={[styles.typingDot, { color: colors.textPrimary }]}>.</Text>
        <Text style={[styles.typingDot, { color: colors.textPrimary }]}>.</Text>
        <Text style={[styles.typingDot, { color: colors.textPrimary }]}>.</Text>
      </View>
    </View>
  );
};

const BuildRoom = () => {
  const { room, username, theme, isAdmin, maxPlayers } = useLocalSearchParams();
  const socket = getSocket(username.toString());
  const router = useRouter();
  const colors = Colors;

  const [userInput, setUserInput] = useState("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [crisisScore, setCrisisScore] = useState(50);

  const [isBegin, setIsBegin] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastToastTime, setLastToastTime] = useState<number>(0);
  const [pendingJoins, setPendingJoins] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageQueue, setMessageQueue] = useState<{txt: string, isAI: boolean, startTimer?: boolean}[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [timeoutWarningShown, setTimeoutWarningShown] = useState(false);
  const [roomCapacity] = useState(parseInt(maxPlayers?.toString() || "4"));
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const [canType, setCanType] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [gameResults, setGameResults] = useState<any>(null);

  const scrollViewRef = useRef<ScrollViewType | null>(null);
  const intervalRef = useRef<number | null>(null);

  const selectedTheme = theme ? JSON.parse(theme.toString()) : {};

  const [conversations, setConversations] = useState<({ txt?: string; options?: any } | null)[]>([
    { txt: "Hey! 👋" },
    { txt: selectedTheme.intro_msg || "Ready to play? Let's go! 🎮" },
  ]);

  const renderMessage = useCallback((value = "") => {
    if (value.trim().length === 0) return;
    setConversations((state) => [...state, { txt: userInput, options: {} }]);
  }, [userInput]);

  const processMessageQueue = useCallback(() => {
    if (isProcessingQueue || messageQueue.length === 0) return;
    
    setIsProcessingQueue(true);
    const currentMessage = messageQueue[0];
    
    if (currentMessage.isAI) {
      setIsTyping(true);
      const typingDuration = Math.max(currentMessage.txt.length * 8, 500);
      
      setTimeout(() => {
        setConversations((state) => [...state, { txt: currentMessage.txt }]);
        setIsTyping(false);
        
        if (currentMessage.startTimer) {
          setIsBegin(true);
          setTimer(120); // 2 minutes
          setCanType(true); // Enable typing after AI responds
        }
        
        setTimeout(() => {
          setMessageQueue(prev => prev.slice(1));
          setIsProcessingQueue(false);
        }, 500);
      }, typingDuration);
    } else {
      setConversations((state) => [...state, { txt: currentMessage.txt, options: {} }]);
      setMessageQueue(prev => prev.slice(1));
      setIsProcessingQueue(false);
    }
  }, [messageQueue, isProcessingQueue]);

  useEffect(() => {
    processMessageQueue();
  }, [processMessageQueue]);

  const sendMessage = useCallback((validate = true) => {
    if (validate && userInput.trim().length === 0) return;

    const decisionText = userInput.trim().length > 0 ? userInput : "No response provided - timeout";
    
    renderMessage(decisionText);
    socket.emit("submit_decision", { 
      room_id: room, 
      username: username, 
      decision: decisionText 
    });
    setUserInput("");
    setIsBegin(false);
    setCanType(false); // Disable typing after submission
    setTimer(120);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [userInput, room, username, socket, renderMessage]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnecting(false);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnecting(true);
    });

    socket.on("connect_error", (error) => {
      setError("Failed to connect to server");
      setIsConnecting(false);
    });

    socket.on("game-room", (data) => {
      const username = data.message.match(/'([^']+)'/)?.[1];
      if (username) {
        setPendingJoins(prev => [...prev, username]);
        setCurrentPlayers(prev => prev + 1);
      }
      setIsConnecting(false);
    });

    socket.on("room-joined", (data) => {
      showToastable({
        message: data.message,
        status: "success",
        duration: 2000,
      });
      setIsConnecting(false);
    });

    socket.on("entered-game", (data) => {
      setIsConnecting(false);
      setError(null);
      // Check if room is full for admin
      if (isAdmin === "1") {
        setCurrentPlayers(1); // Admin is the first player
      }
    });

    socket.on("game_starting", (data) => {
      setIsStarted(true);
      setIsWaiting(true); // Keep waiting state for non-admin players
      
      setConversations((state) => [
        ...state,
        { txt: data.message }
      ]);
    });

    socket.on("game_started", (data) => {
      setIsStarted(true);
      setIsWaiting(false);
      setIsBegin(false); // Will be set to true when decision_timer_started is received
      setCanType(false); // Players can't type until AI responds
      setCrisisScore(data.crisis_score || 50);
      
      const currentPlayerRole = data.roles[username?.toString() || ""]?.role_name || "Player";
      const decisionPrompt = data.next_decision_point.replace(/\n\n⏰ Decision time! You have \d+ seconds to respond\.?/g, '').trim();
      const fullGameIntro = `🎮 Let's go! Here's what's happening:\n\n${data.scenario}\n\nYou're the: ${currentPlayerRole}\n\n${decisionPrompt}`;
      
      setMessageQueue(prev => [
        ...prev,
        { txt: fullGameIntro, isAI: true, startTimer: true },
      ]);
    });

    socket.on("round_completed", (data) => {
      setIsWaiting(false);
      setIsBegin(false);
      setCanType(false); // Disable typing after round completes
      setIsAnalyzing(false); // Hide analyzing state
      setCrisisScore(data.crisis_score);
      
      const newMessages = [
        { txt: `Round ${data.round} completed!`, isAI: true },
        { txt: `Crisis Score: ${data.crisis_score}/100`, isAI: true },
        { txt: data.story_continuation, isAI: true },
        { txt: data.next_decision_point, isAI: true, startTimer: true },
      ];
      
      setMessageQueue(prev => [...prev, ...newMessages]);
    });

    socket.on("decision_timer_started", (data) => {
      setIsWaiting(false);
      setTimeoutWarningShown(false);
      // Don't set isBegin or canType here - let the message queue handle it
      // The message queue will process the last message with startTimer: true
    });

    socket.on("game_ended", (data) => {
      setIsStarted(false);
      setIsBegin(false);
      setIsWaiting(false);
      setIsAnalyzing(false);
      setGameEnded(true);
      
      // Prepare game results data
      const results = {
        players: data.player_scores ? Object.entries(data.player_scores).map(([username, scores]: [string, any]) => ({
          username,
          total_score: scores.total_score || 0,
          rank: scores.rank || 1,
          individual_scores: scores.round_scores || []
        })) : [],
        final_crisis_score: data.final_crisis_score || 0,
        game_summary: data.game_summary || "Game completed successfully!"
      };
      
      setGameResults(results);
      
      // Start celebration animation
      setShowCelebration(true);
      
      setConversations((state) => [
        ...state,
        { txt: "🏁 Game Over!" },
        { txt: `Final Crisis Score: ${data.final_scores?.crisis_outcome || "N/A"}` },
        { txt: data.game_summary },
      ]);
    });

    socket.on("player_decision_submitted", (data) => {
      setConversations((state) => [
        ...state,
        { txt: `${data.username} submitted their decision` },
      ]);
      
      // If this is the last player to submit, show analyzing state
      if (data.remaining_players === 0) {
        setIsAnalyzing(true);
      }
    });

    socket.on("ai_analysis_started", (data) => {
      setIsAnalyzing(true);
      setConversations((state) => [
        ...state,
        { txt: data.message }
      ]);
    });

    socket.on("ai_analysis_completed", (data) => {
      setIsAnalyzing(false);
      setConversations((state) => [
        ...state,
        { txt: data.message }
      ]);
    });

    socket.on("timeout_notification", (data) => {
      setConversations((state) => [
        ...state,
        { txt: data.message },
        { txt: `Processing round with ${data.timeout_count || 0} timeout(s)...` },
        { txt: "AI will continue the game with available responses." },
      ]);
    });


    socket.on("notification", (data) => {
      if (data.message && data.message.includes("left the room")) {
        setConversations((state) => [
          ...state,
          { txt: data.message }
        ]);
        
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("game-room");
      socket.off("room-joined");
      socket.off("entered-game");
      socket.off("game_starting");
      socket.off("game_started");
      socket.off("round_completed");
      socket.off("decision_timer_started");
      socket.off("game_ended");
      socket.off("player_decision_submitted");
      socket.off("ai_analysis_started");
      socket.off("ai_analysis_completed");
      socket.off("timeout_notification");
      socket.off("notification");
    };
  }, [socket, username, lastToastTime, isAdmin]);

  useEffect(() => {
    if (pendingJoins.length > 0) {
      const now = Date.now();
      if (now - lastToastTime > 3000) {
        const message = pendingJoins.length === 1 
          ? `${pendingJoins[0]} joined the game`
          : `${pendingJoins.length} players joined the game`;
        
        showToastable({
          message,
          status: "info",
          duration: 2000,
        });
        
        setLastToastTime(now);
        setPendingJoins([]);
      }
    }
  }, [pendingJoins, lastToastTime]);


  useEffect(() => {
    if (!isBegin) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 30 && !timeoutWarningShown) {
          setConversations((state) => [
            ...state,
            { txt: "⚠️ 30 seconds remaining! Submit your decision quickly!" }
          ]);
          setTimeoutWarningShown(true);
        }
        
        if (prev > 1) return prev - 1;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setConversations((state) => [
          ...state,
          { txt: "⏰ Time's up! Moving to next round..." }
        ]);
        
        // Auto-submit with timeout message
        sendMessage(false);
        return 120;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isBegin, sendMessage, timeoutWarningShown]);


  const gameBegan = () => {
    setIsStarted(true);
    setIsWaiting(true);
    
    socket.emit("start_game", { 
      room_id: room, 
      username: username 
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        {/* Celebration Animation */}
        <CelebrationAnimation 
          isActive={showCelebration}
          onComplete={() => {
            setShowCelebration(false);
            setShowResultsPopup(true);
          }}
        />
        
        {/* Game Results Popup */}
        {gameResults && (
          <GameResultsPopup
            isVisible={showResultsPopup}
            onClose={() => {
              setShowResultsPopup(false);
              // Exit room when popup is closed
              socket.emit("leave", {
                username: username?.toString() || "",
                room: room,
                message: `${username?.toString() || "User"} has left the room.`,
              });
              router.replace("/home");
            }}
            results={gameResults}
          />
        )}
          {/* Modern Header */}
          <ModernHeader
            title="Game Room"
            subtitle={`Room: ${room}`}
            showBackButton={true}
            onBackPress={() => {
              socket.emit("leave", {
                username: username?.toString() || "",
                room: room,
                message: `${username?.toString() || "User"} has left the room.`,
              });
              // Navigate back to home
              router.replace("/home");
            }}
            backgroundColor={colors.background}
          />
          
          {/* Top Right Status Indicators */}
          <View style={styles.statusIndicators}>
            {/* Crisis Score Circle */}
            <AnimatedCard
              style={[styles.statusCircle, { backgroundColor: colors.primary }]}
              direction="left"
              delay={100}
            >
              <MaterialCommunityIcons name="alert-circle" size={16} color={colors.activeText} />
              <Text style={[styles.statusLabel, { color: colors.activeText }]}>Crisis</Text>
              <Text style={[styles.statusValue, { color: colors.activeText }]}>{crisisScore}</Text>
            </AnimatedCard>
            
            {/* Timer Circle */}
            {isBegin && (
              <AnimatedCard
                style={[
                  styles.statusCircle, 
                  { 
                    backgroundColor: timer <= 10 ? colors.error : colors.primary,
                    marginTop: 8
                  }
                ]}
                direction="left"
                delay={150}
              >
                <MaterialCommunityIcons 
                  name={timer <= 10 ? "clock-alert" : "clock"} 
                  size={16} 
                  color={colors.activeText} 
                />
                <Text style={[styles.statusLabel, { color: colors.activeText }]}>Time</Text>
                <Text style={[styles.statusValue, { color: colors.activeText }]}>{timer}</Text>
              </AnimatedCard>
            )}
          </View>

          <View style={styles.chatSection}>
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
                    {
                      backgroundColor:
                        from === undefined ? '#c77dff' : '#f5f5f5',
                      marginLeft: from === undefined ? "auto" : 0,
                      borderRadius: BorderRadius.lg,
                      overflow: "hidden",
                      padding: Spacing.md,
                      marginVertical: Spacing.xs,
                    },
                  ]}
                >
                  {from && (
                    <Text
                      style={{
                        backgroundColor: '#e5e7eb',
                        fontSize: Typography.xs,
                        color: '#6b7280',
                        padding: Spacing.sm,
                        paddingHorizontal: Spacing.md,
                      }}
                    >
                      Manager
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: Typography.base,
                      color: '#000000',
                      paddingHorizontal: Spacing.md,
                      paddingVertical: Spacing.lg,
                    }}
                  >
                    {txt}
                  </Text>
                </View>
              );
            }

            return (
              <AnimatedCard
                key={index}
                style={[styles.messageCard, { backgroundColor: colors.surface }]}
                direction="up"
                delay={index * 50}
              >
                <TypingAnimation 
                  text={txt ?? ""} 
                  speed={10}
                  isAI={true}
                  onComplete={() => {
                    // Don't reset isStarted - let the game flow handle state changes
                  }}
                />
              </AnimatedCard>
            );
          })}
              {isTyping && (
                <AnimatedCard
                  style={[styles.typingCard, { backgroundColor: colors.surface }]}
                  direction="up"
                  delay={100}
                >
                  <TypingIndicator />
                </AnimatedCard>
              )}
            </ScrollViewType>
          </View>
          <View style={styles.actionSection}>
            {gameEnded ? (
              <AnimatedCard
                style={[styles.startGameButton, { backgroundColor: colors.error }]}
                direction="up"
                delay={200}
              >
                <TouchableOpacity
                  style={styles.startGameButtonContent}
                  onPress={() => {
                    socket.emit("leave", {
                      username: username?.toString() || "",
                      room: room,
                      message: `${username?.toString() || "User"} has left the room.`,
                    });
                    router.replace("/home");
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="exit-to-app"
                    size={24}
                    color={colors.activeText}
                    style={styles.startGameIcon}
                  />
                  <Text style={[styles.startGameText, { color: colors.activeText }]}>Exit Room</Text>
                </TouchableOpacity>
              </AnimatedCard>
            ) : !isStarted && isAdmin === "1" && !isConnecting ? (
              currentPlayers < roomCapacity ? (
                <AnimatedCard
                  style={[styles.loadingWrapper, { backgroundColor: colors.surface }]}
                  direction="up"
                  delay={200}
                >
                  <LoadingSpinner size={32} color={colors.primary} />
                  <Text style={[styles.waitingText, { color: colors.textPrimary }]}>
                    Waiting for other players... ({currentPlayers}/{roomCapacity})
                  </Text>
                </AnimatedCard>
              ) : (
                <AnimatedCard
                  style={[styles.startGameButton, { backgroundColor: colors.primary }]}
                  direction="up"
                  delay={200}
                >
                  <TouchableOpacity
                    style={styles.startGameButtonContent}
                    onPress={gameBegan}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="play"
                      size={24}
                      color={colors.activeText}
                      style={styles.startGameIcon}
                    />
                    <Text style={[styles.startGameText, { color: colors.activeText }]}>Let&apos;s Begin</Text>
                  </TouchableOpacity>
                </AnimatedCard>
              )
            ) : !isStarted && isAdmin === "0" && !isConnecting ? (
              <AnimatedCard
                style={[styles.loadingWrapper, { backgroundColor: colors.surface }]}
                direction="up"
                delay={200}
              >
                <View style={styles.loadingAnimation}>
                  <PulsingIcon duration={1500} scale={1.1}>
                    <MaterialCommunityIcons 
                      name="gamepad-variant" 
                      size={48} 
                      color={colors.primary} 
                      style={styles.pulsingIcon}
                    />
                  </PulsingIcon>
                  <AnimatedLoadingDots 
                    color={colors.primary} 
                    size={8}
                    style={styles.loadingDots}
                  />
                </View>
                <Text style={[styles.waitingText, { color: colors.textPrimary }]}>
                  Waiting for admin to launch the game...
                </Text>
                <Text style={[styles.waitingSubtext, { color: colors.textSecondary }]}>
                  Get ready for an exciting adventure! 🎮
                </Text>
              </AnimatedCard>
            ) : isWaiting ? (
              <AnimatedCard
                style={[styles.loadingWrapper, { backgroundColor: colors.surface }]}
                direction="up"
                delay={200}
              >
                <LoadingSpinner size={32} color={colors.primary} />
                <Text style={[styles.waitingText, { color: colors.textPrimary }]}>
                  Loading game...
                </Text>
              </AnimatedCard>
            ) : isAnalyzing ? (
              <AnimatedCard
                style={[styles.loadingWrapper, { backgroundColor: colors.surface }]}
                direction="up"
                delay={200}
              >
                <View style={styles.aiAnalysisAnimation}>
                  <PulsingIcon duration={1200} scale={1.15}>
                    <MaterialCommunityIcons 
                      name="robot" 
                      size={48} 
                      color={colors.accent} 
                      style={styles.aiIcon}
                    />
                  </PulsingIcon>
                  <AIProcessingAnimation 
                    color={colors.accent}
                    style={styles.aiProcessingDots}
                  />
                </View>
                <Text style={[styles.waitingText, { color: colors.textPrimary }]}>
                  🤖 AI is analyzing your responses...
                </Text>
                <Text style={[styles.waitingSubtext, { color: colors.textSecondary }]}>
                  Creating the next exciting scenario! ✨
                </Text>
              </AnimatedCard>
            ) : isStarted && isBegin && canType ? (
              <AnimatedCard
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.surface },
                  timer <= 10 && styles.inputContainerWarning
                ]}
                direction="up"
                delay={200}
              >
                <ModernInput
                  placeholder={timer <= 10 ? "HURRY! Enter your input..." : "Enter your input..."}
                  value={userInput}
                  onChangeText={setUserInput}
                  multiline
                  numberOfLines={4}
                  maxLength={100}
                  rightIcon="send"
                  onRightIconPress={() => sendMessage(true)}
                  containerStyle={styles.inputWrapper}
                  inputStyle={[
                    styles.inputText,
                    { color: colors.textPrimary },
                    timer <= 10 && styles.inputTextWarning
                  ]}
                  editable={true}
                />
              </AnimatedCard>
            ) : isConnecting ? (
              <AnimatedCard
                style={[styles.loadingWrapper, { backgroundColor: colors.surface }]}
                direction="up"
                delay={200}
              >
                <LoadingSpinner size={32} color={colors.primary} />
                <Text style={[styles.connectingText, { color: colors.textPrimary }]}>
                  Connecting to server...
                </Text>
              </AnimatedCard>
            ) : error ? (
              <AnimatedCard
                style={[styles.errorContainer, { backgroundColor: colors.surface }]}
                direction="up"
                delay={200}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={32}
                  color={colors.error}
                />
                <Text style={[styles.errorText, { color: colors.textPrimary }]}>{error}</Text>
                <MinimalisticButton
                  title="Retry Connection"
                  onPress={() => {
                    setError(null);
                    setIsConnecting(true);
                    socket.connect();
                  }}
                  variant="outline"
                  size="md"
                  icon="refresh"
                  iconPosition="left"
                  style={styles.retryButton}
                />
              </AnimatedCard>
            ) : null}
        </View>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default BuildRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  themeToggleButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  timerSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  timerContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  timerText: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  timerWarning: {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  warningText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    marginTop: Spacing.sm,
  },
  crisisScoreText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    marginTop: Spacing.sm,
  },
  chatSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  messageCard: {
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  messageText: {
    fontSize: Typography.base,
    lineHeight: Typography.lineHeight.normal * Typography.base,
  },
  cursor: {
    fontWeight: Typography.bold,
    opacity: 0.8,
  },
  typingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typingText: {
    fontSize: Typography.sm,
    marginRight: Spacing.sm,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    fontSize: Typography.lg,
    marginRight: 2,
  },
  actionSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  startGameContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  startGameButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  startGameButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startGameIcon: {
    marginRight: Spacing.sm,
  },
  startGameText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  waitingContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  waitingText: {
    fontSize: Typography.base,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  loadingContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  loadingAnimation: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  pulsingIcon: {
    marginBottom: Spacing.md,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aiAnalysisAnimation: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  aiIcon: {
    marginBottom: Spacing.md,
  },
  aiProcessingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  waitingSubtext: {
    fontSize: Typography.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  inputContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  inputContainerWarning: {
    borderWidth: 2,
  },
  inputWrapper: {
    marginBottom: 0,
  },
  inputText: {
    fontSize: Typography.base,
  },
  inputTextWarning: {
  },
  connectingContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  connectingText: {
    fontSize: Typography.base,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  errorContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  errorText: {
    fontSize: Typography.base,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  retryButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicators: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1000,
  },
  statusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    ...Shadows.md,
  },
  statusLabel: {
    fontSize: Typography.xs,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: 2,
    textAlign: 'center',
  },
  statusValue: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
});
