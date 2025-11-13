import { ThemeProvider } from '@react-navigation/native'
import {
  useFonts,
  NotoKufiArabic_400Regular,
} from '@expo-google-fonts/noto-kufi-arabic'
import { Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'

import {
  AppDarkTheme,
  AppLightTheme,
  DefaultSettings,
  KVStore,
  Locales,
  NavDarkTheme,
  NavLightTheme,
  StackHeader,
  TSettings,
} from '@/lib'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = { initialRouteName: '(tabs)' }

const RootLayout = () => {
  useFonts({ NotoKufiArabic_400Regular })
  const colorScheme = useColorScheme()
  const [s, setS] = React.useState<TSettings>(DefaultSettings)

  // Load settings
  React.useEffect(() => {
    KVStore.settings.load((v) => (v ? setS(JSON.parse(v)) : {}))
  }, [])

  if (s.language !== 'System') {
    Locales.locale =
      s.language !== 'Turkish' ? s.language.slice(0, 2).toLowerCase() : 'tr'
  }

  const [navTheme, appTheme, status] =
    s.theme === 'System'
      ? colorScheme === 'light'
        ? [NavLightTheme, AppLightTheme, 'auto']
        : [NavDarkTheme, AppDarkTheme, 'auto']
      : s.theme === 'Light'
        ? [NavLightTheme, AppLightTheme, 'dark']
        : [NavDarkTheme, AppDarkTheme, 'light']

  return (
    <ThemeProvider value={navTheme}>
      <PaperProvider theme={appTheme}>
        <SQLiteProvider
          databaseName="quran.db"
          assetSource={{ assetId: require('@/assets/data/quran.db') }}
        >
          <Stack
            screenOptions={{
              header: (props) => (
                // eslint-disable-next-line react/no-children-prop
                <StackHeader navProps={props} children={undefined} />
              ),
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="[slug]/index" />
            <Stack.Screen name="[slug]/[id]" />
            <Stack.Screen
              name="prayer"
              options={{ title: Locales.t('prayer') }}
            />
          </Stack>
        </SQLiteProvider>
      </PaperProvider>

      <StatusBar style={status as StatusBarStyle} />
    </ThemeProvider>
  )
}

export default RootLayout
