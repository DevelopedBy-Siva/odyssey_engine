import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing, Typography } from './DesignSystem';

interface GameSidebarProps {
  players: string[];
  currentUser: string;
  colors: any;
  onPlayerSelect?: (player: string) => void;
  selectedPlayer?: string;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  players,
  currentUser,
  colors,
  onPlayerSelect,
  selectedPlayer
}) => {
  return (
    <View style={[styles.sidebar, { backgroundColor: colors.surface }]}>
      {/* Server Header */}
      <View style={[styles.serverHeader, { borderBottomColor: colors.border }]}>
        <View style={[styles.serverIcon, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="gamepad-variant" size={24} color="white" />
        </View>
        <Text style={[styles.serverName, { color: colors.textPrimary }]}>
          Crisis Room
        </Text>
      </View>

      {/* Online Members */}
      <View style={styles.membersSection}>
        <View style={[styles.membersHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.membersTitle, { color: colors.textSecondary }]}>
            ONLINE — {players.length}
          </Text>
        </View>
        
        <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
          {players.map((player, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.memberItem,
                { backgroundColor: selectedPlayer === player ? colors.primary + '20' : 'transparent' },
                selectedPlayer === player && { borderLeftColor: colors.primary, borderLeftWidth: 3 }
              ]}
              onPress={() => onPlayerSelect?.(player)}
              activeOpacity={0.7}
            >
              <View style={styles.memberInfo}>
                <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.memberAvatarText}>
                    {player.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={[styles.memberName, { color: colors.textPrimary }]}>
                    {player}
                    {player === currentUser && (
                      <Text style={[styles.youIndicator, { color: colors.textSecondary }]}> (you)</Text>
                    )}
                  </Text>
                  <View style={styles.memberStatus}>
                    <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                      Online
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* User Info */}
      <View style={[styles.userInfo, { borderTopColor: colors.border }]}>
        <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.userAvatarText}>
            {currentUser.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {currentUser}
          </Text>
          <Text style={[styles.userStatus, { color: colors.textSecondary }]}>
            Online
          </Text>
        </View>
        <TouchableOpacity style={styles.userSettings}>
          <MaterialCommunityIcons 
            name="cog" 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    height: '100%',
    borderRightWidth: 1,
  },
  serverHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  serverName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    flex: 1,
  },
  membersSection: {
    flex: 1,
  },
  membersHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  membersTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  memberAvatarText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  youIndicator: {
    fontSize: Typography.xs,
    fontStyle: 'italic',
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: Typography.xs,
  },
  userInfo: {
    padding: Spacing.md,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userAvatarText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  userStatus: {
    fontSize: Typography.xs,
  },
  userSettings: {
    padding: Spacing.xs,
  },
});

export default GameSidebar;
