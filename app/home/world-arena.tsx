import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const fetchRankings = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://${data.url}/api/rankings`);

      // Handle the new API structure with data, success, total_users
      if (response.data.success && response.data.data) {
        console.log("API Response:", response.data);
        console.log("Users data:", response.data.data);

        const sortedUsers = response.data.data
          .sort((a: any, b: any) => b.total_score - a.total_score)
          .map((user: any, index: number) => {
            console.log("Processing user:", user);
            return {
              ...user,
              rank: index + 1,
            };
          });

        setRankings(sortedUsers);
      } else {
        setError("Invalid response format from server.");
      }
    } catch (err) {
      setError("Failed to fetch rankings. Please try again.");
      console.error("Error fetching rankings:", err);
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "#8a8a8aff";
  };

  if (loading) {
    return (
      <View style={style.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={style.loadingText}>Loading rankings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={style.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#fff"
          colors={["#fff"]}
        />
      }
    >
      <View style={style.header}>
        <Text style={style.title}>🏆 World Arena Rankings</Text>
        <Text style={style.subtitle}>Top performers across the realm</Text>
        <Text style={style.totalUsers}>Total Players: {rankings.length}</Text>
      </View>

      {error ? (
        <View style={style.errorContainer}>
          <AntDesign name="exclamation-circle" size={24} color="#ff6b6b" />
          <Text style={style.errorText}>{error}</Text>
          <TouchableOpacity style={style.retryButton} onPress={fetchRankings}>
            <Text style={style.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.rankingsContainer}>
          {rankings.map((user, index) => (
            <View
              key={`${user.username}-${index}`}
              style={[
                style.rankingItem,
                index === 0 && style.topRanking,
                index < 3 && style.podiumRanking,
              ]}
            >
              <View style={style.rankInfo}>
                <Text
                  style={[style.rankIcon, { color: getRankColor(user.rank) }]}
                >
                  {getRankIcon(user.rank)}
                </Text>
                <View style={style.userInfo}>
                  <Text style={style.username}>
                    {user.username || "Unknown Player"}
                  </Text>
                  <Text style={style.score}>
                    {user.total_score.toLocaleString()} points
                  </Text>
                  <View style={style.statsRow}>
                    <Text style={style.statText}>
                      Games: {user.total_games}
                    </Text>
                    <Text style={style.statText}>Wins: {user.games_won}</Text>
                    <Text style={style.statText}>
                      Avg: {user.average_score}
                    </Text>
                  </View>
                  {user.achievements.length > 0 && (
                    <View style={style.achievementsContainer}>
                      {user.achievements.slice(0, 2).map((achievement, idx) => (
                        <View key={idx} style={style.achievementBadge}>
                          <Text style={style.achievementText}>
                            {achievement}
                          </Text>
                        </View>
                      ))}
                      {user.achievements.length > 2 && (
                        <Text style={style.moreAchievements}>
                          +{user.achievements.length - 2}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>

              {user.rank <= 3 && (
                <View style={style.badge}>
                  <AntDesign
                    name="star"
                    size={16}
                    color={getRankColor(user.rank)}
                  />
                </View>
              )}
            </View>
          ))}

          {rankings.length === 0 && !error && (
            <View style={style.emptyContainer}>
              <AntDesign name="trophy" size={48} color="#8a8a8aff" />
              <Text style={style.emptyText}>No rankings available yet</Text>
              <Text style={style.emptySubtext}>Be the first to compete!</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default WorldArena;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },

  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
  },

  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#8a8a8aff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },

  totalUsers: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },

  rankingsContainer: {
    padding: 16,
  },

  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#1a1a1a",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 100,
  },

  topRanking: {
    backgroundColor: "#2a1a00",
    borderColor: "#FFD700",
    borderWidth: 2,
  },

  podiumRanking: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },

  rankInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rankIcon: {
    fontSize: 24,
    marginRight: 12,
    fontWeight: "bold",
  },

  userInfo: {
    flex: 1,
  },

  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },

  score: {
    color: "#8a8a8aff",
    fontSize: 14,
    marginBottom: 8,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  statText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },

  achievementsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  achievementBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },

  achievementText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "600",
  },

  moreAchievements: {
    color: "#666",
    fontSize: 10,
    fontStyle: "italic",
  },

  badge: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 20,
    marginLeft: 12,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  emptyText: {
    color: "#8a8a8aff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },

  emptySubtext: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
