import { NotoKufiArabic_400Regular } from '@expo-google-fonts/noto-kufi-arabic'
import { NotoSans_400Regular } from '@expo-google-fonts/noto-sans'
import { ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { Storage } from 'expo-sqlite/kv-store'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'
import React from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'

import {
  AppDarkTheme,
  AppLightTheme,
  DefaultSettings,
  Locales,
  NavDarkTheme,
  NavLightTheme,
  QSettings,
  StackHeader,
  TSettings,
} from '@/lib'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = { initialRouteName: '(tabs)' }

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const [settings, setSettings] = React.useState<TSettings>(DefaultSettings)
  const [loaded, error] = useFonts({
    Indopak: require('@/assets/fonts/Indopak.ttf'),
    Uthmanic: require('@/assets/fonts/Uthmanic.ttf'),
    NotoKufiArabic_400Regular,
    NotoSans_400Regular,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error
  }, [error])

  // Load settings
  React.useEffect(() => {
    ;(async () => {
      await Storage.getItemAsync('settings')
        .then((v) => (v ? setSettings(JSON.parse(v)) : {}))
        .catch((err) => console.error(err))
    })()
  }, [])

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

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
          <QSettings.Provider
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
          </QSettings.Provider>
        </SQLiteProvider>
      </PaperProvider>

      <StatusBar style={status as StatusBarStyle} />
    </ThemeProvider>
  )
}

export default RootLayout
