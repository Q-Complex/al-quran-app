import React from 'react'
import { View } from 'react-native'
import {
  Button,
  List,
  ProgressBar,
  RadioButton,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper'

import {
  Constants,
  DefaultSettings,
  KVStore,
  Locales,
  Modal,
  AppSettings,
  TFontFamily,
  TFontSize,
  TLanguage,
  toMarker,
  TSettings,
  TTheme,
} from '@/lib'

const Settings = () => {
  const theme = useTheme()
  const { onChange } = React.useContext(AppSettings)
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [content, setContent] = React.useState('font')
  const [message, setMessage] = React.useState({ visible: false, content: '' })
  const [settings, setSettings] = React.useState<TSettings>(DefaultSettings)

  React.useEffect(() => {
    setLoading(true)
    ;(async () => {
      await KVStore.settings.load((v) => (v ? setSettings(JSON.parse(v)) : {}))
      setLoading(false)
    })()
  }, [])

  const showModal = (content: string) => {
    setContent(content)
    setVisible(true)
  }

  return (
    <Surface elevation={0} style={{ flex: 1 }}>
      <ProgressBar indeterminate={loading} />

      <List.AccordionGroup>
        <List.Accordion id={1} title={Locales.t('appearance')}>
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

        <List.Accordion id={2} title={Locales.t('quran')}>
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
            await KVStore.settings.save(JSON.stringify(settings), () => {
              onChange(settings)
              setMessage({ visible: true, content: Locales.t('settingsSaved') })
            })
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
        <List.Section style={{ flex: 1, marginVertical: 0 }}>
          {content === 'font' ? (
            <List.AccordionGroup>
              <List.Accordion title={Locales.t('font')} id="1">
                <RadioButton.Group
                  value={settings.font.family}
                  onValueChange={(f) =>
                    setSettings({
                      ...settings,
                      font: { ...settings.font, family: f as TFontFamily },
                    })
                  }
                >
                  {Constants.font.families.map((f) => (
                    <RadioButton.Item
                      labelVariant="bodySmall"
                      key={f}
                      label={Locales.t(f)}
                      value={f}
                    />
                  ))}
                </RadioButton.Group>
              </List.Accordion>

              <List.Accordion title={Locales.t('size')} id="2">
                <RadioButton.Group
                  value={JSON.stringify(settings.font.size)}
                  onValueChange={(s) =>
                    setSettings({
                      ...settings,
                      font: {
                        ...settings.font,
                        size: JSON.parse(s) as TFontSize,
                      },
                    })
                  }
                >
                  {Constants.font.sizes.map((s) => (
                    <RadioButton.Item
                      labelVariant="bodySmall"
                      key={s.label}
                      label={Locales.t(s.label)}
                      value={JSON.stringify(s)}
                    />
                  ))}
                </RadioButton.Group>
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
                    تَعْقِلُونَ{' '}
                    {settings.font.family === 'Uthmanic' ? toMarker('2') : 2}
                  </Text>
                </View>
              </List.Accordion>
            </List.AccordionGroup>
          ) : content === 'language' ? (
            <RadioButton.Group
              value={settings.language}
              onValueChange={(l) =>
                setSettings({ ...settings, language: l as TLanguage })
              }
            >
              {Constants.languages.map((l) => (
                <RadioButton.Item
                  labelVariant="bodySmall"
                  key={l}
                  label={Locales.t(l)}
                  value={l}
                />
              ))}
            </RadioButton.Group>
          ) : content === 'theme' ? (
            <RadioButton.Group
              value={settings.theme}
              onValueChange={(t) =>
                setSettings({
                  ...settings,
                  theme: t as TTheme,
                })
              }
            >
              {Constants.themes.map((t) => (
                <RadioButton.Item
                  labelVariant="bodySmall"
                  key={t}
                  label={Locales.t(t)}
                  value={t}
                />
              ))}
            </RadioButton.Group>
          ) : undefined}
        </List.Section>
      </Modal>

      <Snackbar
        visible={message.visible}
        onDismiss={() => setMessage({ visible: false, content: '' })}
        style={{ backgroundColor: theme.colors.primaryContainer }}
      >
        <Text style={{ color: theme.colors.onPrimaryContainer }}>
          {message.content}
        </Text>
      </Snackbar>
    </Surface>
  )
}

export default Settings
