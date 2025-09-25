import React from 'react'
import { ScrollView, useColorScheme, View } from 'react-native'
import {
  Modal as BaseModal,
  Button,
  IconButton,
  ModalProps,
  Text,
  Tooltip,
} from 'react-native-paper'

import { Locales } from '../locales'
import { AppTheme } from '../styles'

const Modal = (props: {
  title: string
  children: React.ReactNode | React.ReactNode[]
  theme: AppTheme
  modalProps: ModalProps
}) => {
  const colorScheme = useColorScheme()

  // Close action
  const close = () =>
    props.modalProps.onDismiss ? props.modalProps.onDismiss() : undefined

  return (
    <BaseModal
      {...props.modalProps}
      contentContainerStyle={{
        left: 8,
        right: 8,
        borderRadius: 24,
        position: 'absolute',
        backgroundColor:
          colorScheme === 'dark'
            ? props.theme.colors.base300
            : props.theme.colors.base100,
      }}
    >
      <View
        style={{
          paddingTop: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}
      >
        <Text variant="titleLarge">{props.title}</Text>

        <Tooltip title={Locales.t('close')}>
          <IconButton size={24} icon="close" onPress={close} />
        </Tooltip>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {props.children}
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Button mode="contained" onPress={close}>
          {Locales.t('close')}
        </Button>
      </View>
    </BaseModal>
  )
}

export default Modal
