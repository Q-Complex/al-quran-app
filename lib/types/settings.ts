/**
 * Setting types
 */

type TFontFamily = 'NotoKufiArabic_400Regular' | 'Uthmanic' | 'Indopak'
type TFontSize = {
  label: 'Small' | 'Medium' | 'Large'
  value: 'bodyLarge' | 'titleLarge' | 'headlineLarge'
  lineHeight?: number
}
type TLanguage = 'Arabic' | 'English'
type TTheme = 'Auto' | 'Dark' | 'Light'

type TSettings = {
  font: {
    family: TFontFamily
    size: TFontSize
    lineHeight: number
  }
  language: TLanguage
  theme: TTheme
}

export type { TFontFamily, TFontSize, TLanguage, TTheme, TSettings }
