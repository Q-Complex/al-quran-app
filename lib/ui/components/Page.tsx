import { SQLiteDatabase } from 'expo-sqlite'
import React from 'react'
import { View } from 'react-native'
import {
  Button,
  Card,
  Divider,
  Surface,
  Text,
  Tooltip,
} from 'react-native-paper'

import { Slug, TChapter, TCName, TPage, TSettings, TVerse } from '@/lib/types'

import { Locales } from '../locales'
import { toMarker } from '../../utils'
import { AppTheme } from '../styles'

/**
 * Page container
 * @param p properties
 * @returns React.ReactNode
 */
const Container = (p: {
  theme: AppTheme
  data: TCName & TPage
  children: React.ReactNode | React.ReactNode[]
  onNavButtonPress: (path: Slug, id: number) => void
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
          justifyContent: 'center',
        }}
      >
        <Tooltip title={Locales.t('pNum')}>
          <Button onPress={() => p.onNavButtonPress('pages', p.data.id)}>
            {p.data.id}
          </Button>
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
  theme: AppTheme
  settings: TSettings
  verses: TVerse[]
  onVerseLongPress: (v: TVerse) => void
}) => (
  <Text style={{ direction: 'rtl', paddingHorizontal: 8 }}>
    {props.verses.map((v) => (
      <Text
        key={v.id}
        variant={props.settings.font.size.value}
        onLongPress={() => props.onVerseLongPress(v)}
        style={{
          textAlign: 'center',
          fontFamily: props.settings.font.family,
          lineHeight: props.settings.font.size.lineHeight,
        }}
      >
        {v.number !== 1 ? (
          v.content + ' '
        ) : (
          <>
            <Text
              style={{
                textAlign: 'center',
                color: props.theme.colors.success,
                fontFamily: props.settings.font.family,
              }}
            >
              {v.content.slice(0, 39) + '\n'}
            </Text>
            {v.content.slice(39) + ' '}
          </>
        )}

        <Text style={{ fontFamily: 'Uthmanic' }}>
          {toMarker(v.number.toString()) + ' '}
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
  theme: AppTheme
  chapter: TChapter
  settings: TSettings
  onNavButtonPress: (path: Slug, id: number) => void
}) => (
  <Card
    mode="contained"
    style={{ marginHorizontal: 16 }}
    onPress={() => props.onNavButtonPress('chapters', props.chapter.id)}
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
        style={{ lineHeight: 32, textAlign: 'center' }}
      >{`سُورَةُ ${props.chapter.name}`}</Text>

      <Tooltip title={Locales.t('vCount')}>
        <Text variant="bodySmall">آياتها {props.chapter.verse_count}</Text>
      </Tooltip>
    </Card.Content>
  </Card>
)

const Page = (props: {
  path: Slug
  theme: AppTheme
  db: SQLiteDatabase
  settings: TSettings
  onVersePress: (v: TVerse) => void
  data: TCName & TPage & { verses: TVerse[] }
  onNavButtonPress: (path: Slug, id: number) => void
}) => {
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
      <Container
        theme={props.theme}
        data={props.data}
        onNavButtonPress={props.onNavButtonPress}
      >
        {chapter && (
          <Header
            chapter={chapter}
            theme={props.theme}
            settings={props.settings}
            onNavButtonPress={props.onNavButtonPress}
          />
        )}

        <Text style={{ direction: 'rtl', paddingHorizontal: 16 }}>
          <Content
            theme={props.theme}
            settings={props.settings}
            verses={props.data.verses}
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
    <Container {...props}>
      {chapters.map((c) => (
        <View key={c.id} style={{ gap: 16 }}>
          {/* Check if the chapter verses includes 1st verse */}
          {c.verses.find((v) => v.number === 1) && (
            <Header
              chapter={c}
              theme={props.theme}
              settings={props.settings}
              onNavButtonPress={props.onNavButtonPress}
            />
          )}

          <Content
            verses={c.verses}
            theme={props.theme}
            settings={props.settings}
            onVerseLongPress={(v: TVerse) => props.onVersePress(v)}
          />
        </View>
      ))}
    </Container>
  )
}

export default Page
