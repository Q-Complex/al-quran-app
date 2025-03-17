import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import Drawer from 'expo-router/drawer'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { ScrollView } from 'react-native'
import { Chip, List, ProgressBar, Surface, Tooltip } from 'react-native-paper'

import { buildQuery, DrawerHeader, TChapter } from '@/lib'

const Home = () => {
  const db = useSQLiteContext()
  const [data, setData] = React.useState<TChapter[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      setData(await db.getAllAsync<TChapter>(buildQuery('chapters')))
      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                placeholder: 'Search chapters...',
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={data}
        estimatedItemSize={100}
        renderItem={({ item }: { item: TChapter }) => (
          <List.Item
            title={item.name}
            onPress={() => router.push(`/chapters/${item.id}`)}
            left={(props) => <Chip {...props}>{item.id}</Chip>}
            description={`${item.verse_count} verses, ${item.page_count} pages`}
            titleStyle={{
              lineHeight: 25,
              fontFamily: 'AmiriQuran_400Regular',
            }}
            right={(props) => (
              <Tooltip title={item.type ? 'Meccan' : 'Medinan'}>
                <List.Icon
                  {...props}
                  icon={item.type ? 'cube' : 'mosque'}
                  style={[props.style, { marginVertical: 'auto' }]}
                />
              </Tooltip>
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
