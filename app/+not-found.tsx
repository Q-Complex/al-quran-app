import { router, Stack } from 'expo-router'
import React from 'react'
import { Button, Surface, Text } from 'react-native-paper'

import { Locales } from '@/lib'

const NotFound = () => (
  <Surface
    elevation={0}
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
  >
    <Stack.Screen options={{ title: 'Oops' }} />

    <Text variant="displayLarge">{Locales.t('notFound')}</Text>

    <Text variant="bodyLarge">{Locales.t('notFoundMessage')}</Text>

    <Button mode="contained" onPress={() => router.back()}>
      {Locales.t('title')}
    </Button>
  </Surface>
)

export default NotFound
