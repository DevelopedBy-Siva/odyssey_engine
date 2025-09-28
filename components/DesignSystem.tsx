import { StyleSheet } from 'react-native';

export const Colors = {
  // Black and white theme with #9d4edd accent
  primary: '#9d4edd',
  primaryLight: '#c77dff',
  primaryDark: '#7209b7',
  
  secondary: '#9d4edd',
  secondaryLight: '#c77dff',
  secondaryDark: '#7209b7',
  
  accent: '#9d4edd',
  accentLight: '#c77dff',
  accentDark: '#7209b7',
  
  success: '#9d4edd',
  warning: '#9d4edd',
  error: '#9d4edd',
  info: '#9d4edd',
  
  // Black and white theme
  background: '#ffffff',
  surface: '#f5f5f5',
  surfaceLight: '#ffffff',
  surfaceDark: '#2d2d2d',
  
  // Text colors for black and white theme
  textPrimary: '#2d2d2d',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textDisabled: '#d1d5db',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#2d2d2d',
  
  // Gradient colors
  gradientStart: '#ffffff',
  gradientEnd: '#f5f5f5',
  gradientSecondary: '#9d4edd',
  gradientTertiary: '#c77dff',
  
  // Additional colors for smart home UI
  cardBackground: '#2d2d2d',
  cardBackgroundLight: '#f5f5f5',
  activeCard: '#2d2d2d',
  inactiveCard: '#f5f5f5',
  activeText: '#ffffff',
  inactiveText: '#2d2d2d',
};

