import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, FontPresets, Shadows, Spacing } from './DesignSystem';

export const FontShowcase: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[FontPresets.displayLarge, styles.sectionTitle]}>
          Display Styles
        </Text>
        <Text style={FontPresets.displayLarge}>Display Large</Text>
        <Text style={FontPresets.displayMedium}>Display Medium</Text>
        <Text style={FontPresets.displaySmall}>Display Small</Text>
      </View>

      <View style={styles.section}>
        <Text style={[FontPresets.headlineLarge, styles.sectionTitle]}>
          Headline Styles
        </Text>
        <Text style={FontPresets.headlineLarge}>Headline Large</Text>
        <Text style={FontPresets.headlineMedium}>Headline Medium</Text>
        <Text style={FontPresets.headlineSmall}>Headline Small</Text>
      </View>

      <View style={styles.section}>
        <Text style={[FontPresets.titleLarge, styles.sectionTitle]}>
          Title Styles
        </Text>
        <Text style={FontPresets.titleLarge}>Title Large</Text>
        <Text style={FontPresets.titleMedium}>Title Medium</Text>
        <Text style={FontPresets.titleSmall}>Title Small</Text>
      </View>

      <View style={styles.section}>
        <Text style={[FontPresets.bodyLarge, styles.sectionTitle]}>
          Body Styles
        </Text>
        <Text style={FontPresets.bodyLarge}>
          Body Large - This is the main content text that should be used for paragraphs and general reading.
        </Text>
        <Text style={FontPresets.bodyMedium}>
          Body Medium - This is for secondary content and descriptions.
        </Text>
        <Text style={FontPresets.bodySmall}>
          Body Small - This is for fine print and additional information.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[FontPresets.labelLarge, styles.sectionTitle]}>
          Label Styles
        </Text>
        <Text style={FontPresets.labelLarge}>Label Large</Text>
        <Text style={FontPresets.labelMedium}>Label Medium</Text>
        <Text style={FontPresets.labelSmall}>Label Small</Text>
      </View>

      <View style={styles.section}>
        <Text style={[FontPresets.headlineMedium, styles.sectionTitle]}>
          Usage Examples
        </Text>
        
        <View style={styles.card}>
          <Text style={FontPresets.titleLarge}>Card Title</Text>
          <Text style={FontPresets.bodyMedium}>
            This is how you would use the font presets in your components.
            Each preset is optimized for its specific use case.
          </Text>
          <Text style={FontPresets.labelSmall}>Last updated: Today</Text>
        </View>

        <View style={styles.button}>
          <Text style={FontPresets.titleMedium}>Button Text</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.accent,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    ...Shadows.md,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginVertical: Spacing.sm,
    ...Shadows.sm,
  },
});

export default FontShowcase;
