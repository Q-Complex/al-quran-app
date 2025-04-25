/**
 * App translations for Al Quran
 */

import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import { Ar } from './ar'
import { En } from './en'
import { Tr } from './tr'

const Locales = new I18n({ ar: Ar, en: En, tr: Tr })

Locales.locale = getLocales()[0].languageCode ?? 'en'
Locales.enableFallback = true

export { Locales }
