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
        title: Locales.t('chapters'),
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            {...props}
            size={24}
            name={props.focused ? 'home-variant' : 'home-variant-outline'}
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
            name={props.focused ? 'book-search' : 'book-search-outline'}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="bookmarks"
      options={{
        title: Locales.t('bookmarks'),
        tabBarIcon: (props) => (
          <MaterialCommunityIcons
            {...props}
            size={24}
            name={
              props.focused ? 'bookmark-multiple' : 'bookmark-multiple-outline'
            }
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
