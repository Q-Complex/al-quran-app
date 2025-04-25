/**
 * Setting types
 */

type TFontFamily = 'NotoKufiArabic_400Regular' | 'Uthmanic' | 'Indopak'
type TFontSize = {
  label: 'Small' | 'Medium' | 'Large'
  value: 'bodyLarge' | 'titleLarge' | 'headlineLarge'
  lineHeight?: number
}
type TLanguage = 'System' | 'Arabic' | 'English' | 'Turkish'
type TTheme = 'System' | 'Dark' | 'Light'

type TSettings = {
  font: {
    family: TFontFamily
    size: TFontSize
  }
  language: TLanguage
  theme: TTheme
}

export type { TFontFamily, TFontSize, TLanguage, TTheme, TSettings }
