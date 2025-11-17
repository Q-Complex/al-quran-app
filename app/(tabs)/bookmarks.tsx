import { AnimatedFlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import {
  Button,
  Icon,
  List,
  ProgressBar,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

import { AppTheme, KVStore, Locales, Modal, TVerse } from '@/lib'

const Bookmarks = () => {
  const theme = useTheme<AppTheme>()
  const [reload, setReload] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [verse, setVerse] = React.useState<TVerse>()
  const [visible, setVisible] = React.useState(false)
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
              descriptionNumberOfLines={1}
              description={item.content.substring(0, 60) + '...'}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              title={`${Locales.t('verse')} ${item.chapter_id}:${item.number}`}
              onPress={() => {
                setVerse(item)
                setVisible(true)
              }}
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

      <Modal
        theme={theme}
        title={`${Locales.t('verse')} ${verse?.chapter_id}:${verse?.number}`}
        modalProps={{
          visible,
          children: undefined,
          onDismiss: () => setVisible(false),
        }}
      >
        <ScrollView
          style={{ maxHeight: 320 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, padding: 16 }}
        >
          <Text
            style={{ direction: 'rtl', lineHeight: 32, textAlign: 'justify' }}
          >
            {verse?.content}
          </Text>

          <View style={{ gap: 16, flexDirection: 'row' }}>
            <Button
              style={{ flexGrow: 1 }}
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              onPress={async () => {
                await KVStore.bookmarks.remove(verse!, bookmarks, (v) =>
                  setBookmarks(JSON.parse(v)),
                )
                setVisible(false)
              }}
            >
              {Locales.t('remove')}
            </Button>

            <Button
              style={{ flexGrow: 1 }}
              mode="contained"
              onPress={() => router.push(`/pages/${verse?.page_id}`)}
            >
              {Locales.t('read')}
            </Button>
          </View>
        </ScrollView>
      </Modal>

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
