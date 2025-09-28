import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Animation, BorderRadius, Colors, Shadows, Spacing, Typography } from './DesignSystem';


// Minimalistic Button Component
interface MinimalisticButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  textStyle?: any;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const MinimalisticButton: React.FC<MinimalisticButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.lg : Spacing.md,
      paddingHorizontal: size === 'sm' ? Spacing.md : size === 'lg' ? Spacing.xl : Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      minHeight: size === 'sm' ? 36 : size === 'lg' ? 52 : 44,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Colors.secondary,
          borderWidth: 1,
          borderColor: Colors.secondary,
        };
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: Colors.accent,
          borderWidth: 1,
          borderColor: Colors.accent,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.border,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'primary':
      default:
        return {
          ...baseStyle,
          backgroundColor: Colors.primary,
          borderWidth: 1,
          borderColor: Colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: size === 'sm' ? Typography.sm : size === 'lg' ? Typography.lg : Typography.base,
      fontWeight: Typography.medium,
      textAlign: 'center' as const,
    };

    switch (variant) {
      case 'outline':
        return {
          ...baseTextStyle,
          color: Colors.textPrimary,
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: Colors.textSecondary,
        };
      default:
        return {
          ...baseTextStyle,
          color: Colors.textPrimary,
        };
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner size={16} color={Colors.textPrimary} />;
    }

    const textElement = <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
    
    if (icon) {
      const iconElement = (
        <MaterialCommunityIcons
          name={icon as any}
          size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
          color={getTextStyle().color}
          style={{ marginHorizontal: Spacing.xs }}
        />
      );
      
      return iconPosition === 'left' ? (
        <>
          {iconElement}
          {textElement}
        </>
      ) : (
        <>
          {textElement}
          {iconElement}
        </>
      );
    }

    return textElement;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getButtonStyle(), style]}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {renderContent()}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Legacy AnimatedButton interface
interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  textStyle?: any;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.lg : Spacing.md,
      paddingHorizontal: size === 'sm' ? Spacing.md : size === 'lg' ? Spacing.xl : Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...Shadows.md,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: Colors.primary };
      case 'secondary':
        return { ...baseStyle, backgroundColor: Colors.secondary };
      case 'accent':
        return { ...baseStyle, backgroundColor: Colors.accent };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Colors.primary,
        };
      default:
        return { ...baseStyle, backgroundColor: Colors.primary };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: size === 'sm' ? Typography.sm : size === 'lg' ? Typography.lg : Typography.base,
      fontWeight: Typography.semibold,
    };

    if (variant === 'outline') {
      return { ...baseStyle, color: Colors.primary };
    }
    return { ...baseStyle, color: Colors.textPrimary };
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: Animation.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: Animation.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: Animation.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: Animation.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      // Bounce animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: Animation.fast,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: Animation.fast,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress();
    }
  };

  useEffect(() => {
    if (loading) {
      const rotation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotation.start();
      return () => rotation.stop();
    }
  }, [loading, rotationAnim]);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          getButtonStyle(),
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Text style={[getTextStyle(), textStyle]}>⟳</Text>
          </Animated.View>
        ) : (
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Animated Card Component
interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  delay = 0,
  direction = 'up',
}) => {
  const translateAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const getInitialTransform = () => {
      switch (direction) {
        case 'up':
          return { translateY: 50 };
        case 'down':
          return { translateY: -50 };
        case 'left':
          return { translateX: 50 };
        case 'right':
          return { translateX: -50 };
        default:
          return { translateY: 50 };
      }
    };

    const initialTransform = getInitialTransform();
    
    if (direction === 'up' || direction === 'down') {
      translateAnim.setValue(initialTransform.translateY || 50);
    } else {
      translateAnim.setValue(initialTransform.translateX || 50);
    }

    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: Animation.normal,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: Animation.normal,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: Animation.normal,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, direction, translateAnim, opacityAnim, scaleAnim]);

  const getTransform = () => {
    if (direction === 'up' || direction === 'down') {
      return { translateY: translateAnim };
    }
    return { translateX: translateAnim };
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: opacityAnim,
            transform: [
              getTransform(),
              { scale: scaleAnim },
            ],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </CardComponent>
  );
};

// Gradient Button Component
interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: string[];
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  colors = [Colors.gradientStart, Colors.gradientEnd],
  disabled = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: Animation.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: Animation.fast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={[styles.gradientButtonText, textStyle]}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Floating Action Button
interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  color?: string;
  style?: any;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = '+',
  size = 56,
  color = Colors.primary,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: Animation.fast,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: Animation.fast,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: Animation.fast,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: Animation.fast,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    onPress();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.fab,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            transform: [
              { scale: scaleAnim },
              { rotate },
            ],
          },
          Shadows.lg,
          style,
        ]}
      >
        <Text style={[styles.fabIcon, { fontSize: size * 0.4 }]}>{icon}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Loading Spinner
interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: any;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = Colors.primary,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotation.start();
    return () => rotation.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: size,
          height: size,
          borderColor: color,
          transform: [{ rotate }],
        },
        style,
      ]}
    />
  );
};

// Pulse Animation Component
interface PulseAnimationProps {
  children: React.ReactNode;
  duration?: number;
  scale?: number;
  style?: any;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  duration = 1000,
  scale = 1.1,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: scale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, duration, scale]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Animated Loading Dots Component
interface AnimatedLoadingDotsProps {
  color?: string;
  size?: number;
  style?: any;
}

export const AnimatedLoadingDots: React.FC<AnimatedLoadingDotsProps> = ({
  color = Colors.primary,
  size = 8,
  style,
}) => {
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dot1Animation = createDotAnimation(dot1Anim, 0);
    const dot2Animation = createDotAnimation(dot2Anim, 200);
    const dot3Animation = createDotAnimation(dot3Anim, 400);

    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    return () => {
      dot1Animation.stop();
      dot2Animation.stop();
      dot3Animation.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={[styles.loadingDotsContainer, style]}>
      <Animated.View
        style={[
          styles.loadingDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot1Anim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loadingDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot2Anim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loadingDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: dot3Anim,
          },
        ]}
      />
    </View>
  );
};

// AI Processing Animation Component
interface AIProcessingAnimationProps {
  color?: string;
  style?: any;
}

export const AIProcessingAnimation: React.FC<AIProcessingAnimationProps> = ({
  color = Colors.accent,
  style,
}) => {
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.4)).current;
  const dot3Anim = useRef(new Animated.Value(0.4)).current;
  const dot4Anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dot1Animation = createDotAnimation(dot1Anim, 0);
    const dot2Animation = createDotAnimation(dot2Anim, 100);
    const dot3Animation = createDotAnimation(dot3Anim, 200);
    const dot4Animation = createDotAnimation(dot4Anim, 300);

    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();
    dot4Animation.start();

    return () => {
      dot1Animation.stop();
      dot2Animation.stop();
      dot3Animation.stop();
      dot4Animation.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim, dot4Anim]);

  return (
    <View style={[styles.aiProcessingContainer, style]}>
      <Animated.View
        style={[
          styles.aiDot,
          {
            backgroundColor: color,
            opacity: dot1Anim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.aiDot,
          {
            backgroundColor: color,
            opacity: dot2Anim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.aiDot,
          {
            backgroundColor: color,
            opacity: dot3Anim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.aiDot,
          {
            backgroundColor: color,
            opacity: dot4Anim,
          },
        ]}
      />
    </View>
  );
};

// Pulsing Icon Component
interface PulsingIconProps {
  children: React.ReactNode;
  duration?: number;
  scale?: number;
  style?: any;
}

export const PulsingIcon: React.FC<PulsingIconProps> = ({
  children,
  duration = 1500,
  scale = 1.1,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: scale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, duration, scale]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Confetti Piece Component
interface ConfettiPieceProps {
  color: string;
  size: number;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({
  color,
  size,
  delay,
  duration,
  startX,
  startY,
  endX,
  endY,
}) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(translateX, {
        toValue: endX,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: endY,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 360,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: duration * 0.8,
        delay: delay + duration * 0.2,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, [translateX, translateY, rotate, opacity, delay, duration, endX, endY]);

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          width: size,
          height: size,
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }) },
          ],
          opacity,
        },
      ]}
    />
  );
};

// Celebration Animation Component
interface CelebrationAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  style?: any;
}

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isActive,
  onComplete,
  style,
}) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    color: string;
    size: number;
    delay: number;
    duration: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>>([]);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const screenWidth = 400; // Approximate screen width
  const screenHeight = 800; // Approximate screen height

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, index) => ({
        id: index,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // 4-12px
        delay: Math.random() * 500,
        duration: Math.random() * 2000 + 2000, // 2-4 seconds
        startX: Math.random() * screenWidth,
        startY: -20,
        endX: Math.random() * screenWidth,
        endY: screenHeight + 100,
      }));

      setConfettiPieces(pieces);

      // Call onComplete after animation
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 6000);
    } else {
      setConfettiPieces([]);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <View style={[styles.celebrationContainer, style]}>
      {confettiPieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          size={piece.size}
          delay={piece.delay}
          duration={piece.duration}
          startX={piece.startX}
          startY={piece.startY}
          endX={piece.endX}
          endY={piece.endY}
        />
      ))}
    </View>
  );
};

