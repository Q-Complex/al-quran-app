import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import {
  Button,
  List,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

import { AppTheme, Database, Locales, Slug, TItem, V } from '@/lib'
import { formatQuarterLabel } from '@/lib/utils/text'
import { View } from 'react-native'

const ListHome = () => {
  const db = useSQLiteContext()
  const theme = useTheme<AppTheme>()
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

      <ProgressBar indeterminate={loading} color={theme.colors.success} />

      <List.Section style={{ flex: 1, marginVertical: 0 }}>
        <AnimatedFlashList
          data={data}
          ListFooterComponent={
            <View style={{ padding: 16 }}>
              <Button mode="contained" onPress={() => router.push('/prayer')}>
                {Locales.t('prayer')}
              </Button>
            </View>
          }
          renderItem={({ item }) => (
            <List.Item
              descriptionNumberOfLines={1}
              description={`${item.verse_content}...`}
              onPress={() => router.push(`/${slug}/${item.id}`)}
              title={
                slug !== 'quarters'
                  ? `${Locales.t(slug.slice(0, slug.length - 1))} ${item.id}`
                  : formatQuarterLabel(item.id)
              }
              right={(props) => (
                <View
                  style={{
                    ...props.style,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text variant="bodySmall">{item.verse_count}</Text>
                  <List.Icon color={props.color} icon="chevron-right" />
                </View>
              )}
            />
          )}
        />
      </List.Section>
    </Surface>
  )
}

export default ListHome
