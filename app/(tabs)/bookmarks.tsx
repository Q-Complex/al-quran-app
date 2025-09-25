import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React from 'react'
import { RefreshControl, View } from 'react-native'
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

import { AppTheme, KVStore, Locales, TVerse } from '@/lib'

const Bookmarks = () => {
  const theme = useTheme<AppTheme>()
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
      <ProgressBar indeterminate={loading} color={theme.colors.success} />

      <List.Section style={{ flex: 1, marginVertical: 0 }}>
        <AnimatedFlashList
          data={bookmarks}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => setReload(!reload)}
            />
          }
          renderItem={({ item }: { item: TVerse }) => (
            <List.Item
              description={item.content}
              descriptionNumberOfLines={1}
              onPress={() => router.push(`/pages/${item.page_id}`)}
              title={`${Locales.t('verse')} ${item.chapter_id}:${item.number}`}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  iconColor={theme.colors.error}
                  rippleColor={theme.colors.error}
                  onPress={async () =>
                    await KVStore.bookmarks.remove(item, bookmarks, (v) =>
                      setBookmarks(JSON.parse(v)),
                    )
                  }
                />
              )}
            />
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                gap: 16,
                paddingVertical: 96,
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'center',
              }}
            >
              <Icon size={96} source="bookmark-multiple" />

              <Text variant="titleLarge">{Locales.t('noBookmarks')}</Text>
            </View>
          }
        />
      </List.Section>

      {bookmarks.length === 0 && (
        <Snackbar
          visible
          onDismiss={() => {}}
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
