import { TParams } from '@/lib/types'

const buildQuery = (table: 'chapters' | 'other', params?: TParams) => {
  let query = 'SELECT * FROM'

  if (table === 'chapters') {
    query += ' "chapters"'
  } else {
    switch (params) {
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
  }

  return query
}

export { buildQuery }
