import { router } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Appbar } from 'react-native-paper'

import { DrawerContent, DrawerHeader } from '@/lib'

const DrawerLayout = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer
      drawerContent={(props) => (
        <DrawerContent
          navProps={props}
          showDivider={false}
          children={undefined}
          title="Al-Quran Al-Kareem"
        />
      )}
      screenOptions={{
        drawerStyle: { paddingTop: 32 },
        header: (props) => (
          <DrawerHeader navProps={props} children={undefined} />
        ),
        headerRight: (props) => (
          <Appbar.Action
            {...props}
            icon="simple-icons"
            onPress={() => router.push('/icons')}
          />
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: 'Al-Quran', title: 'Al-Quran' }}
      />
      <Drawer.Screen
        name="search"
        options={{ drawerLabel: 'Search', title: 'Search' }}
      />
      <Drawer.Screen
        name="settings"
        options={{ drawerLabel: 'Settings', title: 'Settings' }}
      />
    </Drawer>
  </GestureHandlerRootView>
)

export default DrawerLayout
