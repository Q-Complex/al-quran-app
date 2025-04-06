import { SQLiteDatabase } from 'expo-sqlite'

import {
  Slug,
  TChapter,
  TGroup,
  TPage,
  TPart,
  TQuarter,
  TVerse,
  V,
} from '@/lib'

const Database = {
  query: async (
    table: Slug,
    db: SQLiteDatabase,
    search?: string,
  ): Promise<
    | TChapter[]
    | (TPart & V)[]
    | (TGroup & V)[]
    | (TQuarter & V)[]
    | (TPage & V)[]
  > => {
    // No need to join the tables
    if (table === 'chapters') {
      let statement = 'SELECT * FROM "chapters"'

      if (search) {
        statement = `
        SELECT * FROM (SELECT *,
          REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("name", 'ۜ', ''), 'ۥ', ''), 'ۦ', ''), 'ۚ', ''), 'ٍ', ''), 'ٌ', ''), 'ً', ''), 'ۢ', ''), '۟', ''), 'ۗ', ''), 'ۖ', ''), 'ۭ', ''), 'ۛ', ''), 'ٱ', 'ا'), 'ٰ', ''), 'ٓ', ''), 'ّ', ''), 'ْ', ''), 'ِ', ''), 'ُ', ''), 'َ', '') as "unaccent_name"
        FROM "chapters") WHERE "unaccent_name" LIKE '%${search}%'`
      }

      return await db.getAllAsync<TChapter>(statement)
    }

    const groupByField = table.slice(0, table.length - 1).concat('_id')
    const statement = `
      SELECT
        "${table}"."id",
        "${table}"."name",
        "verses"."chapter_id" as "verse_c_id",
        "verses"."number" as "verse_number",
        substr("verses"."content", 0, 50) as "verse_content"
      FROM "${table}"
        INNER JOIN "verses" ON ("${table}"."id" = "verses"."${groupByField}")
      GROUP BY "verses"."${groupByField}";`

    switch (table) {
      case 'parts':
        return await db.getAllAsync<TPart & V>(statement)

      case 'groups':
        return await db.getAllAsync<TGroup & V>(statement)

      case 'quarters':
        return await db.getAllAsync<TQuarter & V>(statement)

      case 'pages':
        return await db.getAllAsync<TPage & V>(statement)
    }
  },
  extract: async (
    db: SQLiteDatabase,
    id: number,
    table: 'chapters' | 'parts' | 'groups' | 'quarters' | 'pages',
  ): Promise<[TPage[], TVerse[]]> => {
    const data = await db.getAllAsync<
      TPage & {
        verse_id: number
        verse_number: number
        verse_c_id: number
        verse_p_id: number
        verse_content: string
      }
    >(
      `SELECT
        "pages"."id",
        "pages"."chapter_id",
        "pages"."part_id",
        "pages"."group_id",
        "pages"."quarter_id",
        "pages"."name",
        "pages"."verse_count",
        "verses"."id" as "verse_id",
        "verses"."chapter_id" as "verse_c_id",
        "verses"."page_id" as "verse_p_id",
        "verses"."number" as "verse_number",
        "verses"."content" as "verse_content"
      FROM "pages" 
        INNER JOIN "verses" ON ("pages"."id" = "verses"."page_id")
      WHERE "verses"."${table.slice(0, table.length - 1)}_id" = ?;`,
      id,
    )

    const rawPages = [
      ...data.map((i) => {
        return {
          id: i.id,
          name: i.name,
          chapter_id: i.chapter_id,
          part_id: i.part_id,
          group_id: i.group_id,
          quarter_id: i.quarter_id,
          verse_count: i.verse_count,
        } as TPage
      }),
    ]

    const pages: TPage[] = []
    for (const page of rawPages) {
      if (![...pages.map((i) => i.id)].includes(page.id)) {
        pages.push(page)
      }
    }

    return [
      pages,
      [
        ...data.map((i) => {
          return {
            id: i.verse_id,
            number: i.verse_number,
            content: i.verse_content,
            chapter_id: i.verse_c_id,
            page_id: i.verse_p_id,
          } as TVerse
        }),
      ],
    ]
  },
  search: async (db: SQLiteDatabase, query: string): Promise<TVerse[]> =>
    await db.getAllAsync<TVerse>(
      `SELECT
        "id",
        "number",
        "chapter_id",
        "page_id",
        SUBSTR("content", 0, 60) as "content"
      FROM (
        SELECT *,
          REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("content", 'ۜ', ''), 'ۥ', ''), 'ۦ', ''), 'ۚ', ''), 'ٍ', ''), 'ٌ', ''), 'ً', ''), 'ۢ', ''), '۟', ''), 'ۗ', ''), 'ۖ', ''), 'ۭ', ''), 'ۛ', ''), 'ٱ', 'ا'), 'ٰ', ''), 'ٓ', ''), 'ّ', ''), 'ْ', ''), 'ِ', ''), 'ُ', ''), 'َ', '') as "unaccent_content"
        FROM "verses"
      )
      WHERE "unaccent_content" LIKE '%${query}%'`,
    ),
  count: (table: Slug) =>
    table === 'chapters'
      ? 114
      : table === 'parts'
        ? 30
        : table === 'groups'
          ? 60
          : table === 'quarters'
            ? 240
            : 604,
}

const Numbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

const toMarker = (verseNumber: string) => {
  return verseNumber
    .split('')
    .map((i) => Numbers[parseInt(i, 10)])
    .reduce((prv, cur) => prv + cur)
}

export { Database, toMarker }
