import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran'
import {
  ThemeProvider,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { useColorScheme } from 'react-native'
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper'

import { AppDarkTheme, AppLightTheme, StackHeader } from '@/lib/ui'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = { initialRouteName: '(drawer)' }

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationDark: NavDarkTheme,
    reactNavigationLight: NavLightTheme,
    materialDark: AppDarkTheme,
    materialLight: AppLightTheme,
  })
  const [loaded, error] = useFonts({ AmiriQuran_400Regular })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error
  }, [error])

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider
      value={
        colorScheme === 'light'
          ? { ...LightTheme, fonts: NavLightTheme.fonts }
          : { ...DarkTheme, fonts: NavDarkTheme.fonts }
      }
    >
      <PaperProvider
        theme={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}
      >
        <SQLiteProvider
          databaseName="quran.db"
          assetSource={{ assetId: require('@/assets/data/quran.db') }}
        >
          <Stack
            screenOptions={{
              animation: 'fade',
              header: (props) => (
                <StackHeader navProps={props} children={undefined} />
              ),
            }}
          >
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="[type]/index" />
            <Stack.Screen name="[type]/[id]" />
            <Stack.Screen name="chapters/[id]" />
          </Stack>
        </SQLiteProvider>
      </PaperProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default RootLayout