export const Typography = {
  fontFamily: {
    regular: 'ClashGrotesk-Regular',
    medium: 'ClashGrotesk-Medium', 
    semibold: 'ClashGrotesk-Semibold',
    bold: 'ClashGrotesk-Bold',
    light: 'ClashGrotesk-Light',
    extrabold: 'ClashGrotesk-Extrabold',
  },
  
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  
  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Material Design Layout Constants
export const Layout = {
  // Material Design breakpoints (in dp) - Enhanced for responsive design
  breakpoints: {
    mobile: 0,
    tablet: 600,
    desktop: 840,
    large: 1200,
    xlarge: 1600,
  },
  
  // Material Design container max widths
  containerMaxWidth: {
    mobile: '100%',
    tablet: 600,
    desktop: 840,
    large: 1200,
    xlarge: 1600,
  },
  
  // Material Design responsive grid system
  grid: {
    columns: 12,
    gutter: 16,
    margin: 16,
    // Responsive column spans
    columnSpans: {
      mobile: {
        xs: 12,    // Full width on mobile
        sm: 6,     // Half width
        md: 4,     // Third width
        lg: 3,     // Quarter width
      },
      tablet: {
        xs: 6,     // Half width on tablet
        sm: 4,     // Third width
        md: 3,     // Quarter width
        lg: 2,     // Sixth width
      },
      desktop: {
        xs: 4,     // Third width on desktop
        sm: 3,     // Quarter width
        md: 2,     // Sixth width
        lg: 1,     // Twelfth width
      }
    }
  },
  
  // Material Design spacing scale (8dp grid)
  spacing: {
    xs: 4,    // 0.5 * 8dp
    sm: 8,    // 1 * 8dp
    md: 16,   // 2 * 8dp
    lg: 24,   // 3 * 8dp
    xl: 32,   // 4 * 8dp
    '2xl': 40, // 5 * 8dp
    '3xl': 48, // 6 * 8dp
    '4xl': 56, // 7 * 8dp
    '5xl': 64, // 8 * 8dp
  },
  
  // Material Design component spacing
  componentSpacing: {
    // Cards - Material Design specifications
    cardPadding: 16,
    cardMargin: 8,
    cardGap: 16,
    cardContentPadding: 16,
    cardHeaderPadding: 16,
    cardActionsPadding: 8,
    
    // Lists
    listItemPadding: 16,
    listItemGap: 0,
    
    // Forms
    formFieldGap: 16,
    formSectionGap: 24,
    
    // Navigation
    navItemPadding: 16,
    navItemGap: 8,
    
    // Content sections
    sectionGap: 24,
    contentPadding: 16,
    
    // Grid system
    gridGutter: 16,
    gridMargin: 16,
  },
  
  // Material Design elevation levels
  elevation: {
    level0: 0,
    level1: 1,
    level2: 3,
    level3: 6,
    level4: 8,
    level5: 12,
  },
  
  // Responsive layout utilities
  responsive: {
    // Get current breakpoint based on screen width
    getBreakpoint: (width: number) => {
      if (width >= Layout.breakpoints.xlarge) return 'xlarge';
      if (width >= Layout.breakpoints.large) return 'large';
      if (width >= Layout.breakpoints.desktop) return 'desktop';
      if (width >= Layout.breakpoints.tablet) return 'tablet';
      return 'mobile';
    },
    
    // Get column span for responsive grid
    getColumnSpan: (width: number, size: 'xs' | 'sm' | 'md' | 'lg') => {
      const breakpoint = Layout.responsive.getBreakpoint(width);
      return Layout.grid.columnSpans[breakpoint as keyof typeof Layout.grid.columnSpans][size];
    },
    
    // Get container max width
    getContainerMaxWidth: (width: number) => {
      const breakpoint = Layout.responsive.getBreakpoint(width);
      return Layout.containerMaxWidth[breakpoint as keyof typeof Layout.containerMaxWidth];
    }
  }
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Material Design Elevation System
export const Shadows = {
  // Material Design elevation levels
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    // Web compatibility
    boxShadow: 'none',
  },
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
    // Web compatibility
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.18)',
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    // Web compatibility
    boxShadow: '0 1px 1.41px rgba(0, 0, 0, 0.2)',
  },
  level3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    // Web compatibility
    boxShadow: '0 1px 2.22px rgba(0, 0, 0, 0.22)',
  },
  level4: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    // Web compatibility
    boxShadow: '0 2px 2.62px rgba(0, 0, 0, 0.23)',
  },
  level5: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Web compatibility
    boxShadow: '0 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  // Legacy support
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
    // Web compatibility
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.18)',
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    // Web compatibility
    boxShadow: '0 1px 1.41px rgba(0, 0, 0, 0.2)',
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    // Web compatibility
    boxShadow: '0 1px 2.22px rgba(0, 0, 0, 0.22)',
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Web compatibility
    boxShadow: '0 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
};

// Animation Durations
export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
};

// Innovative Font Presets - Clash Grotesk Styles
export const FontPresets = {
  // Display Styles - Large, impactful text
  displayLarge: {
    fontFamily: Typography.fontFamily.extrabold,
    fontSize: Typography['8xl'],
    lineHeight: Typography.lineHeight.tight * Typography['8xl'],
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.textPrimary,
  },
  
  displayMedium: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography['6xl'],
    lineHeight: Typography.lineHeight.snug * Typography['6xl'],
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.textPrimary,
  },
  
  displaySmall: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography['4xl'],
    lineHeight: Typography.lineHeight.normal * Typography['4xl'],
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  // Headline Styles - Section headers
  headlineLarge: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography['3xl'],
    lineHeight: Typography.lineHeight.snug * Typography['3xl'],
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.textPrimary,
  },
  
  headlineMedium: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography['2xl'],
    lineHeight: Typography.lineHeight.normal * Typography['2xl'],
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  headlineSmall: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.xl,
    lineHeight: Typography.lineHeight.normal * Typography.xl,
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  // Title Styles - Card titles, buttons
  titleLarge: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.lg,
    lineHeight: Typography.lineHeight.normal * Typography.lg,
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  titleMedium: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.base,
    lineHeight: Typography.lineHeight.normal * Typography.base,
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  titleSmall: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeight.normal * Typography.sm,
    letterSpacing: Typography.letterSpacing.wide,
    color: Colors.textPrimary,
  },
  
  // Body Styles - Main content
  bodyLarge: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.base,
    lineHeight: Typography.lineHeight.relaxed * Typography.base,
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  bodyMedium: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeight.normal * Typography.sm,
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.textPrimary,
  },
  
  bodySmall: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.xs,
    lineHeight: Typography.lineHeight.normal * Typography.xs,
    letterSpacing: Typography.letterSpacing.wide,
    color: Colors.textSecondary,
  },
  
  // Label Styles - Form labels, captions
  labelLarge: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeight.normal * Typography.sm,
    letterSpacing: Typography.letterSpacing.wide,
    color: Colors.textSecondary,
  },
  
  labelMedium: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.xs,
    lineHeight: Typography.lineHeight.normal * Typography.xs,
    letterSpacing: Typography.letterSpacing.wider,
    color: Colors.textSecondary,
  },
  
  labelSmall: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.xs,
    lineHeight: Typography.lineHeight.normal * Typography.xs,
    letterSpacing: Typography.letterSpacing.widest,
    color: Colors.textDisabled,
  },
};

