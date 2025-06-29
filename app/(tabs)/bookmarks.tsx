import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React from 'react'
import { RefreshControl } from 'react-native'
import {
  Icon,
  IconButton,
  List,
  ProgressBar,
  Surface,
  Text,
} from 'react-native-paper'

import { KVStore, Locales, TVerse } from '@/lib'

const Bookmarks = () => {
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

      <List.Section style={{ flex: 1 }}>
        <AnimatedFlashList
          data={bookmarks}
          estimatedItemSize={100}
          ListHeaderComponent={
            <List.Subheader>{Locales.t('bookmarks')}</List.Subheader>
          }
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
              descriptionStyle={{
                direction: 'rtl',
                fontFamily: 'NotoKufiArabic_400Regular',
              }}
            />
          )}
          ListEmptyComponent={
            <>
              <List.Item
                title={Locales.t('noBookmarks')}
                left={(props) => (
                  <List.Icon {...props} icon="bookmark-multiple" />
                )}
              />
              <Surface
                elevation={0}
                style={{ gap: 8, padding: 16, alignItems: 'center' }}
              >
                <Icon source="bookmark-plus" size={64} />
                <Text>{Locales.t('pressToBookmark')}</Text>
              </Surface>
            </>
          }
        />
      </List.Section>
    </Surface>
  )
}

export default Bookmarks
