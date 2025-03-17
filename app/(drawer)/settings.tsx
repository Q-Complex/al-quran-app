import React from 'react'
import { View } from 'react-native'
import {
  Button,
  List,
  ProgressBar,
  Surface,
  Switch,
  useTheme,
} from 'react-native-paper'

import { Modal } from '@/lib'

const Constants = {
  fonts: ['uthmani', 'indopak'],
  languages: ['arabic', 'english'],
  themes: ['auto', 'dark', 'light'],
  sizes: ['bodyLarge', 'titleLarge', 'headlineLarge'],
}
type TFont = 'Uthmani' | 'Indopak'
type TLanguage = 'arabic' | 'english'
type TTheme = 'auto' | 'dark' | 'light'
type TSize = 'bodyLarge' | 'titleLarge' | 'headlineLarge'

type TSettings = {
  display: boolean
  content: 'theme' | 'language' | 'font' | 'size'
  values: {
    font: TFont
    language: TLanguage
    theme: TTheme
    size: TSize
    translations: boolean
    transliterations: boolean
  }
}

const Settings = () => {
  const theme = useTheme()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [settings, setSettings] = React.useState<TSettings>({
    display: false,
    content: 'font',
    values: {
      font: 'Indopak',
      language: 'english',
      size: 'bodyLarge',
      theme: 'auto',
      translations: false,
      transliterations: false,
    },
  })

  React.useEffect(() => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  const title =
    settings.content === 'font'
      ? 'Font'
      : settings.content === 'language'
        ? 'App language'
        : settings.content === 'size'
          ? 'Font size'
          : settings.content === 'theme'
            ? 'Theme'
            : 'Title'

  const ModalContent = () =>
    settings.content === 'font'
      ? Constants.fonts.map((f) => (
          <List.Item
            key={f}
            title={f[0].toUpperCase() + f.slice(1)}
            onPress={() =>
              setSettings({
                ...settings,
                values: { ...settings.values, font: f as TFont },
              })
            }
            titleStyle={{
              color:
                settings.values.font === f
                  ? theme.colors.primary
                  : theme.colors.onBackground,
            }}
            left={(props) => (
              <List.Icon
                {...props}
                color={
                  settings.values.font === f
                    ? theme.colors.primary
                    : props.color
                }
                icon={
                  settings.values.font === f
                    ? 'checkbox-marked-circle'
                    : 'checkbox-blank-circle-outline'
                }
              />
            )}
          />
        ))
      : settings.content === 'language'
        ? Constants.languages.map((l) => (
            <List.Item
              key={l}
              title={l[0].toUpperCase() + l.slice(1)}
              onPress={() =>
                setSettings({
                  ...settings,
                  values: {
                    ...settings.values,
                    language: l as TLanguage,
                  },
                })
              }
              titleStyle={{
                color:
                  settings.values.language === l
                    ? theme.colors.primary
                    : theme.colors.onBackground,
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color={
                    settings.values.language === l
                      ? theme.colors.primary
                      : props.color
                  }
                  icon={
                    settings.values.language === l
                      ? 'checkbox-marked-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                />
              )}
              right={(props) => (
                <List.Icon
                  {...props}
                  icon={l === 'arabic' ? 'abjad-arabic' : 'alphabet-latin'}
                />
              )}
            />
          ))
        : settings.content === 'size'
          ? Constants.sizes.map((s) => (
              <List.Item
                key={s}
                title={s[0].toUpperCase() + s.slice(1)}
                onPress={() =>
                  setSettings({
                    ...settings,
                    values: { ...settings.values, size: s as TSize },
                  })
                }
                titleStyle={{
                  color:
                    settings.values.size === s
                      ? theme.colors.primary
                      : theme.colors.onBackground,
                }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={
                      settings.values.size === s
                        ? theme.colors.primary
                        : props.color
                    }
                    icon={
                      settings.values.size === s
                        ? 'checkbox-marked-circle'
                        : 'checkbox-blank-circle-outline'
                    }
                  />
                )}
              />
            ))
          : settings.content === 'theme'
            ? Constants.themes.map((t) => (
                <List.Item
                  key={t}
                  title={t[0].toUpperCase() + t.slice(1)}
                  onPress={() =>
                    setSettings({
                      ...settings,
                      values: { ...settings.values, theme: t as TTheme },
                    })
                  }
                  titleStyle={{
                    color:
                      settings.values.theme === t
                        ? theme.colors.primary
                        : theme.colors.onBackground,
                  }}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      color={
                        settings.values.theme === t
                          ? theme.colors.primary
                          : props.color
                      }
                      icon={
                        settings.values.theme === t
                          ? 'checkbox-marked-circle'
                          : 'checkbox-blank-circle-outline'
                      }
                    />
                  )}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      icon={
                        t === 'auto'
                          ? 'cellphone'
                          : t === 'dark'
                            ? 'weather-night'
                            : 'white-balance-sunny'
                      }
                    />
                  )}
                />
              ))
            : undefined

  return (
    <Surface style={{ flex: 1 }}>
      <ProgressBar indeterminate={loading} />

      <List.AccordionGroup>
        <List.Accordion
          id={1}
          title="Appearance"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
        >
          <List.Item
            title="Language"
            description="App language"
            onPress={() => {
              setSettings({
                ...settings,
                content: 'language',
                display: !settings.display,
              })
            }}
            left={(props) => (
              <List.Icon
                {...props}
                icon={
                  settings.values.language === 'arabic'
                    ? 'abjad-arabic'
                    : 'alphabet-latin'
                }
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Theme"
            description="App theme"
            onPress={() => {
              setSettings({
                ...settings,
                content: 'theme',
                display: !settings.display,
              })
            }}
            left={(props) => (
              <List.Icon
                {...props}
                icon={
                  settings.values.theme === 'auto'
                    ? 'cellphone'
                    : settings.values.theme === 'dark'
                      ? 'weather-night'
                      : 'white-balance-sunny'
                }
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Accordion>

        <List.Accordion
          id={2}
          title="Quran"
          left={(props) => <List.Icon {...props} icon="abjad-arabic" />}
        >
          <List.Item
            title="Font"
            description="Quran Font"
            onPress={() =>
              setSettings({
                ...settings,
                content: 'font',
                display: !settings.display,
              })
            }
            left={(props) => <List.Icon {...props} icon="format-font" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Font size"
            description="Font size"
            onPress={() =>
              setSettings({
                ...settings,
                content: 'size',
                display: !settings.display,
              })
            }
            left={(props) => (
              <List.Icon {...props} icon="format-font-size-increase" />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Translation"
            description="Show Quran translations"
            onPress={() =>
              setSettings({
                ...settings,
                values: {
                  ...settings.values,
                  translations: !settings.values.translations,
                },
              })
            }
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => (
              <Switch
                {...props}
                value={settings.values.translations}
                color={
                  settings.values.translations
                    ? theme.colors.primary
                    : undefined
                }
                onValueChange={() =>
                  setSettings({
                    ...settings,
                    values: {
                      ...settings.values,
                      translations: !settings.values.translations,
                    },
                  })
                }
              />
            )}
          />
          <List.Item
            title="Transliteration"
            description="Show Quran transliterations"
            onPress={() =>
              setSettings({
                ...settings,
                values: {
                  ...settings.values,
                  transliterations: !settings.values.transliterations,
                },
              })
            }
            left={(props) => <List.Icon {...props} icon="alphabet-latin" />}
            right={(props) => (
              <Switch
                {...props}
                value={settings.values.transliterations}
                color={
                  settings.values.transliterations
                    ? theme.colors.primary
                    : undefined
                }
                onValueChange={() =>
                  setSettings({
                    ...settings,
                    values: {
                      ...settings.values,
                      transliterations: !settings.values.transliterations,
                    },
                  })
                }
              />
            )}
          />
        </List.Accordion>
      </List.AccordionGroup>

      <View style={{ padding: 16 }}>
        <Button
          icon="check"
          mode="contained"
          loading={loading}
          onPress={() => {}}
        >
          Save
        </Button>
      </View>

      <Modal
        theme={theme}
        title={title}
        modalProps={{
          children: undefined,
          visible: settings.display,
          onDismiss: () => setSettings({ ...settings, display: false }),
        }}
      >
        <List.Section>
          <ModalContent />
        </List.Section>

        <View style={{ gap: 16, padding: 16 }}>
          <Button
            mode="contained"
            onPress={() => setSettings({ ...settings, display: false })}
          >
            Done
          </Button>
        </View>
      </Modal>
    </Surface>
  )
}

export default Settings
