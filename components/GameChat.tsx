import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing, Typography } from './DesignSystem';

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  isAI?: boolean;
  isSystem?: boolean;
}

interface GameChatProps {
  messages: Message[];
  colors: any;
  onSendMessage?: (message: string) => void;
  isTyping?: boolean;
  typingUsers?: string[];
}

const GameChat: React.FC<GameChatProps> = ({
  messages,
  colors,
  onSendMessage,
  isTyping,
  typingUsers = []
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderMessage = (message: Message, index: number) => {
    const isConsecutive = index > 0 && 
      messages[index - 1]?.author === message.author &&
      new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 60000;

    if (message.isSystem) {
      return (
        <View key={message.id} style={styles.systemMessage}>
          <Text style={[styles.systemText, { color: colors.textSecondary }]}>
            {message.content}
          </Text>
        </View>
      );
    }

    return (
      <View key={message.id} style={[styles.messageGroup, !isConsecutive && styles.messageGroupSpaced]}>
        {!isConsecutive && (
          <View style={styles.messageHeader}>
            <View style={[styles.messageAvatar, { backgroundColor: message.isAI ? colors.primary : colors.success }]}>
              <Text style={styles.messageAvatarText}>
                {message.isAI ? 'AI' : message.author.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.messageAuthor, { color: message.isAI ? colors.primary : colors.textPrimary }]}>
              {message.isAI ? 'Crisis AI' : message.author}
            </Text>
            <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
              {formatTime(message.timestamp)}
            </Text>
          </View>
        )}
        <View style={[styles.messageContent, isConsecutive && styles.messageContentConsecutive]}>
          <Text style={[styles.messageText, { color: colors.textPrimary }]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.chatContainer, { backgroundColor: colors.background }]}>
      {/* Chat Header */}
      <View style={[styles.chatHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.chatHeaderLeft}>
          <MaterialCommunityIcons name="pound" size={20} color={colors.textSecondary} />
          <Text style={[styles.channelName, { color: colors.textPrimary }]}>
            general
          </Text>
        </View>
        <View style={styles.chatHeaderRight}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="phone" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="video" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="pin" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="magnify" size={16} color={colors.textSecondary} />
            <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
              Search
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => renderMessage(message, index))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={[styles.typingAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.typingAvatarText}>AI</Text>
            </View>
            <View style={styles.typingContent}>
              <Text style={[styles.typingText, { color: colors.textSecondary }]}>
                Crisis AI is typing
              </Text>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { backgroundColor: colors.textSecondary }]} />
                <View style={[styles.typingDot, { backgroundColor: colors.textSecondary }]} />
                <View style={[styles.typingDot, { backgroundColor: colors.textSecondary }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    height: 48,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    marginLeft: Spacing.sm,
  },
  chatHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.md,
  },
  searchPlaceholder: {
    fontSize: Typography.sm,
    marginLeft: Spacing.xs,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  systemText: {
    fontSize: Typography.sm,
    fontStyle: 'italic',
  },
  messageGroup: {
    marginBottom: Spacing.sm,
  },
  messageGroupSpaced: {
    marginTop: Spacing.md,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  messageAvatarText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  messageAuthor: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    marginRight: Spacing.sm,
  },
  messageTime: {
    fontSize: Typography.xs,
  },
  messageContent: {
    marginLeft: 48,
  },
  messageContentConsecutive: {
    marginLeft: 48,
    marginTop: -Spacing.xs,
  },
  messageText: {
    fontSize: Typography.base,
    lineHeight: Typography.lineHeight.normal * Typography.base,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  typingAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  typingAvatarText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: Typography.sm,
    marginRight: Spacing.sm,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: BorderRadius.full,
    marginRight: 2,
    opacity: 0.6,
  },
});

export default GameChat;
