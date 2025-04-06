import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import Drawer from 'expo-router/drawer'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { ScrollView } from 'react-native'
import { Chip, List, ProgressBar, Surface } from 'react-native-paper'

import { Database, DrawerHeader, TChapter } from '@/lib'

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
      <Drawer.Screen
        options={{
          header: (props) => (
            <DrawerHeader
              navProps={props}
              children={undefined}
              withSearchbar
              searchBarProps={{
                value: '',
                placeholder: 'Search chapters...',
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
            title={`سُورَةُ ${c.name}`}
            onPress={() => router.push(`/chapters/${c.id}`)}
            left={(props) => <Chip {...props}>{c.id}</Chip>}
            titleStyle={{ fontFamily: 'NotoKufiArabic_400Regular' }}
            description={`${c.type ? 'Meccan' : 'Medinan'}, ${c.verse_count} verses`}
            right={(props) => (
              <List.Icon {...props} icon={c.type ? 'cube' : 'mosque'} />
            )}
          />
        )}
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, padding: 16 }}
          >
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/parts')}
            >
              Parts
            </Chip>
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/groups')}
            >
              Groups
            </Chip>
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/quarters')}
            >
              Quarters
            </Chip>
            <Chip
              onClose={() => {}}
              closeIcon="chevron-right"
              onPress={() => router.push('/pages')}
            >
              Pages
            </Chip>
          </ScrollView>
        }
      />
    </Surface>
  )
}

export default Home