// Common Styles with Clash Grotesk
export const CommonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Material Design Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Layout.componentSpacing.cardPadding,
    ...Shadows.level1,
  },
  
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Layout.componentSpacing.cardPadding,
    ...Shadows.level2,
  },
  
  cardOutlined: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Layout.componentSpacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.level0,
  },
  
  cardFilled: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Layout.componentSpacing.cardPadding,
    ...Shadows.level0,
  },
  
  // Card content areas
  cardHeader: {
    paddingBottom: Layout.componentSpacing.cardHeaderPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  cardContent: {
    paddingVertical: Layout.componentSpacing.cardContentPadding,
  },
  
  cardActions: {
    paddingTop: Layout.componentSpacing.cardActionsPadding,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  // Button Styles
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  
  buttonAccent: {
    backgroundColor: Colors.accent,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  
  // Text Styles with Clash Grotesk
  textPrimary: {
    ...FontPresets.bodyLarge,
  },
  
  textSecondary: {
    ...FontPresets.bodyMedium,
    color: Colors.textSecondary,
  },
  
  textHeading: {
    ...FontPresets.headlineLarge,
  },
  
  textSubheading: {
    ...FontPresets.headlineMedium,
    color: Colors.textSecondary,
  },
  
  // Input Styles
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...FontPresets.bodyLarge,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  
  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Utility Styles
  hidden: {
    display: 'none',
  },
  
  absolute: {
    position: 'absolute',
  },
  
  relative: {
    position: 'relative',
  },
});

// Minimalistic Gradient Styles - Subtle and clean
export const GradientStyles = {
  primary: {
    colors: [Colors.background, Colors.surface],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  
  secondary: {
    colors: [Colors.surface, Colors.surfaceLight],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  
  surface: {
    colors: [Colors.surface, Colors.surfaceLight],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  
  // Subtle accent gradients
  accent: {
    colors: [Colors.accent, Colors.accentLight],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  // Minimalistic card gradient
  card: {
    colors: [Colors.surface, Colors.surfaceLight],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

// Animation Presets
export const AnimationPresets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: Animation.normal,
  },
  
  slideUp: {
    from: { transform: [{ translateY: 50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: Animation.normal,
  },
  
  slideDown: {
    from: { transform: [{ translateY: -50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: Animation.normal,
  },
  
  scaleIn: {
    from: { transform: [{ scale: 0.8 }], opacity: 0 },
    to: { transform: [{ scale: 1 }], opacity: 1 },
    duration: Animation.normal,
  },
  
  bounce: {
    from: { transform: [{ scale: 0.8 }] },
    to: { transform: [{ scale: 1.1 }] },
    duration: Animation.fast,
  },
};

export default {
  Colors,
  Typography,
  FontPresets,
  Spacing,
  Layout,
  BorderRadius,
  Shadows,
  Animation,
  CommonStyles,
  GradientStyles,
  AnimationPresets,
};
