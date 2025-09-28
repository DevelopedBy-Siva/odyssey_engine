import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, Layout, Shadows, Spacing, Typography } from './DesignSystem';

// Removed unused screenWidth variable

interface ModernCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: any;
  onPress?: () => void;
  style?: any;
  animated?: boolean;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  gradient?: boolean;
  gradientColors?: string[];
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  title,
  subtitle,
  description,
  image,
  onPress,
  style,
  animated = true,
  delay = 0,
  direction = 'up',
  gradient = false,
  gradientColors = [Colors.gradientStart, Colors.gradientEnd],
  elevation = 'md',
  variant = 'default',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (animated) {
      const getInitialTransform = () => {
        switch (direction) {
          case 'up':
            return 50;
          case 'down':
            return -50;
          case 'left':
            return 50;
          case 'right':
            return -50;
          default:
            return 50;
        }
      };

      const initialTransform = getInitialTransform();
      slideAnim.setValue(initialTransform);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, delay, direction, fadeAnim, slideAnim, scaleAnim]);

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: BorderRadius.lg,
      padding: Layout.componentSpacing.cardPadding,
    };

    switch (variant) {
      case 'elevated':
        return { 
          ...baseStyle, 
          backgroundColor: Colors.surface,
          ...Shadows.level2,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          ...Shadows.level0,
        };
      case 'filled':
        return { 
          ...baseStyle, 
          backgroundColor: Colors.surfaceLight,
          ...Shadows.level0,
        };
      default:
        return { 
          ...baseStyle, 
          backgroundColor: Colors.surface,
          ...Shadows.level1,
        };
    }
  };

  const getTransform = () => {
    if (direction === 'up' || direction === 'down') {
      return { translateY: slideAnim };
    }
    return { translateX: slideAnim };
  };

  const CardContent = () => (
    <View style={styles.cardContent}>
      {image && (
        <Image source={image} style={styles.cardImage} resizeMode="cover" />
      )}
      
      {(title || subtitle || description) && (
        <View style={styles.textContent}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
      
      {children}
    </View>
  );

  const CardComponent = onPress ? TouchableOpacity : View;

  if (gradient) {
    return (
      <CardComponent onPress={onPress} activeOpacity={0.9}>
        <Animated.View
          style={[
            getCardStyle(),
            {
              opacity: fadeAnim,
              transform: [
                getTransform(),
                { scale: scaleAnim },
              ],
            },
            style,
          ]}
        >
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <CardContent />
          </LinearGradient>
        </Animated.View>
      </CardComponent>
    );
  }

  return (
    <CardComponent onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          getCardStyle(),
          {
            opacity: fadeAnim,
            transform: [
              getTransform(),
              { scale: scaleAnim },
            ],
          },
          style,
        ]}
      >
        <CardContent />
      </Animated.View>
    </CardComponent>
  );
};

// Game Room Card Component
interface GameRoomCardProps {
  roomName: string;
  theme: string;
  host: string;
  roomId: string;
  currentPlayers: number;
  maxPlayers: number;
  onJoin: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  style?: any;
  animated?: boolean;
  delay?: number;
}

export const GameRoomCard: React.FC<GameRoomCardProps> = ({
  roomName,
  theme,
  host,
  roomId,
  currentPlayers,
  maxPlayers,
  onJoin,
  onDelete,
  isDeleting = false,
  style,
  animated = true,
  delay = 0,
}) => {
  const isFull = currentPlayers >= maxPlayers;
  const isNearFull = currentPlayers >= maxPlayers * 0.8;

  const getProgressColor = () => {
    if (isFull) return Colors.error;
    if (isNearFull) return Colors.warning;
    return Colors.success;
  };

  return (
    <ModernCard
      title={roomName}
      subtitle={`Theme: ${theme}`}
      description={`Host: ${host} • ID: ${roomId}`}
      onPress={!isFull ? onJoin : undefined}
      style={[
        style,
        isFull && { opacity: 0.6 },
      ]}
      animated={animated}
      delay={delay}
      variant="elevated"
    >
      <View style={styles.roomInfo}>
        <View style={styles.playerCountContainer}>
          <Text style={styles.playerCount}>
            {currentPlayers} / {maxPlayers}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentPlayers / maxPlayers) * 100}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          {onDelete && (
            <TouchableOpacity
              style={[
                styles.deleteButton, 
                { backgroundColor: isDeleting ? Colors.border : Colors.error }
              ]}
              onPress={onDelete}
              activeOpacity={0.8}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons
                  name="delete"
                  size={16}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          )}
          {isFull ? (
            <View style={[styles.joinButton, styles.joinButtonDisabled]}>
              <Text style={styles.joinButtonText}>Full</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.joinButton, { backgroundColor: Colors.primary }]}
              onPress={onJoin}
              activeOpacity={0.8}
            >
              <Text style={[styles.joinButtonText, { color: '#FFFFFF' }]}>Join</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ModernCard>
  );
};

