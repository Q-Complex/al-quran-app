/**
 * Quran data types
 */

type TChapter = {
  id: number
  name: string
  order: number
  type: boolean
  verse_count: number
  page_count: number
}

type TPart = {
  id: number
  name: string
  verse_count: number
  page_count: number
}

type TGroup = {
  id: number
  name: string
  verse_count: number
  page_count: number
  part_id: number
}

type TQuarter = {
  id: number
  name: string
  verse_count: number
  page_count: number
  part_id: number
  group_id: number
}

type TPage = {
  id: number
  name: string
  verse_count: number
  part_id: number
  group_id: number
  chapter_id: number
  quarter_id: number
}

type TVerse = {
  id: number
  number: number
  content: string
  page_id: number
  part_id: number
  group_id: number
  chapter_id: number
  quarter_id: number
}

type TParams = 'parts' | 'groups' | 'quarters' | 'pages'

type TFilters = {
  value?: string
  display: boolean
  ordering: boolean
  operator?: '=' | '>' | '<'
  field: 'id' | 'order' | 'type' | 'verse_count' | 'page_count'
}

export { TChapter, TFilters, TPart, TGroup, TQuarter, TPage, TParams, TVerse }
