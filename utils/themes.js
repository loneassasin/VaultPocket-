// VaultPocket unified theme system
const baseColors = {
  // Primary brand colors
  primary: {
    50: '#FFE6E6',
    100: '#FFB3B3',
    200: '#FF8080',
    300: '#FF4D4D',
    400: '#FF1A1A',
    500: '#E60000', // Main primary color
    600: '#B30000',
    700: '#800000',
    800: '#4D0000',
    900: '#1A0000',
  },
  // Neutral colors
  neutral: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  // Semantic colors
  success: {
    light: '#4CAF50',
    dark: '#388E3C',
  },
  warning: {
    light: '#FFC107',
    dark: '#FFA000',
  },
  error: {
    light: '#FF1744',
    dark: '#D50000',
  },
  info: {
    light: '#2196F3',
    dark: '#1976D2',
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
  textSecondary: baseColors.neutral[700],
  textMuted: baseColors.neutral[500],
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
  tabBarInactive: baseColors.neutral[600],
  
  // List items
  listItemBg: '#FFFFFF',
  listItemBorder: baseColors.neutral[200],
  listItemHover: baseColors.neutral[100],
  listItemActive: baseColors.primary[50],
  
  // Slider
  sliderTrack: baseColors.neutral[300],
  sliderThumb: baseColors.primary[500],
  
  // Modal
  modalBg: '#FFFFFF',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Shadows
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowColorStrong: 'rgba(0, 0, 0, 0.2)',
};

// Dark theme
export const darkTheme = {
  // Main colors
  primary: baseColors.primary[500],
  primaryLight: baseColors.primary[400],
  primaryDark: baseColors.primary[600],
  primaryBg: baseColors.primary[900],
  
  // Background colors
  background: baseColors.neutral[900],
  surface: baseColors.neutral[800],
  cardBg: baseColors.neutral[800],
  elevatedBg: baseColors.neutral[800],
  
  // Border colors
  border: baseColors.neutral[700],
  borderFocus: baseColors.primary[500],
  divider: baseColors.neutral[700],
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: baseColors.neutral[400],
  textMuted: baseColors.neutral[500],
  textInverse: baseColors.neutral[900],
  
  // Interactive elements
  inputBg: baseColors.neutral[800],
  inputBorder: baseColors.neutral[700],
  inputFocusBg: baseColors.neutral[800],
  inputFocusBorder: baseColors.primary[500],
  buttonText: '#FFFFFF',
  
  // Status colors
  success: baseColors.success.dark,
  warning: baseColors.warning.dark,
  error: baseColors.error.dark,
  info: baseColors.info.dark,
  
  // Component specific
  tabBarBg: baseColors.neutral[800],
  tabBarBorder: baseColors.neutral[700],
  tabBarActive: baseColors.primary[500],
  tabBarInactive: baseColors.neutral[500],
  
  // List items
  listItemBg: baseColors.neutral[800],
  listItemBorder: baseColors.neutral[700],
  listItemHover: baseColors.neutral[700],
  listItemActive: baseColors.primary[900],
  
  // Slider
  sliderTrack: baseColors.neutral[700],
  sliderThumb: baseColors.primary[500],
  
  // Modal
  modalBg: baseColors.neutral[800],
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  
  // Shadows
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowColorStrong: 'rgba(0, 0, 0, 0.4)',
};
