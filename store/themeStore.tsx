import { create } from 'zustand';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  accent: string;
  accentLight: string;
  accentDark: string;
  
  success: string;
  warning: string;
  error: string;
  info: string;
  
  background: string;
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  
  border: string;
  borderLight: string;
  borderDark: string;
  
  gradientStart: string;
  gradientEnd: string;
  gradientSecondary: string;
  gradientTertiary: string;
}

const lightTheme: ThemeColors = {
  primary: '#9c27b0', // Material Purple 500
  primaryLight: '#e1bee7', // Material Purple 200
  primaryDark: '#4a148c', // Material Purple 800
  
  secondary: '#9c27b0',
  secondaryLight: '#e1bee7',
  secondaryDark: '#4a148c',
  
  accent: '#9c27b0', // Purple accent
  accentLight: '#f3e5f5', // Purple 50
  accentDark: '#4a148c',
  
  success: '#4caf50', // Material Green 500
  warning: '#ff9800', // Material Orange 500
  error: '#f44336', // Material Red 500
  info: '#2196f3', // Material Blue 500
  
  background: '#ffffff', // Pure white
  surface: '#fafafa', // Material Grey 50
  surfaceLight: '#ffffff',
  surfaceDark: '#f5f5f5', // Material Grey 100
  
  textPrimary: '#000000', // Pure black
  textSecondary: '#424242', // Material Grey 800
  textTertiary: '#757575', // Material Grey 600
  textDisabled: '#bdbdbd', // Material Grey 400
  
  border: '#e0e0e0', // Material Grey 300
  borderLight: '#f5f5f5', // Material Grey 100
  borderDark: '#9e9e9e', // Material Grey 500
  
  gradientStart: '#ffffff',
  gradientEnd: '#fafafa',
  gradientSecondary: '#f5f5f5',
  gradientTertiary: '#eeeeee',
};

const darkTheme: ThemeColors = {
  primary: '#ba68c8', // Material Purple 300
  primaryLight: '#e1bee7', // Material Purple 200
  primaryDark: '#4a148c', // Material Purple 800
  
  secondary: '#ba68c8',
  secondaryLight: '#e1bee7',
  secondaryDark: '#4a148c',
  
  accent: '#ba68c8', // Purple accent for dark theme
  accentLight: '#f3e5f5', // Purple 50
  accentDark: '#4a148c',
  
  success: '#66bb6a', // Material Green 400
  warning: '#ffb74d', // Material Orange 300
  error: '#ef5350', // Material Red 400
  info: '#42a5f5', // Material Blue 400
  
  background: '#000000', // Pure black
  surface: '#121212', // Material Dark Surface
  surfaceLight: '#1e1e1e', // Material Dark Surface Light
  surfaceDark: '#000000',
  
  textPrimary: '#ffffff', // Pure white
  textSecondary: '#b3b3b3', // Material Grey 300
  textTertiary: '#808080', // Material Grey 500
  textDisabled: '#4d4d4d', // Material Grey 700
  
  border: '#333333', // Dark grey
  borderLight: '#1e1e1e',
  borderDark: '#000000',
  
  gradientStart: '#000000',
  gradientEnd: '#121212',
  gradientSecondary: '#1e1e1e',
  gradientTertiary: '#2a2a2a',
};

interface ThemeStore {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: true, // Default to dark theme
  colors: darkTheme,
  toggleTheme: () => set((state) => ({
    isDark: !state.isDark,
    colors: !state.isDark ? darkTheme : lightTheme,
  })),
  setTheme: (isDark: boolean) => set({
    isDark,
    colors: isDark ? darkTheme : lightTheme,
  }),
}));
