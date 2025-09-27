import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { RefreshControl, View } from 'react-native'
import {
  List,
  ProgressBar,
  Searchbar,
  Surface,
  useTheme,
} from 'react-native-paper'

import { Database, Locales, TVerse, KVStore, AppTheme } from '@/lib'

const Search = () => {
  const db = useSQLiteContext()
  const theme = useTheme<AppTheme>()
  const [query, setQuery] = React.useState('')
  const [reload, setReload] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [history, setHistory] = React.useState<string[]>([])
  const [results, setResults] = React.useState<TVerse[]>([])

  // Search history data
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      await KVStore.history.load((h) => (h ? setHistory(JSON.parse(h)) : {}))
      setLoading(false)
    })()
  }, [reload])

  // Search logic
  React.useEffect(() => {
    if (query !== '') {
      setLoading(true)
      ;(async () => {
        setResults(await Database.search(db, query))
        setLoading(false)
      })()
    } else {
      setResults([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, query])

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <ProgressBar indeterminate={loading} color={theme.colors.success} />

      <List.Section style={{ flex: 1, marginVertical: 0 }}>
        <AnimatedFlashList
          data={results}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => setReload(!reload)}
            />
          }
          ListHeaderComponent={
            <View style={{ paddingTop: 16 }}>
              <View style={{ paddingHorizontal: 16 }}>
                <Searchbar
                  value={query}
                  onChangeText={(v) => setQuery(v)}
                  placeholder={Locales.t('search')}
                  onBlur={async () => {
                    if (query !== '' && !history.includes(query)) {
                      const newHistory = [...history, query]

                      setHistory(newHistory)

                      await KVStore.history.save(
                        JSON.stringify(newHistory),
                        () => setReload(!reload),
                      )
                      setReload(!reload)
                    }
                  }}
                />
              </View>

              <List.Subheader>
                {query === ''
                  ? Locales.t('history')
                  : Locales.t('results') + ` ${results.length}`}
              </List.Subheader>
            </View>
          }
          renderItem={({ item }: { item: TVerse }) => (
            <List.Item
              description={item.content + '...'}
              descriptionNumberOfLines={1}
              onPress={() => router.push(`/pages/${item.page_id}`)}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              title={`${Locales.t('verse')} ${item.chapter_id}:${item.number}`}
            />
          )}
          ListEmptyComponent={
            history.length > 0 ? (
              <>
                {history.map((i) => (
                  <List.Item
                    key={i}
                    title={i}
                    onPress={() => setQuery(i)}
                    left={(props) => <List.Icon {...props} icon="history" />}
                    right={(props) => <List.Icon {...props} icon="magnify" />}
                  />
                ))}
                <List.Item
                  title={Locales.t('clear')}
                  rippleColor={theme.colors.error}
                  titleStyle={{ color: theme.colors.error }}
                  onPress={async () =>
                    await KVStore.history.delete(() => setHistory([]))
                  }
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="delete-clock"
                      color={theme.colors.error}
                    />
                  )}
                />
              </>
            ) : (
              <List.Item
                title={Locales.t('noSearches')}
                left={(props) => <List.Icon {...props} icon="history" />}
              />
            )
          }
        />
      </List.Section>
    </Surface>
  )
}

export default Search
