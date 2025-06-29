import { SQLiteDatabase } from 'expo-sqlite'

import {
  Slug,
  TChapter,
  TCName,
  TGroup,
  TItem,
  TPage,
  TPart,
  TQuarter,
  TVerse,
  V,
} from '@/lib'

type FullPage = TCName & TPage & { verses: TVerse[] }

const Database = {
  query: async (
    table: Slug,
    db: SQLiteDatabase,
    search?: string,
  ): Promise<(TItem & V)[]> => {
    // No need to join the tables
    if (table === 'chapters') {
      let statement = 'SELECT * FROM "chapters"'

      if (search) {
        statement = `
        SELECT * FROM (SELECT *,
          REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("name", 'ۜ', ''), 'ۥ', ''), 'ۦ', ''), 'ۚ', ''), 'ٍ', ''), 'ٌ', ''), 'ً', ''), 'ۢ', ''), '۟', ''), 'ۗ', ''), 'ۖ', ''), 'ۭ', ''), 'ۛ', ''), 'ٱ', 'ا'), 'ٰ', ''), 'ٓ', ''), 'ّ', ''), 'ْ', ''), 'ِ', ''), 'ُ', ''), 'َ', '') as "unaccent_name"
        FROM "chapters") WHERE "unaccent_name" LIKE '%${search}%'`
      }

      return await db.getAllAsync<TChapter & V>(statement)
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
  ): Promise<FullPage[]> => {
    const data = await db.getAllAsync<
      TCName &
        TPage & {
          verse_id: number
          verse_number: number
          verse_c_id: number
          verse_p_id: number
          verse_content: string
        }
    >(
      `SELECT
        "chapters"."name" as "chapter_name",
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
        REPLACE(REPLACE("verses"."content", 'ا۟', 'اْ'), 'و۟', 'وْ') as "verse_content"
      FROM
        "chapters"
        INNER JOIN "pages" ON ("chapters"."id" = "pages"."chapter_id")
        INNER JOIN "verses" ON ("pages"."id" = "verses"."page_id")
      WHERE
        "verses"."${table.slice(0, table.length - 1)}_id" = ?;`,
      id,
    )

    const results: FullPage[] = []
    for (const row of data) {
      if (results.map((p) => p.id).includes(row.id)) {
        results
          .find((p) => p.id === row.id)
          ?.verses.push({
            id: row.verse_id,
            chapter_id: row.verse_c_id,
            content: row.verse_content,
            number: row.verse_number,
            page_id: row.verse_p_id,
            group_id: 0,
            part_id: 0,
            quarter_id: 0,
          })

        continue
      }

      results.push({
        id: row.id,
        name: row.name,
        chapter_id: row.chapter_id,
        chapter_name: row.chapter_name,
        group_id: row.group_id,
        part_id: row.part_id,
        quarter_id: row.quarter_id,
        verse_count: row.verse_count,
        verses: [
          {
            id: row.verse_id,
            chapter_id: row.verse_c_id,
            content: row.verse_content,
            number: row.verse_number,
            page_id: row.verse_p_id,
            group_id: 0,
            part_id: 0,
            quarter_id: 0,
          },
        ],
      })
    }

    return results
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
