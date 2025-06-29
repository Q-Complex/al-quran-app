/**
 * Setting Context
 */

import React from 'react'

import { DefaultSettings } from './constants'
import { TSettings } from './types'

const AppSettings = React.createContext<{
  settings: TSettings
  onChange: (v: TSettings) => void
}>({ settings: DefaultSettings, onChange: () => {} })

export { AppSettings as QSettings }
