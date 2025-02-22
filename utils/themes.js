// VaultPocket unified theme system
const baseColors = {
  // Primary brand colors - Modern indigo/purple palette
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary color
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  // Neutral colors - Slate palette
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // Semantic colors
  success: {
    light: '#10B981', // Emerald 500
    dark: '#059669',  // Emerald 600
  },
  warning: {
    light: '#F59E0B', // Amber 500
    dark: '#D97706',  // Amber 600
  },
  error: {
    light: '#EF4444', // Red 500
    dark: '#DC2626',  // Red 600
  },
  info: {
    light: '#3B82F6', // Blue 500
    dark: '#2563EB',  // Blue 600
  },
};

// Light theme
export const lightTheme = {
  // Main colors
  primary: baseColors.primary[500],
  primaryLight: baseColors.primary[400],
  primaryDark: baseColors.primary[600],
  primaryBg: baseColors.primary[50],
  
  // Background colors
  background: baseColors.neutral[50],
  surface: '#FFFFFF',
  cardBg: '#FFFFFF',
  elevatedBg: '#FFFFFF',
  
  // Border colors
  border: baseColors.neutral[200],
  borderFocus: baseColors.primary[500],
  divider: baseColors.neutral[200],
  
  // Text colors
  text: baseColors.neutral[900],
  textSecondary: baseColors.neutral[600],
  textMuted: baseColors.neutral[400],
  textInverse: '#FFFFFF',
  
  // Interactive elements
  inputBg: '#FFFFFF',
  inputBorder: baseColors.neutral[300],
  inputFocusBg: '#FFFFFF',
  inputFocusBorder: baseColors.primary[500],
  buttonText: '#FFFFFF',
  
  // Status colors
  success: baseColors.success.light,
  warning: baseColors.warning.light,
  error: baseColors.error.light,
  info: baseColors.info.light,
  
  // Component specific
  tabBarBg: '#FFFFFF',
  tabBarBorder: baseColors.neutral[200],
  tabBarActive: baseColors.primary[500],
  tabBarInactive: baseColors.neutral[400],
  
  // List items
  listItemBg: '#FFFFFF',
  listItemBorder: baseColors.neutral[200],
  listItemHover: baseColors.neutral[100],
  listItemActive: baseColors.primary[50],
  
  // Slider
  sliderTrack: baseColors.neutral[200],
  sliderThumb: baseColors.primary[500],
  
  // Shadows
  shadowColor: baseColors.neutral[900],
  shadowOpacity: 0.1,
};

// Dark theme
export const darkTheme = {
  // Main colors
  primary: baseColors.primary[400],
  primaryLight: baseColors.primary[300],
  primaryDark: baseColors.primary[500],
  primaryBg: baseColors.primary[900],
  
  // Background colors
  background: baseColors.neutral[900],
  surface: baseColors.neutral[800],
  cardBg: baseColors.neutral[800],
  elevatedBg: baseColors.neutral[800],
  
  // Border colors
  border: baseColors.neutral[700],
  borderFocus: baseColors.primary[400],
  divider: baseColors.neutral[700],
  
  // Text colors
  text: baseColors.neutral[50],
  textSecondary: baseColors.neutral[300],
  textMuted: baseColors.neutral[500],
  textInverse: baseColors.neutral[900],
  
  // Interactive elements
  inputBg: baseColors.neutral[800],
  inputBorder: baseColors.neutral[600],
  inputFocusBg: baseColors.neutral[800],
  inputFocusBorder: baseColors.primary[400],
  buttonText: baseColors.neutral[50],
  
  // Status colors
  success: baseColors.success.dark,
  warning: baseColors.warning.dark,
  error: baseColors.error.dark,
  info: baseColors.info.dark,
  
  // Component specific
  tabBarBg: baseColors.neutral[800],
  tabBarBorder: baseColors.neutral[700],
  tabBarActive: baseColors.primary[400],
  tabBarInactive: baseColors.neutral[500],
  
  // List items
  listItemBg: baseColors.neutral[800],
  listItemBorder: baseColors.neutral[700],
  listItemHover: baseColors.neutral[700],
  listItemActive: baseColors.primary[900],
  
  // Slider
  sliderTrack: baseColors.neutral[700],
  sliderThumb: baseColors.primary[400],
  
  // Shadows
  shadowColor: '#000000',
  shadowOpacity: 0.2,
};
