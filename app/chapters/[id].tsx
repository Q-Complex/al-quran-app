import { AnimatedFlashList } from '@shopify/flash-list'
import Constants from 'expo-constants'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { View } from 'react-native'
import {
  Appbar,
  Button,
  IconButton,
  List,
  ProgressBar,
  Surface,
  Tooltip,
  useTheme,
} from 'react-native-paper'

import { Modal, Page, TChapter, TPage } from '@/lib'

const ChapterDetails = () => {
  const theme = useTheme()
  const db = useSQLiteContext()
  const [data, setData] = React.useState<TPage[]>([])
  const { id } = useLocalSearchParams<{ id: string }>()
  const [chapter, setChapter] = React.useState<TChapter>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)

  const ID = parseInt(id, 10)

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      const c = await db.getFirstAsync<TChapter>(
        'SELECT * FROM "chapters" WHERE "id" = ?',
        id,
      )
      setChapter(c!)

      setData(
        await db.getAllAsync<TPage>(
          `SELECT DISTINCT
            "pages"."id",
            "pages"."chapter_id",
            "pages"."part_id",
            "pages"."group_id",
            "pages"."quarter_id",
            "pages"."name",
            "pages"."verse_count"
          FROM "pages"
            INNER JOIN "verses" ON ("pages"."id" = "verses"."page_id")
          WHERE "verses"."chapter_id" = ?;`,
          ID,
        ),
      )

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Surface
      style={{
        flex: 1,
        paddingTop: isFullscreen ? Constants.statusBarHeight : undefined,
      }}
    >
      <Stack.Screen
        options={{
          title: chapter ? chapter.name : 'Chapter ' + id,
          headerShown: !isFullscreen,
          headerRight: (props) => (
            <>
              <Tooltip title="Fullscreen">
                <Appbar.Action
                  {...props}
                  icon="fullscreen"
                  onPress={() => setIsFullscreen(!isFullscreen)}
                />
              </Tooltip>
              <Tooltip title="Previous">
                <Appbar.Action
                  {...props}
                  icon="chevron-left"
                  disabled={ID === 1}
                  onPress={() => router.replace(`/chapters/${ID - 1}`)}
                />
              </Tooltip>
              <Tooltip title="Next">
                <Appbar.Action
                  {...props}
                  icon="chevron-right"
                  disabled={ID === 114}
                  onPress={() => router.replace(`/chapters/${ID + 1}`)}
                />
              </Tooltip>
              <Tooltip title={chapter?.type ? 'Meccan' : 'Medinan'}>
                <Appbar.Action
                  {...props}
                  icon={chapter?.type ? 'cube' : 'mosque'}
                />
              </Tooltip>
            </>
          ),
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={data}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <Page
            data={item}
            theme={theme}
            filterField="chapter"
            filterValue={ID}
            onMarkerPress={(id) => setVisible(true)}
          />
        )}
      />

      <View
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          padding: 8,
          position: 'absolute',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          display: !isFullscreen ? 'none' : undefined,
        }}
      >
        <Tooltip title="Exit fullscreen mode">
          <IconButton
            mode="contained"
            icon="fullscreen-exit"
            onPress={() => setIsFullscreen(!isFullscreen)}
          />
        </Tooltip>
      </View>

      <Modal
        theme={theme}
        title="Actions"
        modalProps={{
          visible,
          children: undefined,
          onDismiss: () => setVisible(false),
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
            title="Copy"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="content-copy" />}
            // right={(props) => <List.Icon {...props} icon="check" />}
          />
          <List.Item
            title="Share"
            onPress={() => {}}
            left={(props) => <List.Icon {...props} icon="share-variant" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <View style={{ padding: 16 }}>
          <Button mode="contained" onPress={() => setVisible(false)}>
            Close
          </Button>
        </View>
      </Modal>
    </Surface>
  )
}

export default ChapterDetails
