import { BorderRadius, Colors, Layout, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import ApiService, { SystemStats, UserStats } from "@/services/apiService";
import { getSocket } from "@/store/socket";
import { useUserStore } from "@/store/userStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { username, clearUsername } = useUserStore();
  const router = useRouter();
  const socket = getSocket(username);
  const colors = Colors;
  const [activeTab, setActiveTab] = useState('room');
  const [activeBottomNav, setActiveBottomNav] = useState('home');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Helper function to format last played date
  const formatLastPlayed = (lastPlayed: string | null) => {
    if (!lastPlayed) return 'Welcome!';
    
    try {
      const date = new Date(lastPlayed);
      if (isNaN(date.getTime())) return 'Welcome!';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Last Played: Yesterday';
      if (diffDays < 7) return `Last Played: ${diffDays} days ago`;
      if (diffDays < 30) return `Last Played: ${Math.ceil(diffDays / 7)} weeks ago`;
      
      return `Last Played: ${date.toLocaleDateString()}`;
    } catch (error) {
      return 'Welcome!';
    }
  };

  const [roomsFeatures, setRoomsFeatures] = useState([
    { id: 1, name: 'Build Room', icon: 'plus-circle', count: 'Create Game', isActive: true },
    { id: 2, name: 'Join Room', icon: 'login', count: 'Find Games', isActive: false },
  ]);

  // Update rooms count based on system stats
  useEffect(() => {
    if (systemStats) {
      setRoomsFeatures(prev => prev.map(feature => 
        feature.name === 'Join Room' 
          ? { ...feature, count: `${systemStats.total_rooms} Available` }
          : feature
      ));
    }
  }, [systemStats]);

  const [gameFeatures] = useState([
    { id: 1, name: 'World Arena', icon: 'trophy', count: 'Rankings', isActive: true },
    { id: 2, name: 'Profile', icon: 'account', count: 'Settings', isActive: false },
  ]);

  // Removed toggleFeature function as it's not used in the new UI

  const navigateToFeature = (feature: any) => {
    if (feature.name === 'Build Room') {
      router.push('/home/set-theme');
    } else if (feature.name === 'Join Room') {
      router.push('/home/join-room');
    } else if (feature.name === 'World Arena') {
      router.push('/home/world-arena');
    } else if (feature.name === 'Profile') {
      router.push('/home/profile');
    }
  };

  const handleBottomNavPress = (navItem: string) => {
    setActiveBottomNav(navItem);
    switch (navItem) {
      case 'home':
        // Navigate to home page (refresh current page)
        router.replace('/home');
        break;
      case 'trophy':
        // Navigate to world arena rankings
        router.push('/home/world-arena');
        break;
      case 'gamepad':
        // Middle control button - display only, no navigation
        // This button is just for display purposes
        break;
      case 'account':
        // Navigate to profile page
        router.push('/home/profile');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API if username exists
      if (username) {
        const logoutResult = await ApiService.logout(username);
      }
      
      // Clear local storage and state
      await AsyncStorage.clear();
      clearUsername();
      
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      // Even if logout fails, clear local data
      try {
        await AsyncStorage.clear();
        clearUsername();
        router.replace('/login');
      } catch (clearError) {
        // Force navigation even if clearing fails
        router.replace('/login');
      }
    }
  };

  // Load user data and system stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check server health first
        try {
          await ApiService.healthCheck();
          setIsOfflineMode(false);
        } catch (error) {
          setIsOfflineMode(true);
        }
        
        // Load user stats
        if (username) {
          try {
            const stats = await ApiService.getUserStats(username);
            setUserStats(stats);
          } catch (error) {
            // Continue without user stats
          }
        }
        
        // Load system stats
        try {
          const sysStats = await ApiService.getSystemStats();
          setSystemStats(sysStats);
        } catch (error) {
          // Continue without system stats
        }
        
      } catch (error) {
        setIsOfflineMode(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  useEffect(() => {
    socket.on("navigate-to-room", (data) => {
      router.replace({
        pathname: "/home/build-room",
        params: {
          room: data["room"],
          username: username,
          roomName: data["room_name"],
          theme: JSON.stringify(data["room_theme"]),
          maxPlayers: data["room_players"],
          isAdmin: data["option"] === "create" ? "1" : "0",
        },
      });
    });

    socket.on("entered-game", (data) => {
      // Handle game room entry
    });

    return () => {
      socket.off("navigate-to-room");
      socket.off("entered-game");
    };
  }, [socket, router, username]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.background, { backgroundColor: colors.background }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Loading your game data...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>
            Hello, {username ? username.charAt(0).toUpperCase() + username.slice(1) : 'User'}
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Offline Mode Indicator */}
        {isOfflineMode && (
          <View style={[styles.offlineIndicator, { backgroundColor: colors.warning }]}>
            <MaterialCommunityIcons name="wifi-off" size={16} color={colors.textPrimary} />
            <Text style={[styles.offlineText, { color: colors.textPrimary }]}>
              Offline Mode - Some features may be limited
            </Text>
          </View>
        )}

        {/* Game Stats Card */}
        <View style={[styles.gameStatsCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.gameStatsMain}>
            <View style={styles.gameStatsInfo}>
              <Text style={[styles.gameLevel, { color: colors.activeText }]}>
                {loading ? '...' : userStats ? `Score: ${userStats.total_score || 0}` : 'Score: 0'}
              </Text>
              <Text style={[styles.gameStatus, { color: colors.activeText }]}>
                {loading ? 'Loading...' : userStats ? 'Ready to Play' : 'New Player'}
              </Text>
              <Text style={[styles.gameDate, { color: colors.activeText }]}>
                {loading ? '...' : formatLastPlayed(userStats?.last_played ?? null)}
              </Text>
            </View>
            <View style={styles.gameIcon}>
              <MaterialCommunityIcons name="gamepad-variant" size={40} color={colors.activeText} />
            </View>
          </View>
          <View style={styles.gameStats}>
            <View style={styles.gameStat}>
              <Text style={[styles.statLabel, { color: colors.activeText }]}>Games Won</Text>
              <Text style={[styles.statValue, { color: colors.activeText }]}>
                {loading ? '...' : userStats?.games_won || 0}
              </Text>
            </View>
            <View style={styles.gameStat}>
              <Text style={[styles.statLabel, { color: colors.activeText }]}>Avg Score</Text>
              <Text style={[styles.statValue, { color: colors.activeText }]}>
                {loading ? '...' : userStats?.average_score ? Math.round(userStats.average_score) : 0}
              </Text>
            </View>
            <View style={styles.gameStat}>
              <Text style={[styles.statLabel, { color: colors.activeText }]}>Games Played</Text>
              <Text style={[styles.statValue, { color: colors.activeText }]}>
                {loading ? '...' : userStats?.total_games || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'room' && styles.activeTab]}
            onPress={() => setActiveTab('room')}
          >
            <Text style={[styles.tabText, activeTab === 'room' && styles.activeTabText]}>Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'devices' && styles.activeTab]}
            onPress={() => setActiveTab('devices')}
          >
            <Text style={[styles.tabText, activeTab === 'devices' && styles.activeTabText]}>Features</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Content Grid */}
        <View style={styles.featuresGrid}>
          {activeTab === 'room' ? (
            roomsFeatures.map((feature) => (
              <TouchableOpacity 
                key={feature.id}
                style={[
                  styles.featureCard, 
                  { backgroundColor: feature.isActive ? colors.activeCard : colors.inactiveCard }
                ]}
                onPress={() => navigateToFeature(feature)}
              >
                <View style={styles.featureHeader}>
                  <MaterialCommunityIcons 
                    name={feature.icon as any} 
                    size={24} 
                    color={feature.isActive ? colors.activeText : colors.inactiveText} 
                  />
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={feature.isActive ? colors.activeText : colors.inactiveText}
                  />
                </View>
                <Text style={[
                  styles.featureName, 
                  { color: feature.isActive ? colors.activeText : colors.inactiveText }
                ]}>
                  {feature.name}
                </Text>
                <Text style={[
                  styles.featureCount, 
                  { color: feature.isActive ? colors.activeText : colors.inactiveText }
                ]}>
                  {feature.count}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            gameFeatures.map((feature) => (
              <TouchableOpacity 
                key={feature.id}
                style={[
                  styles.featureCard, 
                  { backgroundColor: feature.isActive ? colors.activeCard : colors.inactiveCard }
                ]}
                onPress={() => navigateToFeature(feature)}
              >
                <View style={styles.featureHeader}>
                  <MaterialCommunityIcons 
                    name={feature.icon as any} 
                    size={24} 
                    color={feature.isActive ? colors.activeText : colors.inactiveText} 
                  />
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={feature.isActive ? colors.activeText : colors.inactiveText}
                  />
                </View>
                <Text style={[
                  styles.featureName, 
                  { color: feature.isActive ? colors.activeText : colors.inactiveText }
                ]}>
                  {feature.name}
                </Text>
                <Text style={[
                  styles.featureCount, 
                  { color: feature.isActive ? colors.activeText : colors.inactiveText }
                ]}>
                  {feature.count}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* Bottom Navigation - Moved outside main content */}
      <View style={[styles.bottomNav, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.navItem, activeBottomNav === 'home' && styles.activeNavItem]}
          onPress={() => handleBottomNavPress('home')}
        >
          <MaterialCommunityIcons 
            name="home" 
            size={24} 
            color={activeBottomNav === 'home' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.navLabel, 
            { color: activeBottomNav === 'home' ? colors.primary : colors.textSecondary }
          ]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeBottomNav === 'trophy' && styles.activeNavItem]}
          onPress={() => handleBottomNavPress('trophy')}
        >
          <MaterialCommunityIcons 
            name="trophy" 
            size={24} 
            color={activeBottomNav === 'trophy' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.navLabel, 
            { color: activeBottomNav === 'trophy' ? colors.primary : colors.textSecondary }
          ]}>
            Arena
          </Text>
        </TouchableOpacity>
        <View style={[styles.navItem, styles.displayOnlyItem]}>
          <MaterialCommunityIcons 
            name="gamepad-variant" 
            size={24} 
            color={colors.textTertiary} 
          />
          <Text style={[
            styles.navLabel, 
            { color: colors.textTertiary }
          ]}>
            Control
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.navItem, activeBottomNav === 'account' && styles.activeNavItem]}
          onPress={() => handleBottomNavPress('account')}
        >
          <MaterialCommunityIcons 
            name="account" 
            size={24} 
            color={activeBottomNav === 'account' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[
            styles.navLabel, 
            { color: activeBottomNav === 'account' ? colors.primary : colors.textSecondary }
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, activeBottomNav === 'logout' && styles.activeNavItem]}
          onPress={() => handleBottomNavPress('logout')}
        >
          <MaterialCommunityIcons 
            name="logout" 
            size={24} 
            color={activeBottomNav === 'logout' ? colors.error : colors.textSecondary} 
          />
          <Text style={[
            styles.navLabel, 
            { color: activeBottomNav === 'logout' ? colors.error : colors.textSecondary }
          ]}>
            Logout
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: Layout.componentSpacing.contentPadding,
    paddingBottom: 0, // Remove bottom padding to allow bottom nav to stick to bottom
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.componentSpacing.contentPadding,
    paddingBottom: Layout.componentSpacing.sectionGap,
  },
  greeting: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily.bold,
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  gameStatsCard: {
    borderRadius: BorderRadius.lg,
    padding: Layout.componentSpacing.cardPadding,
    marginBottom: Layout.componentSpacing.sectionGap,
    ...Shadows.md,
  },
  gameStatsMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.componentSpacing.contentPadding,
  },
  gameStatsInfo: {
    flex: 1,
  },
  gameLevel: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
  },
  gameStatus: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
  },
  gameDate: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  gameIcon: {
    alignItems: 'center',
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.semibold,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Layout.componentSpacing.sectionGap,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Layout.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.componentSpacing.formFieldGap,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.activeCard,
  },
  tabText: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.inactiveText,
  },
  activeTabText: {
    color: Colors.activeText,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing['5xl'],
    gap: Layout.componentSpacing.cardGap,
    paddingBottom: 100, // Add padding to prevent content from being hidden behind bottom nav
  },
  featureCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Layout.componentSpacing.cardPadding,
    ...Shadows.level1,
    // Material Design card spacing
    marginBottom: 0, // Gap is handled by parent
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.componentSpacing.contentPadding,
  },
  featureName: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.xs,
  },
  featureCount: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Layout.componentSpacing.contentPadding,
    paddingHorizontal: Layout.componentSpacing.sectionGap,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.background,
    ...Shadows.level2,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xs,
    borderRadius: BorderRadius.md,
    minWidth: 60,
  },
  activeNavItem: {
    backgroundColor: Colors.surface,
  },
  navLabel: {
    fontSize: Typography.xs,
    fontFamily: Typography.fontFamily.medium,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  displayOnlyItem: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.componentSpacing.contentPadding,
  },
  loadingText: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.regular,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginHorizontal: Layout.componentSpacing.contentPadding,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  offlineText: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.medium,
    marginLeft: Spacing.sm,
  },
});
