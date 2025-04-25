import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import {
  Appbar,
  List,
  ProgressBar,
  Surface,
  Text,
  Tooltip,
  useTheme,
} from 'react-native-paper'

import {
  Database,
  Locales,
  Modal,
  Page,
  QSettings,
  Slug,
  TChapter,
  TGroup,
  TItem,
  TPage,
  TQuarter,
  TVerse,
} from '@/lib'

const Details = () => {
  const theme = useTheme()
  const db = useSQLiteContext()
  const { settings } = React.useContext(QSettings)
  const { id, slug } = useLocalSearchParams<{ id: string; slug: Slug }>()
  const [item, setItem] = React.useState<TItem>()
  const [pages, setPages] = React.useState<TPage[]>([])
  const [verses, setVerses] = React.useState<TVerse[]>([])
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState({
    details: false,
    actions: false,
  })

  const ID = parseInt(id, 10)
  const count = Database.count(slug)
  const types = ['chapters', 'parts', 'groups', 'quarters', 'pages']

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      const [p, v] = await Database.extract(db, ID, slug)

      setItem(
        (await db.getFirstAsync(`SELECT * FROM "${slug}" WHERE "id" = ?`, ID))!,
      )

      setPages(p)
      setVerses(v)

      setLoading(false)
    })()
  }, [ID, db, slug])

  const single = slug.slice(0, slug.length - 1)
  const title =
    slug === 'chapters' && item
      ? Locales.t('chapter') + ` ${item?.name}`
      : Locales.t(single) + ' ' + id

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title,
          headerTitleStyle:
            slug === 'chapters' && item
              ? { fontSize: 16, fontFamily: 'NotoKufiArabic_400Regular' }
              : undefined,
          headerRight: (props) => (
            <>
              <Tooltip title={Locales.t('prev')}>
                <Appbar.Action
                  {...props}
                  icon="chevron-left"
                  disabled={ID === 1}
                  onPress={() => router.push(`/${slug}/${ID - 1}`)}
                />
              </Tooltip>
              <Tooltip title={Locales.t('next')}>
                <Appbar.Action
                  {...props}
                  icon="chevron-right"
                  disabled={ID === count}
                  onPress={() => router.push(`/${slug}/${ID + 1}`)}
                />
              </Tooltip>
              <Tooltip title={Locales.t('info')}>
                <Appbar.Action
                  {...props}
                  icon="information"
                  onPress={() => setVisible({ ...visible, details: true })}
                />
              </Tooltip>
            </>
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={pages}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <Page
            db={db}
            data={item}
            theme={theme}
            verses={verses.filter((i) => i.page_id === item.id)}
            onVersePress={(id) => setVisible({ ...visible, actions: true })}
            font={{
              family: settings.font.family,
              size: settings.font.size,
            }}
          />
        )}
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
        <List.Section>
          <List.Item
            title={Locales.t(single)}
            right={(props) => <Text {...props}>{item?.id}</Text>}
            left={(props) => (
              <List.Icon {...props} icon="sort-numeric-ascending" />
            )}
          />
          {slug === 'chapters' && (
            <>
              <List.Item
                title={Locales.t('name')}
                right={(props) => (
                  <Text
                    {...props}
                    style={{
                      ...props.style,
                      fontFamily: 'NotoKufiArabic_400Regular',
                    }}
                  >
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
          {types.slice(2).includes(slug) && (
            <List.Item
              title={Locales.t('part')}
              left={(props) => <List.Icon {...props} icon="grid-large" />}
              right={(props) => (
                <Text {...props}>{(item as TGroup)?.part_id}</Text>
              )}
            />
          )}
          {types.slice(3).includes(slug) && (
            <List.Item
              title={Locales.t('group')}
              left={(props) => <List.Icon {...props} icon="grid" />}
              right={(props) => (
                <Text {...props}>{(item as TQuarter)?.group_id}</Text>
              )}
            />
          )}
          {slug === 'pages' && (
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
          {types.slice(0, types.length - 1).includes(slug) && (
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
          <List.Item
            title={Locales.t('settings')}
            onPress={() => router.push('/settings')}
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
      </Modal>

      {/* 
      <Modal
        theme={theme}
        title="Actions"
        modalProps={{
          visible: visible.actions,
          children: undefined,
          onDismiss: () => setVisible({ ...visible, actions: false }),
        }}
      >
        <List.Section>
          <List.Item
            title="Listen"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="ear-hearing" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Translations"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Tafsir"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="book-open" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Bookmark"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="bookmark-outline" />}
            // right={(props) => <List.Icon {...props} icon="check" />}
          /> 
          <List.Item
            title="Share"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="share-variant" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Copy"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="content-copy" />}
          />
        </List.Section>
      </Modal> 
      */}
    </Surface>
  )
}

export default Details
