import { AnimatedCard } from "@/components/AnimatedComponents";
import { BorderRadius, Colors, Layout, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import { ModernHeader } from "@/components/ModernHeader";
import ApiService, { SystemStats, UserStats } from "@/services/apiService";
import { useUserStore } from "@/store/userStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToastable } from "react-native-toastable";

export default function Profile() {
  const username = useUserStore((state) => state.username);
  const clearUsername = useUserStore((state) => state.clearUsername);
  const router = useRouter();
  const colors = Colors;
  
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.clear();
      clearUsername();
      
      showToastable({
        message: "Logged out successfully",
        status: "success",
      });
      
      // Navigate to login
      router.replace("/login");
    } catch {
      showToastable({
        message: "Error logging out",
        status: "danger",
      });
    }
  };

  // Load user data and system stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load user stats
        if (username) {
          const stats = await ApiService.getUserStats(username);
          setUserStats(stats);
        }
        
        // Load system stats
        const sysStats = await ApiService.getSystemStats();
        setSystemStats(sysStats);
        
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.background, { backgroundColor: colors.background }]}>
          {/* Modern Header */}
          <ModernHeader
            title="Profile"
            subtitle="Your Game Statistics"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Loading your profile...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        {/* Modern Header */}
        <ModernHeader
          title="Profile"
          subtitle="Your Game Statistics"
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Grid - Organized like the image */}
          <View style={styles.statsGrid}>
            {/* Games Won Card */}
            <AnimatedCard
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              direction="up"
              delay={100}
            >
              <View style={styles.statContent}>
                <MaterialCommunityIcons name="trophy" size={28} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {userStats?.games_won || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textPrimary }]} numberOfLines={1}>Games Won</Text>
                </View>
              </View>
              <View style={[styles.verticalBar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.verticalText, { color: colors.activeText }]}>Active</Text>
              </View>
            </AnimatedCard>

            {/* Average Score Card */}
            <AnimatedCard
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              direction="up"
              delay={150}
            >
              <View style={styles.statContent}>
                <MaterialCommunityIcons name="chart-line" size={28} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {userStats?.average_score || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textPrimary }]} numberOfLines={1}>Avg Score</Text>
                </View>
              </View>
              <View style={[styles.verticalBar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.verticalText, { color: colors.activeText }]}>Active</Text>
              </View>
            </AnimatedCard>

            {/* Games Played Card */}
            <AnimatedCard
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              direction="up"
              delay={200}
            >
              <View style={styles.statContent}>
                <MaterialCommunityIcons name="gamepad-variant" size={28} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {userStats?.total_games || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textPrimary }]} numberOfLines={1}>Games Played</Text>
                </View>
              </View>
              <View style={[styles.verticalBar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.verticalText, { color: colors.activeText }]}>Active</Text>
              </View>
            </AnimatedCard>

            {/* Achievements Card */}
            <AnimatedCard
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              direction="up"
              delay={250}
            >
              <View style={styles.statContent}>
                <MaterialCommunityIcons name="medal" size={28} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    {userStats?.achievements?.length || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textPrimary }]} numberOfLines={1}>Achievements</Text>
                </View>
              </View>
              <View style={[styles.verticalBar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.verticalText, { color: colors.activeText }]}>Active</Text>
              </View>
            </AnimatedCard>
          </View>

          {/* System Stats */}
          {systemStats && (
            <AnimatedCard
              style={[styles.systemStatsCard, { backgroundColor: colors.surface }]}
              direction="up"
              delay={400}
            >
              <Text style={[styles.systemStatsTitle, { color: colors.textPrimary }]}>Global Statistics</Text>
              <View style={styles.systemStatsGrid}>
                <View style={styles.systemStatItem}>
                  <Text style={[styles.systemStatValue, { color: colors.textPrimary }]}>
                    {systemStats.total_users}
                  </Text>
                  <Text style={[styles.systemStatLabel, { color: colors.textSecondary }]}>Total Players</Text>
                </View>
                <View style={styles.systemStatItem}>
                  <Text style={[styles.systemStatValue, { color: colors.textPrimary }]}>
                    {systemStats.total_rooms}
                  </Text>
                  <Text style={[styles.systemStatLabel, { color: colors.textSecondary }]}>Active Rooms</Text>
                </View>
                <View style={styles.systemStatItem}>
                  <Text style={[styles.systemStatValue, { color: colors.textPrimary }]}>
                    {systemStats.active_games}
                  </Text>
                  <Text style={[styles.systemStatLabel, { color: colors.textSecondary }]}>Live Games</Text>
                </View>
              </View>
            </AnimatedCard>
          )}

          {/* Achievements Section */}
          {userStats?.achievements && userStats.achievements.length > 0 && (
            <AnimatedCard
              style={[styles.achievementsCard, { backgroundColor: colors.surface }]}
              direction="up"
              delay={450}
            >
              <Text style={[styles.achievementsTitle, { color: colors.textPrimary }]}>Your Achievements</Text>
              <View style={styles.achievementsList}>
                {userStats.achievements.map((achievement, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.achievementItem, 
                      { backgroundColor: colors.surfaceLight }
                    ]}
                  >
                    <MaterialCommunityIcons name="medal" size={16} color={colors.primary} />
                    <Text style={[styles.achievementText, { color: colors.textPrimary }]}>
                      {achievement}
                    </Text>
                  </View>
                ))}
              </View>
            </AnimatedCard>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="logout" size={20} color={colors.activeText} />
            <Text style={[styles.logoutText, { color: colors.activeText }]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.componentSpacing.contentPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['6xl'],
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.regular,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'column',
    marginBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  statCard: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.sm,
  },
  statContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  statValue: {
    fontSize: Typography['2xl'],
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'left',
  },
  statLabel: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'left',
  },
  verticalBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  verticalText: {
    fontSize: Typography.xs,
    fontFamily: Typography.fontFamily.medium,
    transform: [{ rotate: '90deg' }],
    color: Colors.activeText,
    textAlign: 'center',
  },
  systemStatsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  systemStatsTitle: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.md,
  },
  systemStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: Spacing.md,
  },
  systemStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  systemStatValue: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  systemStatLabel: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * Typography.sm,
  },
  achievementsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing['6xl'],
    ...Shadows.md,
  },
  achievementsTitle: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.md,
  },
  achievementsList: {
    gap: Spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  achievementText: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.medium,
    flex: 1,
    lineHeight: Typography.lineHeight.normal * Typography.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing['6xl'],
    ...Shadows.md,
  },
  logoutText: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.semibold,
  },
});
