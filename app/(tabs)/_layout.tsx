import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

import { Locales, TabBar, TabsHeader } from '@/lib'

const TabLayout = () => (
  <Tabs
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{
      tabBarHideOnKeyboard: true,
      header: (props) => <TabsHeader navProps={props} children={undefined} />,
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: Locales.t('home'),
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            {...props}
            size={24}
            name={props.focused ? 'home' : 'home-outline'}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="search"
      options={{
        title: Locales.t('search'),
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            {...props}
            size={24}
            name={props.focused ? 'text-box-search' : 'text-box-search-outline'}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="settings"
      options={{
        title: Locales.t('settings'),
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            {...props}
            size={24}
            name={props.focused ? 'cog' : 'cog-outline'}
          />
        ),
      }}
    />
  </Tabs>
)

export default TabLayout
