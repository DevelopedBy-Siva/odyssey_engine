import { AnimatedCard, LoadingSpinner } from "@/components/AnimatedComponents";
import { BorderRadius, Colors, Layout, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import { RankingCard } from "@/components/ModernCard";
import { ModernHeader } from "@/components/ModernHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import data from "../../assets/data.json";

interface UserRanking {
  username: string;
  total_score: number;
  average_score: number;
  total_games: number;
  games_won: number;
  achievements: string[];
  lastActive: string;
  last_played: string;
  rank: number;
}

const WorldArena = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = Colors;
  const router = useRouter();

  const fetchRankings = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://${data.url}/api/rankings`);

      // Handle the new API structure with data, success, total_users
      if (response.data.success && response.data.data) {
        const sortedUsers = response.data.data
          .sort((a: any, b: any) => b.total_score - a.total_score)
          .map((user: any, index: number) => ({
            ...user,
            rank: index + 1,
          }));

        setRankings(sortedUsers);
      } else {
        setError("Invalid response format from server.");
      }
    } catch {
      setError("Failed to fetch rankings. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRankings();
  };

  useEffect(() => {
    fetchRankings();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <ModernHeader
            title="World Arena"
            subtitle="Global Rankings"
            showBackButton={true}
            onBackPress={() => router.back()}
          />
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} color={colors.primary} />
            <Text style={styles.loadingText}>Loading rankings...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        <ModernHeader
          title="World Arena"
          subtitle="Global Rankings"
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <AnimatedCard
            style={styles.headerStats}
            direction="up"
            delay={100}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={24}
                  color={colors.warning}
                />
                <Text style={styles.statNumber}>{rankings.length}</Text>
                <Text style={styles.statLabel}>Total Players</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={colors.accent}
                />
                <Text style={styles.statNumber}>
                  {rankings.length > 0 ? rankings[0].total_score.toLocaleString() : 0}
                </Text>
                <Text style={styles.statLabel}>Top Score</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="gamepad-variant"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.statNumber}>
                  {rankings.reduce((sum, user) => sum + user.total_games, 0)}
                </Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
            </View>
          </AnimatedCard>

          {error ? (
            <AnimatedCard
              style={styles.errorContainer}
              direction="up"
              delay={200}
            >
              <MaterialCommunityIcons
                name="alert-circle"
                size={48}
                color={colors.error}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchRankings}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </AnimatedCard>
          ) : (
            <View style={styles.rankingsContainer}>
              {rankings.map((user, index) => (
                <RankingCard
                  key={`${user.username}-${index}`}
                  rank={user.rank}
                  username={user.username || "Unknown Player"}
                  score={user.total_score}
                  games={user.total_games}
                  wins={user.games_won}
                  achievements={user.achievements}
                  averageScore={user.average_score}
                  lastPlayed={user.last_played}
                  lastActive={user.lastActive}
                  animated={true}
                  delay={200 + (index * 100)}
                />
              ))}

              {rankings.length === 0 && !error && (
                <AnimatedCard
                  style={styles.emptyContainer}
                  direction="up"
                  delay={200}
                >
                  <MaterialCommunityIcons
                    name="trophy"
                    size={48}
                    color={colors.textTertiary}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyText}>No rankings available yet</Text>
                  <Text style={styles.emptySubtext}>Be the first to compete!</Text>
                </AnimatedCard>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WorldArena;

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
    padding: Spacing['4xl'],
  },
  loadingText: {
    fontSize: Typography.lg,
    marginTop: Spacing.lg,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  headerStats: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    marginVertical: Spacing.sm,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.sm,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  rankingsContainer: {
    gap: Layout.componentSpacing.cardGap,
  },
  errorContainer: {
    alignItems: 'center',
    padding: Layout.componentSpacing.contentPadding,
    borderRadius: BorderRadius.lg,
    margin: Layout.componentSpacing.contentPadding,
    ...Shadows.level1,
  },
  errorIcon: {
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.lg,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  retryButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Layout.componentSpacing.contentPadding,
    borderRadius: BorderRadius.lg,
    margin: Layout.componentSpacing.contentPadding,
    ...Shadows.level1,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: Typography.sm,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
});
