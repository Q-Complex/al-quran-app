/**
 * Material themes
 */

import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  configureFonts,
} from 'react-native-paper'

import { Colors } from '@/lib/ui/styles/colors'

const fontConfig = {
  fontFamily: 'NotoSans_400Regular',
}

const AppLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: Colors.light.green,
  fonts: configureFonts({ config: fontConfig }),
}

const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: Colors.dark.green,
  fonts: configureFonts({ config: fontConfig }),
}

export { AppLightTheme, AppDarkTheme }
