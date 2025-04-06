/**
 * App library
 */

import { TSettings } from './types/settings'

export * from '@/lib/types'
export * from '@/lib/ui'
export * from '@/lib/utils'

// Constants
const Constants = {
  font: {
    families: ['NotoKufiArabic_400Regular', 'Uthmanic', 'Indopak'],
    sizes: [
      { label: 'Small', value: 'bodyLarge', lineHeight: 32 },
      { label: 'Medium', value: 'titleLarge', lineHeight: 48 },
      { label: 'Large', value: 'headlineLarge', lineHeight: 56 },
    ],
  },
  languages: ['Arabic', 'English'],
  themes: ['Auto', 'Dark', 'Light'],
}

const DefaultSettings: TSettings = {
  font: {
    family: 'NotoKufiArabic_400Regular',
    size: { label: 'Small', value: 'bodyLarge' },
    lineHeight: 32,
  },
  language: 'English',
  theme: 'Auto',
}

export { Constants, DefaultSettings }
