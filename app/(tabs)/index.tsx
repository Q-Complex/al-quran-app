import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Tabs } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import {
  Appbar,
  Chip,
  List,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

import { AppTheme, Database, Locales, Modal, TabsHeader, TChapter } from '@/lib'
import { RefreshControl } from 'react-native'

const Home = () => {
  const db = useSQLiteContext()
  const theme = useTheme<AppTheme>()
  const [reload, setReload] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [visible, setVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [chapters, setChapters] = React.useState<TChapter[]>([])

  // Load chapters
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
                right:
                  query === ''
                    ? (props) => (
                        <Appbar.Action
                          {...props}
                          icon="dots-vertical"
                          onPress={() => setVisible(true)}
                        />
                      )
                    : undefined,
              }}
            />
          ),
        }}
      />

      <ProgressBar indeterminate={loading} color={theme.colors.success} />

      <List.Section style={{ flex: 1, marginVertical: 0 }}>
        <AnimatedFlashList
          data={chapters}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => setReload(!reload)}
            />
          }
          renderItem={({ item: c }: { item: TChapter }) => (
            <List.Item
              title={`سُورَةُ ${c.name}`}
              onPress={() => router.push(`/chapters/${c.id}`)}
              description={`${c.verse_count} ${Locales.t('verses')}`}
              left={(props) => (
                <Chip
                  {...props}
                  style={{
                    ...props.style,
                    backgroundColor: theme.colors.primary,
                  }}
                  textStyle={{ color: theme.colors.onPrimary }}
                >
                  {c.id}
                </Chip>
              )}
              right={(props) => (
                <List.Icon {...props} icon={c.type ? 'cube' : 'mosque'} />
              )}
            />
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
