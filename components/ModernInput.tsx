import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from './DesignSystem';

interface ModernInputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: any;
  inputStyle?: any;
  animated?: boolean;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  error,
  success = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  animated = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const focusAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(focusAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, focusAnim, animated]);

  useEffect(() => {
    if (error && animated) {
      Animated.sequence([
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [error, errorAnim, animated]);

  useEffect(() => {
    if (success && animated) {
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [success, successAnim, animated]);

  const handleFocus = () => {
    setIsFocused(true);
    if (animated) {
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (animated) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleTextChange = (text: string) => {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (success) return Colors.success;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  const getLabelColor = () => {
    if (error) return Colors.error;
    if (success) return Colors.success;
    if (isFocused) return Colors.primary;
    return Colors.textSecondary;
  };

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  const animatedLabelColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textSecondary, Colors.primary],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: animated ? animatedLabelColor : getLabelColor(),
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
      
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: animated ? animatedBorderColor : getBorderColor(),
          },
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          success && styles.inputContainerSuccess,
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {leftIcon && (
            <MaterialCommunityIcons
              name={leftIcon as any}
              size={20}
              color={isFocused ? Colors.primary : Colors.textTertiary}
              style={styles.leftIcon}
            />
          )}
          
          <TextInput
            style={[styles.input, inputStyle]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            placeholderTextColor={Colors.textTertiary}
            {...props}
          />
          
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightIconContainer}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={rightIcon as any}
                size={20}
                color={isFocused ? Colors.primary : Colors.textTertiary}
              />
            </TouchableOpacity>
          )}
          
          {success && (
            <Animated.View
              style={[
                styles.successIcon,
                {
                  opacity: successAnim,
                  transform: [
                    {
                      scale: successAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={Colors.success}
              />
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
      
      {error && (
        <Animated.View
          style={[
            styles.errorContainer,
            {
              opacity: errorAnim,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color={Colors.error}
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
};

// Search Input Component
interface SearchInputProps extends Omit<ModernInputProps, 'leftIcon'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onClear,
  showClearButton = true,
  ...props
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text: string) => {
    setQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <ModernInput
      {...props}
      value={query}
      onChangeText={handleSearch}
      leftIcon="magnify"
      rightIcon={showClearButton && query.length > 0 ? "close" : undefined}
      onRightIconPress={handleClear}
      placeholder="Search..."
    />
  );
};

// Password Input Component
interface PasswordInputProps extends Omit<ModernInputProps, 'rightIcon' | 'onRightIconPress'> {
  showStrengthIndicator?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showStrengthIndicator = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const handlePasswordChange = (text: string) => {
    setStrength(getPasswordStrength(text));
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return Colors.error;
    if (strength <= 3) return Colors.warning;
    return Colors.success;
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <View>
      <ModernInput
        {...props}
        secureTextEntry={!isVisible}
        rightIcon={isVisible ? "eye-off" : "eye"}
        onRightIconPress={() => setIsVisible(!isVisible)}
        onChangeText={handlePasswordChange}
        placeholder="Enter password"
      />
      
      {showStrengthIndicator && props.value && props.value.length > 0 && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthFill,
                {
                  width: `${(strength / 5) * 100}%`,
                  backgroundColor: getStrengthColor(),
                },
              ]}
            />
          </View>
          <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
            {getStrengthText()}
          </Text>
        </View>
      )}
    </View>
  );
};

// Text Area Component
interface TextAreaProps extends Omit<ModernInputProps, 'multiline'> {
  minHeight?: number;
  maxHeight?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  minHeight = 80,
  maxHeight = 200,
  ...props
}) => {
  return (
    <ModernInput
      {...props}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      style={[
        props.style,
        {
          minHeight,
          maxHeight,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    marginBottom: Spacing.xs,
    color: Colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    ...Shadows.sm,
  },
  inputContainerFocused: {
    ...Shadows.md,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  inputContainerSuccess: {
    borderColor: Colors.success,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.primaryDark,
    paddingVertical: Spacing.md,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIconContainer: {
    padding: Spacing.xs,
  },
  successIcon: {
    marginLeft: Spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  errorIcon: {
    marginRight: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sm,
    flex: 1,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
});
