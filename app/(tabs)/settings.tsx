import { Storage } from 'expo-sqlite/kv-store'
import React from 'react'
import { View } from 'react-native'
import {
  Button,
  List,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

import {
  Constants,
  DefaultSettings,
  Locales,
  Modal,
  QSettings,
  TFontFamily,
  TFontSize,
  TLanguage,
  TSettings,
  TTheme,
} from '@/lib'

const Settings = () => {
  const theme = useTheme()
  const [reload, setReload] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [content, setContent] = React.useState('font')
  const [settings, setSettings] = React.useState<TSettings>(DefaultSettings)
  const { onChange } = React.useContext(QSettings)

  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      if (!reload) {
        await Storage.getItemAsync('settings')
          .then((data) => (data ? setSettings(JSON.parse(data)) : {}))
          .catch((err) => console.error(err))
      } else {
        setTimeout(() => {}, 500)
      }
      setLoading(false)
    })()
  }, [reload])

  const showModal = (content: string) => {
    setContent(content)
    setVisible(true)
  }

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <ProgressBar indeterminate={loading} />

      <List.AccordionGroup>
        <List.Accordion
          id={1}
          title={Locales.t('appearance')}
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
        >
          <List.Item
            title={Locales.t('language')}
            description={Locales.t(settings.language)}
            onPress={() => showModal('language')}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title={Locales.t('theme')}
            description={Locales.t(settings.theme)}
            onPress={() => showModal('theme')}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Accordion>

        <List.Accordion
          id={2}
          title={Locales.t('quran')}
          left={(props) => <List.Icon {...props} icon="abjad-arabic" />}
        >
          <List.Item
            title={Locales.t('font')}
            description={Locales.t(settings.font.family)}
            onPress={() => showModal('font')}
            left={(props) => <List.Icon {...props} icon="format-font" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title={Locales.t('size')}
            description={Locales.t(settings.font.size.label)}
            onPress={() => showModal('font')}
            left={(props) => (
              <List.Icon {...props} icon="format-font-size-increase" />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Accordion>
      </List.AccordionGroup>

      <View style={{ padding: 16 }}>
        <Button
          mode="contained"
          onPress={async () =>
            await Storage.setItemAsync('settings', JSON.stringify(settings))
              .then(() => {
                setReload(true)
                onChange(settings)
              })
              .catch((err) => console.error(err))
          }
        >
          {Locales.t('save')}
        </Button>
      </View>

      <Modal
        theme={theme}
        title={
          content === 'font'
            ? Locales.t('font')
            : content === 'language'
              ? Locales.t('language')
              : content === 'size'
                ? Locales.t('size')
                : content === 'theme'
                  ? Locales.t('theme')
                  : 'Title'
        }
        modalProps={{
          visible,
          children: undefined,
          onDismiss: () => setVisible(false),
        }}
      >
        <List.Section>
          {content === 'font' ? (
            <List.AccordionGroup>
              <List.Accordion title={Locales.t('font')} id="1">
                {Constants.font.families.map((f) => (
                  <List.Item
                    key={f}
                    title={Locales.t(f)}
                    onPress={() =>
                      setSettings({
                        ...settings,
                        font: { ...settings.font, family: f as TFontFamily },
                      })
                    }
                    titleStyle={{
                      color:
                        settings.font.family === f
                          ? theme.colors.primary
                          : theme.colors.onBackground,
                    }}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        color={
                          settings.font.family === f
                            ? theme.colors.primary
                            : props.color
                        }
                        icon={
                          settings.font.family === f
                            ? 'checkbox-marked-circle'
                            : 'checkbox-blank-circle-outline'
                        }
                      />
                    )}
                  />
                ))}
              </List.Accordion>
              <List.Accordion title={Locales.t('size')} id="2">
                {Constants.font.sizes.map((s) => (
                  <List.Item
                    key={s.label}
                    title={Locales.t(s.label)}
                    onPress={() =>
                      setSettings({
                        ...settings,
                        font: { ...settings.font, size: s as TFontSize },
                      })
                    }
                    titleStyle={{
                      color:
                        settings.font.size.value === s.value
                          ? theme.colors.primary
                          : theme.colors.onBackground,
                    }}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        color={
                          settings.font.size.value === s.value
                            ? theme.colors.primary
                            : props.color
                        }
                        icon={
                          settings.font.size.value === s.value
                            ? 'checkbox-marked-circle'
                            : 'checkbox-blank-circle-outline'
                        }
                      />
                    )}
                  />
                ))}
              </List.Accordion>

              <List.Accordion title={Locales.t('preview')} id="3">
                <View style={{ paddingHorizontal: 16 }}>
                  <Text
                    variant={settings.font.size.value}
                    style={{
                      direction: 'rtl',
                      textAlign: 'center',
                      fontFamily: settings.font.family,
                      lineHeight: settings.font.size.lineHeight,
                    }}
                  >
                    إِنَّآ أَنزَلْنَـٰهُ قُرْءَٰنًا عَرَبِيًّا لَّعَلَّكُمْ
                    تَعْقِلُونَ
                  </Text>
                </View>
              </List.Accordion>
            </List.AccordionGroup>
          ) : content === 'language' ? (
            Constants.languages.map((l) => (
              <List.Item
                key={l}
                title={Locales.t(l)}
                onPress={() =>
                  setSettings({ ...settings, language: l as TLanguage })
                }
                titleStyle={{
                  color:
                    settings.language === l
                      ? theme.colors.primary
                      : theme.colors.onBackground,
                }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={
                      settings.language === l
                        ? theme.colors.primary
                        : props.color
                    }
                    icon={
                      settings.language === l
                        ? 'checkbox-marked-circle'
                        : 'checkbox-blank-circle-outline'
                    }
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon={l === 'Arabic' ? 'abjad-arabic' : 'alphabet-latin'}
                  />
                )}
              />
            ))
          ) : content === 'theme' ? (
            Constants.themes.map((t) => (
              <List.Item
                key={t}
                title={Locales.t(t)}
                onPress={() =>
                  setSettings({
                    ...settings,
                    theme: t as TTheme,
                  })
                }
                titleStyle={{
                  color:
                    settings.theme === t
                      ? theme.colors.primary
                      : theme.colors.onBackground,
                }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={
                      settings.theme === t ? theme.colors.primary : props.color
                    }
                    icon={
                      settings.theme === t
                        ? 'checkbox-marked-circle'
                        : 'checkbox-blank-circle-outline'
                    }
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon={
                      t === 'Auto'
                        ? 'cellphone'
                        : t === 'Dark'
                          ? 'weather-night'
                          : 'white-balance-sunny'
                    }
                  />
                )}
              />
            ))
          ) : undefined}
        </List.Section>
      </Modal>
    </Surface>
  )
}

export default Settings
