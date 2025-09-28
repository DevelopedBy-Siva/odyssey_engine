import { CircularSlider } from "@/components/CircularSlider";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "@/components/DesignSystem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeviceControl() {
  const router = useRouter();
  const colors = Colors;
  const [selectedWattage, setSelectedWattage] = useState('8 watt');
  const [lightIntensity, setLightIntensity] = useState(80);
  const [selectedMode, setSelectedMode] = useState('auto');

  const wattageOptions = ['8 watt', '9 watt', '12.5 watt', '17 watt'];
  const modeOptions = [
    { id: 'auto', name: 'Auto', icon: 'auto-fix' },
    { id: 'cool', name: 'Cool', icon: 'snowflake' },
    { id: 'day', name: 'Day', icon: 'weather-sunny' },
    { id: 'night', name: 'Night', icon: 'weather-night' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Smart Light</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Wattage Selection */}
        <View style={styles.section}>
          <View style={styles.wattageContainer}>
            {wattageOptions.map((wattage) => (
              <TouchableOpacity
                key={wattage}
                style={[
                  styles.wattageButton,
                  selectedWattage === wattage && styles.activeWattageButton
                ]}
                onPress={() => setSelectedWattage(wattage)}
              >
                <Text style={[
                  styles.wattageText,
                  selectedWattage === wattage && styles.activeWattageText
                ]}>
                  {wattage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Light Intensity Controller */}
        <View style={styles.section}>
          <View style={styles.intensityContainer}>
            <CircularSlider
              value={lightIntensity}
              onValueChange={setLightIntensity}
              size={200}
              strokeWidth={8}
              min={0}
              max={100}
            />
            <View style={styles.intensityLabels}>
              <Text style={[styles.intensityMinMax, { color: colors.textSecondary }]}>Min</Text>
              <Text style={[styles.intensityMinMax, { color: colors.textSecondary }]}>Max</Text>
            </View>
          </View>
        </View>

        {/* Mode Selection */}
        <View style={styles.section}>
          <View style={styles.modeGrid}>
            {modeOptions.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeButton,
                  selectedMode === mode.id && styles.activeModeButton
                ]}
                onPress={() => setSelectedMode(mode.id)}
              >
                <MaterialCommunityIcons
                  name={mode.icon as any}
                  size={24}
                  color={selectedMode === mode.id ? colors.activeText : colors.inactiveText}
                />
                <Text style={[
                  styles.modeText,
                  selectedMode === mode.id && styles.activeModeText
                ]}>
                  {mode.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Power Consumption */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Power consumption</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {selectedWattage} Smart Light
          </Text>
          
          <View style={styles.powerGrid}>
            <View style={[styles.powerCard, { backgroundColor: colors.activeCard }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={colors.activeText} />
              <Text style={[styles.powerValue, { color: colors.activeText }]}>5kWh</Text>
              <Text style={[styles.powerLabel, { color: colors.activeText }]}>Today</Text>
            </View>
            <View style={[styles.powerCard, { backgroundColor: colors.inactiveCard }]}>
              <MaterialCommunityIcons name="power-plug" size={24} color={colors.inactiveText} />
              <Text style={[styles.powerValue, { color: colors.inactiveText }]}>120kWh</Text>
              <Text style={[styles.powerLabel, { color: colors.inactiveText }]}>This month</Text>
            </View>
          </View>
        </View>

        {/* Add Device Button */}
        <TouchableOpacity style={[styles.addDeviceButton, { backgroundColor: colors.activeCard }]}>
          <Text style={[styles.addDeviceText, { color: colors.activeText }]}>Add new device</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontFamily.semibold,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  wattageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wattageButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inactiveCard,
    alignItems: 'center',
  },
  activeWattageButton: {
    backgroundColor: Colors.activeCard,
  },
  wattageText: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.inactiveText,
  },
  activeWattageText: {
    color: Colors.activeText,
  },
  intensityContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  intensityMinMax: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inactiveCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  activeModeButton: {
    backgroundColor: Colors.activeCard,
  },
  modeText: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.inactiveText,
    marginTop: Spacing.sm,
  },
  activeModeText: {
    color: Colors.activeText,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.lg,
  },
  powerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  powerCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.sm,
  },
  powerValue: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontFamily.bold,
    marginVertical: Spacing.sm,
  },
  powerLabel: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  addDeviceButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    ...Shadows.sm,
  },
  addDeviceText: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.semibold,
  },
});
