import React from 'react'
import { View } from 'react-native'
import {
  Modal as BaseModal,
  Button,
  IconButton,
  MD3Theme,
  ModalProps,
  Text,
  Tooltip,
} from 'react-native-paper'

const Modal = (props: {
  title: string
  children: React.ReactNode | React.ReactNode[]
  theme: MD3Theme
  modalProps: ModalProps
}) => {
  // Close action
  const close = () =>
    props.modalProps.onDismiss ? props.modalProps.onDismiss() : undefined

  return (
    <BaseModal
      {...props.modalProps}
      contentContainerStyle={{
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 8,
        position: 'absolute',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: props.theme.colors.background,
      }}
    >
      <View
        style={{
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="titleLarge">{props.title}</Text>

        <Tooltip title="Close">
          <IconButton size={24} icon="close" onPress={close} />
        </Tooltip>
      </View>

      {props.children}

      <View style={{ padding: 16 }}>
        <Button mode="contained" onPress={close}>
          Close
        </Button>
      </View>
    </BaseModal>
  )
}

export default Modal
