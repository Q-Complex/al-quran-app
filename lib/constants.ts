/**
 * Constants
 */

import { TFontFamily, TFontSize, TSettings } from './types'

const Constants = {
  font: {
    families: ['NotoKufiArabic_400Regular', 'Uthmanic', 'Indopak'],
    sizes: [
      { label: 'Small', value: 'bodyLarge', lineHeight: 38 },
      { label: 'Medium', value: 'titleLarge', lineHeight: 48 },
      { label: 'Large', value: 'headlineLarge', lineHeight: 64 },
    ],
  },
  languages: ['System', 'Arabic', 'English', 'Turkish'],
  themes: ['System', 'Dark', 'Light'],
}

const DefaultSettings: TSettings = {
  font: {
    family: Constants.font.families[0] as TFontFamily,
    size: Constants.font.sizes[0] as TFontSize,
  },
  language: 'System',
  theme: 'System',
}

export { Constants, DefaultSettings }
