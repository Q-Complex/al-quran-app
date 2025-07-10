import { SQLiteDatabase } from 'expo-sqlite'
import React from 'react'
import { View } from 'react-native'
import {
  Button,
  Card,
  Divider,
  MD3Theme,
  Surface,
  Text,
  Tooltip,
} from 'react-native-paper'

import {
  Slug,
  TChapter,
  TCName,
  TFontFamily,
  TFontSize,
  TPage,
  TVerse,
} from '@/lib/types'

import { Locales } from '../locales'
import { AppSettings } from '@/lib/context'
import { toMarker } from '../../utils'

const formatQuarterLabel = (quarter: number) => {
  const group = Math.ceil(quarter / 4)
  const posInGroup = quarter % 4

  if (posInGroup === 0) {
    return `${Locales.t('group')} ${group}`
  }

  return `${Locales.t(posInGroup + '/4')} ${Locales.t('group')} ${group}`
}

/**
 * Page container
 * @param p properties
 * @returns React.ReactNode
 */
const Container = (p: {
  data: TCName & TPage
  onNavButtonPress: (path: Slug, id: number) => void
  children: React.ReactNode | React.ReactNode[]
}) => (
  <Surface elevation={0} style={{ gap: 16 }}>
    <View
      style={{
        paddingTop: 8,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
      }}
    >
      <Tooltip title={Locales.t('read')}>
        <Text
          variant="bodySmall"
          style={{ lineHeight: 20 }}
          onPress={() => p.onNavButtonPress('chapters', p.data.chapter_id)}
        >
          سُورَةُ {p.data.chapter_name}
        </Text>
      </Tooltip>

      <Tooltip title={Locales.t('read')}>
        <Text
          variant="bodySmall"
          onPress={() => p.onNavButtonPress('parts', p.data.part_id)}
        >
          {Locales.t('part')} {p.data.part_id}
        </Text>
      </Tooltip>
    </View>

    <View style={{ gap: 8 }}>
      {p.children}

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Tooltip title={Locales.t('read')}>
          <Text
            variant="bodySmall"
            onPress={() => p.onNavButtonPress('groups', p.data.group_id)}
          >
            {Locales.t('group')} {p.data.group_id}
          </Text>
        </Tooltip>

        <Tooltip title={Locales.t('pNum')}>
          <Button onPress={() => p.onNavButtonPress('pages', p.data.id)}>
            {p.data.id}
          </Button>
        </Tooltip>

        <Tooltip title={Locales.t('read')}>
          <Text
            variant="bodySmall"
            onPress={() => p.onNavButtonPress('quarters', p.data.quarter_id)}
          >
            {formatQuarterLabel(p.data.quarter_id)}
          </Text>
        </Tooltip>
      </View>

      <Divider bold />
    </View>
  </Surface>
)

/**
 * Page verses
 * @param props properties
 * @returns React.ReactNode
 */
const Content = (props: {
  color: string
  font: { family: TFontFamily; size: TFontSize }
  verses: TVerse[]
  onVerseLongPress: (v: TVerse) => void
}) => (
  <Text style={{ direction: 'rtl', paddingHorizontal: 16 }}>
    {props.verses.map((v) => (
      <Text
        key={v.id}
        variant={props.font.size.value}
        onLongPress={() => props.onVerseLongPress(v)}
        style={{
          textAlign: 'center',
          fontFamily: props.font.family,
          lineHeight: props.font.size.lineHeight,
        }}
      >
        {v.number !== 1 ? (
          v.content + ' '
        ) : (
          <>
            <Text
              style={{
                textAlign: 'center',
                color: props.color,
                fontFamily: props.font.family,
              }}
            >
              {v.content.slice(0, 39) + '\n'}
            </Text>
            {v.content.slice(39) + ' '}
          </>
        )}

        <Text
          style={{
            color: props.color,
            fontFamily: props.font.family,
          }}
        >
          {(props.font.family === 'Uthmanic'
            ? toMarker(v.number.toString())
            : v.number) + ' '}
        </Text>
      </Text>
    ))}
  </Text>
)

/**
 * Chapter header
 * @param props properties
 * @returns React.ReactNode
 */
const Header = (props: {
  color: string
  chapter: TChapter
  font: TFontFamily
  onBavButtonPress: (path: Slug, id: number) => void
}) => (
  <Card
    mode="outlined"
    style={{ marginHorizontal: 16 }}
    onPress={() => props.onBavButtonPress('chapters', props.chapter.id)}
  >
    <Card.Content
      style={{
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Tooltip title={Locales.t('chapter')}>
        <Text variant="bodySmall">ترتيبها {props.chapter.id}</Text>
      </Tooltip>

      <Text
        variant="bodyLarge"
        style={{
          textAlign: 'center',
          lineHeight: 32,
          color: props.color,
          fontFamily: props.font,
        }}
      >{`سُورَةُ ${props.chapter.name}`}</Text>

      <Tooltip title={Locales.t('vCount')}>
        <Text variant="bodySmall">آيلتها {props.chapter.verse_count}</Text>
      </Tooltip>
    </Card.Content>
  </Card>
)

const Page = (props: {
  db: SQLiteDatabase
  path: Slug
  data: TCName & TPage & { verses: TVerse[] }
  theme: MD3Theme
  onVersePress: (v: TVerse) => void
  onNavButtonPress: (path: Slug, id: number) => void
}) => {
  const { settings } = React.useContext(AppSettings)
  const firstVerse = props.data.verses[0]

  // There is only one chapter
  if (props.path === 'chapters') {
    let chapter = undefined

    if (firstVerse.number === 1) {
      chapter = props.db.getFirstSync<TChapter>(
        'SELECT * FROM "chapters" WHERE "id" = ?',
        firstVerse.chapter_id,
      )!
    }

    return (
      <Container data={props.data} onNavButtonPress={props.onNavButtonPress}>
        {chapter && (
          <Header
            chapter={chapter}
            font={settings.font.family}
            color={props.theme.colors.primary}
            onBavButtonPress={props.onNavButtonPress}
          />
        )}

        <Text style={{ direction: 'rtl', paddingHorizontal: 16 }}>
          <Content
            verses={props.data.verses}
            font={settings.font}
            color={props.theme.colors.primary}
            onVerseLongPress={(v: TVerse) => props.onVersePress(v)}
          />
        </Text>
      </Container>
    )
  }

  // There is one or more chapters, we need to extract them
  const chapters: (TChapter & { verses: TVerse[] })[] = []
  for (const v of props.data.verses) {
    if (chapters.map((i) => i.id).includes(v.chapter_id)) {
      chapters.find((c) => c.id === v.chapter_id)?.verses.push(v)
      continue
    }

    const chapter = props.db.getFirstSync<TChapter>(
      'SELECT * FROM "chapters" WHERE "id" = ?',
      v.chapter_id,
    )!

    chapters.push({ ...chapter, verses: [v] })
  }

  return (
    <Container data={props.data} onNavButtonPress={props.onNavButtonPress}>
      {chapters.map((c) => (
        <View key={c.id} style={{ gap: 16 }}>
          {/* Check if the chapter verses includes 1st verse */}
          {c.verses.find((v) => v.number === 1) && (
            <Header
              chapter={c}
              font={settings.font.family}
              color={props.theme.colors.primary}
              onBavButtonPress={props.onNavButtonPress}
            />
          )}

          <Content
            verses={c.verses}
            font={settings.font}
            color={props.theme.colors.primary}
            onVerseLongPress={(v: TVerse) => props.onVersePress(v)}
          />
        </View>
      ))}
    </Container>
  )
}

export default Page
