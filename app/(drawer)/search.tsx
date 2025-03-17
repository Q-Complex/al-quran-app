import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import Drawer from 'expo-router/drawer'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { Chip, List, ProgressBar, Surface } from 'react-native-paper'

import { DrawerHeader } from '@/lib'

const Search = () => {
  const db = useSQLiteContext()
  const [data, setData] = React.useState<any[]>([])
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState<boolean>(false)

  // Search logic
  React.useEffect(() => {
    if (query !== '') {
      setLoading(true)
      ;(async () => {
        setData(
          await db.getAllAsync(
            `SELECT * FROM "chapters" WHERE "name" LIKE '%${query}%'`,
          ),
        )

        setLoading(false)
      })()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <Surface style={{ flex: 1 }}>
      <Drawer.Screen
        options={{
          header: (props) => (
            <DrawerHeader
              navProps={props}
              children={undefined}
              withSearchbar
              searchBarProps={{
                value: '',
                onChangeText: (t) => setQuery(t),
                placeholder: 'Search chapters...',
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <List.Section style={{ flex: 1 }}>
        <AnimatedFlashList
          data={data}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <List.Item
              key={item.id}
              title={item.name}
              onPress={() => router.push(`/`)}
              left={(props) => <Chip {...props}>{item.id}</Chip>}
              description={`${item.verse_count} verses, ${item.page_count} pages`}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          )}
        />
      </List.Section>
    </Surface>
  )
}

export default Search
