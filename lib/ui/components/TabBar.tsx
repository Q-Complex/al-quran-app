import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import React from 'react'
import { BottomNavigation, useTheme } from 'react-native-paper'
import { AppTheme } from '../styles'

const TabBar = (props: BottomTabBarProps) => {
  const theme = useTheme<AppTheme>()

  return (
    <BottomNavigation.Bar
      labeled={false}
      navigationState={props.state}
      safeAreaInsets={props.insets}
      activeColor={theme.colors.onPrimaryContainer}
      activeIndicatorStyle={{ backgroundColor: theme.colors.primaryContainer }}
      renderIcon={({ route, focused, color }) => {
        const { options } = props.descriptors[route.key]

        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 })
        }

        return null
      }}
      onTabPress={({ route, preventDefault }) => {
        const event = props.navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        })

        if (event.defaultPrevented) {
          preventDefault()
        } else {
          props.navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: props.state.key,
          })
        }
      }}
    />
  )
}

export default TabBar
