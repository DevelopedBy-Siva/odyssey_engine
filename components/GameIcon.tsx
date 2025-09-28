import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BorderRadius, Colors, Shadows } from './DesignSystem';

interface GameIconProps {
  size?: number;
  score?: number;
  maxScore?: number;
  achievements?: number;
}

export const GameIcon: React.FC<GameIconProps> = ({ 
  size = 80, 
  score = 0, 
  maxScore = 1000,
  achievements = 0 
}) => {
  const colors = Colors;
  const scorePercentage = Math.min((score / maxScore) * 100, 100);

  return (
    <View style={[styles.container, { 
      width: size, 
      height: size,
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      ...Shadows.md
    }]}>
      {/* Main Game Controller Icon */}
      <MaterialCommunityIcons 
        name="gamepad-variant" 
        size={size * 0.4} 
        color={colors.textPrimary} 
      />
      
      {/* Score Progress Bar */}
      <View style={[styles.scoreBar, { 
        backgroundColor: colors.border,
        bottom: size * 0.1,
        left: size * 0.1,
        right: size * 0.1,
        height: size * 0.05,
        borderRadius: size * 0.025
      }]}>
        <View style={[styles.scoreFill, {
          backgroundColor: colors.primary,
          width: `${scorePercentage}%`,
          height: size * 0.05,
          borderRadius: size * 0.025
        }]} />
      </View>
      
      {/* Achievement Indicators */}
      <View style={[styles.achievements, {
        top: size * 0.1,
        right: size * 0.1
      }]}>
        {achievements > 0 && (
          <MaterialCommunityIcons 
            name="trophy" 
            size={size * 0.15} 
            color={colors.primary} 
          />
        )}
        {achievements > 1 && (
          <MaterialCommunityIcons 
            name="star" 
            size={size * 0.15} 
            color={colors.primary} 
            style={{ marginTop: size * 0.02 }}
          />
        )}
      </View>
      
      {/* Connection Indicators (like Wi-Fi signals) */}
      <View style={[styles.connectionSignals, {
        top: size * 0.05,
        left: size * 0.05
      }]}>
        <View style={[styles.signal, { 
          backgroundColor: colors.primary,
          width: size * 0.02,
          height: size * 0.08,
          borderRadius: size * 0.01
        }]} />
        <View style={[styles.signal, { 
          backgroundColor: colors.primary,
          width: size * 0.03,
          height: size * 0.06,
          borderRadius: size * 0.015,
          marginLeft: size * 0.01
        }]} />
        <View style={[styles.signal, { 
          backgroundColor: colors.primary,
          width: size * 0.04,
          height: size * 0.04,
          borderRadius: size * 0.02,
          marginLeft: size * 0.01
        }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scoreBar: {
    position: 'absolute',
  },
  scoreFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  achievements: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
  },
  connectionSignals: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signal: {
    position: 'absolute',
  },
});
