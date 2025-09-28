import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from './DesignSystem';

interface CircularSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  size?: number;
  strokeWidth?: number;
  min?: number;
  max?: number;
}

export const CircularSlider: React.FC<CircularSliderProps> = ({
  value,
  onValueChange,
  size = 200,
  strokeWidth = 8,
  min = 0,
  max = 100,
}) => {
  const radius = (size - strokeWidth) / 2;
  const angle = ((value - min) / (max - min)) * 270 - 135;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.border,
          },
        ]}
      />
      
      {/* Progress Arc */}
      <View
        style={[
          styles.progressArc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.primary,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      />
      
      {/* Center Content */}
      <View style={styles.centerContent}>
        <Text style={[styles.valueText, { color: Colors.textPrimary }]}>
          {value}%
        </Text>
        <Text style={[styles.labelText, { color: Colors.textSecondary }]}>
          light Intensity
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
  },
  progressArc: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: Typography['3xl'],
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
  },
  labelText: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
  },
});
