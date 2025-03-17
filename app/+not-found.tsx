import { router, Stack } from 'expo-router'
import React from 'react'
import { Button, Surface, Text } from 'react-native-paper'

import { styles } from '@/lib/ui'

const NotFound = () => (
  <Surface style={styles.screen}>
    <Stack.Screen options={{ title: 'Oops' }} />

    <Text variant="displayLarge">Not found</Text>

    <Text variant="bodyLarge">
      This screen doesn't exist.{'\n'}Go back to the previous screen or go home
      instead.
    </Text>

    <Button mode="contained" onPress={() => router.replace('/')}>
      Go Home
    </Button>
  </Surface>
)

export default NotFound
