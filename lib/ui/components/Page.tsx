import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { View } from 'react-native'
import {
  Card,
  Chip,
  MD3Theme,
  Surface,
  Text,
  Tooltip,
} from 'react-native-paper'

import { TPage, TVerse } from '@/lib/types'

const Page = (props: {
  data: TPage
  theme: MD3Theme
  filterValue?: number
  filterField?: 'chapter' | 'part' | 'group' | 'quarter'
  onMarkerPress: (id: number) => void
}) => {
  const db = useSQLiteContext()
  const [verses, setVerses] = React.useState<TVerse[]>([])

  // Data verses
  React.useEffect(() => {
    ;(async () => {
      const args = [props.data.id]
      let query = 'SELECT * FROM "verses" WHERE "page_id" = ?'

      if (props.filterField && props.filterValue) {
        args.push(props.filterValue)
        query += ` AND "${props.filterField}_id" = ?`
      }

      setVerses(await db.getAllAsync<TVerse>(query, args))
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toMarker = (verseNumber: string) => {
    const Numbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return verseNumber
      .split('')
      .map((i) => Numbers[parseInt(i, 10)])
      .reduce((prv, cur) => prv + cur)
  }

  return (
    <View style={{ gap: 16, marginBottom: 16 }}>
      <Surface
        elevation={0}
        style={{
          padding: 2,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          backgroundColor: props.theme.colors.surface,
        }}
      >
        <Text variant="bodySmall">Chapter {props.data.chapter_id}</Text>

        <Text variant="bodySmall">Part {props.data.part_id}</Text>
      </Surface>

      <View style={{ gap: 16, paddingHorizontal: 16 }}>
        <Text style={{ direction: 'rtl' }}>
          {verses.map((v) => (
            <Text key={v.id} variant="titleLarge">
              {v.number === 1 ? (
                <>
                  {'\n'}
                  <Card mode="outlined" style={{ width: '100%' }}>
                    <Card.Content
                      style={{
                        gap: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Chip>Chapter {props.data.chapter_id}</Chip>
                    </Card.Content>
                  </Card>
                  {'\n'}
                </>
              ) : undefined}
              <Text style={{ lineHeight: 40 }}>
                <Text
                  variant="titleLarge"
                  style={{
                    fontFamily: 'AmiriQuran_400Regular',
                    lineHeight: 40,
                  }}
                >
                  {v.content}
                </Text>{' '}
                <Text
                  variant="headlineSmall"
                  onPress={() => props.onMarkerPress(v.id)}
                  style={{
                    color: props.theme.colors.primary,
                    fontFamily: 'AmiriQuran_400Regular',
                    lineHeight: 40,
                  }}
                >
                  {toMarker(v.number.toString())}
                </Text>{' '}
              </Text>
            </Text>
          ))}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text variant="bodySmall">Group {props.data.group_id}</Text>

          <Tooltip title="Page number">
            <Chip>{props.data.id}</Chip>
          </Tooltip>

          <Text variant="bodySmall">Quarter {props.data.quarter_id}</Text>
        </View>
      </View>
    </View>
  )
}

export default Page
