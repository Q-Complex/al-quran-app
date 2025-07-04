import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React from 'react'
import { RefreshControl } from 'react-native'
import {
  Icon,
  IconButton,
  List,
  ProgressBar,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

import { KVStore, Locales, TVerse } from '@/lib'

const Bookmarks = () => {
  const theme = useTheme()
  const [reload, setReload] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [bookmarks, setBookmarks] = React.useState<TVerse[]>([])

  // Search bookmarks data
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      await KVStore.bookmarks.load((v) =>
        v ? setBookmarks(JSON.parse(v)) : {},
      )

      setLoading(false)
    })()
  }, [reload])

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <ProgressBar indeterminate={loading} />

      <List.Section style={{ flex: 1, marginVertical: 0 }}>
        <AnimatedFlashList
          data={bookmarks}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => setReload(!reload)}
            />
          }
          renderItem={({ item }: { item: TVerse }) => (
            <List.Item
              descriptionNumberOfLines={1}
              description={item.content}
              title={`${Locales.t('verse')} ${item.chapter_id}:${item.number}`}
              onPress={() => router.push(`/pages/${item.page_id}`)}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={async () =>
                    await KVStore.bookmarks.remove(item, bookmarks, (v) =>
                      setBookmarks(JSON.parse(v)),
                    )
                  }
                />
              )}
              descriptionStyle={{ direction: 'rtl' }}
            />
          )}
          ListEmptyComponent={
            <Surface
              elevation={0}
              style={{
                flex: 1,
                gap: 16,
                paddingVertical: 96,
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'center',
              }}
            >
              <Icon
                size={96}
                source="bookmark-multiple"
                color={theme.colors.primary}
              />

              <Text variant="titleLarge">{Locales.t('noBookmarks')}</Text>
            </Surface>
          }
        />
      </List.Section>

      {bookmarks.length === 0 && (
        <Snackbar
          visible
          icon="information"
          onDismiss={() => {}}
          onIconPress={() => {}}
          style={{ backgroundColor: theme.colors.primaryContainer }}
        >
          <Text style={{ color: theme.colors.onPrimaryContainer }}>
            {Locales.t('pressToBookmark')}
          </Text>
        </Snackbar>
      )}
    </Surface>
  )
}

export default Bookmarks
