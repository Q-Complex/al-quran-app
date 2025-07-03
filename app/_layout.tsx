import { ThemeProvider } from '@react-navigation/native'
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
  AppSettings,
  StackHeader,
  TSettings,
} from '@/lib'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = { initialRouteName: '(tabs)' }

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const [settings, setSettings] = React.useState<TSettings>(DefaultSettings)

  // Load settings
  React.useEffect(() => {
    ;(async () => {
      await KVStore.settings.load((v) => (v ? setSettings(JSON.parse(v)) : {}))
    })()
  }, [])

  if (settings.language !== 'System') {
    Locales.locale =
      settings.language !== 'Turkish'
        ? settings.language.slice(0, 2).toLowerCase()
        : 'tr'
  }

  const [navTheme, appTheme, status] =
    settings.theme === 'System'
      ? colorScheme === 'light'
        ? [NavLightTheme, AppLightTheme, 'auto']
        : [NavDarkTheme, AppDarkTheme, 'auto']
      : settings.theme === 'Light'
        ? [NavLightTheme, AppLightTheme, 'light']
        : [NavDarkTheme, AppDarkTheme, 'dark']

  return (
    <ThemeProvider value={navTheme}>
      <PaperProvider theme={appTheme}>
        <SQLiteProvider
          databaseName="quran.db"
          assetSource={{ assetId: require('@/assets/data/quran.db') }}
        >
          <AppSettings.Provider
            value={{ settings, onChange: (v) => setSettings(v) }}
          >
            <Stack
              screenOptions={{
                animation: 'fade_from_bottom',
                header: (props) => (
                  <StackHeader navProps={props} children={undefined} />
                ),
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="[slug]/index" />
              <Stack.Screen name="[slug]/[id]" />
            </Stack>
          </AppSettings.Provider>
        </SQLiteProvider>
      </PaperProvider>

      <StatusBar style={status as StatusBarStyle} />
    </ThemeProvider>
  )
}

export default RootLayout
