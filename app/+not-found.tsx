import { router, Stack } from 'expo-router'
import React from 'react'
import { Button, Surface, Text } from 'react-native-paper'

const NotFound = () => (
  <Surface
    elevation={0}
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
  >
    <Stack.Screen options={{ title: 'Oops' }} />

    <Text variant="displayLarge">Not found</Text>

    <Text variant="bodyLarge">
      This screen doesn't exist.{'\n'}Go back to the previous screen or go home
      instead.
    </Text>

    <Button mode="contained" onPress={() => router.back()}>
      Go Home
    </Button>
  </Surface>
)

export default NotFound
