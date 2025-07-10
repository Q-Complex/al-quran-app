import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { List, ProgressBar, Surface } from 'react-native-paper'

import { Database, Locales, Slug, TItem, V } from '@/lib'
import { formatQuarterLabel } from '@/lib/utils/text'

const ListHome = () => {
  const db = useSQLiteContext()
  const { slug } = useLocalSearchParams<{ slug: Slug }>()
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<(TItem & V)[]>([])

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      setData(await Database.query(slug, db))

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const title = Locales.t(slug)

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <Stack.Screen options={{ title }} />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={data}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <List.Item
            title={
              slug !== 'quarters'
                ? `${Locales.t(slug.slice(0, slug.length - 1))} ${item.id}`
                : formatQuarterLabel(item.id)
            }
            descriptionNumberOfLines={1}
            description={`${item.verse_content}...`}
            onPress={() => router.push(`/${slug}/${item.id}`)}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        )}
      />
    </Surface>
  )
}

export default ListHome
