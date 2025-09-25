import { AnimatedFlashList } from '@shopify/flash-list'
import * as Clipboard from 'expo-clipboard'
import * as Constants from 'expo-constants'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import {
  Appbar,
  FAB,
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
  DefaultSettings,
  KVStore,
  Locales,
  Modal,
  Page,
  Slug,
  TChapter,
  TCName,
  TGroup,
  TItem,
  TPage,
  TQuarter,
  TVerse,
} from '@/lib'
import { formatQuarterLabel } from '@/lib/utils/text'

const Details = () => {
  const db = useSQLiteContext()
  const theme = useTheme<AppTheme>()
  const [settings, setSettings] = React.useState(DefaultSettings)
  const { id, slug } = useLocalSearchParams<{ id: string; slug: Slug }>()
  const [ID, setID] = React.useState(parseInt(id, 10))
  const [path, setPath] = React.useState(slug)
  const [item, setItem] = React.useState<TItem>()
  const [pages, setPages] = React.useState<(TCName & TPage)[]>([])
  const [bookmarks, setBookmarks] = React.useState<TVerse[]>([])
  const [pressedVerse, setPVerse] = React.useState<TVerse>()
  const [loading, setLoading] = React.useState(false)
  const [headerShown, setHeaderShown] = React.useState(true)
  const [visible, setVisible] = React.useState({
    details: false,
    actions: false,
  })

  const count = Database.count(slug)
  const types = ['chapters', 'parts', 'groups', 'quarters', 'pages']

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      // Load settings
      await KVStore.settings.load((v) => (v ? setSettings(JSON.parse(v)) : {}))

      setPages(await Database.extract(db, ID, path))
      setItem(
        (await db.getFirstAsync(`SELECT * FROM "${path}" WHERE "id" = ?`, ID))!,
      )
      await KVStore.bookmarks.load((v) =>
        v ? setBookmarks(JSON.parse(v)) : {},
      )

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ID, path])

  const single = path.replace('s', '')

  return (
    <Surface
      elevation={0}
      style={{
        flex: 1,
        paddingTop: !headerShown
          ? Constants.default.statusBarHeight
          : undefined,
      }}
    >
      <Stack.Screen
        options={{
          headerShown,
          title:
            path !== 'chapters'
              ? path === 'quarters'
                ? formatQuarterLabel(ID)
                : `${Locales.t(single)} ${ID}`
              : item
                ? item.name
                : '',
          headerRight: (props) => (
            <>
              <Tooltip title={Locales.t('fullscreen')}>
                <Appbar.Action
                  {...props}
                  icon="fullscreen"
                  onPress={() => setHeaderShown(!headerShown)}
                />
              </Tooltip>
              <Tooltip title={Locales.t('prev')}>
                <Appbar.Action
                  {...props}
                  icon="chevron-left"
                  disabled={ID === 1}
                  onPress={() => setID(ID - 1)}
                />
              </Tooltip>
              <Tooltip title={Locales.t('next')}>
                <Appbar.Action
                  {...props}
                  icon="chevron-right"
                  disabled={ID === count}
                  onPress={() => setID(ID + 1)}
                />
              </Tooltip>
              <Tooltip title={Locales.t('info')}>
                <Appbar.Action
                  {...props}
                  icon="information"
                  iconColor={theme.colors.info}
                  rippleColor={theme.colors.info}
                  onPress={() => setVisible({ ...visible, details: true })}
                />
              </Tooltip>
            </>
          ),
        }}
      />

      <ProgressBar indeterminate={loading} color={theme.colors.success} />

      <AnimatedFlashList
        data={pages}
        renderItem={({ item }) => (
          <Page
            db={db}
            data={item}
            path={path}
            theme={theme}
            settings={settings}
            onNavButtonPress={(s, i) => {
              setPath(s)
              setID(i)
            }}
            onVersePress={(v) => {
              setPVerse(v)
              setVisible({ ...visible, actions: true })
            }}
          />
        )}
      />

      <FAB
        size="small"
        visible={!headerShown}
        icon="fullscreen-exit"
        onPress={() => setHeaderShown(!headerShown)}
        style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
      />

      <Modal
        theme={theme}
        title={Locales.t('details')}
        modalProps={{
          visible: visible.details,
          children: undefined,
          onDismiss: () => setVisible({ ...visible, details: false }),
        }}
      >
        <List.Section style={{ flex: 1, marginVertical: 0 }}>
          <List.Item
            title={Locales.t(single)}
            right={(props) => <Text {...props}>{item?.id}</Text>}
            left={(props) => (
              <List.Icon {...props} icon="sort-numeric-ascending" />
            )}
          />
          {path === 'chapters' && (
            <>
              <List.Item
                title={Locales.t('name')}
                right={(props) => (
                  <Text {...props} style={{ ...props.style }}>
                    {item?.name}
                  </Text>
                )}
                left={(props) => <List.Icon {...props} icon="abjad-arabic" />}
              />
              <List.Item
                title={Locales.t('type')}
                right={(props) => (
                  <Text {...props}>
                    {(item as TChapter)?.type
                      ? Locales.t('meccan')
                      : Locales.t('medinan')}
                  </Text>
                )}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={(item as TChapter)?.type ? 'cube' : 'mosque'}
                  />
                )}
              />
              <List.Item
                title={Locales.t('chronoOrder')}
                right={(props) => (
                  <Text {...props}>{(item as TChapter)?.order}</Text>
                )}
                left={(props) => (
                  <List.Icon {...props} icon="sort-clock-ascending" />
                )}
              />
            </>
          )}
          {types.slice(2).includes(path) && (
            <List.Item
              title={Locales.t('part')}
              left={(props) => <List.Icon {...props} icon="grid-large" />}
              right={(props) => (
                <Text {...props}>{(item as TGroup)?.part_id}</Text>
              )}
            />
          )}
          {types.slice(3).includes(path) && (
            <List.Item
              title={Locales.t('group')}
              left={(props) => <List.Icon {...props} icon="grid" />}
              right={(props) => (
                <Text {...props}>{(item as TQuarter)?.group_id}</Text>
              )}
            />
          )}
          {path === 'pages' && (
            <>
              <List.Item
                title={Locales.t('quarter')}
                left={(props) => <List.Icon {...props} icon="dots-grid" />}
                right={(props) => (
                  <Text {...props}>{(item as TPage)?.quarter_id}</Text>
                )}
              />
              <List.Item
                title={Locales.t('chapter')}
                left={(props) => <List.Icon {...props} icon="book" />}
                right={(props) => (
                  <Text {...props}>{(item as TPage)?.chapter_id}</Text>
                )}
              />
            </>
          )}
          {types.slice(0, types.length - 1).includes(path) && (
            <List.Item
              title={Locales.t('pCount')}
              right={(props) => (
                <Text {...props}>{(item as TChapter)?.page_count}</Text>
              )}
              left={(props) => (
                <List.Icon {...props} icon="book-open-page-variant" />
              )}
            />
          )}
          <List.Item
            title={Locales.t('vCount')}
            right={(props) => <Text {...props}>{item?.verse_count}</Text>}
            left={(props) => <List.Icon {...props} icon="book-open" />}
          />
        </List.Section>
      </Modal>

      <Modal
        theme={theme}
        title={`${Locales.t('verse')} ${pressedVerse?.chapter_id}:${pressedVerse?.number}`}
        modalProps={{
          children: undefined,
          visible: visible.actions,
          onDismiss: () => setVisible({ ...visible, actions: false }),
        }}
      >
        <List.Section>
          {pressedVerse &&
          bookmarks.map((v) => v.id).includes(pressedVerse.id) ? (
            <List.Item
              title={Locales.t('rmBookmark')}
              left={(props) => <List.Icon {...props} icon="bookmark-check" />}
              onPress={async () =>
                await KVStore.bookmarks.remove(pressedVerse!, bookmarks, (v) =>
                  setBookmarks(JSON.parse(v)),
                )
              }
            />
          ) : (
            <List.Item
              title={Locales.t('bookmark')}
              onPress={async () =>
                await KVStore.bookmarks.add(pressedVerse!, bookmarks, (v) =>
                  setBookmarks(JSON.parse(v)),
                )
              }
              left={(props) => <List.Icon {...props} icon="bookmark-outline" />}
            />
          )}
          <List.Item
            title={Locales.t('copy')}
            onPress={async () =>
              await Clipboard.setStringAsync(pressedVerse!.content)
            }
            left={(props) => <List.Icon {...props} icon="content-copy" />}
          />
        </List.Section>
      </Modal>
    </Surface>
  )
}

export default Details