// Game Results Popup Component
interface GameResultsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  results: {
    players: Array<{
      username: string;
      total_score: number;
      rank: number;
      individual_scores: Array<number>;
    }>;
    final_crisis_score: number;
    game_summary: string;
  };
  style?: any;
}

export const GameResultsPopup: React.FC<GameResultsPopupProps> = ({
  isVisible,
  onClose,
  results,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, scaleAnim, opacityAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.popupOverlay,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.popupContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {/* Header */}
        <View style={styles.popupHeader}>
          <MaterialCommunityIcons name="trophy" size={32} color={Colors.warning} />
          <Text style={styles.popupTitle}>🎉 Game Complete! 🎉</Text>
          <Text style={styles.popupSubtitle}>Final Crisis Score: {results.final_crisis_score}/100</Text>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>🏆 Final Rankings</Text>
          {results.players
            .sort((a, b) => a.rank - b.rank)
            .map((player, index) => (
              <View key={player.username} style={styles.playerResult}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rankNumber}>#{player.rank}</Text>
                  {player.rank === 1 && <MaterialCommunityIcons name="crown" size={20} color={Colors.warning} />}
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.username}</Text>
                  <Text style={styles.playerScore}>Total Score: {player.total_score}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Game Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>📝 Game Summary</Text>
          <Text style={styles.summaryText}>{results.game_summary}</Text>
        </View>

        {/* Exit Button */}
        <TouchableOpacity style={styles.exitButton} onPress={onClose} activeOpacity={0.8}>
          <MaterialCommunityIcons name="exit-to-app" size={24} color="#FFFFFF" />
          <Text style={styles.exitButtonText}>Exit Room</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Animated Purple Border Component
interface AnimatedPurpleBorderProps {
  children: React.ReactNode;
  style?: any;
  borderWidth?: number;
  animationDuration?: number;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const AnimatedPurpleBorder: React.FC<AnimatedPurpleBorderProps> = ({
  children,
  style,
  borderWidth = 2,
  animationDuration = 2000,
  colors,
}) => {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Border animation - rotating gradient effect
    const borderAnimation = Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );

    // Glow animation - pulsing effect
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: animationDuration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: animationDuration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    borderAnimation.start();
    glowAnimation.start();

    return () => {
      borderAnimation.stop();
      glowAnimation.stop();
    };
  }, [borderAnim, glowAnim, animationDuration]);

  const borderRotation = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const primaryColor = colors?.primary || '#9c27b0';
  const secondaryColor = colors?.secondary || '#ba68c8';
  const backgroundColor = colors?.background || '#ffffff';

  return (
    <View style={[styles.animatedBorderContainer, style]}>
      {/* Animated border gradient */}
      <Animated.View
        style={[
          styles.animatedBorder,
          {
            borderWidth,
            transform: [{ rotate: borderRotation }],
            opacity: glowOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[primaryColor, secondaryColor, primaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.borderGradient}
        />
      </Animated.View>
      
      {/* Content container */}
      <View style={[styles.borderContent, { backgroundColor }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  gradientButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
  },
  fabIcon: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  spinner: {
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRadius: BorderRadius.full,
  },
  animatedBorderContainer: {
    position: 'relative',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  animatedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.lg,
    padding: 2, // Border width
  },
  borderGradient: {
    flex: 1,
    borderRadius: BorderRadius.lg,
  },
  borderContent: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingDot: {
    marginHorizontal: 2,
  },
  aiProcessingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  popupContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    margin: Spacing.lg,
    maxHeight: '80%',
    width: '90%',
    ...Shadows.lg,
  },
  popupHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  popupTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  popupSubtitle: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  resultsContainer: {
    marginBottom: Spacing.xl,
  },
  resultsTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  playerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
    minWidth: 60,
  },
  rankNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  playerScore: {
    fontSize: Typography.lg,
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  scoreBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  roundScore: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  summaryContainer: {
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  summaryText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal * Typography.sm,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  exitButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
  },
});
