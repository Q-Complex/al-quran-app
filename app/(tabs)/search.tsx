import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Tabs } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import Storage from 'expo-sqlite/kv-store'
import React from 'react'
import { List, ProgressBar, Surface } from 'react-native-paper'

import { Database, TabsHeader, Locales, TVerse } from '@/lib'

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
      await Storage.getItemAsync('history')
        .then((h) => (h ? setHistory(JSON.parse(h)) : setHistory([])))
        .catch((err) => console.error(err))

      setLoading(false)
    })()
  }, [reload])

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
  }, [query])

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <Tabs.Screen
        options={{
          header: (props) => (
            <TabsHeader
              navProps={props}
              children={undefined}
              withSearchBar
              searchBarProps={{
                value: '',
                placeholder: Locales.t('search'),
                onChangeText: (t) => setQuery(t),
                onEndEditing: async () =>
                  query !== '' && !history.includes(query)
                    ? await Storage.setItemAsync(
                        'history',
                        JSON.stringify([...history, query]),
                      )
                        .then(() => setReload(!reload))
                        .catch((err) => console.error(err))
                    : {},
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <List.Section style={{ flex: 1 }}>
        <AnimatedFlashList
          data={results}
          estimatedItemSize={100}
          ListHeaderComponent={
            <List.Subheader>
              {query === ''
                ? Locales.t('history')
                : Locales.t('results') + ` ${results.length}`}
            </List.Subheader>
          }
          renderItem={({ item }: { item: TVerse }) => (
            <List.Item
              descriptionNumberOfLines={1}
              description={item.content + '...'}
              title={`${item.chapter_id}:${item.number}`}
              onPress={() => router.push(`/pages/${item.page_id}`)}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              descriptionStyle={{
                direction: 'rtl',
                fontFamily: 'NotoKufiArabic_400Regular',
              }}
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
                      titleStyle={{ fontFamily: 'NotoKufiArabic_400Regular' }}
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
                      await Storage.setItemAsync('history', '[]')
                        .then(() => setReload(!reload))
                        .catch((err) => console.error(err))
                    }
                  />
                </>
              ) : (
                <List.Item
                  title={Locales.t('noSearches')}
                  description={Locales.t('typeToSearch')}
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
