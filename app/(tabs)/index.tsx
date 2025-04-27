import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Tabs } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { ScrollView } from 'react-native'
import { Chip, List, ProgressBar, Surface } from 'react-native-paper'

import { Database, Locales, TabsHeader, TChapter } from '@/lib'

const Home = () => {
  const db = useSQLiteContext()
  const [query, setQuery] = React.useState<string>('')
  const [loading, setLoading] = React.useState(false)
  const [chapters, setChapters] = React.useState<TChapter[]>([])

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      setChapters((await Database.query('chapters', db, query)) as TChapter[])
      setLoading(false)
    })()

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
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={chapters}
        estimatedItemSize={100}
        renderItem={({ item: c }: { item: TChapter }) => (
          <List.Item
            title={Locales.t('chapter') + ` ${c.name}`}
            onPress={() => router.push(`/chapters/${c.id}`)}
            left={(props) => <Chip {...props}>{c.id}</Chip>}
            titleStyle={{ fontFamily: 'NotoKufiArabic_400Regular' }}
            description={`${c.type ? Locales.t('meccan') : Locales.t('medinan')}, ${c.verse_count} ${Locales.t('verseCount')}`}
            right={(props) => (
              <List.Icon {...props} icon={c.type ? 'cube' : 'mosque'} />
            )}
          />
        )}
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 0 }}
          >
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/parts')}
            >
              {Locales.t('parts')}
            </Chip>
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/groups')}
            >
              {Locales.t('groups')}
            </Chip>
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/quarters')}
            >
              {Locales.t('quarters')}
            </Chip>
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/pages')}
            >
              {Locales.t('pages')}
            </Chip>
          </ScrollView>
        }
      />
    </Surface>
  )
}

export default Home
