import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Tabs } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import {
  Chip,
  IconButton,
  List,
  ProgressBar,
  Surface,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper'

import { Database, Locales, Modal, TabsHeader, TChapter } from '@/lib'
import { RefreshControl } from 'react-native'

const Home = () => {
  const theme = useTheme()
  const db = useSQLiteContext()
  const [reload, setReload] = React.useState(false)
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
          header: (props) => (
            <TabsHeader
              navProps={props}
              children={undefined}
              withSearchBar
              searchBarProps={{
                value: query,
                loading: loading,
                onChangeText: setQuery,
                placeholder: Locales.t('search'),
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <List.Section style={{ flex: 1, marginVertical: 0 }}>
        <AnimatedFlashList
          data={chapters}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => setReload(!reload)}
            />
          }
          ListHeaderComponent={
            <Surface
              elevation={0}
              style={{
                gap: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <List.Subheader>
                {query === ''
                  ? Locales.t('chapters')
                  : Locales.t('results') + ` ${chapters.length}`}
              </List.Subheader>

              <Tooltip title={Locales.t('read')}>
                <IconButton
                  icon="dots-vertical"
                  style={{ marginHorizontal: 16 }}
                  onPress={() => setVisible(true)}
                />
              </Tooltip>
            </Surface>
          }
          renderItem={({ item: c }: { item: TChapter }) => (
            <Tooltip title={Locales.t(c.type ? 'meccan' : 'medinan')}>
              <List.Item
                title={`سُورَةُ ${c.name}`}
                description={`${c.verse_count} ${Locales.t('verses')}`}
                titleStyle={{ color: theme.colors.primary, lineHeight: 32 }}
                onPress={() => router.push(`/chapters/${c.id}`)}
                left={(props) => <Chip {...props}>{c.id}</Chip>}
                right={(props) => (
                  <List.Icon {...props} icon={c.type ? 'cube' : 'mosque'} />
                )}
              />
            </Tooltip>
          )}
        />
      </List.Section>

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
