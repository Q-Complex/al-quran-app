/**
 * Material themes
 */

import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  configureFonts,
  adaptNavigationTheme,
} from 'react-native-paper'

import { Colors } from '@/lib/ui/styles/colors'

const fontConfig = {
  fontFamily: 'NotoSans_400Regular',
}

const AppLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: Colors.light.cyan,
  fonts: configureFonts({ config: fontConfig }),
}

const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: Colors.dark.cyan,
  fonts: configureFonts({ config: fontConfig }),
}

const { LightTheme: NLightTheme, DarkTheme: NDarkTheme } = adaptNavigationTheme(
  {
    reactNavigationDark: DarkTheme,
    reactNavigationLight: DefaultTheme,
    materialDark: AppDarkTheme,
    materialLight: AppLightTheme,
  },
)

const NavLightTheme = { ...NLightTheme, fonts: DefaultTheme.fonts }
const NavDarkTheme = { ...NDarkTheme, fonts: DarkTheme.fonts }

export { AppLightTheme, AppDarkTheme, NavDarkTheme, NavLightTheme }
