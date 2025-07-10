/**
 * Text utilities
 */

import { Locales } from '../ui'

const formatQuarterLabel = (quarter: number) => {
  const group = Math.ceil(quarter / 4)
  const posInGroup = quarter % 4

  if (posInGroup === 0) {
    return `${Locales.t('group')} ${group}`
  }

  return `${Locales.t(posInGroup + '/4')} ${Locales.t('group')} ${group}`
}

export { formatQuarterLabel }
