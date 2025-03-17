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

import { Modal, Page, TPage, TParams } from '@/lib'

const Details = () => {
  const theme = useTheme()
  const db = useSQLiteContext()
  const [data, setData] = React.useState<TPage[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(false)
  const { id, type } = useLocalSearchParams<{ id: string; type: TParams }>()
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)

  const ID = parseInt(id, 10)
  const count =
    type === 'parts'
      ? 30
      : type === 'groups'
        ? 60
        : type === 'quarters'
          ? 240
          : 604
  const filterField =
    type === 'parts'
      ? 'part'
      : type === 'groups'
        ? 'group'
        : type === 'quarters'
          ? 'quarter'
          : undefined

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      switch (type) {
        case 'parts':
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
              WHERE "verses"."part_id" = ?;`,
              ID,
            ),
          )
          break

        case 'groups':
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
              WHERE "verses"."group_id" = ?;`,
              ID,
            ),
          )
          break

        case 'quarters':
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
              WHERE "verses"."quarter_id" = ?;`,
              ID,
            ),
          )
          break

        case 'pages':
          setData(
            await db.getAllAsync<TPage>(
              'SELECT * FROM "pages" WHERE "id" = ?',
              ID,
            ),
          )
          break
      }

      setLoading(false)
    })()
  }, [ID, db, type])

  return (
    <Surface
      style={{
        flex: 1,
        paddingTop: isFullscreen ? Constants.statusBarHeight : undefined,
      }}
    >
      <Stack.Screen
        options={{
          title:
            type[0].toUpperCase() + type.slice(1, type.length - 1) + ' ' + id,
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
                  onPress={() => router.replace(`/${type}/${ID - 1}`)}
                />
              </Tooltip>
              <Tooltip title="Next">
                <Appbar.Action
                  {...props}
                  icon="chevron-right"
                  disabled={ID === count}
                  onPress={() => router.replace(`/${type}/${ID + 1}`)}
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
            filterField={filterField}
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

export default Details
