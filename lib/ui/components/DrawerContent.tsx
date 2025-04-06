import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { router } from 'expo-router'
import React from 'react'
import { Drawer, DrawerSectionProps, Icon } from 'react-native-paper'

interface DrawerContentProps extends DrawerSectionProps {
  navProps: DrawerContentComponentProps
}

const DrawerContent = (props: DrawerContentProps) => (
  <Drawer.Section {...props}>
    <Drawer.Item
      label="Home"
      icon="home"
      active={props.navProps.state.index === 0}
      onPress={() => router.push('/(drawer)')}
    />
    <Drawer.Item
      label="Search"
      icon="magnify"
      active={props.navProps.state.index === 1}
      onPress={() => router.push('/(drawer)/search')}
      right={(props) => <Icon {...props} size={24} source="chevron-right" />}
    />
    <Drawer.Item
      label="Settings"
      icon="cog"
      active={props.navProps.state.index === 2}
      onPress={() => router.push('/(drawer)/settings')}
      right={(props) => <Icon {...props} size={24} source="chevron-right" />}
    />
  </Drawer.Section>
)

export default DrawerContent
