import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Spacing, Typography } from './DesignSystem';

interface GameInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  colors: any;
  disabled?: boolean;
  maxLength?: number;
}

const GameInput: React.FC<GameInputProps> = ({
  onSendMessage,
  placeholder = "Message #general",
  colors,
  disabled = false,
  maxLength = 2000
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.inputWrapper}>
        {/* Attachment Button */}
        <TouchableOpacity 
          style={[styles.attachmentButton, { backgroundColor: colors.background }]}
          disabled={disabled}
        >
          <MaterialCommunityIcons 
            name="plus" 
            size={24} 
            color={disabled ? colors.textSecondary : colors.textPrimary} 
          />
        </TouchableOpacity>

        {/* Message Input */}
        <View style={[
          styles.textInputContainer,
          { 
            backgroundColor: colors.background,
            borderColor: isFocused ? colors.primary : 'transparent',
            borderWidth: isFocused ? 1 : 0
          }
        ]}>
          <TextInput
            style={[styles.textInput, { color: colors.textPrimary }]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            multiline
            maxLength={maxLength}
            editable={!disabled}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Emoji Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            disabled={disabled}
          >
            <MaterialCommunityIcons 
              name="emoticon-happy-outline" 
              size={24} 
              color={disabled ? colors.textSecondary : colors.textPrimary} 
            />
          </TouchableOpacity>

          {/* GIF Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            disabled={disabled}
          >
            <MaterialCommunityIcons 
              name="gif" 
              size={24} 
              color={disabled ? colors.textSecondary : colors.textPrimary} 
            />
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              { 
                backgroundColor: message.trim() && !disabled ? colors.primary : colors.background,
                opacity: message.trim() && !disabled ? 1 : 0.5
              }
            ]}
            onPress={handleSend}
            disabled={!message.trim() || disabled}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={20} 
              color={message.trim() && !disabled ? 'white' : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Character Count */}
      {message.length > maxLength * 0.8 && (
        <View style={styles.characterCount}>
          <Text style={[
            styles.characterCountText,
            { 
              color: message.length >= maxLength ? colors.error : colors.textSecondary 
            }
          ]}>
            {message.length}/{maxLength}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 40,
    maxHeight: 120,
  },
  textInput: {
    fontSize: Typography.base,
    lineHeight: Typography.lineHeight.normal * Typography.base,
    minHeight: 20,
    maxHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
  },
  characterCountText: {
    fontSize: Typography.xs,
  },
});

export default GameInput;
