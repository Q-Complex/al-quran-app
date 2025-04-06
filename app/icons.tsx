import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AnimatedFlashList } from '@shopify/flash-list'
import { Stack } from 'expo-router'
import React from 'react'
import { List, ProgressBar, Surface } from 'react-native-paper'

import { icons, StackHeader } from '@/lib'

function Icon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name']
  color: string
}) {
  return <MaterialCommunityIcons size={24} {...props} />
}

const Search = () => {
  const [data, setData] = React.useState<string[]>(icons)
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Search logic
  React.useEffect(() => {
    setLoading(true)
    if (query !== '') {
      setData(icons.filter((i) => i.includes(query.toLowerCase())))
    } else {
      setData(icons)
    }

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: (props) => (
            <StackHeader
              navProps={props}
              children={undefined}
              withSearchbar
              searchBarProps={{
                value: '',
                onChangeText: (t) => setQuery(t),
                placeholder: 'Search icons...',
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <List.Section style={{ flex: 1 }}>
        <AnimatedFlashList
          data={data}
          estimatedItemSize={64}
          renderItem={({ item }) => (
            <List.Item
              key={item}
              title={item}
              left={(props) => <Icon {...props} name={item} />}
            />
          )}
        />
      </List.Section>
    </Surface>
  )
}

export default Search
