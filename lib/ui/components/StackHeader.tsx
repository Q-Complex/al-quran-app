import { getHeaderTitle } from '@react-navigation/elements'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React from 'react'
import {
  Appbar,
  AppbarProps,
  Searchbar,
  SearchbarProps,
  Tooltip,
} from 'react-native-paper'
import { Locales } from '../locales'

interface StackHeaderProps extends AppbarProps {
  navProps: NativeStackHeaderProps
  withSearchbar?: boolean
  searchBarProps?: SearchbarProps
}

const StackHeader = (props: StackHeaderProps) => {
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    if (props.searchBarProps?.onChangeText) {
      props.searchBarProps.onChangeText(query)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return props.withSearchbar ? (
    <Appbar.Header {...props}>
      <Searchbar
        {...props.searchBarProps}
        icon="arrow-left"
        value={query}
        onChangeText={setQuery}
        style={{ margin: 8, marginBottom: 16 }}
        onIconPress={() => props.navProps.navigation.goBack()}
        placeholder={getHeaderTitle(
          props.navProps.options,
          props.navProps.route.name,
        )}
      />
    </Appbar.Header>
  ) : (
    <Appbar.Header {...props}>
      {props.navProps.options.headerLeft
        ? props.navProps.options.headerLeft({
            canGoBack: props.navProps.navigation.canGoBack(),
          })
        : undefined}

      {props.navProps.back ? (
        <Tooltip title={Locales.t('back')}>
          <Appbar.BackAction onPress={props.navProps.navigation.goBack} />
        </Tooltip>
      ) : null}

      <Appbar.Content
        title={getHeaderTitle(
          props.navProps.options,
          props.navProps.route.name,
        )}
        titleStyle={[
          props.navProps.options.headerTitleStyle,
          { lineHeight: 36 },
        ]}
      />

      {props.navProps.options.headerRight
        ? props.navProps.options.headerRight({
            canGoBack: props.navProps.navigation.canGoBack(),
          })
        : undefined}
    </Appbar.Header>
  )
}

export default StackHeader
