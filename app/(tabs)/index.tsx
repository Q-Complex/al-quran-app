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
  Tooltip,
  useTheme,
} from 'react-native-paper'

import {
  AppTheme,
  Database,
  Locales,
  Modal,
  Slug,
  TabsHeader,
  TChapter,
} from '@/lib'
import { RefreshControl, View } from 'react-native'

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
                        <Tooltip title={Locales.t('more')}>
                          <Appbar.Action
                            {...props}
                            icon="dots-vertical"
                            onPress={() => setVisible(true)}
                          />
                        </Tooltip>
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
          ListFooterComponent={
            <List.Item
              title={Locales.t('prayer')}
              onPress={() => router.push('/prayer')}
              left={(props) => <List.Icon {...props} icon="hands-pray" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          }
          renderItem={({ item: c }: { item: TChapter }) => (
            <List.Item
              title={`سُورَةُ ${c.name}`}
              onPress={() => router.push(`/chapters/${c.id}`)}
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
                <View
                  style={{
                    gap: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
                    ...props.style,
                  }}
                >
                  <Text variant="bodySmall">{c.verse_count}</Text>
                  <Tooltip title={Locales.t(c.type ? 'meccan' : 'medinan')}>
                    <List.Icon
                      color={props.color}
                      icon={c.type ? 'cube' : 'mosque'}
                    />
                  </Tooltip>
                  <List.Icon color={props.color} icon="chevron-right" />
                </View>
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
          {['parts', 'groups', 'quarters', 'pages'].map((i) => (
            <List.Item
              key={i}
              title={Locales.t(i)}
              onPress={() => router.push(`/${i}`)}
              right={(props) => (
                <View
                  style={{
                    ...props.style,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text variant="bodySmall">{Database.count(i as Slug)}</Text>
                  <List.Icon color={props.color} icon="chevron-right" />
                </View>
              )}
            />
          ))}
        </List.Section>
      </Modal>
    </Surface>
  )
}

export default Home
