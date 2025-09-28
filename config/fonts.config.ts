// Font Configuration - Clash Grotesk
import { FontSource } from 'expo-font';

// Clash Grotesk Font Family Configuration
export const ClashGroteskFonts: Record<string, FontSource> = {
  'ClashGrotesk-Extralight': require('../assets/fonts/ClashGrotesk-Extralight.otf'),
  'ClashGrotesk-Light': require('../assets/fonts/ClashGrotesk-Light.otf'),
  'ClashGrotesk-Regular': require('../assets/fonts/ClashGrotesk-Regular.otf'),
  'ClashGrotesk-Medium': require('../assets/fonts/ClashGrotesk-Medium.otf'),
  'ClashGrotesk-Semibold': require('../assets/fonts/ClashGrotesk-Semibold.otf'),
  'ClashGrotesk-Bold': require('../assets/fonts/ClashGrotesk-Bold.otf'),
};

// Font loading configuration
export const FontConfig = {
  fonts: ClashGroteskFonts,
  fallback: {
    // Fallback fonts if Clash Grotesk fails to load
    extralight: 'System',
    light: 'System',
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
};

// Font loading utility
export const loadClashGroteskFonts = async () => {
  try {
    const { loadAsync } = await import('expo-font');
    await loadAsync(ClashGroteskFonts);
    // Fonts loaded successfully
    return true;
  } catch (error) {
    // Failed to load fonts, using fallback
    return false;
  }
};