// Ranking Card Component
interface RankingCardProps {
  rank: number;
  username: string;
  score: number;
  games: number;
  wins: number;
  achievements: string[];
  averageScore?: number;
  lastPlayed?: string;
  lastActive?: string;
  style?: any;
  animated?: boolean;
  delay?: number;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  rank,
  username,
  score,
  games,
  wins,
  achievements,
  averageScore,
  lastPlayed,
  lastActive,
  style,
  animated = true,
  delay = 0,
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return Colors.warning;
    if (rank === 2) return Colors.textSecondary;
    if (rank === 3) return Colors.accent;
    return Colors.textTertiary;
  };

  const isTopThree = rank <= 3;

  // Helper functions
  const calculateWinRate = () => {
    if (games === 0) return 0;
    return Math.round((wins / games) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const isOnline = () => {
    if (!lastActive) return false;
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    return diffInMinutes < 5; // Online if active within last 5 minutes
  };

  return (
    <ModernCard
      style={[
        style,
        isTopThree && styles.topRankingCard,
      ]}
      animated={animated}
      delay={delay}
      variant="default"
    >
      <View style={styles.rankingContent}>
        <View style={styles.rankInfo}>
          <Text style={[styles.rankIcon, { color: getRankColor(rank) }]}>
            {getRankIcon(rank)}
          </Text>
          <View style={styles.userInfo}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{username.charAt(0).toUpperCase() + username.slice(1)}</Text>
              <View style={[styles.statusIndicator, { backgroundColor: isOnline() ? Colors.success : Colors.border }]} />
            </View>
            <Text style={styles.score}>{score.toLocaleString()} points</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statText}>Games: {games}</Text>
              <Text style={styles.statText}>Wins: {wins}</Text>
              <Text style={styles.statText}>Win Rate: {calculateWinRate()}%</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityText}>Last Played: {formatDate(lastPlayed)}</Text>
              <Text style={styles.activityText}>Active: {formatDate(lastActive)}</Text>
            </View>
            {achievements.length > 0 && (
              <View style={styles.achievementsContainer}>
                {achievements.slice(0, 2).map((achievement, index) => (
                  <View key={index} style={styles.achievementBadge}>
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
                {achievements.length > 2 && (
                  <Text style={styles.moreAchievements}>
                    +{achievements.length - 2}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </ModernCard>
  );
};

// Theme Selection Card Component
interface ThemeCardProps {
  theme: {
    id: number;
    name: string;
    image: any;
    emoji: string;
    intro_msg: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  style?: any;
  animated?: boolean;
  delay?: number;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  isSelected,
  onSelect,
  style,
  animated = true,
  delay = 0,
}) => {
  return (
    <ModernCard
      onPress={onSelect}
      style={[
        style,
        styles.themeCard,
        isSelected && styles.selectedThemeCard,
      ]}
      animated={animated}
      delay={delay}
      variant={isSelected ? 'elevated' : 'outlined'}
    >
      <View style={styles.themeContent}>
        <Image source={theme.image} style={styles.themeImage} resizeMode="cover" />
        <View style={styles.themeOverlay}>
          <Text style={styles.themeEmoji}>{theme.emoji}</Text>
          <Text style={styles.themeName}>{theme.name}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color={Colors.success}
            />
          </View>
        )}
      </View>
    </ModernCard>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  textContent: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    lineHeight: Typography.lineHeight.normal * Typography.sm,
  },
  gradientCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  roomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  playerCountContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  playerCount: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  joinButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: Colors.border,
  },
  joinButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  deleteButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRankingCard: {
    // Remove border to match profile card style
  },
  rankingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    fontWeight: Typography.bold,
  },
  userInfo: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  username: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  score: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  averageScore: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  activityText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    flex: 1,
  },
  statText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  achievementBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  achievementText: {
    color: Colors.warning,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  moreAchievements: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontStyle: 'italic',
  },
  themeCard: {
    width: 200,
    height: 180,
    marginBottom: Spacing.md,
  },
  selectedThemeCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  themeContent: {
    position: 'relative',
    flex: 1,
  },
  themeImage: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.md,
  },
  themeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: Spacing.sm,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    alignItems: 'center',
  },
  themeEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  themeName: {
    color: '#FFFFFF',
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
  },
});
