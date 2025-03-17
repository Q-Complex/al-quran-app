import { AnimatedFlashList } from '@shopify/flash-list'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { Chip, List, ProgressBar, Surface, Tooltip } from 'react-native-paper'

import { TGroup, TPage, TParams, TPart, TQuarter, TVerse } from '@/lib/types'

const ListHome = () => {
  const db = useSQLiteContext()
  const { type } = useLocalSearchParams<{ type: TParams }>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [data, setData] = React.useState<
    TPart[] | TGroup[] | TQuarter[] | TPage[] | TVerse[]
  >([])

  const buildQuery = (type: TParams) => {
    let query = 'SELECT * FROM '

    switch (type) {
      case 'parts':
        query += '"parts"'
        break

      case 'groups':
        query += '"groups"'
        break

      case 'quarters':
        query += '"quarters"'
        break

      case 'pages':
        query += '"pages"'
        break
    }

    return query
  }

  // Data loading
  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      setData(await db.getAllAsync<TPart | TGroup | TQuarter>(buildQuery(type)))

      setLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const count =
    type === 'parts'
      ? 30
      : type === 'groups'
        ? 60
        : type === 'quarters'
          ? 240
          : 604

  return (
    <Surface style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: type[0].toUpperCase() + type.slice(1) + ` (${count})`,
        }}
      />

      <ProgressBar indeterminate={loading} />

      <AnimatedFlashList
        data={data}
        estimatedItemSize={100}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        renderItem={({ item }) => {
          let description = ''

          switch (type) {
            case 'parts':
              description += `${item.page_count} pages, ${item.verse_count} verses`
              break

            case 'groups':
              description += `Part ${item.part_id}`
              break

            case 'quarters':
              description += `, Group ${item.group_id}`
              break

            case 'pages':
              description += `C ${item.chapter_id}, P ${item.part_id}, G ${item.group_id}, Q ${item.quarter_id}`
              break
          }

          return (
            <List.Item
              title={item.name}
              description={description}
              onPress={() => router.push(`/${type}/${item.id}`)}
              left={(props) => (
                <Tooltip
                  title={`${type !== 'pages' ? item.page_count + ' pages,' : ''} ${item.verse_count} verses`}
                >
                  <Chip {...props}>{item.id}</Chip>
                </Tooltip>
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          )
        }}
      />
    </Surface>
  )
}

export default ListHome
