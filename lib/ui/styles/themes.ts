/**
 * Material themes
 */

import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  adaptNavigationTheme,
} from 'react-native-paper'

const fontConfig = { fontFamily: 'NotoKufiArabic_400Regular' }

const lightThemeColors = {
  base100: '#ffffff',
  base200: '#f8f8f8',
  base300: '#f5f5f5',
  baseContent: '#8a5700',
  primary: '#161616',
  primaryContent: '#ffffff',
  secondary: '#cbd0d7',
  secondaryContent: '#152747',
  accent: '#dad3d7',
  accentContent: '#513448',
  neutral: '#ffe7a4',
  neutralContent: '#331800',
  info: '#67c6ff',
  infoContent: '#040e16',
  success: '#87d03a',
  successContent: '#061001',
  warning: '#e2d563',
  warningContent: '#121003',
  error: '#ff6f6f',
  errorContent: '#160404',
}

const AppLightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    onPrimary: lightThemeColors.primaryContent,
    primaryContainer: lightThemeColors.primary,
    onPrimaryContainer: lightThemeColors.primaryContent,
    inversePrimary: lightThemeColors.primaryContent,
    onSecondary: lightThemeColors.secondaryContent,
    secondaryContainer: lightThemeColors.secondary,
    onSecondaryContainer: lightThemeColors.secondaryContent,
    tertiary: lightThemeColors.accent,
    onTertiary: lightThemeColors.accentContent,
    tertiaryContainer: lightThemeColors.accent,
    onTertiaryContainer: lightThemeColors.accentContent,
    onError: lightThemeColors.errorContent,
    errorContainer: lightThemeColors.error,
    onErrorContainer: lightThemeColors.errorContent,
    background: lightThemeColors.primaryContent,
    onBackground: lightThemeColors.primary,
    surface: lightThemeColors.primaryContent,
    onSurface: lightThemeColors.primary,
    surfaceVariant: lightThemeColors.base300,
    onSurfaceVariant: lightThemeColors.primary,
    outline: lightThemeColors.base200,
    outlineVariant: lightThemeColors.base300,
    shadow: lightThemeColors.primary,
    scrim: lightThemeColors.primary,
    inverseSurface: lightThemeColors.baseContent,
    inverseOnSurface: lightThemeColors.base100,
    elevation: {
      level0: 'transparent',
      level1: lightThemeColors.base100,
      level2: lightThemeColors.base200,
      level3: lightThemeColors.base300,
      level4: lightThemeColors.base300,
      level5: lightThemeColors.base300,
    },
    surfaceDisabled: lightThemeColors.base300,
    onSurfaceDisabled: lightThemeColors.baseContent,
    backdrop: lightThemeColors.primary + 'aa',

    // Theme colors
    ...lightThemeColors,
  },
}

const darkThemeColors = {
  base100: '#09090b',
  base200: '#171618',
  base300: '#1e1d1f',
  baseContent: '#dca54d',
  primary: '#ffffff',
  primaryContent: '#161616',
  secondary: '#152747',
  secondaryContent: '#cbd0d7',
  accent: '#513448',
  accentContent: '#dad3d7',
  neutral: '#331800',
  neutralContent: '#ffe7a4',
  info: '#67c6ff',
  infoContent: '#040e16',
  success: '#87d03a',
  successContent: '#061001',
  warning: '#e2d563',
  warningContent: '#121003',
  error: '#ff6f6f',
  errorContent: '#160404',
}

const AppDarkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    onPrimary: darkThemeColors.primaryContent,
    primaryContainer: darkThemeColors.primary,
    onPrimaryContainer: darkThemeColors.primaryContent,
    inversePrimary: darkThemeColors.primaryContent,
    onSecondary: darkThemeColors.secondaryContent,
    secondaryContainer: darkThemeColors.secondary,
    onSecondaryContainer: darkThemeColors.secondaryContent,
    tertiary: darkThemeColors.accent,
    onTertiary: darkThemeColors.accentContent,
    tertiaryContainer: darkThemeColors.accent,
    onTertiaryContainer: darkThemeColors.accentContent,
    onError: darkThemeColors.errorContent,
    errorContainer: darkThemeColors.error,
    onErrorContainer: darkThemeColors.errorContent,
    background: darkThemeColors.primaryContent,
    onBackground: darkThemeColors.primary,
    surface: darkThemeColors.primaryContent,
    onSurface: darkThemeColors.primary,
    surfaceVariant: darkThemeColors.base300,
    onSurfaceVariant: darkThemeColors.primary,
    outline: darkThemeColors.base200,
    outlineVariant: darkThemeColors.base300,
    shadow: darkThemeColors.primary,
    scrim: darkThemeColors.primary,
    inverseSurface: darkThemeColors.baseContent,
    inverseOnSurface: darkThemeColors.base100,
    elevation: {
      level0: 'transparent',
      level1: darkThemeColors.base100,
      level2: darkThemeColors.base200,
      level3: darkThemeColors.base300,
      level4: darkThemeColors.base300,
      level5: darkThemeColors.base300,
    },
    surfaceDisabled: darkThemeColors.base300,
    onSurfaceDisabled: darkThemeColors.baseContent,
    backdrop: darkThemeColors.primaryContent + 'aa',

    // Theme colors
    ...darkThemeColors,
  },
}

const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } =
  adaptNavigationTheme({
    reactNavigationDark: DarkTheme,
    reactNavigationLight: DefaultTheme,
    materialDark: AppDarkTheme,
    materialLight: AppLightTheme,
  })

type AppTheme = typeof AppDarkTheme

export { AppTheme, AppLightTheme, AppDarkTheme, NavDarkTheme, NavLightTheme }
