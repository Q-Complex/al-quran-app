import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { RefreshControl, View } from 'react-native'
import { List, ProgressBar, Searchbar, Surface } from 'react-native-paper'

import { Database, Locales, TVerse, KVStore } from '@/lib'

const Search = () => {
  const db = useSQLiteContext()
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
  }, [])

  // Search logic
  React.useEffect(() => {
    if (query !== '') {
      setLoading(true)
      ;(async () => {
        setResults(await Database.search(db, query))
      })()
      setLoading(false)
    } else {
      setResults([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, reload])

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <ProgressBar indeterminate={loading} />

      <View style={{ gap: 16, padding: 16, paddingBottom: 0 }}>
        <Searchbar
          value={query}
          onChangeText={setQuery}
          placeholder={Locales.t('search')}
        />
      </View>

      <List.Section style={{ flex: 1 }}>
        <AnimatedFlashList
          data={results}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => setReload(!reload)}
            />
          }
          ListHeaderComponent={
            <List.Subheader>
              {query === ''
                ? Locales.t('history')
                : Locales.t('results') + ` ${results.length}`}
            </List.Subheader>
          }
          renderItem={({ item }: { item: TVerse }) => (
            <List.Item
              description={item.content}
              descriptionNumberOfLines={1}
              descriptionStyle={{ direction: 'rtl' }}
              onPress={() => router.push(`/pages/${item.page_id}`)}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              title={`${Locales.t('verse')} ${item.chapter_id}:${item.number}`}
            />
          )}
          ListEmptyComponent={
            <>
              {history.length > 0 ? (
                <>
                  {history.map((i) => (
                    <List.Item
                      key={i}
                      title={i}
                      onPress={() => setQuery(i)}
                      left={(props) => <List.Icon {...props} icon="history" />}
                      right={(props) => (
                        <List.Icon {...props} icon="chevron-right" />
                      )}
                    />
                  ))}
                  <List.Item
                    title={Locales.t('clear')}
                    description={Locales.t('deleteHistory')}
                    left={(props) => (
                      <List.Icon {...props} icon="delete-clock" />
                    )}
                    onPress={async () =>
                      await KVStore.history.delete(() => setHistory([]))
                    }
                  />
                </>
              ) : (
                <List.Item
                  title={Locales.t('noSearches')}
                  left={(props) => <List.Icon {...props} icon="history" />}
                />
              )}
            </>
          }
        />
      </List.Section>
    </Surface>
  )
}

export default Search
