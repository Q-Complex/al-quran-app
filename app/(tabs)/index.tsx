import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Tabs } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { View } from 'react-native'
import {
  Appbar,
  Chip,
  List,
  ProgressBar,
  Searchbar,
  Surface,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper'

import { Database, Locales, Modal, TChapter } from '@/lib'

const Home = () => {
  const theme = useTheme()
  const db = useSQLiteContext()
  const [query, setQuery] = React.useState<string>('')
  const [visible, setVisible] = React.useState(false)
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
          headerRight: (props) => (
            <Tooltip title={Locales.t('read')}>
              <Appbar.Action
                {...props}
                icon="dots-vertical"
                onPress={() => setVisible(true)}
              />
            </Tooltip>
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={chapters}
        estimatedItemSize={100}
        ListHeaderComponent={
          <View style={{ gap: 16, padding: 16, paddingBottom: 0 }}>
            <Searchbar
              value={query}
              onChangeText={setQuery}
              placeholder={Locales.t('search')}
            />
          </View>
        }
        renderItem={({ item: c }: { item: TChapter }) => (
          <List.Item
            title={c.name}
            onPress={() => router.push(`/chapters/${c.id}`)}
            left={(props) => <Chip {...props}>{c.id}</Chip>}
            description={`${c.type ? Locales.t('meccan') : Locales.t('medinan')}, ${c.verse_count} ${Locales.t('verseCount')}`}
            right={(props) => (
              <List.Icon {...props} icon={c.type ? 'cube' : 'mosque'} />
            )}
          />
        )}
      />

      <Modal
        theme={theme}
        title={Locales.t('read')}
        modalProps={{
          visible,
          children: undefined,
          onDismiss: () => setVisible(false),
        }}
      >
        <List.Section>
          <List.Item
            title={Locales.t('parts')}
            onPress={() => router.push('/parts')}
            right={(props) => <Text {...props}>30</Text>}
          />
          <List.Item
            title={Locales.t('groups')}
            onPress={() => router.push('/groups')}
            right={(props) => <Text {...props}>60</Text>}
          />
          <List.Item
            title={Locales.t('quarters')}
            onPress={() => router.push('/quarters')}
            right={(props) => <Text {...props}>240</Text>}
          />
          <List.Item
            title={Locales.t('pages')}
            onPress={() => router.push('/pages')}
            right={(props) => <Text {...props}>604</Text>}
          />
        </List.Section>
      </Modal>
    </Surface>
  )
}

export default Home
